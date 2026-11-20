const { verify, db } = require('./_maelle-admin');

const allowed = ['processando', 'preparando', 'despachado', 'saiu_entrega', 'entregue'];
const baseColumns = 'id,cliente,itens,total,moeda,estado_pagamento,criado_em,arquivado_em';

async function failure(response, context) {
  const detail = await response.text().catch(() => '');
  console.error('admin-orders ' + context, response.status, detail.slice(0, 1200));
  return detail;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (!await verify(req)) return res.status(403).json({ error: 'Acesso negado' });

    if (req.method === 'GET') {
      // Start with columns that exist in the original orders table. Optional
      // tracking/delivery fields may not yet have been migrated in Supabase.
      const query = 'encomendas_sumup?select=' + baseColumns + '&order=criado_em.desc&limit=1000';
      const result = await db(query);
      if (!result.ok) {
        await failure(result, 'GET orders');
        return res.status(502).json({ error: 'Falha ao consultar encomendas. Consulte os logs da função na Vercel.' });
      }
      const orders = await result.json();
      // Fetch optional columns separately so missing migration columns do not
      // make the entire order list disappear.
      const extras = await db('encomendas_sumup?select=id,codigo_rastreio,estado_entrega&limit=1000');
      if (extras.ok) {
        const map = new Map((await extras.json()).map(row => [row.id, row]));
        for (const order of orders) Object.assign(order, map.get(order.id) || {});
      } else {
        await failure(extras, 'optional tracking fields');
        for (const order of orders) {
          order.codigo_rastreio = null;
          order.estado_entrega = null;
        }
      }
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const id = String(req.body?.id || '');
      const action = String(req.body?.action || '');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !['archive','restore'].includes(action)) {
        return res.status(400).json({ error: 'Pedido inválido' });
      }
      // Soft-delete only. Never remove payment evidence or modify SumUp payment state.
      const result = await db('encomendas_sumup?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ arquivado_em: action === 'archive' ? new Date().toISOString() : null })
      });
      if (!result.ok) {
        await failure(result, 'archive/restore');
        return res.status(502).json({ error: 'Não foi possível alterar a lixeira. Confirme a migração SQL.' });
      }
      const changed = await result.json();
      if (changed.length !== 1) return res.status(404).json({ error: 'Encomenda não encontrada' });
      return res.status(200).json({ ok: true, arquivado_em: changed[0].arquivado_em });
    }
    if (req.method !== 'PATCH') return res.status(405).json({ error: 'Método não permitido' });
    const id = String(req.body?.id || '');
    const estado = String(req.body?.estado_entrega || '');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !allowed.includes(estado)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    const check = await db('encomendas_sumup?select=estado_pagamento&id=eq.' + encodeURIComponent(id));
    if (!check.ok) {
      await failure(check, 'payment check');
      return res.status(502).json({ error: 'Falha ao verificar o pagamento' });
    }
    const rows = await check.json();
    if (rows.length !== 1 || rows[0].estado_pagamento !== 'PAID') {
      return res.status(409).json({ error: 'Só pode alterar entregas de encomendas pagas' });
    }
    const result = await db('encomendas_sumup?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ estado_entrega: estado })
    });
    if (!result.ok) {
      const detail = await failure(result, 'PATCH delivery');
      return res.status(502).json({ error: detail.includes('estado_entrega') ? 'A coluna estado_entrega ainda não existe. Execute a migração SQL de encomendas.' : 'Não foi possível atualizar a entrega. Consulte os logs da Vercel.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('admin-orders unexpected error', error);
    return res.status(502).json({ error: 'Erro na API de encomendas. Consulte os logs da Vercel.' });
  }
};
