/* Black Friday v2: public read, authenticated administrator write, RLS enforced. */
const { verify } = require('./_maelle-admin');
const base = () => process.env.SUPABASE_URL || process.env.MAELLE_SUPABASE_URL;
const key = () => process.env.SUPABASE_PUBLISHABLE_KEY;
const endpoint = () => base() + '/rest/v1/maelle_promocoes?chave=eq.black_friday&select=ativa';
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  if (!['GET','POST'].includes(req.method)) return res.status(405).json({error:'Método não permitido.'});
  if (!base() || !key()) return res.status(503).json({error:'Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY na Vercel.'});
  try {
    const headers = {'apikey':key(),'Content-Type':'application/json'};
    const opts = {headers,cache:'no-store'};
    if (req.method === 'POST') {
      if (typeof req.body?.active !== 'boolean') return res.status(400).json({error:'Estado inválido.'});
      if (!(await verify(req))) return res.status(403).json({error:'Sem permissão de administrador.'});
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i,'');
      headers.Authorization = 'Bearer ' + token;
      headers.Prefer = 'return=representation';
      opts.method='PATCH';
      opts.body=JSON.stringify({ativa:req.body.active,atualizado_em:new Date().toISOString()});
    }
    const r = await fetch(endpoint(),opts);
    if (!r.ok) {
      const raw=await r.text();let detail={};try{detail=JSON.parse(raw)}catch{}
      console.error('Black Friday v2 Supabase:',r.status,String(detail.code||''),String(detail.message||'').slice(0,180));
      return res.status(503).json({error:'A configuração da campanha não está acessível. Execute BLACK_FRIDAY_V2_RLS.sql e confira os Logs.'});
    }
    const rows=await r.json();
    if (!Array.isArray(rows)||rows.length!==1) return res.status(503).json({error:'Campanha não encontrada ou sem permissão de leitura. Execute BLACK_FRIDAY_V2_RLS.sql.'});
    return res.status(200).json({active:rows[0].ativa===true,percent:20});
  }catch(e){console.error('Black Friday v2:',e?.message);return res.status(503).json({error:'Falha ao consultar o estado da campanha.'});}
};
