/* Black Friday: nova aba com sessão Supabase do ADM, sem API antiga. */
(() => {
  const $ = id => document.getElementById(id);
  let active = false, busy = false, loaded = false;
  function draw(message, error = false) {
    const btn = $('bf2-toggle'), status = $('bf2-status');
    if (!btn || !status) return;
    btn.disabled = busy || !loaded;
    btn.textContent = busy ? 'A guardar...' : !loaded ? 'Indisponível' : active ? 'DESLIGAR' : 'LIGAR';
    btn.style.background = active ? '#35543a' : '#171717';
    btn.setAttribute('aria-pressed', String(active));
    status.textContent = message || (active ? 'Campanha ligada: 20% exceto Saldos.' : 'Campanha desligada: preços normais.');
    status.style.color = error ? '#ad2020' : '';
  }
  async function load() {
    if (busy) return;
    busy = true; loaded = false; draw('A consultar Supabase...');
    try {
      if (!window.MaelleDB?.client) throw Error('Supabase não disponível.');
      if (!(await MaelleDB.isAdmin())) throw Error('Sessão administrativa não autorizada.');
      const {data,error} = await MaelleDB.client.from('maelle_promocoes').select('ativa').eq('chave','black_friday').single();
      if (error) throw error;
      active = data.ativa === true; loaded = true; busy = false; draw();
    } catch(e) { busy = false; draw('Erro ao consultar campanha: '+e.message,true); }
  }
  async function toggle() {
    if (busy || !loaded) return;
    const next = !active;
    if (!confirm(next ? 'Ligar Black Friday de 20% (exceto Saldos)?' : 'Desligar Black Friday e restaurar preços normais?')) return;
    busy = true; draw('A guardar...');
    try {
      if (!(await MaelleDB.isAdmin())) throw Error('Sem permissão administrativa.');
      const {data,error} = await MaelleDB.client.from('maelle_promocoes')
        .update({ativa:next,atualizado_em:new Date().toISOString()})
        .eq('chave','black_friday').select('ativa').single();
      if (error) throw error;
      active = data.ativa === true; busy = false; draw();
    } catch(e) { busy = false; draw('Não foi possível guardar: '+e.message,true); }
  }
  function init() {
    $('bf2-toggle')?.addEventListener('click',toggle);
    $('bf2-refresh')?.addEventListener('click',load);
    document.querySelector('[data-tab="black-friday-nova"]')?.addEventListener('click',load);
    draw('Abra a aba para consultar a campanha.');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
