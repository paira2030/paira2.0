const ghl=require('./_ghl');
const URL_BASE=process.env.SUPABASE_URL||process.env.MAELLE_SUPABASE_URL;
const KEY=process.env.SUPABASE_SECRET_KEY;
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).end();
 if(!URL_BASE||!KEY||!process.env.SUMUP_API_KEY)return res.status(503).json({error:'Serviço não configurado.'});
 const id=String(req.query.pedido||'');
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Referência inválida.'});
 const headers={apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'};
 try{
  const r=await fetch(`${URL_BASE}/rest/v1/encomendas_sumup?id=eq.${id}&select=id,sumup_checkout_id,total,moeda,estado_pagamento,codigo_rastreio`,{headers});
  if(!r.ok)throw Error('Não foi possível consultar a encomenda.');
  const [order]=await r.json(); if(!order)return res.status(404).json({error:'Encomenda não encontrada.'});
  if(!order.sumup_checkout_id)return res.json({status:'PENDING'});
  const payment=await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(order.sumup_checkout_id)}`,{headers:{Authorization:`Bearer ${process.env.SUMUP_API_KEY}`}});
  if(!payment.ok)throw Error('Não foi possível confirmar o estado na SumUp.');
  const checkout=await payment.json();
  if(checkout.checkout_reference!==id||checkout.currency!=='EUR'||Math.round(checkout.amount*100)!==Math.round(order.total*100))throw Error('Divergência nos dados do pagamento.');
  const status=['PAID','PENDING','FAILED','EXPIRED'].includes(checkout.status)?checkout.status:'PENDING';
  if(status==='PAID'&&order.estado_pagamento!=='PAID'){
   // Transição condicional: só uma das rotas (status ou webhook) marca PAID e notifica o GHL.
   const up=await fetch(`${URL_BASE}/rest/v1/encomendas_sumup?id=eq.${id}&estado_pagamento=neq.PAID`,{method:'PATCH',headers:{...headers,Prefer:'return=representation'},body:JSON.stringify({estado_pagamento:'PAID'})});
   const rows=up.ok?await up.json().catch(()=>[]):[];
   if(Array.isArray(rows)&&rows.length===1)await ghl.pagamentoConfirmado(rows[0]);
  }else if(status!==order.estado_pagamento)await fetch(`${URL_BASE}/rest/v1/encomendas_sumup?id=eq.${id}`,{method:'PATCH',headers,body:JSON.stringify({estado_pagamento:status})});
  return res.json(status==='PAID'?{status,codigo_rastreio:order.codigo_rastreio}:{status});
 }catch(e){console.error('SumUp status:',e.message);return res.status(502).json({error:'Não foi possível confirmar o pagamento. Tente novamente.'});}
};
