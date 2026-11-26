// Integração MAELLE -> GHL (carrinho abandonado e confirmação de encomenda).
// Nunca pode quebrar nem atrasar o checkout: timeout curto e falha silenciosa.
const ORIGIN = 'https://www.maelle.pt';

async function notifyGHL(url, payload) {
  if (!url) return;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    });
    clearTimeout(t);
  } catch (e) {
    console.warn('GHL webhook falhou:', e?.message);
  }
}

function phonePT(raw) {
  let p = String(raw || '').replace(/[^\d+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p.startsWith('+')) p = p.length === 9 ? '+351' + p : '+' + p;
  return p;
}

const eur = n => Number(n || 0).toFixed(2).replace('.', ',') + ' €';

// Link que reconstrói o cesto noutro dispositivo. Só leva códigos, nunca preços.
function retomarUrl(parsed) {
  const param = Buffer.from(JSON.stringify(
    parsed.map(x => [x.code || x.id, x.qty, x.size || '', x.color || ''])
  )).toString('base64url');
  return `${ORIGIN}/checkout.html?carrinho=${param}`;
}

function checkoutIniciado({ checkoutId, parsed, snapshot, customer, total }) {
  const [firstName, ...rest] = String(customer.name || '').trim().split(/\s+/);
  return notifyGHL(process.env.GHL_WEBHOOK_CHECKOUT, {
    event: 'checkout_iniciado',
    checkout_id: checkoutId,
    checkout_url: retomarUrl(parsed),
    created_at: new Date().toISOString(),
    customer: {
      first_name: firstName || '',
      last_name: rest.join(' '),
      email: customer.email,
      phone: phonePT(customer.phone),
      address: customer.address,
      postal_code: customer.postalCode,
      city: customer.city,
      nif: customer.nif || ''
    },
    total,
    currency: 'EUR',
    items_text: snapshot
      .map(s => `${s.quantidade}x ${s.nome}${s.tamanho ? ` (${s.tamanho})` : ''} ${eur(s.preco * s.quantidade)}`)
      .join('\n')
  });
}

// Chamar só quando a encomenda acabou de passar a PAID (uma única vez).
function pagamentoConfirmado(order) {
  const cliente = order?.cliente || {};
  if (!cliente.email) return Promise.resolve();
  return notifyGHL(process.env.GHL_WEBHOOK_PAGAMENTO, {
    event: 'pagamento_confirmado',
    checkout_id: order.sumup_checkout_id,
    paid_at: new Date().toISOString(),
    customer: { email: cliente.email, phone: phonePT(cliente.phone) },
    total: Number(order.total)
  });
}

module.exports = { checkoutIniciado, pagamentoConfirmado };
