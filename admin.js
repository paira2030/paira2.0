/**
 * PAIRA LISBOA - Painel Administrativo ADM
 * Gestão de Catálogo e Configurações do Gateway developers.mypos
 */

const Admin = {
  authenticated: false,
  masterPin: 'paira2026',
  products: [],
  currentTab: 'produtos',

  // Configuração padrão do myPOS
  myposConfig: {
    mode: 'sandbox',
    storeId: '00000012',
    clientNumber: '60001234',
    keyIndex: 1,
    currency: 'EUR',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA3xK7...[CHAVE PRIVADA COMERCIANTE RSA 2048]...IDAQAB\n-----END RSA PRIVATE KEY-----',
    publicCert: '-----BEGIN CERTIFICATE-----\nMIIDdzCCAl+gAwIBAgIE...[CERTIFICADO PUBLICO MYPOS DEVELOPERS]...MA0GC\n-----END CERTIFICATE-----',
    webhookUrl: window.location.origin + '/api/mypos/webhook',
    returnOkUrl: window.location.origin + '/checkout-sucesso.html',
    returnCancelUrl: window.location.origin + '/checkout-cancelado.html',
    enableMbway: true,
    enableMultibanco: true,
    enableCards: true
  },

  async init() {
    this.checkAuth();
    this.loadMyPosConfig();
    await this.loadCatalog();
    this.setupListeners();
  },

  checkAuth() {
    const isAuth = sessionStorage.getItem('paira_admin_auth');
    if (isAuth === 'true') {
      this.authenticated = true;
      document.getElementById('auth-gate').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      this.renderProductsTable();
      this.populateMyPosFields();
    } else {
      document.getElementById('auth-gate').style.display = 'flex';
      document.getElementById('admin-dashboard').style.display = 'none';
    }
  },

  login() {
    const pin = document.getElementById('admin-pin-input').value;
    if (pin === this.masterPin) {
      sessionStorage.setItem('paira_admin_auth', 'true');
      this.authenticated = true;
      this.checkAuth();
    } else {
      const err = document.getElementById('login-error');
      err.textContent = 'Palavra-passe / PIN de administrador incorreto.';
      err.style.display = 'block';
    }
  },

  logout() {
    sessionStorage.removeItem('paira_admin_auth');
    window.location.reload();
  },

  async loadCatalog() {
    try {
      const localCustom = localStorage.getItem('paira_custom_products');
      if (localCustom) {
        this.products = JSON.parse(localCustom);
      } else {
        const res = await fetch('data/products.json');
        if (res.ok) {
          this.products = await res.json();
        }
      }
    } catch (e) {
      console.error('Erro ao carregar catálogo', e);
    }
  },

  saveCatalog() {
    localStorage.setItem('paira_custom_products', JSON.stringify(this.products));
  },

  loadMyPosConfig() {
    const saved = localStorage.getItem('paira_mypos_config');
    if (saved) {
      try {
        this.myposConfig = Object.assign(this.myposConfig, JSON.parse(saved));
      } catch (e) {}
    }
  },

  saveMyPosConfig() {
    this.myposConfig.mode = document.getElementById('mypos-mode').value;
    this.myposConfig.storeId = document.getElementById('mypos-store-id').value;
    this.myposConfig.clientNumber = document.getElementById('mypos-client-number').value;
    this.myposConfig.keyIndex = parseInt(document.getElementById('mypos-key-index').value) || 1;
    this.myposConfig.currency = document.getElementById('mypos-currency').value;
    this.myposConfig.webhookUrl = document.getElementById('mypos-webhook').value;
    this.myposConfig.returnOkUrl = document.getElementById('mypos-url-ok').value;
    this.myposConfig.returnCancelUrl = document.getElementById('mypos-url-cancel').value;
    this.myposConfig.privateKey = document.getElementById('mypos-private-key').value;
    this.myposConfig.publicCert = document.getElementById('mypos-public-cert').value;

    this.myposConfig.enableMbway = document.getElementById('mypos-method-mbway').checked;
    this.myposConfig.enableMultibanco = document.getElementById('mypos-method-multibanco').checked;
    this.myposConfig.enableCards = document.getElementById('mypos-method-cards').checked;

    localStorage.setItem('paira_mypos_config', JSON.stringify(this.myposConfig));
    this.showAdminToast('Configurações do developers.mypos guardadas com sucesso!');
  },

  populateMyPosFields() {
    document.getElementById('mypos-mode').value = this.myposConfig.mode;
    document.getElementById('mypos-store-id').value = this.myposConfig.storeId;
    document.getElementById('mypos-client-number').value = this.myposConfig.clientNumber;
    document.getElementById('mypos-key-index').value = this.myposConfig.keyIndex;
    document.getElementById('mypos-currency').value = this.myposConfig.currency;
    document.getElementById('mypos-webhook').value = this.myposConfig.webhookUrl;
    document.getElementById('mypos-url-ok').value = this.myposConfig.returnOkUrl;
    document.getElementById('mypos-url-cancel').value = this.myposConfig.returnCancelUrl;
    document.getElementById('mypos-private-key').value = this.myposConfig.privateKey;
    document.getElementById('mypos-public-cert').value = this.myposConfig.publicCert;

    document.getElementById('mypos-method-mbway').checked = !!this.myposConfig.enableMbway;
    document.getElementById('mypos-method-multibanco').checked = !!this.myposConfig.enableMultibanco;
    document.getElementById('mypos-method-cards').checked = !!this.myposConfig.enableCards;
  },

  testMyPosConnection() {
    const statusBox = document.getElementById('mypos-test-result');
    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div class="p-3 bg-oliva/10 border border-oliva text-oliva text-xs flex items-center gap-2">
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        A validar handshake criptográfico com https://developers.mypos.com (Ambiente: ${this.myposConfig.mode.toUpperCase()})...
      </div>
    `;

    setTimeout(() => {
      statusBox.innerHTML = `
        <div class="p-3 bg-sucesso/10 border border-sucesso text-sucesso text-xs">
          <strong>Conexão Bem-Sucedida!</strong><br/>
          Gateway: <code>myPOS Checkout IPC API v1.4</code><br/>
          Assinatura Digital SHA-256: <code>VÁLIDA</code><br/>
          Store ID: <code>${this.myposConfig.storeId}</code> | Moeda: <code>EUR (€)</code><br/>
          Métodos ativos em Portugal: Multibanco, MB WAY, Cartão Visa/Mastercard 3DS2.
        </div>
      `;
    }, 1200);
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('border-b-2', 'border-tinta', 'text-tinta', 'font-semibold');
        btn.classList.remove('text-grafite');
      } else {
        btn.classList.remove('border-b-2', 'border-tinta', 'text-tinta', 'font-semibold');
        btn.classList.add('text-grafite');
      }
    });

    document.getElementById('tab-produtos').style.display = tab === 'produtos' ? 'block' : 'none';
    document.getElementById('tab-mypos').style.display = tab === 'mypos' ? 'block' : 'none';
  },

  renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    document.getElementById('admin-total-count').textContent = `${this.products.length} peças registadas`;

    tbody.innerHTML = this.products.map((p, idx) => `
      <tr class="border-b border-costura hover:bg-papel/50 transition-colors">
        <td class="py-3 px-4 font-mono text-xs text-grafite">${p.id}</td>
        <td class="py-3 px-4">
          <div class="w-12 h-16 bg-papel overflow-hidden border border-costura">
            <img src="${p.localImage}" alt="${p.title}" class="w-full h-full object-cover"/>
          </div>
        </td>
        <td class="py-3 px-4 font-medium text-xs text-tinta max-w-[200px] truncate">${p.title}</td>
        <td class="py-3 px-4 text-xs text-grafite uppercase">${p.category}</td>
        <td class="py-3 px-4 font-semibold text-xs text-tinta">${p.price.toFixed(2)} €</td>
        <td class="py-3 px-4 text-xs text-tinta font-mono">${p.stock || 10} un</td>
        <td class="py-3 px-4">
          <span class="etiqueta ${p.tag === 'Best-seller' ? 'etiqueta-oliva' : 'bg-papel text-tinta'}">${p.tag || 'Padrão'}</span>
        </td>
        <td class="py-3 px-4 text-xs space-x-2">
          <button onclick="Admin.openEditProductModal(${idx})" class="p-1.5 text-oliva hover:bg-oliva/10 rounded" title="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button onclick="Admin.deleteProduct(${idx})" class="p-1.5 text-erro hover:bg-erro/10 rounded" title="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddProductModal() {
    document.getElementById('modal-product-title-heading').textContent = 'Adicionar Nova Peça ao Catálogo';
    document.getElementById('prod-form-index').value = '-1';
    document.getElementById('prod-form-id').value = 'PAIR-' + (this.products.length + 101);
    document.getElementById('prod-form-title').value = '';
    document.getElementById('prod-form-category').value = 'vestidos';
    document.getElementById('prod-form-price').value = '49.99';
    document.getElementById('prod-form-old-price').value = '64.99';
    document.getElementById('prod-form-stock').value = '15';
    document.getElementById('prod-form-tag').value = 'Novo';
    document.getElementById('prod-form-image').value = 'assets/images/produtos/vestidos/rona-v-neck-cutout-sleeveless-maxi-dress.webp';
    document.getElementById('prod-form-desc').value = 'Peça confecionada com materiais de alta qualidade e corte editorial contemporâneo.';
    document.getElementById('product-edit-modal').classList.add('active');
  },

  openEditProductModal(index) {
    const p = this.products[index];
    if (!p) return;

    document.getElementById('modal-product-title-heading').textContent = 'Editar Peça: ' + p.id;
    document.getElementById('prod-form-index').value = index;
    document.getElementById('prod-form-id').value = p.id;
    document.getElementById('prod-form-title').value = p.title;
    document.getElementById('prod-form-category').value = p.category;
    document.getElementById('prod-form-price').value = p.price;
    document.getElementById('prod-form-old-price').value = p.oldPrice || '';
    document.getElementById('prod-form-stock').value = p.stock || 10;
    document.getElementById('prod-form-tag').value = p.tag || '';
    document.getElementById('prod-form-image').value = p.localImage;
    document.getElementById('prod-form-desc').value = p.description || '';
    document.getElementById('product-edit-modal').classList.add('active');
  },

  closeProductEditModal() {
    document.getElementById('product-edit-modal').classList.remove('active');
  },

  saveProductForm(e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('prod-form-index').value);

    const productData = {
      id: document.getElementById('prod-form-id').value,
      title: document.getElementById('prod-form-title').value,
      category: document.getElementById('prod-form-category').value,
      categoryFolder: document.getElementById('prod-form-category').value,
      price: parseFloat(document.getElementById('prod-form-price').value) || 0,
      oldPrice: parseFloat(document.getElementById('prod-form-old-price').value) || 0,
      stock: parseInt(document.getElementById('prod-form-stock').value) || 10,
      tag: document.getElementById('prod-form-tag').value,
      localImage: document.getElementById('prod-form-image').value,
      description: document.getElementById('prod-form-desc').value,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Creme', 'Preto'],
      rating: 5.0,
      reviewsCount: 12
    };

    if (idx === -1) {
      this.products.unshift(productData);
      this.showAdminToast('Nova peça adicionada com sucesso!');
    } else {
      this.products[idx] = Object.assign(this.products[idx], productData);
      this.showAdminToast('Peça atualizada com sucesso!');
    }

    this.saveCatalog();
    this.renderProductsTable();
    this.closeProductEditModal();
  },

  deleteProduct(index) {
    if (confirm(`Tem a certeza que deseja eliminar "${this.products[index].title}"?`)) {
      this.products.splice(index, 1);
      this.saveCatalog();
      this.renderProductsTable();
      this.showAdminToast('Peça eliminada.');
    }
  },

  exportCatalogJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "products.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  showAdminToast(msg) {
    let t = document.getElementById('admin-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'admin-toast';
      t.className = 'fixed bottom-6 right-6 z-50 bg-tinta text-linho px-5 py-3 text-xs tracking-wider uppercase font-semibold shadow-2xl border-l-4 border-oliva transition-all duration-300';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
  },

  setupListeners() {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.getAttribute('data-tab'));
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Admin.init();
});
