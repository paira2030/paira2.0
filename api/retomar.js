// Link de retoma (WhatsApp/e-mail do GHL): devolve os dados de contacto para pré-preencher o checkout.
// O id da encomenda é um UUID aleatório enviado só à própria cliente. Só funciona para encomendas
// ainda não pagas e com menos de 14 dias.
const URL_BASE = process.env.SUPABASE_URL || process.env.MAELLE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;
const MAX_DIAS = 14;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).end();
  if (!URL_BASE || !KEY) return res.status(503).json({ error: 'Serviço não configurado.' });

  const id = String(req.query.pedido || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(400).json({ error: 'Referência inválida.' });
  }

  try {
    const r = await fetch(
      `${URL_BASE}/rest/v1/encomendas_sumup?id=eq.${id}&select=cliente,estado_pagamento,criado_em`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    if (!r.ok) throw Error('consulta falhou');
    const [order] = await r.json();

    const idadeDias = order ? (Date.now() - new Date(order.criado_em).getTime()) / 86400000 : Infinity;
    if (!order || order.estado_pagamento === 'PAID' || !(idadeDias <= MAX_DIAS)) {
      return res.status(404).json({ error: 'Link expirado.' });
    }

    const c = order.cliente || {};
    const s = v => (typeof v === 'string' ? v.slice(0, 250) : '');
    return res.status(200).json({
      cliente: {
        name: s(c.name), email: s(c.email), phone: s(c.phone), address: s(c.address),
        postalCode: s(c.postalCode), city: s(c.city), nif: s(c.nif)
      }
    });
  } catch (e) {
    console.error('retomar:', e.message);
    return res.status(502).json({ error: 'Indisponível.' });
  }
};
