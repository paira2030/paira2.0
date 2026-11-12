/* Integração Supabase Maelle: sem credenciais privadas no navegador. */
const MaelleDB = {
  client: null,
  get enabled() { return !!this.client; },
  init() {
    const url = (window.MAELLE_SUPABASE_URL || '').trim();
    const key = (window.MAELLE_SUPABASE_PUBLISHABLE_KEY || '').trim();
    if (url && key && window.supabase?.createClient) this.client = window.supabase.createClient(url, key);
  },
  async isAdmin() {
    if (!this.enabled) return false;
    const {data: {user}, error} = await this.client.auth.getUser();
    if (error || !user) return false;
    const {data, error: e} = await this.client.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (e) throw e;
    return !!data;
  },
  async loginWithPasswordOnly(password) {
    if (!this.enabled) throw new Error('Supabase não configurado.');
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify({password})
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Não foi possível entrar.');
    const {error} = await this.client.auth.setSession({
      access_token: payload.access_token,
      refresh_token: payload.refresh_token
    });
    if (error) throw error;
    if (!(await this.isAdmin())) {
      await this.client.auth.signOut();
      throw new Error('Esta conta não tem permissão administrativa.');
    }
  },
  async login(email, password) {
    const {error} = await this.client.auth.signInWithPassword({email,password});
    if (error) throw error;
    if (!(await this.isAdmin())) { await this.client.auth.signOut(); throw new Error('Esta conta não é administradora.'); }
  },
  async list() {
    const {data,error} = await this.client.from('produtos').select('*').order('criado_em',{ascending:false});
    if (error) throw error;
    return data.map(p=>({id:p.codigo||p.id,dbId:p.id,title:p.nome,description:p.descricao||'',price:Number(p.preco),stock:p.estoque,images:p.imagens||[],localImage:p.imagens?.[0]||'',category:p.categoria||'vestidos',categoryFolder:p.categoria||'vestidos',oldPrice:Number(p.preco_anterior||0),tag:p.etiqueta||'',sizes:['XS','S','M','L'],colors:['Creme','Preto'],rating:5,reviewsCount:0}));
  },
  async upload(dataUrl) {
    if (!dataUrl.startsWith('data:image/')) return dataUrl;
    const response = await fetch(dataUrl); const blob = await response.blob();
    if (blob.size > 8*1024*1024) throw new Error('Imagem excede 8 MB');
    const path = crypto.randomUUID()+'.jpg';
    const {error} = await this.client.storage.from('produtos-maelle').upload(path,blob,{contentType:'image/jpeg',upsert:false});
    if (error) throw error;
    return this.client.storage.from('produtos-maelle').getPublicUrl(path).data.publicUrl;
  },
  async save(p) {
    if (!(await this.isAdmin())) throw new Error('Sem permissão de administrador.');
    const images=[];
    for (const src of p.images.length?p.images:[p.localImage]) if(src) images.push(await this.upload(src));
    const row={nome:p.title,descricao:p.description,preco:p.price,estoque:p.stock,imagens:images,ativo:true,categoria:p.category,preco_anterior:p.oldPrice||null,etiqueta:p.tag||null,codigo:p.id};
    let q;
    if (p.dbId) q=this.client.from('produtos').update(row).eq('id',p.dbId);
    else q=this.client.from('produtos').insert(row);
    const {error}=await q;
    if(error) throw error;
  },
  async remove(p) {
    if (!(await this.isAdmin())) throw new Error('Sem permissão.');
    const {error}=await this.client.from('produtos').delete().eq('id',p.dbId);
    if(error) throw error;
  }
};
MaelleDB.init();
