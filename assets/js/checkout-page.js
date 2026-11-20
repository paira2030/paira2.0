/* Checkout Maelle: preços exibidos são indicativos; API recalcula pelo catálogo. */
const MaelleCheckout={
 cart:[],
 eur(v){return Number(v||0).toLocaleString('pt-PT',{style:'currency',currency:'EUR'})},
 init(){
  try{const value=JSON.parse(localStorage.getItem('maelle_cart')||'[]');this.cart=Array.isArray(value)?value:[]}catch{this.cart=[]}
  if(!this.cart.length){document.querySelector('main').innerHTML='<h1 class="font-display text-3xl my-8">O seu cesto está vazio</h1><a href="/" class="underline">Voltar à loja</a>';return}
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
  const shipping=subtotal>=49.90?0:4.50;
  document.getElementById('checkout-subtotal').textContent=this.eur(subtotal);
  document.getElementById('checkout-shipping').textContent=shipping?this.eur(shipping):'Grátis';
  document.getElementById('checkout-total').textContent=this.eur(subtotal+shipping);
 },
 async pay(event){
  event.preventDefault();const form=document.getElementById('checkout-form');if(!form.reportValidity())return;
  const btn=form.querySelector('[type=submit]');btn.disabled=true;const label=btn.textContent;btn.textContent='A preparar pagamento...';
  const val=id=>document.getElementById(id).value.trim();
  const customer={name:val('cust-name'),email:val('cust-email'),phone:val('cust-phone'),address:val('cust-address'),postalCode:val('cust-postal'),city:val('cust-city'),nif:val('cust-nif')};
  try{
   const response=await fetch('/api/sumup-create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer,items:this.cart.map(i=>({id:i.dbId||i.id,code:i.id,qty:i.qty,size:i.size,color:i.color}))})});
   const data=await response.json().catch(()=>({}));if(!response.ok||!data.url)throw Error(data.error||'Não foi possível iniciar o pagamento.');
   const url=new URL(data.url);if(url.protocol!=='https:'||url.hostname!=='checkout.sumup.com')throw Error('Destino de pagamento inválido.');window.location.assign(url.toString());
  }catch(err){alert(err.message);btn.disabled=false;btn.textContent=label}
 }
};document.addEventListener('DOMContentLoaded',()=>MaelleCheckout.init());
