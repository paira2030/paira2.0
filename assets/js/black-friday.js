/* Campanha pública: somente apresentação; preço final é sempre calculado na API SumUp. */
window.MaelleBlackFriday={active:false,ready:false,
 price(p){const base=Math.round(Number(p.price)*100);return (this.active&&!p.isSaldo?Math.round(base*.8):base)/100},
 eligible(p){return this.active&&!p.isSaldo},
 async load(){try{const r=await fetch('/api/black-friday',{cache:'no-store'});if(!r.ok)throw Error('Promoção indisponível');const data=await r.json();this.active=data.active===true;this.ready=true;}catch(e){console.warn(e);this.active=false;this.ready=false;}this.paint();return this.active},
 paint(){document.querySelectorAll('.maelle-bf-strip,.maelle-bf-hero').forEach(e=>e.remove());if(!this.active)return;const bar=document.createElement('div');bar.className='maelle-bf-strip';bar.textContent='BLACK FRIDAY MAELLE · 20% DE DESCONTO EM TODAS AS PEÇAS EXCETO SALDOS';document.body.prepend(bar);if(location.pathname==='/'||location.pathname.endsWith('/index.html')){const hero=document.createElement('section');hero.className='maelle-bf-hero';hero.innerHTML='<div class="maelle-bf-kicker">MAELLE · EDIÇÃO ESPECIAL</div><h2>BLACK FRIDAY</h2><p>20% de desconto nas suas peças favoritas.</p><small>Exclui artigos em Saldos. Não acumulável com outras promoções.</small><a href="#colecao">DESCOBRIR PEÇAS</a>';bar.insertAdjacentElement('afterend',hero);}}
};
