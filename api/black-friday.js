const { verify, db } = require('./_maelle-admin');

async function reportFailure(response, operation) {
  const raw = await response.text().catch(() => '');
  let detail = {};
  try { detail = JSON.parse(raw); } catch (_) {}
  const code = typeof detail.code === 'string' ? detail.code : 'UNKNOWN';
  // Never log API keys, tokens or request authorization headers.
  console.error(`Black Friday ${operation}: Supabase HTTP ${response.status}, code ${code}, message ${String(detail.message || '').slice(0, 240)}`);
  let message = 'Não foi possível consultar a configuração Black Friday. Verifique os Logs da Vercel.';
  if (response.status === 401 || response.status === 403) message = 'A API não tem autorização para aceder ao Supabase. Verifique SUPABASE_SECRET_KEY na Vercel.';
  else if (code === '42P01' || code === 'PGRST205') message = 'A tabela maelle_promocoes não foi encontrada no projeto Supabase utilizado pela Vercel.';
  else if (response.status === 404) message = 'A tabela não está disponível na API do projeto Supabase ligado à Vercel.';
  return { status: 503, message };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Método não permitido.' });
    if (req.method === 'POST') {
      if (!(await verify(req))) return res.status(403).json({ error: 'Sem permissão de administrador.' });
      if (typeof req.body?.active !== 'boolean') return res.status(400).json({ error: 'Estado inválido.' });
    }
    const path = 'maelle_promocoes?chave=eq.black_friday&select=ativa';
    const options = req.method === 'POST' ? {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ativa: req.body.active, atualizado_em: new Date().toISOString() })
    } : {};
    const r = await db(path, options);
    if (!r.ok) {
      const failure = await reportFailure(r, req.method);
      return res.status(failure.status).json({ error: failure.message });
    }
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length !== 1) {
      console.error('Black Friday: registo black_friday ausente ou não acessível.');
      return res.status(503).json({ error: 'Registo black_friday não acessível pela API. Confira o projeto e as permissões.' });
    }
    return res.status(200).json({ active: rows[0].ativa === true, percent: 20 });
  } catch (e) {
    console.error('Black Friday: falha de ligação ou configuração:', e?.name || 'Error', String(e?.message || '').slice(0, 180));
    return res.status(503).json({ error: 'Falha de ligação com o Supabase. Confira as variáveis de ambiente na Vercel e os Logs.' });
  }
};
