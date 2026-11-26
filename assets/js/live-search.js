/* Pesquisa global, independente dos filtros da página. */
(() => {
  const input = document.getElementById('overlay-search-input') || document.getElementById('mh-search-input');
  if (!input) return;
  const panel = document.getElementById('search-overlay-bar') || document.getElementById('mh-search');
  const collection = input.id === 'mh-search-input';
  const results = document.createElement('div');
  results.className = 'maelle-search-results'; results.hidden = true;
  const status = document.createElement('div'); status.className = 'maelle-search-status'; status.setAttribute('role','status');
  const list = document.createElement('div'); list.className = 'maelle-search-list';
  results.append(status,list); panel.append(results);
  const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  let pending, revision = 0;
  async function catalog() {
    if (!pending) pending = (async () => {
      const rows = MaelleDB.enabled ? await MaelleDB.list(true) : await fetch('data/products.json').then(r => {if(!r.ok) throw Error('Catálogo indisponível'); return r.json();});
      if (!MaelleBlackFriday.ready) await MaelleBlackFriday.load();
      return rows.filter(p => p.active !== false && p.ativo !== false).map(p => ({...p,basePrice:p.price,price:MaelleBlackFriday.price(p),bfActive:MaelleBlackFriday.eligible(p)}));
    })().catch(e => {pending = null; throw e;});
    return pending;
  }
  function close() { revision++; input.value = ''; results.hidden = true; list.replaceChildren(); if(collection) panel.hidden = true; else Store.closeSearchModal(); }
  function openProduct(p) {
    const existing = Store.products.find(x => x.id === p.id);
    if (!existing) Store.products.push(p);
    close(); Store.openPDP(p.id);
  }
  async function render() {
    const current = ++revision, query = norm(input.value);
    list.replaceChildren(); results.hidden = !query;
    if (!query) return;
    status.textContent = 'A pesquisar…';
    try {
      const rows = await catalog(); if(current !== revision) return;
      const terms = query.split(' ');
      const matches = rows.filter(p => {const text = norm([p.title,p.id,p.category,window.MaelleCategories?.label(p.category)].join(' ')); return terms.every(t => text.includes(t));});
      matches.sort((a,b) => Number(norm(b.title).startsWith(query))-Number(norm(a.title).startsWith(query)));
      status.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}` : 'Nenhum artigo encontrado. Experimente outro nome ou referência.';
      for (const p of matches) {
        const button = document.createElement('button'); button.type='button'; button.className='maelle-search-item';
        const img = document.createElement('img'); img.alt=''; img.loading='lazy'; const src=p.localImage||p.images?.[0]; if(src) img.src=src;
        const info=document.createElement('span'); const name=document.createElement('strong'); name.textContent=p.title;
        const price=document.createElement('span'); price.textContent=Store.formatPrice(p.price); info.append(name,price); button.append(img,info);
        button.addEventListener('click',()=>openProduct(p)); list.append(button);
      }
    } catch(e) {if(current===revision) status.textContent='Não foi possível carregar os artigos. Tente novamente.';}
  }
  input.removeAttribute('oninput');
  input.addEventListener('input',render);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();list.querySelector('button')?.click();} if(e.key==='Escape')close();});
  if(collection){const button=document.createElement('button');button.type='button';button.className='maelle-search-close';button.textContent='×';button.setAttribute('aria-label','Fechar pesquisa');button.onclick=close;input.after(button);}
})();
