
const { randomUUID, randomBytes } = require('node:crypto');

const URL_BASE =
  process.env.SUPABASE_URL ||
  process.env.MAELLE_SUPABASE_URL;

const KEY = process.env.SUPABASE_SECRET_KEY;

const ORIGIN = 'https://www.maelle.pt';

const api = (path, opts = {}) =>
  fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...opts.headers
    }
  });

const fail = (res, status, error) =>
  res.status(status).json({ error });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return fail(res, 405, 'Método não permitido.');
  }

  res.setHeader('Cache-Control', 'no-store');

  if (
    !process.env.SUMUP_API_KEY ||
    !process.env.SUMUP_MERCHANT_CODE ||
    !URL_BASE ||
    !KEY
  ) {
    return fail(
      res,
      503,
      'Checkout ainda não configurado na Vercel.'
    );
  }

  try {
    const { items, customer, paymentMode } = req.body || {};
    const embedded = paymentMode === 'widget';

    if (
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 30 ||
      !customer ||
      !/^\S+@\S+\.\S+$/.test(customer.email || '')
    ) {
      return fail(res, 400, 'Dados da encomenda inválidos.');
    }

    if (
      !['name', 'phone', 'address', 'postalCode', 'city']
        .every(k =>
          typeof customer[k] === 'string' &&
          customer[k].trim().length >= 2 &&
          customer[k].length <= 250
        )
    ) {
      return fail(res, 400, 'Preencha os dados de entrega.');
    }

    if (!/^\d{4}-\d{3}$/.test(customer.postalCode)) {
      return fail(res, 400, 'Código postal inválido.');
    }

    const parsed = items.map(x => ({
      id: String(x.id || ''),
      code: String(x.code || ''),
      qty: Number(x.qty),
      size: String(x.size || '').slice(0, 30),
      color: String(x.color || '').slice(0, 30)
    }));

    if (
      parsed.some(x =>
        !Number.isSafeInteger(x.qty) ||
        x.qty < 1 ||
        x.qty > 50 ||
        (
          !/^[0-9a-f-]{36}$/i.test(x.id) &&
          !x.code
        )
      )
    ) {
      return fail(res, 400, 'Artigo inválido.');
    }

    const codes = [
      ...new Set(parsed.map(x => x.code).filter(Boolean))
    ];

    const uuids = [
      ...new Set(
        parsed
          .map(x => x.id)
          .filter(x => /^[0-9a-f-]{36}$/i.test(x))
      )
    ];

    let query = 'select=id,codigo,nome,preco,estoque,ativo,modo_envio,valor_portes';

    const filters = [];

    if (uuids.length) {
      filters.push(`id.in.(${uuids.join(',')})`);
    }

    if (codes.length) {
      const safeCodes = codes.map(x =>
        '"' + x.replace(/["\\,()]/g, '') + '"'
      );

      filters.push(`codigo.in.(${safeCodes.join(',')})`);
    }

    query += '&or=(' + filters.join(',') + ')';

    const db = await api('produtos?' + query);

    if (!db.ok) {
      console.error('Erro Supabase catálogo:', db.status);
      throw Error('Não foi possível consultar o catálogo.');
    }

    const products = await db.json();

    let subtotalCents = 0;
    const snapshot = [];
    const shippingRules = [];

    for (const x of parsed) {
      const product = products.find(
        p => p.id === x.id || (x.code && p.codigo === x.code)
      );

      if (
        !product ||
        !product.ativo ||
        product.estoque < x.qty
      ) {
        return fail(
          res,
          409,
          'Um artigo está indisponível ou sem stock.'
        );
      }

      const cents = Math.round(Number(product.preco) * 100);

      if (!Number.isSafeInteger(cents) || cents <= 0) {
        return fail(
          res,
          409,
          'Preço inválido no catálogo.'
        );
      }

      subtotalCents += cents * x.qty;
      shippingRules.push({mode:product.modo_envio || 'legacy',cents:Math.round(Number(product.valor_portes ?? 4.50)*100)});

      snapshot.push({
        id: product.id,
        codigo: product.codigo,
        nome: product.nome,
        preco: cents / 100,
        quantidade: x.qty,
        tamanho: x.size,
        cor: x.color
      });
    }

    const freeShipping = Math.round(
      Number(process.env.MAELLE_FREE_SHIPPING_EUR || 49.90) * 100
    );

    // Uma cobrança por encomenda: maior valor entre produtos pagos.
    // Produtos antigos preservam a regra anterior até serem editados no ADM.
    const shippingCents = Math.max(0, ...shippingRules.map(rule => {
      if (rule.mode === 'free') return 0;
      if (rule.mode === 'paid') {
        if (!Number.isSafeInteger(rule.cents) || rule.cents < 0 || rule.cents > 999999) throw Error('Portes inválidos no catálogo.');
        return rule.cents;
      }
      return subtotalCents >= freeShipping ? 0 : 450;
    }));

    const total = (subtotalCents + shippingCents) / 100;

    const id = randomUUID();

    const row = {
      id,
      codigo_rastreio: 'MAE-' + randomBytes(9).toString('hex').toUpperCase(),
      cliente: customer,
      itens: snapshot,
      subtotal: subtotalCents / 100,
      portes: shippingCents / 100,
      total,
      moeda: 'EUR',
      estado_pagamento: 'PENDING'
    };

    const inserted = await api('encomendas_sumup', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    });

    if (!inserted.ok) {
      const detalhe = await inserted.text();
      console.error('Erro ao inserir encomenda no Supabase:', {
        status: inserted.status,
        detalhe
      });
      throw Error('Não foi possível registar a encomenda.');
    }

    const payment = await fetch(
      'https://api.sumup.com/v0.1/checkouts',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUMUP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchant_code: process.env.SUMUP_MERCHANT_CODE,
          amount: total,
          currency: 'EUR',
          checkout_reference: id,
          description: `Encomenda Maelle ${id.slice(0, 8)}`,
          ...(embedded ? {} : { hosted_checkout: { enabled: true } }),
          redirect_url:
            `${ORIGIN}/pagamento.html?pedido=${id}`,
          return_url:
            `${ORIGIN}/api/sumup-webhook`
        })
      }
    );

    const result = await payment.json().catch(() => ({}));

    console.log('SumUp checkout:', {
      status: payment.status,
      checkout_criado: Boolean(result.id),
      url_recebida: Boolean(result.hosted_checkout_url)
    });

    if (
      !payment.ok ||
      !result.id ||
      (!embedded && !result.hosted_checkout_url)
    ) {
      await api(`encomendas_sumup?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          estado_pagamento: 'ERROR'
        })
      });

      throw Error(
        'A SumUp não criou o pagamento. Verifique as credenciais e a configuração.'
      );
    }

    const updated = await api(
      `encomendas_sumup?id=eq.${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          sumup_checkout_id: result.id
        })
      }
    );

    if (!updated.ok) {
      throw Error(
        'Não foi possível associar o pagamento à encomenda.'
      );
    }

    if (embedded) {
      return res.status(200).json({ checkoutId: result.id, pedido: id });
    }

    const checkoutUrl = new URL(result.hosted_checkout_url);

    if (
      checkoutUrl.protocol !== 'https:' ||
      checkoutUrl.hostname !== 'checkout.sumup.com'
    ) {
      throw Error('URL de pagamento inesperada.');
    }

    return res.status(200).json({
      url: checkoutUrl.toString()
    });

  } catch (e) {
    console.error('SumUp create:', e.message);

    return fail(
      res,
      502,
      e.message
    );
  }
};
