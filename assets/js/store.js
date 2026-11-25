/**
 * MAELLE - Core Store Logic
 * Catálogo Reativo, Carrinho com Barra de Portes Grátis, Filtros e PDP
 */

// Estado da Loja
const Store = {
  products: [],
  cart: JSON.parse(localStorage.getItem('maelle_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('maelle_wishlist')) || [],
  currentCategory: 'all',
  currentFilterLabel: 'Todas as Peças',
  filterSubcategory: null,
  filterMaxPrice: null,
  filterColor: null,
  searchQuery: '',
  activeProductModal: null,
  activeMegaMenu: null,
  megaMenuTimer: null,
  freeShippingThreshold: 49.90,

  // Inicialização
  async init() {
    await this.loadProducts();
    await window.MaelleBlackFriday?.load();
    this.products.forEach(p=>{p.basePrice=p.price;if(window.MaelleBlackFriday?.eligible(p)){p.price=window.MaelleBlackFriday.price(p);p.bfActive=true;}});
    this.cart=this.cart.map(i=>{const p=this.products.find(p=>p.id===i.id);return p?{...i,price:p.price}:i;});this.saveCart();
    this.renderCatalog();
    this.renderFavoritosInverno();
    this.updateCartUI();
    this.updateWishlistBadges();
    this.setupEventListeners();
    this.updateCategoryCounts();
    const params = new URLSearchParams(location.search);
    const category = params.get('categoria');
    if(category) this.filterCategory(category);
    const productId = params.get('produto');
    if (productId && this.products.some(p => String(p.id) === productId)) this.openPDP(productId);
  },

  // Carregar Catálogo
  async loadProducts() {
    if (MaelleDB.enabled) {
      try { this.products = await MaelleDB.list(true); return; }
      catch(err) { console.error('Falha ao carregar catálogo online:',err); this.products=[]; return; }
    }
    try {
      const response = await fetch('data/products.json');
      if (response.ok) {
        this.products = await response.json();
      } else {
        console.error('Falha ao carregar catálogo local.');
      }
    } catch (e) {
      console.warn('Usando catálogo em fallback.');
    }
    try { const custom = localStorage.getItem('maelle_custom_products'); if (custom) this.products = JSON.parse(custom); } catch (e) { console.warn('Catálogo local inválido', e); }
  },

  // Portes por produto: máximo único entre artigos pagos; antigos mantêm regra de 49,90 €.
  calculateShipping(cart = this.cart) {
    const subtotal = cart.reduce((s, item) => s + Number(item.price) * Number(item.qty), 0);
    const amounts = cart.map(item => {
      const product = this.products.find(p => p.id === item.id);
      const mode = product?.shippingMode ?? item.shippingMode ?? 'legacy';
      const price = Number(product?.shippingPrice ?? item.shippingPrice ?? 4.50);
      if (mode === 'free') return 0;
      if (mode === 'paid') return Number.isFinite(price) && price >= 0 ? price : 4.50;
      return subtotal >= this.freeShippingThreshold ? 0 : 4.50;
    });
    return Math.max(0, ...amounts);
  },
  // Formatação de Preço Português (€)
  formatPrice(num) {
    return Number(num).toFixed(2).replace('.', ',') + ' €';
  },

  // Voltar ao Início do Site (Botão MAELLE)
  goHome(event) {
    if (event) event.preventDefault();
    this.currentCategory = 'all';
    this.filterSubcategory = null;
    this.filterMaxPrice = null;
    this.filterColor = null;
    this.searchQuery = '';
    this.currentFilterLabel = 'Todas as Peças';

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    const overlayInput = document.getElementById('overlay-search-input');
    if (overlayInput) overlayInput.value = '';

    this.closeMegaMenuImmediate();
    this.closeSearchModal();
    this.closeMobileMenu();
    this.closeCart();
    this.closePDP();

    this.renderCatalog();

    // Rola suavemente até o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Filtro por Opção / Subcategoria do Mega-Menu
  updateCategoryCounts(){document.querySelectorAll('[data-count-group]').forEach(el=>{el.textContent='('+this.products.filter(p=>MaelleCategories.match(p,el.dataset.countGroup,el.dataset.countSub)).length+')';});},
  filterByOption(category, subcat, label) {
    if(category==='acessorios'){location.href='acessorios.html'+(subcat?'?tipo='+encodeURIComponent(subcat):'');return;}
    this.currentCategory = category || 'all';
    this.filterSubcategory = subcat ? subcat.toLowerCase() : null;
    this.filterMaxPrice = null;
    this.filterColor = null;
    this.currentFilterLabel = label || subcat || category;
    this.closeMegaMenuImmediate();
    this.renderCatalog();
    this.scrollToCatalog();
  },

  // Filtro por Preço Máximo
  filterByPrice(maxPrice, label) {
    this.filterMaxPrice = maxPrice;
    this.filterSubcategory = null;
    this.filterColor = null;
    this.currentFilterLabel = label || `Peças até ${maxPrice} €`;
    this.closeMegaMenuImmediate();
    this.renderCatalog();
    this.scrollToCatalog();
  },

  // Filtro por Cor
  filterByColor(color, label) {
    this.filterColor = color ? color.toLowerCase() : null;
    this.filterMaxPrice = null;
    this.filterSubcategory = null;
    this.currentFilterLabel = label || `Cor: ${color}`;
    this.closeMegaMenuImmediate();
    this.renderCatalog();
    this.scrollToCatalog();
  },

  scrollToCatalog() {
    const catalogEl = document.getElementById('vitrine-produtos');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // Filtro de Categoria Tradicional
  filterCategory(category) {
    if(category==='acessorios'){location.href='acessorios.html';return;}
    this.currentCategory = category;
    this.filterSubcategory = null;
    this.filterMaxPrice = null;
    this.filterColor = null;
    this.currentFilterLabel = category === 'all' ? 'Todas as Peças' : (window.MaelleCategories?.labels[category] || category).toUpperCase();
    this.closeMegaMenuImmediate();
    this.renderCatalog();

    // Atualiza links ativos no menu
    document.querySelectorAll('[data-category-filter]').forEach(el => {
      if (el.getAttribute('data-category-filter') === category) {
        el.classList.add('text-oliva', 'font-semibold');
      } else {
        el.classList.remove('text-oliva', 'font-semibold');
      }
    });

    this.scrollToCatalog();
  },

  // Controladores do Mega-Menu no Hover
  openMegaMenu(menuId) {
    clearTimeout(this.megaMenuTimer);
    document.querySelectorAll('.megamenu-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    const target = document.getElementById('megamenu-' + menuId);
    if (target) {
      target.classList.add('is-active');
      this.activeMegaMenu = menuId;
    }
  },

  closeMegaMenu() {
    clearTimeout(this.megaMenuTimer);
    this.megaMenuTimer = setTimeout(() => {
      document.querySelectorAll('.megamenu-panel').forEach(panel => {
        panel.classList.remove('is-active');
      });
      this.activeMegaMenu = null;
    }, 150);
  },

  closeMegaMenuImmediate() {
    clearTimeout(this.megaMenuTimer);
    document.querySelectorAll('.megamenu-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    this.activeMegaMenu = null;
  },

  keepMegaMenuOpen() {
    clearTimeout(this.megaMenuTimer);
  },

  // Modal / Barra de Busca Flutuante
  openSearchModal() {
    const overlay = document.getElementById('search-overlay-bar');
    if (overlay) {
      overlay.classList.add('active');
      const input = document.getElementById('overlay-search-input');
      if (input) {
        input.focus();
        input.select();
      }
    }
  },

  closeSearchModal() {
    const overlay = document.getElementById('search-overlay-bar');
    if (overlay) {
      overlay.classList.remove('active');
    }
  },

  // Destaques selecionados no ADM; não mostra peças fictícias.
  renderFavoritosInverno() {
    const section=document.getElementById('favoritos-inverno');
    const grid=document.getElementById('favoritos-inverno-grid');
    if(!section || !grid) return;
    const selected=this.products.filter(p=>p.isFavoritoInverno === true || p.isFavoritoInverno === 1 || p.isFavoritoInverno === "true").slice(0,4);
    section.hidden=selected.length===0;
    if(!selected.length) {grid.replaceChildren();return;}
    grid.replaceChildren();
    for(const p of selected) {
      const card=document.createElement('article');
      card.className='group min-w-0';
      const button=document.createElement('button');
      button.type='button';button.className='block w-full text-left';
      button.setAttribute('aria-label','Ver '+p.title);
      button.onclick=()=>this.openPDP(p.id);
      const picture=document.createElement('div');picture.className='relative aspect-[3/4] overflow-hidden bg-papel';
      const img=document.createElement('img');img.src=p.localImage||p.images?.[0]||'';img.alt=p.title;img.loading='lazy';img.className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105';
      const tag=document.createElement('span');tag.className='absolute left-3 top-3 bg-white px-2 py-1 text-[10px] uppercase tracking-wide';tag.textContent='Favorito de Inverno';
      picture.append(img,tag);
      const title=document.createElement('h3');title.className='mt-3 text-sm text-tinta';title.textContent=p.title;
      const price=document.createElement('p');price.className='mt-1 text-sm font-semibold';price.textContent=this.formatPrice(p.price);if(p.bfActive){const old=document.createElement('span');old.className='maelle-bf-old';old.textContent=this.formatPrice(p.basePrice);price.append(old);}
      button.append(picture,title,price);card.append(button);grid.append(card);
    }
  },

  // Renderizar Vitrine
  renderCatalog() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = this.products;

    if (this.currentCategory === 'vestidos') {
      filtered = filtered.filter(p => p.category === 'vestidos');
    } else if (this.currentCategory === 'casacos') {
      filtered = filtered.filter(p => MaelleCategories.parent(p.category) === 'casacos');
    } else if (this.currentCategory === 'tops' || this.currentCategory === 'roupa') {
      filtered = filtered.filter(p => MaelleCategories.parent(p.category) === 'tops');
    } else if (['calcas','saias'].includes(this.currentCategory)) {
      filtered = filtered.filter(p => p.category === this.currentCategory);
    } else if (this.currentCategory === 'conjuntos') {
      filtered = filtered.filter(p => MaelleCategories.parent(p.category) === 'conjuntos');
    } else if (this.currentCategory === 'novidades') {
      filtered = filtered.filter(p => p.tag === 'Novo' || p.tag === 'Best-seller');
    } else if (this.currentCategory === 'saldos') {
      filtered = filtered.filter(p => p.isSaldo && p.oldPrice && p.oldPrice > p.price);
    } else if (this.currentCategory === 'inverno') {
      filtered = filtered.filter(p => p.isInverno);
    } else if (this.currentCategory === 'verao') {
      filtered = filtered.filter(p => p.category === 'vestidos' || MaelleCategories.parent(p.category) === 'tops' || MaelleCategories.parent(p.category) === 'conjuntos');
    } else if (this.currentCategory === 'acessorios') {
      filtered = filtered.filter(p => MaelleCategories.parent(p.category) === 'acessorios');
    }

    if (this.filterSubcategory) {
      const sub = this.filterSubcategory;
      filtered = filtered.filter(p => 
        (MaelleCategories.groups[this.currentCategory]?.[sub] ? MaelleCategories.match(p,this.currentCategory,sub) : MaelleCategories.norm([p.title,p.slug,p.description].join(' ')).includes(MaelleCategories.norm(sub)))
      );
    }

    if (this.filterMaxPrice) {
      filtered = filtered.filter(p => p.price <= this.filterMaxPrice);
    }

    if (this.filterColor) {
      const col = this.filterColor;
      filtered = filtered.filter(p => 
        (p.colors && p.colors.some(c => c.toLowerCase().includes(col))) ||
        p.title.toLowerCase().includes(col) ||
        p.description.toLowerCase().includes(col)
      );
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    const countLabel = document.getElementById('catalog-count');
    if (countLabel) {
      countLabel.textContent = `${this.currentFilterLabel} — ${filtered.length} peças encontradas`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <p class="font-display text-2xl text-grafite">Nenhuma peça encontrada para esta seleção.</p>
          <button onclick="Store.filterCategory('all')" class="mt-4 btn-editorial-outline px-6 py-2 text-xs">Ver Todas as Peças</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isWish = this.wishlist.includes(p.id);
      return `
        <article class="product-card group relative bg-linho flex flex-col" data-product-id="${p.id}">
          <div class="relative aspect-fashion overflow-hidden bg-papel cursor-pointer" onclick="Store.openPDP('${p.id}')">
            <img 
              src="${p.localImage}" 
              alt="${p.title}" 
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
            />
            
            <!-- Etiqueta / Tag -->
            <div class="absolute left-3 top-3 flex flex-col items-start gap-1">
              ${p.tag ? `<span class="etiqueta ${p.tag === 'Best-seller' ? 'etiqueta-oliva' : 'bg-tinta text-linho'}">${p.tag}</span>` : ''}
              ${p.bfActive ? `<span class="maelle-bf-tag">BLACK FRIDAY −20%</span>` : (p.oldPrice && p.oldPrice > p.price ? `<span class="etiqueta etiqueta-ouro">OFERTA</span>` : '')}
            </div>

            <!-- Botão Wishlist -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); Store.toggleWishlist('${p.id}')" 
              aria-label="Guardar nos Favoritos"
              class="absolute right-3 top-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors hover:text-oliva ${isWish ? 'text-erro' : 'text-tinta'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>

            <!-- Botão de Adição Rápida (Hover) -->
            <div class="quick-add-btn absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3">
              <button 
                type="button" 
                onclick="event.stopPropagation(); Store.quickAdd('${p.id}')"
                class="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-tinta hover:text-oliva flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Adicionar Rápido
              </button>
            </div>
          </div>

          <!-- Informações da Peça -->
          <div class="mt-3.5 space-y-1.5 cursor-pointer" onclick="Store.openPDP('${p.id}')">
            <h3 class="font-body text-sm font-normal text-tinta line-clamp-1 hover:text-oliva transition-colors">${p.title}</h3>
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-tinta">${this.formatPrice(p.price)}</p>
              ${p.bfActive ? `<p class="maelle-bf-old">${this.formatPrice(p.basePrice)}</p>` : (p.oldPrice && p.oldPrice > p.price ? `<p class="text-xs text-grafite line-through">${this.formatPrice(p.oldPrice)}</p>` : '')}
            </div>
            <p class="text-[11px] text-grafite tracking-wide uppercase">${p.categoryFolder.replace(/-/g, ' ')}</p>
          </div>
        </article>
      `;
    }).join('');
  },

  // Adição Rápida ao Carrinho
  quickAdd(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const defaultSize = product.sizes && product.sizes.length ? product.sizes[0] : (/^acessorios(?:-|$)/.test(product.categoryFolder || product.category || '') ? '' : 'S');
    const defaultColor = product.colors && product.colors.length ? product.colors[0] : (/^acessorios(?:-|$)/.test(product.categoryFolder || product.category || '') ? '' : 'Padrão');

    this.addToCart(product, defaultSize, defaultColor, 1);
    this.openCart();
    this.showToast(`"${product.title}" adicionado ao carrinho!`);
  },

  // Adicionar ao Carrinho
  addToCart(product, size, color, qty = 1) {
    const existingIndex = this.cart.findIndex(item => 
      item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        shippingMode: product.shippingMode || 'legacy',
        shippingPrice: product.shippingPrice ?? 4.50,
        image: product.localImage,
        size: size,
        color: color,
        qty: qty
      });
    }

    this.saveCart();
    this.updateCartUI();
  },

  // Salvar Carrinho no LocalStorage
  saveCart() {
    localStorage.setItem('maelle_cart', JSON.stringify(this.cart));
  },

  // Atualizar Quantidade no Carrinho
  changeCartQty(index, delta) {
    if (this.cart[index]) {
      this.cart[index].qty += delta;
      if (this.cart[index].qty <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveCart();
      this.updateCartUI();
    }
  },

  // Remover Item do Carrinho
  removeCartItem(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
    this.showToast('Item removido do carrinho.');
  },

  // Atualizar Interface do Carrinho & Barra de Frete Grátis
  updateCartUI() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
    
    badges.forEach(b => {
      b.textContent = totalItems;
      b.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    const itemsContainer = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const progressEl = document.getElementById('shipping-progress');
    const shippingTextEl = document.getElementById('shipping-status-text');

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (subtotalEl) {
      subtotalEl.textContent = this.formatPrice(subtotal);
    }

    // Regras personalizadas de envio prevalecem sobre a antiga barra de 49,90 €.
    const customShipping = this.cart.some(item => {
      const product = this.products.find(p => p.id === item.id);
      return (product?.shippingMode ?? item.shippingMode ?? 'legacy') !== 'legacy';
    });
    if (progressEl && shippingTextEl && customShipping) {
      const charge = this.calculateShipping();
      progressEl.style.width = charge === 0 ? '100%' : '0%';
      shippingTextEl.textContent = charge === 0 ? 'Esta encomenda tem envio grátis!' : `Portes de envio desta encomenda: ${this.formatPrice(charge)}`;
    } else
    // Cálculo da barra de Portes Grátis para Portugal (> 49,90 €)
    if (progressEl && shippingTextEl) {
      if (subtotal >= this.freeShippingThreshold) {
        progressEl.style.width = '100%';
        shippingTextEl.innerHTML = '<span class="text-sucesso font-semibold">Parabéns! Tem portes grátis para Portugal Continental e Ilhas!</span>';
      } else {
        const remaining = (this.freeShippingThreshold - subtotal);
        const percent = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
        progressEl.style.width = `${percent}%`;
        shippingTextEl.innerHTML = `Faltam apenas <strong>${this.formatPrice(remaining)}</strong> para ter <strong>Portes Grátis</strong>!`;
      }
    }

    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center space-y-4">
          <svg class="mx-auto text-costura" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p class="font-display text-xl text-grafite">O seu cesto de compras está vazio</p>
          <p class="text-xs text-grafite">Descubra as novidades exclusivas da Coleção MAELLE.</p>
          <button onclick="Store.closeCart(); Store.filterCategory('all')" class="mt-2 btn-editorial px-6 py-2.5 text-xs">Descobrir Coleção</button>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = this.cart.map((item, idx) => `
      <div class="flex gap-4 py-4 border-b border-costura">
        <div class="w-20 h-28 aspect-fashion bg-papel shrink-0 overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover"/>
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <h4 class="text-sm font-medium text-tinta line-clamp-1">${item.title}</h4>
              <button onclick="Store.removeCartItem(${idx})" class="text-grafite hover:text-erro p-1" aria-label="Remover">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p class="text-xs text-grafite mt-0.5">${[item.size && 'Tam: '+item.size, item.color && 'Cor: '+item.color].filter(Boolean).join(' • ')}</p>
            <p class="text-sm font-semibold text-tinta mt-1">${this.formatPrice(item.price)}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center border border-costura bg-white rounded-none">
              <button onclick="Store.changeCartQty(${idx}, -1)" class="px-2.5 py-0.5 text-xs hover:bg-papel">-</button>
              <span class="px-2 text-xs font-semibold">${item.qty}</span>
              <button onclick="Store.changeCartQty(${idx}, 1)" class="px-2.5 py-0.5 text-xs hover:bg-papel">+</button>
            </div>
            <span class="text-xs font-medium text-grafite ml-auto">${this.formatPrice(item.price * item.qty)}</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Abrir Modal de Produto Individual (PDP)
  openPDP(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.activeProductModal = product;
    const modalEl = document.getElementById('pdp-modal');
    if (!modalEl) return;

    let selectedSize = product.sizes && product.sizes.length ? product.sizes[0] : (/^acessorios(?:-|$)/.test(product.categoryFolder || product.category || '') ? '' : 'S');
    let selectedColor = product.colors && product.colors.length ? product.colors[0] : (/^acessorios(?:-|$)/.test(product.categoryFolder || product.category || '') ? '' : 'Creme');

    const gallery = modalEl.querySelector('#pdp-gallery');
    const images = [...new Set((Array.isArray(product.images) ? product.images : []).concat(product.localImage || '').filter(src => typeof src === 'string' && src.trim()))];
    this.activeProductImages = images;
    gallery.replaceChildren();
    gallery.classList.toggle('maelle-gallery-single', images.length === 1);
    images.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'maelle-gallery-item';
      button.setAttribute('aria-label', `Ampliar fotografia ${index + 1} de ${images.length}`);
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${product.title} — fotografia ${index + 1}`;
      img.loading = index < 2 ? 'eager' : 'lazy';
      button.appendChild(img);
      button.addEventListener('click', () => this.openPhotoLightbox(index));
      gallery.appendChild(button);
    });
    modalEl.querySelector('#pdp-tag').textContent = product.tag || 'Exclusivo';
    modalEl.querySelector('#pdp-title').textContent = product.title;
    modalEl.querySelector('#pdp-price').textContent = this.formatPrice(product.price);
    
    const oldPriceEl = modalEl.querySelector('#pdp-old-price');
    if (product.bfActive || (product.oldPrice && product.oldPrice > product.price)) {
      oldPriceEl.textContent = this.formatPrice(product.bfActive ? product.basePrice : product.oldPrice);
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }

    modalEl.querySelector('#pdp-description').textContent = product.description;
    modalEl.querySelector('#pdp-composition').textContent = product.composition || 'Confecção nobre artesanal.';
    modalEl.querySelector('#pdp-sku').textContent = `REF: ${product.id} • Lisboa, Portugal`;

    // Renderizar seletores de tamanho
    const sizesContainer = modalEl.querySelector('#pdp-sizes');
    sizesContainer.innerHTML = (Array.isArray(product.sizes) ? product.sizes : ['XS', 'S', 'M', 'L']).map((s, idx) => `
      <button 
        type="button" 
        class="size-pill ${idx === 0 ? 'selected' : ''}" 
        data-size="${s}"
        onclick="Store.selectPdpSize('${s}', this)"
      >
        ${s}
      </button>
    `).join('');

    // Cores do produto: bolinhas idênticas às do painel administrativo.
    const colorsContainer = modalEl.querySelector('#pdp-colors');
    const swatches = {Preto:'#202020', Branco:'#ffffff', Creme:'#e9dfc8', Bege:'#d5c3a8', Azul:'#58799d', Vermelho:'#b63e48', Verde:'#54765c', Rosa:'#d99da8', Castanho:'#785044'};
    const customHex = product.colorHex || [];
    if (Array.isArray(customHex)) customHex.forEach(c => { if (c && c.name && /^#[0-9a-f]{6}$/i.test(c.hex)) swatches[c.name] = c.hex; });
    else Object.entries(customHex).forEach(([name, hex]) => { if (/^#[0-9a-f]{6}$/i.test(hex)) swatches[name] = hex; });
    colorsContainer.replaceChildren();
    (Array.isArray(product.colors) ? product.colors : []).forEach((c, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'maelle-color-choice' + (idx === 0 ? ' selected' : '');
      button.dataset.color = c;
      button.title = c;
      button.setAttribute('aria-label', 'Cor ' + c);
      button.setAttribute('aria-pressed', String(idx === 0));
      const dot = document.createElement('span');
      dot.className = 'maelle-color-dot';
      dot.style.setProperty('--swatch', swatches[c] || '#888888');
      const label = document.createElement('span');
      label.className = 'maelle-color-label';
      label.textContent = c;
      button.append(dot, label);
      button.addEventListener('click', () => this.selectPdpColor(c, button));
      colorsContainer.appendChild(button);
    });

    const optionalVariants = /^acessorios(?:-|$)/.test(product.categoryFolder || product.category || '');
    for (const [container, values] of [[sizesContainer, product.sizes], [colorsContainer, product.colors]]) {
      container.parentElement.style.display = optionalVariants && !values?.length ? 'none' : '';
    }
    // Botão Adicionar
    const addBtn = modalEl.querySelector('#pdp-add-btn');
    addBtn.onclick = () => {
      const activeSize = modalEl.querySelector('.size-pill.selected')?.getAttribute('data-size') || selectedSize;
      const activeColor = modalEl.querySelector('#pdp-colors button.selected')?.getAttribute('data-color') || selectedColor;
      this.addToCart(product, activeSize, activeColor, 1);
      this.closePDP();
      this.openCart();
      this.showToast(`"${product.title}" adicionado ao carrinho!`);
    };

    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  openPhotoLightbox(index) {
    if (!this.activeProductImages?.length) return;
    this.activePhotoIndex = index;
    const overlay = document.getElementById('maelle-photo-lightbox');
    overlay.hidden = false;
    this.updatePhotoLightbox();
  },

  updatePhotoLightbox() {
    const images = this.activeProductImages || [];
    if (!images.length) return;
    document.getElementById('maelle-photo-full').src = images[this.activePhotoIndex];
    document.getElementById('maelle-photo-count').textContent = `${this.activePhotoIndex + 1} / ${images.length}`;
  },

  changePhoto(delta) {
    const images = this.activeProductImages || [];
    if (!images.length) return;
    this.activePhotoIndex = (this.activePhotoIndex + delta + images.length) % images.length;
    this.updatePhotoLightbox();
  },

  closePhotoLightbox() {
    const overlay = document.getElementById('maelle-photo-lightbox');
    if (overlay) overlay.hidden = true;
  },

  selectPdpSize(size, el) {
    document.querySelectorAll('#pdp-sizes .size-pill').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
  },

  selectPdpColor(color, el) {
    document.querySelectorAll('#pdp-colors .maelle-color-choice').forEach(button => {
      const active = button === el;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
  },

  openSizeGuide() {
    const guide = document.getElementById('maelle-size-guide');
    if (!guide) return;
    guide.classList.add('active');
    guide.setAttribute('aria-hidden', 'false');
    guide.querySelector('.maelle-size-close')?.focus();
  },

  closeSizeGuide() {
    const guide = document.getElementById('maelle-size-guide');
    if (!guide) return;
    guide.classList.remove('active');
    guide.setAttribute('aria-hidden', 'true');
  },

  closePDP() {
    this.closePhotoLightbox();
    const modalEl = document.getElementById('pdp-modal');
    if (modalEl) modalEl.classList.remove('active');
    document.body.style.overflow = '';
  },

  // Alternar Wishlist
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      this.showToast('Item removido dos favoritos.');
    } else {
      this.wishlist.push(productId);
      this.showToast('Item adicionado aos favoritos!');
    }
    localStorage.setItem('maelle_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistBadges();
    this.renderCatalog();
  },

  updateWishlistBadges() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = this.wishlist.length;
      b.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
    });
  },

  // Abrir / Fechar Carrinho
  openCart() {
    document.getElementById('cart-drawer')?.classList.add('active');
    document.getElementById('cart-backdrop')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('active');
    document.getElementById('cart-backdrop')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  // Menu Mobile
  openMobileMenu() {
    document.getElementById('mobile-drawer')?.classList.add('active');
    document.getElementById('mobile-backdrop')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeMobileMenu() {
    document.getElementById('mobile-drawer')?.classList.remove('active');
    document.getElementById('mobile-backdrop')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  // Notificação Toast
  showToast(message) {
    let toast = document.getElementById('maelle-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'maelle-toast';
      toast.className = 'fixed bottom-6 right-6 z-50 bg-tinta text-linho px-5 py-3 text-xs tracking-wider uppercase font-medium shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-2 border-l-2 border-oliva';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    toast.classList.remove('translate-y-12', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-12', 'opacity-0');
    }, 2800);
  },

  // Event Listeners Gerais
  setupEventListeners() {
    // Busca em tempo real (Overlay)
    const overlayInput = document.getElementById('overlay-search-input');
    if (overlayInput) {
      overlayInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderCatalog();
      });
    }

    // Busca antiga se existir
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderCatalog();
      });
    }

    // Atalhos de Teclado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const photoOverlay = document.getElementById('maelle-photo-lightbox');
        if (photoOverlay && !photoOverlay.hidden) { this.closePhotoLightbox(); return; }
        if (typeof Checkout !== 'undefined') Checkout.closeCheckoutModal();
        this.closeCart();
        this.closePDP();
        this.closeMobileMenu();
        this.closeSearchModal();
        this.closeMegaMenuImmediate();
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.openSearchModal();
      }
    });

    // Acordeões dentro da PDP
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
      });
    });
  }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('maelle-local-ui')) Store.init();
});

// Permitir abrir o guia a partir dos rodapes das paginas institucionais.
document.addEventListener('DOMContentLoaded', () => {
  if (location.hash === '#guia-de-tamanhos') {
    Store.openSizeGuide();
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') Store.closeSizeGuide();
  });
});
