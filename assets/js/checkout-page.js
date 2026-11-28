/* Checkout Maelle: preços exibidos são indicativos; API recalcula pelo catálogo. */
const MaelleCheckout={
 cart:[],
 eur(v){return Number(v||0).toLocaleString('pt-PT',{style:'currency',currency:'EUR'})},
 async init(){
  try { await window.MaelleBlackFriday.load();const catalog=await MaelleDB.list();this.liveCatalog=catalog; } catch(e){document.querySelector('main').innerHTML='<p>Não foi possível confirmar os preços atuais. Atualize a página antes de pagar.</p>';return;}
  try{const value=JSON.parse(localStorage.getItem('maelle_cart')||'[]');this.cart=Array.isArray(value)?value:[];this.cart=this.cart.map(i=>{const p=this.liveCatalog.find(p=>p.id===i.id);return p?{...i,price:window.MaelleBlackFriday.price(p)}:i})}catch{this.cart=[]}
  if(this.cart.some(i=>!this.liveCatalog.some(p=>p.id===i.id))){document.querySelector('main').textContent='Há artigos indisponíveis no cesto. Volte à loja.';return;}if(!this.cart.length){document.querySelector('main').innerHTML='<h1 class="font-display text-3xl my-8">O seu cesto está vazio</h1><a href="/" class="underline">Voltar à loja</a>';return}
  const box=document.getElementById('checkout-summary-items');box.replaceChildren();let subtotal=0;
  for(const item of this.cart){
   const qty=Number(item.qty)||1,price=Number(item.price)||0;subtotal+=qty*price;
   const line=document.createElement('div');line.className='flex gap-3 items-start border-b border-costura pb-4';
   const pic=document.createElement('img');pic.className='w-20 h-24 object-cover bg-papel';pic.alt='';
   const source=item.image||item.img||item.imagem||(Array.isArray(item.images)?item.images[0]:'');if(typeof source==='string'&&/^(https?:\/\/|\/|images\/|assets\/)/.test(source))pic.src=source;
   const info=document.createElement('div');info.className='flex-1 min-w-0';
   const name=document.createElement('p');name.className='text-sm font-medium';name.textContent=item.title||item.name||'Artigo';
   const variant=document.createElement('p');variant.className='text-xs text-grafite mt-1';variant.textContent=[item.size&&'Tam: '+item.size,item.color&&'Cor: '+item.color].filter(Boolean).join(' · ');
   const amount=document.createElement('p');amount.className='text-xs mt-2';amount.textContent='Quantidade: '+qty;
   const total=document.createElement('strong');total.className='text-sm';total.textContent=this.eur(price*qty);
   info.append(name,variant,amount,total);line.append(pic,info);box.append(line);
  }
  // Recalcular os portes a partir do catálogo atualizado, nunca do carrinho antigo.
  // Mesma regra da API SumUp: maior valor entre os artigos com portes pagos.
  const shipping=Math.max(0,...this.cart.map(item=>{
   const product=this.liveCatalog.find(p=>p.id===item.id||p.dbId===item.id);
   if(!product)return 0;
   if(product.shippingMode==='free')return 0;
   if(product.shippingMode==='paid'){
    const amount=Number(product.shippingPrice);
    return Number.isFinite(amount)&&amount>0?amount:4.50;
   }
   return subtotal>=49.90?0:4.50;
  }));
  document.getElementById('checkout-subtotal').textContent=this.eur(subtotal);
  document.getElementById('checkout-shipping').textContent=shipping?this.eur(shipping):'Grátis';
  document.getElementById('checkout-total').textContent=this.eur(subtotal+shipping);
 },
 async pay(event){
  event.preventDefault();
  const form=document.getElementById('checkout-form');
  if(!form.reportValidity() || this.paymentPrepared)return;
  const btn=document.getElementById('prepare-payment');
  const status=document.getElementById('payment-status');
  const errorBox=document.getElementById('payment-error');
  errorBox.hidden=true;btn.disabled=true;btn.textContent='A preparar pagamento...';
  const val=id=>document.getElementById(id).value.trim();
  const customer={name:val('cust-name'),email:val('cust-email'),phone:val('cust-phone'),address:val('cust-address'),postalCode:val('cust-postal'),city:val('cust-city'),nif:val('cust-nif')};
  try{
   if(!window.SumUpCard || typeof window.SumUpCard.mount!=='function')throw Error('O formulário seguro da SumUp não carregou. Atualize a página.');
   const response=await fetch('/api/sumup-create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({paymentMode:'widget',customer,items:this.cart.map(i=>({id:i.dbId||i.id,code:i.id,qty:i.qty,size:i.size,color:i.color}))})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.checkoutId||!data.pedido)throw Error(data.error||'Não foi possível iniciar o pagamento.');
   this.paymentPrepared=true;
   this.pedido=data.pedido;
   btn.hidden=true;
   status.textContent='Preencha os dados do pagamento no formulário seguro abaixo.';
   window.SumUpCard.mount({id:'sumup-card',checkoutId:data.checkoutId,email:customer.email,onResponse:async(type,body)=>{
    if(type==='error'||type==='fail'){errorBox.textContent='Não foi possível concluir o pagamento. Verifique os dados ou tente novamente.';errorBox.hidden=false;status.textContent='Pagamento não confirmado.';return}
    if(type==='success'){
     status.textContent='A verificar o pagamento com a SumUp...';
     try{
      const check=await fetch('/api/sumup-status?pedido='+encodeURIComponent(this.pedido),{cache:'no-store'});
      const result=await check.json();
      if(!check.ok)throw Error(result.error||'Não foi possível confirmar o pagamento.');
      if(result.status==='PAID')window.location.assign('/pagamento.html?pedido='+encodeURIComponent(this.pedido));
      else status.textContent='Pagamento enviado. A confirmação ainda está pendente; consulte o estado da encomenda antes de repetir.';
     }catch(e){status.textContent=e.message+' Não tente pagar novamente antes de verificar a encomenda.'}
    }
   }});
  }catch(err){errorBox.textContent=err.message;errorBox.hidden=false;btn.disabled=false;btn.textContent='Tentar novamente'}
 }
};document.addEventListener('DOMContentLoaded',()=>MaelleCheckout.init());
