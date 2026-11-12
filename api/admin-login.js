// Vercel Serverless Function. The administrator email is never sent to the browser.
// The password is verified by Supabase Auth, and the admins table is checked using RLS.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({error:'Método não permitido.'});
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (origin && (!host || new URL(origin).host !== host)) return res.status(403).json({error:'Origem não permitida.'});
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, MAELLE_ADMIN_EMAIL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !MAELLE_ADMIN_EMAIL) {
    return res.status(503).json({error:'Login ainda não configurado na Vercel.'});
  }
  const password = req.body?.password;
  if (typeof password !== 'string' || password.length < 1 || password.length > 256) {
    return res.status(400).json({error:'Digite uma senha válida.'});
  }
  try {
    const base = SUPABASE_URL.replace(/\/+$/, '');
    const authResponse = await fetch(base + '/auth/v1/token?grant_type=password', {
      method:'POST',
      headers:{'Content-Type':'application/json',apikey:SUPABASE_PUBLISHABLE_KEY},
      body:JSON.stringify({email:MAELLE_ADMIN_EMAIL,password})
    });
    if (!authResponse.ok) {
      return res.status(authResponse.status === 429 ? 429 : 401).json({error:authResponse.status === 429 ? 'Muitas tentativas. Aguarde antes de tentar novamente.' : 'Senha incorreta.'});
    }
    const session = await authResponse.json();
    const userId = session.user?.id;
    if (!userId || !session.access_token || !session.refresh_token) return res.status(401).json({error:'Acesso negado.'});
    const adminResponse = await fetch(base + '/rest/v1/admins?select=user_id&user_id=eq.' + encodeURIComponent(userId), {
      headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer ' + session.access_token}
    });
    if (!adminResponse.ok || !(await adminResponse.json()).some(row => row.user_id === userId)) {
      return res.status(403).json({error:'Conta sem permissão administrativa.'});
    }
    return res.status(200).json({access_token:session.access_token,refresh_token:session.refresh_token});
  } catch (_) {
    return res.status(502).json({error:'Não foi possível contactar o serviço de autenticação.'});
  }
};
