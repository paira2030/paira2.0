/**
 * MAELLE - Painel Administrativo ADM
 * Gestão de Catálogo Maelle e pagamentos SumUp
 */

const Admin = {
  authenticated: false,
  products: [],
  editingImages: [],
  currentTab: 'produtos',


  async init() {
    this.setupPasswordRecovery();
    await this.checkAuth();
    if (this.authenticated) await this.loadCatalog();
    this.setupListeners();
  },

  async checkAuth() {
    try {
      this.authenticated = MaelleDB.enabled ? await MaelleDB.isAdmin() : false;
    } catch(e) { console.error(e); this.authenticated = false; }
    document.getElementById('auth-gate').style.display = this.authenticated ? 'none' : 'flex';
    document.getElementById('admin-dashboard').style.display = this.authenticated ? 'block' : 'none';
    if (this.authenticated) {
      await this.loadCatalog(); this.renderProductsTable();
    }
  },
  async login() {
    const pin = document.getElementById('admin-pin-input').value;
    try {
      if (MaelleDB.enabled) await MaelleDB.loginWithPasswordOnly(pin);
      else throw new Error('Supabase não configurado. Verifique js/supabase-config.js.');
      await this.checkAuth();
    } catch(e) { const el=document.getElementById('login-error'); el.textContent=e.message; el.style.display='block'; }
  },
  setupPasswordRecovery() {
    if (!MaelleDB.enabled) return;
    const showRecovery = () => {
      const modal = document.getElementById('password-recovery-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('new-password').focus();
    };
    // Capture the event, including when Supabase clears the URL fragment.
    MaelleDB.client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') showRecovery();
    });
    if (window.__maelleRecoveryLink) {
      // Supabase JS processes recovery tokens asynchronously on startup.
      MaelleDB.client.auth.getSession().then(({data, error}) => {
        if (!error && data?.session) showRecovery();
        else {
          const target = document.getElementById('login-error');
          target.textContent = 'O link de recuperação expirou ou é inválido. Solicita um novo link.';
          target.style.display = 'block';
        }
      });
    }
  },
  async requestPasswordReset(fromPanel = false) {
    const target = document.getElementById(fromPanel ? 'security-message' : 'login-error');
    target.style.display = 'block';
    if (!MaelleDB.enabled) { target.textContent = 'Configura primeiro o Project URL e a Publishable Key do Supabase.'; return; }
    let email = document.getElementById('admin-email-input').value.trim();
    if (fromPanel) {
      const {data} = await MaelleDB.client.auth.getUser();
      email = data.user?.email || '';
    }
    if (!email && !fromPanel) {
      const form = document.getElementById('reset-email-form');
      form.classList.remove('hidden');
      document.getElementById('reset-email-input').focus();
      target.textContent = 'Introduz o email da conta Supabase no campo abaixo e clica em Enviar link.';
      return;
    }
    if (!email) { target.textContent = 'Introduz o teu email de administrador.'; return; }
    try {
      const redirectTo = new URL('admin.html', window.location.href).href.split('#')[0];
      const {error} = await MaelleDB.client.auth.resetPasswordForEmail(email, {redirectTo});
      if (error) throw error;
      target.textContent = 'Se o email estiver registado, receberás um link para redefinir a senha. Verifica também o spam.';
    } catch(e) { target.textContent = 'Não foi possível enviar: ' + e.message; }
  },
  async submitResetEmail() {
    const email = document.getElementById('reset-email-input').value.trim();
    document.getElementById('admin-email-input').value = email;
    await this.requestPasswordReset(false);
  },
  async finishPasswordReset() {
    const target = document.getElementById('password-recovery-message');
    const password = document.getElementById('new-password').value;
    const confirmation = document.getElementById('confirm-password').value;
    if (password.length < 12 || password !== confirmation) {
      target.textContent = 'Usa pelo menos 12 caracteres e confirma a mesma senha.'; return;
    }
    try {
      const {error} = await MaelleDB.client.auth.updateUser({password});
      if (error) throw error;
      target.textContent = 'Senha alterada. Entra novamente com a nova senha.';
      await MaelleDB.client.auth.signOut();
      setTimeout(() => window.location.replace('admin.html'), 1300);
    } catch(e) { target.textContent = 'Erro ao alterar senha: ' + e.message; }
  },
  async logout() {
    if(MaelleDB.enabled) await MaelleDB.client.auth.signOut();
    sessionStorage.removeItem('maelle_admin_auth'); window.location.reload();
  },

  async loadCatalog() {
    try {
      if (MaelleDB.enabled) { this.products = await MaelleDB.list(); return; }
      const localCustom = localStorage.getItem('maelle_custom_products');
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
    if (MaelleDB.enabled) return;
    localStorage.setItem('maelle_custom_products', JSON.stringify(this.products));
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
    document.getElementById('tab-sumup').style.display = tab === 'sumup' ? 'block' : 'none';
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
    this.editingImages = [];
    this.renderImagePreviews();
    document.getElementById('prod-form-files').value = '';
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
    document.getElementById('prod-form-image').value = p.localImage?.startsWith('data:') ? '' : (p.localImage || '');
    this.editingImages = Array.isArray(p.images) ? [...p.images] : (p.localImage ? [p.localImage] : []);
    this.renderImagePreviews();
    document.getElementById('prod-form-files').value = '';
    document.getElementById('prod-form-desc').value = p.description || '';
    document.getElementById('product-edit-modal').classList.add('active');
  },

  closeProductEditModal() {
    document.getElementById('product-edit-modal').classList.remove('active');
  },

  async saveProductForm(e) {
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
      localImage: this.editingImages[0] || document.getElementById('prod-form-image').value,
      images: [...this.editingImages],
      description: document.getElementById('prod-form-desc').value,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Creme', 'Preto'],
      rating: 5.0,
      reviewsCount: 12
    };

    if (!productData.localImage) { this.showAdminToast('Escolha uma imagem para o produto.'); return; }
    const previousProduct = idx >= 0 ? this.products[idx] : null;
    if (MaelleDB.enabled) {
      try {
        if (previousProduct) productData.dbId = previousProduct.dbId;
        await MaelleDB.save(productData);
        await this.loadCatalog(); this.renderProductsTable(); this.closeProductEditModal();
        this.showAdminToast('Produto guardado online com sucesso!');
      } catch(err) { console.error(err); this.showAdminToast('Erro ao guardar online: '+err.message); }
      return;
    }
    if (idx === -1) {
      this.products.unshift(productData);
      this.showAdminToast('Nova peça adicionada com sucesso!');
    } else {
      this.products[idx] = Object.assign(this.products[idx], productData);
      this.showAdminToast('Peça atualizada com sucesso!');
    }

    try { this.saveCatalog(); } catch (error) {
      if (idx === -1) this.products.shift();
      else this.products[idx] = previousProduct;
      this.showAdminToast('Armazenamento cheio. Escolha menos imagens ou imagens menores.'); return;
    }
    this.renderProductsTable();
    this.closeProductEditModal();
  },

  async deleteProduct(index) {
    if (confirm(`Tem a certeza que deseja eliminar "${this.products[index].title}"?`)) {
      if (MaelleDB.enabled) {
        try { await MaelleDB.remove(this.products[index]); await this.loadCatalog(); this.renderProductsTable(); this.showAdminToast('Produto removido online.'); }
        catch(err) { this.showAdminToast('Erro: '+err.message); }
        return;
      }
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

  async handleProductImages(files) {
    for (const file of [...files]) {
      if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { this.showAdminToast('Formato não suportado.'); continue; }
      if (file.size > 8 * 1024 * 1024) { this.showAdminToast('Imagem acima de 8 MB.'); continue; }
      try {
        const img = await createImageBitmap(file);
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); img.close();
        this.editingImages.push(canvas.toDataURL('image/jpeg', 0.72));
      } catch (error) { this.showAdminToast('Não foi possível ler uma imagem.'); }
    }
    this.renderImagePreviews();
  },
  renderImagePreviews() {
    const box = document.getElementById('prod-image-previews'); if (!box) return;
    box.replaceChildren();
    this.editingImages.forEach((src, index) => {
      const wrapper = document.createElement('div'); wrapper.className = 'flex flex-col gap-1 items-center';
      const image = document.createElement('img'); image.src = src; image.alt = 'Foto ' + (index + 1);
      image.className = 'w-20 h-24 object-cover border cursor-pointer ' + (index === 0 ? 'border-oliva border-2' : 'border-costura');
      image.title = 'Definir como imagem principal'; image.onclick = () => {
        const selected = this.editingImages.splice(index, 1)[0]; this.editingImages.unshift(selected); this.renderImagePreviews();
      };
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = index === 0 ? 'Principal · Remover' : 'Remover';
      remove.className = 'text-xs underline'; remove.onclick = () => { this.editingImages.splice(index, 1); this.renderImagePreviews(); };
      wrapper.append(image, remove); box.append(wrapper);
    });
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
