/* Controlo de campanha Black Friday — estado sempre confirmado pelo servidor. */
(function () {
  let active = false;
  let busy = false;
  const el = id => document.getElementById(id);
  function render(message, error=false) {
    const toggle=el('bf-toggle'), status=el('bf-status');
    if(!toggle||!status)return;
    toggle.disabled=busy||error;
    toggle.setAttribute('aria-checked',String(active));
    toggle.setAttribute('aria-busy',String(busy));
    toggle.classList.toggle('bf-on',active);
    toggle.classList.toggle('bf-off',!active);
    const label=el('bf-switch-label');if(label)label.textContent=busy?'A guardar...':active?'LIGADA':'DESLIGADA';
    status.textContent=message|| (active?'Black Friday ativa — 20% exceto Saldos.':'Black Friday desativada — preços normais.');
    status.style.color=error?'#a12626':'';
    const retry=el('bf-retry');if(retry)retry.hidden=!error;
  }
  async function request(method,body) {
    const options={method,cache:'no-store',headers:{'Accept':'application/json'}};
    if(method==='POST'){
      if(!window.MaelleDB?.client)throw Error('Sessão do ADM não disponível. Atualize a página.');
      const {data,error}=await MaelleDB.client.auth.getSession();
      if(error||!data?.session?.access_token)throw Error('Sessão expirada. Entre novamente no ADM.');
      options.headers['Authorization']='Bearer '+data.session.access_token;
      options.headers['Content-Type']='application/json';
      options.body=JSON.stringify(body);
    }
    const controller=new AbortController();options.signal=controller.signal;
    const timeout=setTimeout(()=>controller.abort(),10000);
    try {
      const response=await fetch('/api/black-friday',options);
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw Error(data.error||'Erro HTTP '+response.status+' ao consultar a campanha.');
      if(typeof data.active!=='boolean')throw Error('Resposta inesperada da API da campanha.');
      return data;
    } catch(e) {
      if(e.name==='AbortError')throw Error('A consulta demorou demasiado. Verifique a API e tente novamente.');
      throw e;
    } finally {clearTimeout(timeout);}
  }
  async function load(){
    if(busy)return;busy=true;render('A consultar estado da campanha...');
    try{const data=await request('GET');active=data.active;busy=false;render();}
    catch(e){busy=false;render('Não foi possível carregar: '+e.message,true);}
  }
  async function toggle(){
    if(busy)return;const desired=!active;
    if(!confirm(desired?'Ativar 20% de desconto em todos os produtos, exceto Saldos?':'Desativar a Black Friday e voltar aos preços normais?'))return;
    busy=true;render('A guardar alteração no Supabase...');
    try{const data=await request('POST',{active:desired});active=data.active;busy=false;render();}
    catch(e){busy=false;render('Não foi possível guardar: '+e.message,true);}
  }
  function init(){
    if(!el('bf-toggle'))return;
    el('bf-toggle').addEventListener('click',toggle);
    el('bf-retry')?.addEventListener('click',load);
    document.querySelector('[data-tab="black-friday"]')?.addEventListener('click',load);
    render('Abra a aba Black Friday para consultar o estado.');
    if(el('tab-black-friday')?.style.display!=='none')load();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
