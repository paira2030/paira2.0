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
      await this.loadCatalog(); this.renderProductsTable(); await this.loadColorPalette();
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
    for (const name of ['saldos','inverno','favoritos-inverno','black-friday-nova']) document.getElementById('tab-'+name).style.display = tab === name ? 'block' : 'none';
    if (tab === 'saldos' || tab === 'inverno' || tab === 'favoritos-inverno') this.renderCollectionTab(tab);
    document.getElementById('tab-sumup').style.display = tab === 'sumup' ? 'block' : 'none';
    document.getElementById('tab-encomendas').style.display = tab === 'encomendas' ? 'block' : 'none';
    document.getElementById('tab-seguranca').style.display = tab === 'seguranca' ? 'block' : 'none';
    if(tab==='encomendas') MaelleExtras.loadOrders();
  },

  renderCollectionTab(tab) {
    const el = document.getElementById('admin-'+tab+'-list');
    if (!el) return;
    el.replaceChildren();
    if(tab==='inverno'||tab==='favoritos-inverno') return this.renderVisualCollection(tab,el);
    if(tab==='favoritos-inverno') { const counter=document.getElementById('admin-favoritos-count'); if(counter)counter.textContent=this.products.filter(p=>p.isFavoritoInverno).length+' de 4 produtos selecionados'; }
    this.products.forEach((p,index) => {
      const row = document.createElement('div');
      row.className='bg-white border border-costura p-3 flex flex-wrap gap-3 items-center';
      const name = document.createElement('span'); name.className='flex-1 min-w-40 text-sm'; name.textContent=p.title;
      const check=document.createElement('input'); check.type='checkbox'; check.checked=tab==='saldos'?!!p.isSaldo:tab==='inverno'?!!p.isInverno:!!p.isFavoritoInverno;
      check.setAttribute('aria-label','Incluir '+p.title+' em '+tab);
      const details=document.createElement('span');details.className='text-xs text-grafite';details.textContent=Number(p.price||0).toFixed(2)+' €';
      if(tab==='saldos') {
        const old=document.createElement('input');old.type='number';old.min='0.01';old.step='0.01';old.placeholder='Preço anterior (€)';old.value=p.oldPrice||'';old.className='border p-2 w-36 text-xs';
        const current=document.createElement('input');current.type='number';current.min='0.01';current.step='0.01';current.value=p.price||'';current.className='border p-2 w-32 text-xs';current.title='Preço promocional (€)';
        const save=document.createElement('button');save.className='btn-editorial text-xs px-3 py-2';save.textContent='Guardar';
        save.onclick=()=>this.saveCollectionItem(index,tab,check.checked,Number(old.value),Number(current.value));
        row.append(name,check,details,old,current,save);
      } else {
        const save=document.createElement('button');save.className='btn-editorial text-xs px-3 py-2';save.textContent='Guardar';
        save.onclick=()=>this.saveCollectionItem(index,tab,check.checked);
        row.append(name,check,details,save);
      }
      el.appendChild(row);
    });
  },
  renderVisualCollection(tab, el) {
    const field=tab==='inverno'?'isInverno':'isFavoritoInverno';
    const column=tab==='inverno'?'em_inverno':'favorito_inverno';
    const limit=tab==='inverno'?Infinity:4;
    const products=this.products.slice();
    const selected=new Set(products.filter(p=>p[field]).map(p=>p.id));
    const labels=new Map(Array.from(document.querySelectorAll('#prod-form-category option')).map(o=>[o.value,o.textContent]));
    const make=(tag,cls,txt)=>{const e=document.createElement(tag);e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
    const toolbar=make('div','collection-toolbar');
    const search=make('input','collection-input');search.type='search';search.placeholder='Pesquisar nome ou SKU';search.setAttribute('aria-label','Pesquisar peças');
    const category=make('select','collection-input');category.setAttribute('aria-label','Categoria');category.add(new Option('Todas as categorias',''));for(const c of new Set(products.map(p=>p.category).filter(Boolean)))category.add(new Option(labels.get(c)||c,c));
    const filter=make('select','collection-input');filter.setAttribute('aria-label','Estado da seleção');for(const [v,l] of [['','Todas as peças'],['yes','Selecionadas'],['no','Não selecionadas']])filter.add(new Option(l,v));
    const summary=make('div','collection-summary');const count=make('strong','');const status=make('span','text-sm');status.setAttribute('aria-live','polite');const save=make('button','collection-save','Guardar alterações');save.type='button';summary.append(count,status,save);
    const grid=make('div','collection-grid');toolbar.append(search,category,filter);el.append(summary,toolbar,grid);
    let busy=false;
    const changes=()=>products.filter(p=>!!p[field]!==selected.has(p.id));
    const refresh=()=>{
      count.textContent=selected.size+(limit===4?' de 4':'')+' peças selecionadas';
      const counter=document.getElementById('admin-favoritos-count');if(tab==='favoritos-inverno'&&counter)counter.textContent='';
      save.disabled=busy||!changes().length;save.textContent=busy?'A guardar…':'Guardar alterações ('+changes().length+')';
      search.disabled=category.disabled=filter.disabled=busy;
      grid.replaceChildren();const q=search.value.trim().toLocaleLowerCase();
      for(const p of products){const on=selected.has(p.id);if(q&&!`${p.title} ${p.id}`.toLocaleLowerCase().includes(q)||category.value&&p.category!==category.value||filter.value==='yes'&&!on||filter.value==='no'&&on)continue;
        const card=make('article','collection-card'+(on?' selected':''));const photo=make('div','collection-photo');const src=p.images?.[0]||p.localImage;
        if(src){const img=make('img','');img.src=src;img.alt=p.title;img.loading='lazy';img.onerror=()=>{photo.textContent='Sem imagem';};photo.append(img);}else photo.textContent='Sem imagem';
        
        const body=make('div','collection-body');body.append(make('strong','collection-name',p.title),make('span','collection-meta',`${p.id} · ${labels.get(p.category)||p.category||''}`),make('strong','',Number(p.price||0).toFixed(2)+' €'));
        const toggle=make('input','collection-toggle');toggle.type='checkbox';toggle.checked=on;toggle.disabled=busy;toggle.setAttribute('aria-label','Incluir '+p.title);toggle.onchange=()=>{if(on)selected.delete(p.id);else if(selected.size>=limit){status.textContent='Limite de 4 favoritos. Retire uma peça primeiro.';toggle.checked=false;return;}else selected.add(p.id);status.textContent='Alterações por guardar';refresh();};card.append(photo,body,toggle);grid.append(card);
      }if(!grid.children.length)grid.append(make('p','text-sm','Nenhuma peça encontrada.'));
    };
    search.oninput=category.onchange=filter.onchange=refresh;
    save.onclick=async()=>{if(busy)return;busy=true;status.textContent='A guardar alterações…';refresh();try{
      const pending=changes().sort((a,b)=>Number(selected.has(a.id))-Number(selected.has(b.id)));
      if(MaelleDB.enabled){if(!await MaelleDB.isAdmin())throw Error('Sem permissão de administrador.');for(const p of pending){const value=selected.has(p.id);const {data,error}=await MaelleDB.client.from('produtos').update({[column]:value}).eq('id',p.dbId).select('id').single();if(error||!data)throw error||Error('Produto não atualizado');p[field]=value;}}
      else {for(const p of pending)p[field]=selected.has(p.id);this.saveCatalog();}
      status.textContent='Alterações guardadas.';this.renderProductsTable();
    }catch(e){status.textContent='Erro ao guardar: '+e.message+'. Pode tentar novamente.';}finally{busy=false;refresh();}};
    refresh();
  },
  async saveCollectionItem(index,tab,checked,oldPrice,price) {
    const original=this.products[index]; if(!original)return;
    if(tab==='saldos' && checked && !(price>0 && oldPrice>price)) {
      this.showAdminToast('O preço anterior deve ser maior que o preço promocional.');return;
    }
    if(tab==='favoritos-inverno' && checked && !original.isFavoritoInverno && this.products.filter(p=>p.isFavoritoInverno).length>=4) {this.showAdminToast('Pode destacar no máximo 4 peças. Retire uma antes de adicionar outra.');return;}
    const p={...original,images:original.images||[],isSaldo:tab==='saldos'?checked:!!original.isSaldo,isInverno:tab==='inverno'?checked:!!original.isInverno,isFavoritoInverno:tab==='favoritos-inverno'?checked:!!original.isFavoritoInverno};
    if(tab==='saldos') {p.price=price;p.oldPrice=oldPrice;}
    try {
      if(MaelleDB.enabled) {await MaelleDB.save(p);await this.loadCatalog();}
      else {this.products[index]=p;this.saveCatalog();}
      this.renderCollectionTab(tab);this.renderProductsTable();this.showAdminToast('Alterações guardadas.');
    } catch(e) {console.error(e);this.showAdminToast('Erro ao guardar: '+e.message);}
  },

  renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    document.getElementById('admin-total-count').textContent = `${this.products.length} peças registadas`;

    const select = document.getElementById('adm-category');
    const labels = new Map(Array.from(document.querySelectorAll('#prod-form-category option')).map(o=>[o.value,o.textContent]));
    if(select && select.options.length===1) document.querySelectorAll('#prod-form-category option').forEach(o=>select.add(new Option(o.textContent,o.value)));
    const q=(document.getElementById('adm-search')?.value||'').trim().toLowerCase(), cat=select?.value||'', stock=document.getElementById('adm-stock')?.value||'';
    const items=this.products.map((p,idx)=>({p,idx})).filter(({p})=>(!q||`${p.title} ${p.id}`.toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!stock||(stock==='available'?Number(p.stock)>0:Number(p.stock)<=0)));
    for(const [id,value] of Object.entries({total:this.products.length,stock:this.products.filter(p=>Number(p.stock)>0).length,empty:this.products.filter(p=>Number(p.stock)<=0).length,sale:this.products.filter(p=>p.isSaldo).length})) {const el=document.getElementById('adm-stat-'+id);if(el)el.textContent=value;}
    document.getElementById('admin-total-count').textContent=`${items.length} de ${this.products.length} peças registadas`;
    tbody.innerHTML = items.map(({p, idx}) => `
      <tr class="border-b border-costura hover:bg-papel/50 transition-colors">
        <td class="py-3 px-4 font-mono text-xs text-grafite">${p.id}</td>
        <td class="py-3 px-4">
          <div class="w-12 h-16 bg-papel overflow-hidden border border-costura">
            <img src="${p.localImage}" alt="${p.title}" class="w-full h-full object-cover"/>
          </div>
        </td>
        <td class="py-3 px-4 font-medium text-xs text-tinta max-w-[200px] truncate">${p.title}</td>
        <td class="py-3 px-4 text-xs text-grafite uppercase">${labels.get(p.category)||p.category}</td>
        <td class="py-3 px-4 font-semibold text-xs text-tinta">${p.price.toFixed(2)} €</td>
        <td class="py-3 px-4 text-xs text-tinta font-mono"><span class="adm-stock-pill ${Number(p.stock)>0?'in-stock':'out-stock'}">${p.stock ?? 0} un</span></td>
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
    `).join('') || '<tr><td colspan="8" class="p-8 text-center">Nenhuma peça encontrada.</td></tr>';
  },

  palette: [{name:'Preto',hex:'#202020'},{name:'Branco',hex:'#ffffff'},{name:'Creme',hex:'#e9dfc8'},{name:'Bege',hex:'#d5c3a8'},{name:'Azul',hex:'#58799d'},{name:'Vermelho',hex:'#b63e48'},{name:'Verde',hex:'#54765c'},{name:'Rosa',hex:'#d99da8'},{name:'Castanho',hex:'#785044'}],
  colorChoices: [],
  sizeChoices: [],
  customPalette: [],
  sharedPalette: [],
  paletteBusy: false,
  mergedPalette() {
    return [...new Map([...this.palette,...this.sharedPalette,...this.customPalette].map(c=>[c.name,c])).values()];
  },
  async loadColorPalette() {
    if (!MaelleDB.enabled) return;
    const {data,error}=await MaelleDB.client.from('maelle_color_palette').select('name,hex').order('name');
    if(error) { this.showAdminToast('Paleta: execute o SQL da atualização. '+error.message); return; }
    this.sharedPalette=data||[];
    if(document.getElementById('product-edit-modal').classList.contains('active')) this.renderVariations();
  },
  async removePaletteColor(item) {
    if(this.paletteBusy || !confirm('Retirar '+item.name+' da paleta geral? As peças existentes não serão alteradas.')) return;
    this.paletteBusy=true;
    try {
      const {error}=await MaelleDB.client.from('maelle_color_palette').delete().eq('name',item.name);
      if(error) throw error;
      if(this.colorChoices.includes(item.name) && !this.customPalette.some(c=>c.name===item.name)) this.customPalette.push(item);
      this.sharedPalette=this.sharedPalette.filter(c=>c.name!==item.name);
      this.renderVariations();
    } catch(e) {this.showAdminToast('Erro: '+e.message);} finally {this.paletteBusy=false;}
  },
  availableSizes() {
    return /^(?:acessorios-)?sapatos(?:-|$)/.test(document.getElementById('prod-form-category').value) ? ['35','36','37','38','39','40','41','42','43'] : ['XXS','XS','S','M','L','XL','XXL','3XL'];
  },
  categoryChanged() {
    this.sizeChoices = this.sizeChoices.filter(s => this.availableSizes().includes(s));
    this.renderVariations();
  },
  updateVariationLabels() {
    const category = document.getElementById('prod-form-category').value;
    const optional = /^acessorios(?:-|$)/.test(category) && category !== 'acessorios-sapatos';
    for (const id of ['prod-color-label','prod-size-label']) {
      const label = document.getElementById(id);
      if (label) label.textContent = label.dataset.base + (id === 'prod-color-label' || optional ? ' (opcional)' : ' *');
    }
  },

  renderVariations() {
    this.updateVariationLabels();
    const colors = document.getElementById('prod-form-colors');
    const sizes = document.getElementById('prod-form-sizes');
    const selectedList = document.getElementById('prod-selected-colors');
    if (!colors || !sizes) return;
    colors.replaceChildren();
    if (selectedList) selectedList.replaceChildren();
    const palette = this.mergedPalette();
    const toggle = (name) => {
      this.colorChoices = this.colorChoices.includes(name)
        ? this.colorChoices.filter(x => x !== name)
        : [...this.colorChoices, name];
      this.renderVariations();
    };
    for (const item of palette) {
      const selected = this.colorChoices.includes(item.name);
      const wrapper = document.createElement('div');
      wrapper.className = 'flex flex-col items-center gap-1';
      const btn = document.createElement('button'); btn.type = 'button';
      btn.title = (selected ? 'Retirar ' : 'Adicionar ') + item.name;
      btn.setAttribute('aria-label', btn.title);
      btn.setAttribute('aria-pressed', String(selected));
      btn.style.cssText = 'width:24px;height:24px;border-radius:50%;background:'+item.hex+';border:2px solid '+(selected?'#232323':'#dedede')+';outline:'+(selected?'2px solid #9b9b9b':'none')+';outline-offset:2px;cursor:pointer';
      btn.onclick = () => toggle(item.name);
      const name = document.createElement('span'); name.className = 'text-[10px]'; name.textContent = item.name;
      wrapper.append(btn, name);
      if(this.sharedPalette.some(c=>c.name===item.name)) {
        const del=document.createElement('button');del.type='button';del.textContent='×';del.title='Retirar da paleta geral';del.setAttribute('aria-label',del.title+' '+item.name);del.className='text-xs text-red-600';del.onclick=()=>this.removePaletteColor(item);wrapper.append(del);
      }
      colors.append(wrapper);
    }
    if (selectedList) {
      if (!this.colorChoices.length) {
        const hint = document.createElement('span');
        hint.className = 'text-xs text-gray-500';
        hint.textContent = 'Nenhuma cor selecionada. Clique numa bolinha para adicionar.';
        selectedList.append(hint);
      }
      for (const name of this.colorChoices) {
        const item = palette.find(c => c.name === name) || {name,hex:'#999999'};
        const chip = document.createElement('div');
        chip.className = 'inline-flex items-center gap-2 border border-costura rounded-full bg-white px-2 py-1';
        const swatch = document.createElement('span');
        swatch.style.cssText = 'display:inline-block;width:18px;height:18px;border-radius:50%;border:1px solid #aaa;background:'+item.hex;
        const label = document.createElement('span'); label.className = 'text-xs'; label.textContent = name;
        const remove = document.createElement('button'); remove.type = 'button';
        remove.textContent = '×'; remove.title = 'Remover '+name+' desta peça';
        remove.setAttribute('aria-label', remove.title);
        remove.className = 'text-lg leading-none px-1';
        remove.onclick = () => toggle(name);
        chip.append(swatch,label,remove); selectedList.append(chip);
      }
    }
    sizes.replaceChildren();
    for (const name of this.availableSizes()) {
      const selected = this.sizeChoices.includes(name);
      const btn = document.createElement('button');btn.type='button';btn.textContent=name;
      btn.className='border px-3 py-2 text-xs '+(selected?'bg-tinta text-white border-tinta':'border-costura bg-white text-tinta');
      btn.setAttribute('aria-pressed',String(selected));
      btn.onclick=()=>{this.sizeChoices=selected?this.sizeChoices.filter(x=>x!==name):[...this.sizeChoices,name];this.renderVariations();};
      sizes.append(btn);
    }
  },
  async addCustomColor() {
    const input=document.getElementById('prod-new-color-name');
    const name=input.value.trim();const hex=document.getElementById('prod-new-color-hex').value;
    if(!name) return this.showAdminToast('Escreva o nome da cor.');
    if(this.paletteBusy) return;
    const existing=[...this.palette,...this.sharedPalette].find(c=>c.name.toLowerCase()===name.toLowerCase());
    if(!existing) {
      this.paletteBusy=true;
      try {
        const {error}=await MaelleDB.client.from('maelle_color_palette').insert({name,hex});
        if(error) throw error;
        this.sharedPalette.push({name,hex});
        this.customPalette=this.customPalette.filter(c=>c.name!==name);
      } catch(e) {this.showAdminToast('Não foi possível guardar a cor: '+e.message);return;} finally {this.paletteBusy=false;}
    }
    const chosen=existing?.name||name;
    if(!this.colorChoices.includes(chosen)) this.colorChoices.push(chosen);
    input.value='';this.renderVariations();
  },
  toggleShippingPrice() {
    const paid = document.getElementById('prod-form-shipping-mode').value === 'paid';
    const priceInput = document.getElementById('prod-form-shipping-price');
    if (paid && !(Number(priceInput.value) > 0)) priceInput.value = '4.50';
    document.getElementById('prod-form-shipping-price-wrap').style.display = paid ? '' : 'none';
    document.getElementById('prod-form-shipping-price').required = paid;
  },
  openAddProductModal() {
    document.getElementById('modal-product-title-heading').textContent = 'Adicionar Nova Peça ao Catálogo';
    document.getElementById('prod-form-index').value = '-1';
    document.getElementById('prod-form-id').readOnly = MaelleDB.enabled;
    document.getElementById('prod-form-id').placeholder = MaelleDB.enabled ? 'Gerado ao guardar (MAE-123, MAE-124...)' : '';
    document.getElementById('prod-form-id').value = MaelleDB.enabled ? '' : 'MAE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    document.getElementById('prod-form-title').value = '';
    document.getElementById('prod-form-category').value = 'vestidos';
    document.getElementById('prod-form-price').value = '49.99';
    document.getElementById('prod-form-old-price').value = '64.99';
    document.getElementById('prod-form-saldos').checked = false;
    document.getElementById('prod-form-inverno').checked = false;
    document.getElementById('prod-form-favorito-inverno').checked = false;
    document.getElementById('prod-form-stock').value = '15';
    document.getElementById('prod-form-shipping-mode').value = 'paid';
    document.getElementById('prod-form-shipping-price').value = '4.50';
    this.toggleShippingPrice();
    document.getElementById('prod-form-tag').value = 'Novo';
    document.getElementById('prod-form-image').value = 'assets/images/produtos/vestidos/rona-v-neck-cutout-sleeveless-maxi-dress.webp';
    this.editingImages = [];
    this.colorChoices = []; this.sizeChoices = []; this.customPalette = []; this.renderVariations();
    this.renderImagePreviews();
    document.getElementById('prod-form-files').value = '';
    document.getElementById('prod-form-desc').value = 'Peça confecionada com materiais de alta qualidade e corte editorial contemporâneo.';
    document.getElementById('product-edit-modal').classList.add('active');
    this.loadColorPalette();
  },

  openEditProductModal(index) {
    const p = this.products[index];
    if (!p) return;

    document.getElementById('modal-product-title-heading').textContent = 'Editar Peça: ' + p.id;
    document.getElementById('prod-form-index').value = index;
    document.getElementById('prod-form-id').readOnly = false;
    document.getElementById('prod-form-id').placeholder = '';
    document.getElementById('prod-form-id').value = p.id;
    document.getElementById('prod-form-title').value = p.title;
    document.getElementById('prod-form-category').value = p.category;
    document.getElementById('prod-form-price').value = p.price;
    document.getElementById('prod-form-old-price').value = p.oldPrice || '';
    document.getElementById('prod-form-saldos').checked = !!p.isSaldo;
    document.getElementById('prod-form-inverno').checked = !!p.isInverno;
    document.getElementById('prod-form-favorito-inverno').checked = !!p.isFavoritoInverno;
    document.getElementById('prod-form-stock').value = p.stock || 10;
    document.getElementById('prod-form-shipping-mode').value = p.shippingMode || 'paid';
    document.getElementById('prod-form-shipping-price').value = p.shippingMode === 'paid' && !(Number(p.shippingPrice) > 0) ? '4.50' : (p.shippingPrice ?? 4.50);
    this.toggleShippingPrice();
    document.getElementById('prod-form-tag').value = p.tag || '';
    document.getElementById('prod-form-image').value = p.localImage?.startsWith('data:') ? '' : (p.localImage || '');
    this.colorChoices = [...(p.colors || [])]; this.sizeChoices = (p.sizes || []).map(String).filter(s => this.availableSizes().includes(s));
    this.customPalette = (p.colorHex || []).filter(c=>!this.palette.some(x=>x.name===c.name));
    for (const name of this.colorChoices) if (!this.mergedPalette().some(c=>c.name===name)) this.customPalette.push({name,hex:'#999999'});
    this.renderVariations();
    this.editingImages = Array.isArray(p.images) ? [...p.images] : (p.localImage ? [p.localImage] : []);
    this.renderImagePreviews();
    document.getElementById('prod-form-files').value = '';
    document.getElementById('prod-form-desc').value = p.description || '';
    document.getElementById('product-edit-modal').classList.add('active');
    this.loadColorPalette();
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
      isSaldo: document.getElementById('prod-form-saldos').checked,
      isInverno: document.getElementById('prod-form-inverno').checked,
      isFavoritoInverno: document.getElementById('prod-form-favorito-inverno').checked,
      stock: parseInt(document.getElementById('prod-form-stock').value) || 10,
      shippingMode: document.getElementById('prod-form-shipping-mode').value,
      shippingPrice: Number(document.getElementById('prod-form-shipping-price').value),
      tag: document.getElementById('prod-form-tag').value,
      localImage: this.editingImages[0] || document.getElementById('prod-form-image').value,
      images: [...this.editingImages],
      description: document.getElementById('prod-form-desc').value,
      sizes: [...this.sizeChoices],
      colors: [...this.colorChoices],
      colorHex: this.mergedPalette().filter(c=>this.colorChoices.includes(c.name)),
      rating: 5.0,
      reviewsCount: 12
    };

    if(productData.isFavoritoInverno && !(idx>=0 && this.products[idx]?.isFavoritoInverno) && this.products.filter(p=>p.isFavoritoInverno).length>=4) {this.showAdminToast('Limite de 4 Favoritos de Inverno.');return;}
    if (productData.shippingMode === 'paid' && (!Number.isFinite(productData.shippingPrice) || productData.shippingPrice <= 0 || productData.shippingPrice > 9999.99)) { this.showAdminToast('Indique um valor válido para os portes.'); return; }
    if (productData.isSaldo && !(productData.oldPrice > productData.price && productData.price > 0)) { this.showAdminToast('Para Saldos, o preço anterior deve ser maior que o promocional.'); return; }
    if ((!/^acessorios(?:-|$)/.test(productData.category) || productData.category === 'acessorios-sapatos') && !productData.sizes.length) { this.showAdminToast('Selecione pelo menos um tamanho.'); return; }
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
    for(const id of ['adm-search','adm-category','adm-stock']) document.getElementById(id)?.addEventListener(id==='adm-search'?'input':'change',()=>this.renderProductsTable());
    document.getElementById('adm-clear')?.addEventListener('click',()=>{for(const id of ['adm-search','adm-category','adm-stock']) document.getElementById(id).value='';this.renderProductsTable();});
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
