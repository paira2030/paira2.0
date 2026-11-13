const { randomUUID } = require('node:crypto');
const URL_BASE = process.env.SUPABASE_URL || process.env.MAELLE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;
const api = (path, opts={}) => fetch(`${URL_BASE}/rest/v1/${path}`, { ...opts, headers:{ apikey:KEY, Authorization:`Bearer ${KEY}`, 'Content-Type':'application/json', ...opts.headers }});
const fail=(res,status,error)=>res.status(status).json({error});
module.exports=async (req,res)=>{
 if(req.method!=='POST') return fail(res,405,'Método não permitido.');
 res.setHeader('Cache-Control','no-store');
 if(!process.env.SUMUP_API_KEY||!process.env.SUMUP_MERCHANT_CODE||!URL_BASE||!KEY) return fail(res,503,'Checkout ainda não configurado na Vercel.');
 try {
  const {items,customer}=req.body||{};
  if(!Array.isArray(items)||items.length<1||items.length>30||!customer||!/^\S+@\S+\.\S+$/.test(customer.email||'')) return fail(res,400,'Dados da encomenda inválidos.');
  if(!['name','phone','address','postalCode','city'].every(k=>typeof customer[k]==='string'&&customer[k].trim().length>=2&&customer[k].length<=250)) return fail(res,400,'Preencha os dados de entrega.');
  if(!/^\d{4}-\d{3}$/.test(customer.postalCode)) return fail(res,400,'Código postal inválido.');
  const parsed=items.map(x=>({id:String(x.id||''),code:String(x.code||''),qty:Number(x.qty),size:String(x.size||'').slice(0,30),color:String(x.color||'').slice(0,30)}));
  if(parsed.some(x=>!Number.isSafeInteger(x.qty)||x.qty<1||x.qty>50||(!/^[0-9a-f-]{36}$/i.test(x.id)&&!x.code))) return fail(res,400,'Artigo inválido.');
  const codes=[...new Set(parsed.map(x=>x.code).filter(Boolean))];
  const uuids=[...new Set(parsed.map(x=>x.id).filter(x=>/^[0-9a-f-]{36}$/i.test(x)))];
  let query='select=id,codigo,nome,preco,estoque,ativo';
  const filters=[];
  if(uuids.length) filters.push(`id.in.(${uuids.join(',')})`);
  if(codes.length) filters.push(`codigo.in.(${codes.map(x=>'"'+x.replace(/["\\,()]/g,'')+'"').join(',')})`);
  query+='&or=('+filters.join(',')+')';
  const db = await api('produtos?' + query);

if (!db.ok) {
  const detalhe = await db.text();
  console.error('Erro Supabase catálogo:', {
    status: db.status,
    detalhe
  });
  throw Error('Não foi possível consultar o catálogo.');
}
  const products=await db.json();
  let subtotalCents=0; const snapshot=[];
  for(const x of parsed){
   const product=products.find(p=>p.id===x.id||p.codigo===x.code);
   if(!product||!product.ativo||product.estoque<x.qty) return fail(res,409,'Um artigo está indisponível ou sem stock.');
   const cents=Math.round(Number(product.preco)*100);
   if(!Number.isSafeInteger(cents)||cents<=0) return fail(res,409,'Preço inválido no catálogo.');
   subtotalCents+=cents*x.qty;
   snapshot.push({id:product.id,codigo:product.codigo,nome:product.nome,preco:cents/100,quantidade:x.qty,tamanho:x.size,cor:x.color});
  }
  const shippingCents=subtotalCents>=Math.round(Number(process.env.MAELLE_FREE_SHIPPING_EUR||49.90)*100)?0:450;
  const total=(subtotalCents+shippingCents)/100;
  const id=randomUUID();
  const row={id,cliente:customer,itens:snapshot,subtotal:subtotalCents/100,portes:shippingCents/100,total,moeda:'EUR',estado_pagamento:'PENDING'};
  const inserted=await api('encomendas_sumup',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)});
  if(!inserted.ok) throw Error('Tabela de encomendas não configurada. Execute o SQL incluído no projeto.');
  const origin='https://maelleoficial.vercel.app';
  const payment=await fetch('https://api.sumup.com/v0.1/checkouts',{method:'POST',headers:{Authorization:`Bearer ${process.env.SUMUP_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({merchant_code:process.env.SUMUP_MERCHANT_CODE,amount:total,currency:'EUR',checkout_reference:id,description:`Encomenda Maelle ${id.slice(0,8)}`,hosted_checkout:{enabled:true},redirect_url:`${origin}/pagamento.html?pedido=${id}`})});
  return_url:`${origin}/api/sumup-webhook`
  const result=await payment.json().catch(()=>({}));
  console.error('Diagnostico SumUp:', {
  status: payment.status,
  resposta: {
    error_code: result.error_code,
    message: result.message,
    errors: result.errors,
    checkout_criado: Boolean(result.id),
    url_recebida: Boolean(result.hosted_checkout_url)
  }
});
  if(!payment.ok||!result.id||!result.hosted_checkout_url) {await api(`encomendas_sumup?id=eq.${id}`,{method:'PATCH',body:JSON.stringify({estado_pagamento:'ERROR'})}); throw Error('A SumUp não criou o pagamento. Confirme a ativação do Hosted Checkout e as credenciais.');}
  const updated=await api(`encomendas_sumup?id=eq.${id}`,{method:'PATCH',body:JSON.stringify({sumup_checkout_id:result.id})});
  if(!updated.ok) throw Error('Não foi possível associar o pagamento à encomenda.');
  if(new URL(result.hosted_checkout_url).hostname!=='checkout.sumup.com') throw Error('URL de pagamento inesperada.');
  return res.status(200).json({url:result.hosted_checkout_url});
 }catch(e){console.error('SumUp create:',e.message);return fail(res,502,e.message);}
};
