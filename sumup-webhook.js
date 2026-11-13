
const URL_BASE =
  process.env.SUPABASE_URL ||
  process.env.MAELLE_SUPABASE_URL;

const KEY = process.env.SUPABASE_SECRET_KEY;
const SUMUP_KEY = process.env.SUMUP_API_KEY;

const api = (path, options = {}) =>
  fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido'
    });
  }

  if (!URL_BASE || !KEY || !SUMUP_KEY) {
    return res.status(503).json({
      error: 'Serviço não configurado'
    });
  }

  try {
    const body = req.body || {};
    const checkoutId = body.id;

    if (
      typeof checkoutId !== 'string' ||
      !/^[0-9a-f-]{36}$/i.test(checkoutId)
    ) {
      return res.status(400).json({
        error: 'Identificador inválido'
      });
    }

    // O webhook é apenas uma notificação.
    // Consultamos diretamente a SumUp.
    const payment = await fetch(
      'https://api.sumup.com/v0.1/checkouts/' +
        encodeURIComponent(checkoutId),
      {
        headers: {
          Authorization: `Bearer ${SUMUP_KEY}`
        }
      }
    );

    if (!payment.ok) {
      console.error(
        'Falha na consulta SumUp:',
        payment.status
      );

      return res.status(502).json({
        error: 'Falha ao verificar pagamento'
      });
    }

    const checkout = await payment.json();

    const orderId = checkout.checkout_reference;

    if (
      typeof orderId !== 'string' ||
      !/^[0-9a-f-]{36}$/i.test(orderId)
    ) {
      return res.status(400).json({
        error: 'Referência inválida'
      });
    }

    const lookup = await api(
      'encomendas_sumup?id=eq.' +
        encodeURIComponent(orderId) +
        '&select=id,total,moeda,estado_pagamento,sumup_checkout_id'
    );

    if (!lookup.ok) {
      throw new Error('Falha ao consultar encomenda');
    }

    const orders = await lookup.json();
    const order = orders[0];

    if (!order) {
      return res.status(404).json({
        error: 'Encomenda não encontrada'
      });
    }

    // Validar a correspondência com a encomenda.
    if (
      order.sumup_checkout_id !== checkoutId ||
      checkout.currency !== order.moeda ||
      !Number.isFinite(Number(checkout.amount)) ||
      Math.round(Number(checkout.amount) * 100) !==
        Math.round(Number(order.total) * 100)
    ) {
      console.error('Divergência no pagamento');

      return res.status(409).json({
        error: 'Dados do pagamento não correspondem'
      });
    }

    // Nunca marcar como pago sem confirmação
    // direta da API da SumUp.
    if (checkout.status !== 'PAID') {
      return res.status(200).json({
        received: true
      });
    }

    // Notificações repetidas não devem
    // alterar um pedido já confirmado.
    if (order.estado_pagamento === 'PAID') {
      return res.status(200).json({
        received: true
      });
    }

    const updated = await api(
      'encomendas_sumup?id=eq.' +
        encodeURIComponent(orderId) +
        '&estado_pagamento=neq.PAID',
      {
        method: 'PATCH',
        headers: {
          Prefer: 'return=representation'
        },
        body: JSON.stringify({
          estado_pagamento: 'PAID'
        })
      }
    );

    if (!updated.ok) {
      throw new Error('Falha ao atualizar pagamento');
    }

    const rows = await updated.json();

    if (!Array.isArray(rows)) {
      throw new Error('Resposta inválida do Supabase');
    }

    console.log('SumUp: pagamento processado');

    return res.status(200).json({
      received: true
    });

  } catch (error) {
    console.error('Erro webhook SumUp:', error.message);

    return res.status(500).json({
      error: 'Erro ao processar notificação'
    });
  }
};
