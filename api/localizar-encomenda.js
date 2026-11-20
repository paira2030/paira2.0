const BASE=process.env.SUPABASE_URL||process.env.MAELLE_SUPABASE_URL;
const KEY=process.env.SUPABASE_SECRET_KEY;
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
 if(!BASE||!KEY)return res.status(503).json({error:'Serviço indisponível'});
 const code=String(req.body?.codigo||'').trim().toUpperCase();
 const email=String(req.body?.email||'').trim().toLowerCase();
 if(!/^MAE-[A-F0-9]{18}$/.test(code)||email.length>254||!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({error:'Código ou e-mail inválido'});
 try{
  const r=await fetch(BASE+'/rest/v1/encomendas_sumup?codigo_rastreio=eq.'+encodeURIComponent(code)+'&select=cliente,estado_pagamento,estado_entrega',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
  if(!r.ok)throw Error('Falha na consulta');
  const rows=await r.json();const o=rows[0];
  if(!o||String(o.cliente?.email||'').trim().toLowerCase()!==email||o.estado_pagamento!=='PAID')return res.status(404).json({error:'Encomenda paga não encontrada para estes dados'});
  return res.json({estado_entrega:o.estado_entrega||'processando'});
 }catch(e){console.error('localizar-encomenda',e.message);return res.status(502).json({error:'Não foi possível consultar agora'});}
};
