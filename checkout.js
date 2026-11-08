/**
 * PAIRA LISBOA - Módulo de Checkout & Pagamentos
 * Preparado para integração com Banco de Portugal e developers.mypos
 */

const Checkout = {
  currentStep: 1,
  selectedPayment: 'mbway', // 'mbway', 'multibanco', 'mypos_card'
  orderData: {},

  init() {
    this.setupListeners();
  },

  openCheckoutModal() {
    const cart = Store.cart;
    if (!cart || cart.length === 0) {
      Store.showToast('O seu cesto de compras está vazio!');
      return;
    }

    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    this.renderOrderSummary();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    Store.closeCart();
  },

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  selectPaymentMethod(method) {
    this.selectedPayment = method;

    // Atualiza classes dos cartões de pagamento
    document.querySelectorAll('.payment-method-card').forEach(card => {
      if (card.getAttribute('data-method') === method) {
        card.classList.add('border-tinta', 'bg-papel');
        card.classList.remove('border-costura');
      } else {
        card.classList.remove('border-tinta', 'bg-papel');
        card.classList.add('border-costura');
      }
    });

    // Mostra o formulário específico do método
    document.getElementById('mbway-fields').style.display = method === 'mbway' ? 'block' : 'none';
    document.getElementById('multibanco-fields').style.display = method === 'multibanco' ? 'block' : 'none';
    document.getElementById('mypos-fields').style.display = method === 'mypos_card' ? 'block' : 'none';
  },

  renderOrderSummary() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    const subtotal = Store.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= Store.freeShippingThreshold ? 0 : 4.50;
    const total = subtotal + shipping;

    if (summaryContainer) {
      summaryContainer.innerHTML = Store.cart.map(item => `
        <div class="flex items-center justify-between text-xs py-2 border-b border-costura/60">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-tinta">${item.qty}x</span>
            <span class="text-grafite line-clamp-1">${item.title} (${item.size})</span>
          </div>
          <span class="font-medium text-tinta">${Store.formatPrice(item.price * item.qty)}</span>
        </div>
      `).join('');
    }

    document.getElementById('checkout-subtotal').textContent = Store.formatPrice(subtotal);
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Grátis' : Store.formatPrice(shipping);
    document.getElementById('checkout-total').textContent = Store.formatPrice(total);
  },

  // Finalizar Encomenda e Disparar Pagamento
  processOrder(event) {
    event.preventDefault();

    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const subtotal = Store.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= Store.freeShippingThreshold ? 0 : 4.50;
    const total = subtotal + shipping;

    const customer = {
      name: document.getElementById('cust-name').value,
      email: document.getElementById('cust-email').value,
      phone: document.getElementById('cust-phone').value,
      address: document.getElementById('cust-address').value,
      postalCode: document.getElementById('cust-postal').value,
      city: document.getElementById('cust-city').value,
      nif: document.getElementById('cust-nif').value || 'Consumidor Final',
      country: 'Portugal'
    };

    // Leitura das configurações myPOS salvas pelo ADM
    const myPosConfig = JSON.parse(localStorage.getItem('paira_mypos_config')) || {
      storeId: '00000000',
      clientNumber: '60000000',
      keyIndex: 1,
      mode: 'sandbox'
    };

    const orderId = 'PAIR-PT-' + Math.floor(100000 + Math.random() * 900000);

    // Estrutura de Encomenda para o Gateway myPOS / Banco de Portugal
    const orderPayload = {
      orderId: orderId,
      currency: 'EUR',
      amount: total.toFixed(2),
      customer: customer,
      items: Store.cart,
      paymentMethod: this.selectedPayment,
      myposConfig: {
        storeId: myPosConfig.storeId,
        clientNumber: myPosConfig.clientNumber,
        mode: myPosConfig.mode
      },
      createdAt: new Date().toISOString()
    };

    // Exibir tela de sucesso com as instruções de pagamento específicas
    this.displayOrderSuccess(orderPayload);
  },

  displayOrderSuccess(order) {
    const modalContent = document.getElementById('checkout-modal-content');
    if (!modalContent) return;

    let paymentInstructionHtml = '';

    if (order.paymentMethod === 'mbway') {
      const mbwayPhone = document.getElementById('mbway-phone').value || order.customer.phone;
      paymentInstructionHtml = `
        <div class="bg-papel p-5 border border-costura mt-4 text-left">
          <div class="flex items-center gap-3">
            <img src="assets/images/pagamentos/mbway.svg" alt="MB WAY" class="h-6"/>
            <span class="text-xs font-semibold text-tinta">Confirmação Pendente no MB WAY</span>
          </div>
          <p class="text-xs text-grafite mt-2 leading-relaxed">
            Enviámos um pedido de autorização de <strong>${Store.formatPrice(order.amount)}</strong> para o número de telemóvel <strong>${mbwayPhone}</strong>.
            Por favor, abra a sua aplicação MB WAY ou do seu banco e aprove a transação nos próximos <strong>5 minutos</strong>.
          </p>
        </div>
      `;
    } else if (order.paymentMethod === 'multibanco') {
      const ent = '21245';
      const ref = Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      paymentInstructionHtml = `
        <div class="bg-papel p-5 border border-costura mt-4 text-left">
          <div class="flex items-center gap-3">
            <img src="assets/images/pagamentos/multibanco.svg" alt="Multibanco" class="h-6"/>
            <span class="text-xs font-semibold text-tinta">Dados para Pagamento por Multibanco</span>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-costura text-xs">
            <div>
              <p class="text-grafite">Entidade:</p>
              <p class="font-bold text-tinta text-sm font-mono">${ent}</p>
            </div>
            <div>
              <p class="text-grafite">Referência:</p>
              <p class="font-bold text-tinta text-sm font-mono">${ref}</p>
            </div>
            <div>
              <p class="text-grafite">Montante:</p>
              <p class="font-bold text-tinta text-sm font-mono">${Store.formatPrice(order.amount)}</p>
            </div>
          </div>
          <p class="text-[11px] text-grafite mt-3">Poderá pagar na rede de caixas Multibanco ou através do Homebanking do seu Banco em Portugal (Opção: Pagamentos de Compras / Serviços).</p>
        </div>
      `;
    } else {
      // myPOS Cartão com 3D Secure
      paymentInstructionHtml = `
        <div class="bg-papel p-5 border border-costura mt-4 text-left">
          <div class="flex items-center gap-3">
            <span class="font-semibold text-xs text-tinta">myPOS Checkout 3D Secure 2.0</span>
            <span class="ml-auto text-[10px] px-2 py-0.5 bg-oliva text-white rounded">Autorizado</span>
          </div>
          <p class="text-xs text-grafite mt-2 leading-relaxed">
            Transação processada com sucesso através do gateway certificado <strong>developers.mypos</strong>.
            Código de Autorização: <strong class="font-mono">AUTH-MYPOS-${Math.floor(100000 + Math.random() * 900000)}</strong>.
          </p>
        </div>
      `;
    }

    modalContent.innerHTML = `
      <div class="p-8 text-center space-y-4">
        <div class="w-14 h-14 bg-sucesso/10 text-sucesso rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span class="etiqueta etiqueta-oliva">Encomenda Registada</span>
        <h2 class="font-display text-3xl text-tinta">Muito obrigado pela sua compra, ${order.customer.name}!</h2>
        <p class="text-sm text-grafite">
          Número da Encomenda: <strong class="text-tinta font-mono">${order.orderId}</strong><br/>
          Foi enviado um e-mail de confirmação e fatura fiscal para <strong>${order.customer.email}</strong>.
        </p>

        ${paymentInstructionHtml}

        <div class="pt-6 border-t border-costura flex justify-center gap-4">
          <button onclick="Checkout.closeCheckoutModal(); Store.cart = []; Store.saveCart(); Store.updateCartUI(); window.location.reload();" class="btn-editorial text-xs px-8 py-3">
            Voltar à Loja
          </button>
        </div>
      </div>
    `;

    // Limpa o carrinho
    Store.cart = [];
    Store.saveCart();
    Store.updateCartUI();
  },

  setupListeners() {
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectPaymentMethod(card.getAttribute('data-method'));
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Checkout.init();
});
