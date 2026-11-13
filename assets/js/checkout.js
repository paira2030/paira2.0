/* MAELLE — SumUp Hosted Checkout. Nunca marca pagamento como concluído no navegador. */
const Checkout = {
  init() {},
  openCheckoutModal() {
    if (!Store.cart?.length) return Store.showToast('O seu cesto está vazio.');
    this.renderOrderSummary();
    document.getElementById('checkout-modal').classList.add('active');
    document.body.style.overflow='hidden';
    Store.closeCart();
  },
  closeCheckoutModal() { document.getElementById('checkout-modal')?.classList.remove('active'); document.body.style.overflow=''; },
  renderOrderSummary() {
    const subtotal=Store.cart.reduce((s,i)=>s+Number(i.price)*Number(i.qty),0);
    const shipping=subtotal>=Store.freeShippingThreshold?0:4.5;
    const el=document.getElementById('checkout-summary-items');
    el.replaceChildren();
    for (const item of Store.cart) {
      const line=document.createElement('div'); line.className='flex justify-between text-xs py-2 border-b';
      const name=document.createElement('span'); name.textContent=`${item.qty}x ${item.title} (${item.size||''})`;
      const price=document.createElement('span'); price.textContent=Store.formatPrice(item.price*item.qty);
      line.append(name,price); el.append(line);
    }
    document.getElementById('checkout-subtotal').textContent=Store.formatPrice(subtotal);
    document.getElementById('checkout-shipping').textContent=shipping?Store.formatPrice(shipping):'Grátis';
    document.getElementById('checkout-total').textContent=Store.formatPrice(subtotal+shipping);
  },
  async processOrder(event) {
    event.preventDefault();
    const form=document.getElementById('checkout-form');
    if (!form.reportValidity()) return;
    const btn=form.querySelector('button[type=submit]');
    btn.disabled=true; const previous=btn.textContent; btn.textContent='A preparar pagamento SumUp...';
    const customer={name:document.getElementById('cust-name').value,email:document.getElementById('cust-email').value,phone:document.getElementById('cust-phone').value,address:document.getElementById('cust-address').value,postalCode:document.getElementById('cust-postal').value,city:document.getElementById('cust-city').value,nif:document.getElementById('cust-nif').value};
    try {
      const response=await fetch('/api/sumup-create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer,items:Store.cart.map(i=>({id:i.dbId||i.id,code:i.id,qty:i.qty,size:i.size,color:i.color}))})});
      const data=await response.json();
      if (!response.ok || !data.url) throw Error(data.error||'Não foi possível iniciar o pagamento.');
      if (new URL(data.url).hostname!=='checkout.sumup.com') throw Error('Destino de pagamento inválido.');
      window.location.assign(data.url);
    } catch(err) { Store.showToast(err.message); btn.disabled=false; btn.textContent=previous; }
  }
};
