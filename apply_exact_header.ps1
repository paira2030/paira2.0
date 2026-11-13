$headerHtml = @'
  <!-- ==========================================
       HEADER FIXO (STICKY HEADER COM MEGA-MENUS PAYRA)
       ========================================== -->
  <header class="sticky top-0 z-40 bg-linho/95 backdrop-blur-md border-b border-costura transition-all duration-200">
    <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">
      
      <!-- Lado Esquerdo: Mobile Menu + Logotipo MAELLE -->
      <div class="flex items-center gap-4">
        <button type="button" onclick="Store.openMobileMenu()" class="p-2 lg:hidden text-tinta hover:text-oliva" aria-label="Abrir menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <a aria-label="Maelle - pagina inicial" href="/" class="flex items-center text-tinta select-none transition-opacity hover:opacity-80">
          <span class="font-display text-2xl lg:text-[1.85rem] tracking-[0.16em] font-normal uppercase text-tinta leading-none">MAELLE</span>
        </a>
      </div>

      <!-- Navegacao Desktop (8 Departamentos Identicos a Payra) -->
      <nav aria-label="Departamentos" class="hidden lg:block">
        <ul class="flex items-center gap-7 lg:gap-8">
          <li class="py-5" onmouseenter="Store.openMegaMenu('verao')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('verao')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">VER&Atilde;O</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('novidades')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('novidades')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">NOVIDADES</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('vestidos')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('vestidos')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">VESTIDOS</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('roupa')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('tops')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">ROUPA</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('casacos')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('casacos')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">CASACOS</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('conjuntos')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('conjuntos')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">CONJUNTOS</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('acessorios')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('acessorios')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">ACESS&Oacute;RIOS</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('saldos')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('saldos')" class="label-etiqueta transition-colors duration-200 text-promo">SALDOS</button>
          </li>
        </ul>
      </nav>

      <!-- Acoes do Header a Direita (Pesquisa, Conta/ADM, Wishlist, Carrinho) -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button type="button" onclick="Store.openSearchModal()" aria-label="Pesquisar (atalho: /)" class="p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </button>
        <a href="admin.html" aria-label="A minha conta / ADM" class="hidden sm:block p-2 text-tinta transition-colors hover:text-oliva" title="Acesso ADM & myPOS">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </a>
        <button type="button" onclick="Store.filterCategory('all'); Store.showToast('Visualizando pecas favoritas!');" aria-label="Favoritos" class="hidden sm:block relative p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span class="wishlist-count-badge absolute top-1 right-1 w-4 h-4 rounded-full bg-oliva text-white text-[9px] font-bold hidden items-center justify-center">0</span>
        </button>
        <button type="button" onclick="Store.openCart()" aria-label="Carrinho" class="relative p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span class="cart-count-badge absolute top-1 right-1 w-4 h-4 rounded-full bg-tinta text-linho text-[9px] font-bold hidden items-center justify-center">0</span>
        </button>
      </div>

    </div>

    <!-- Barra de Pesquisa Expansivel (Drop-down) -->
    <div id="search-overlay-bar" class="search-overlay">
      <div class="mx-auto max-w-[1440px] flex items-center gap-4">
        <svg class="text-grafite shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input 
          type="text" 
          id="overlay-search-input" 
          placeholder="Pesquisar vestidos, blusas, casacos, conjuntos..." 
          class="flex-1 bg-transparent text-sm sm:text-base border-none outline-none font-body placeholder:text-grafite/60 text-tinta"
        />
        <button onclick="Store.closeSearchModal()" class="p-1 text-grafite hover:text-tinta" aria-label="Fechar pesquisa">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- ==========================================
         MEGA-MENUS (EXATAMENTE COMO NA PAYRA)
         ========================================== -->

    <!-- 1. MEGA-MENU VERAO -->
    <div id="megamenu-verao" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">A edi&ccedil;&atilde;o da esta&ccedil;&atilde;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('verao', '', 'Toda a Colecao Verao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Toda a Cole&ccedil;&atilde;o Ver&atilde;o</button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'verao', 'Vestidos de Verao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos de Ver&atilde;o</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'verao', 'Conjuntos de Verao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Conjuntos de Ver&atilde;o</button></li>
              <li><button onclick="Store.filterByOption('tops', 'verao', 'Tops de Verao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Tops de Ver&atilde;o</button></li>
              <li><button onclick="Store.filterByOption('verao', 'praia', 'Intimo e Praia')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">&Iacute;ntimo e praia</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Verao ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Verao ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Verao ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('verao')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="A edicao da estacao" src="assets/images/hero/hero-colecao-mobile.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">A edi&ccedil;&atilde;o da esta&ccedil;&atilde;o</p>
        </div>
      </div>
    </div>

    <!-- 2. MEGA-MENU NOVIDADES -->
    <div id="megamenu-novidades" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Acabou de chegar</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterCategory('novidades')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Ver tudo</button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'vestido', 'Vestidos Novos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos novos</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'conjunto', 'Conjuntos Novos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Conjuntos novos</button></li>
              <li><button onclick="Store.filterByOption('casacos', 'casaco', 'Casacos Novos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Casacos novos</button></li>
              <li><button onclick="Store.filterByOption('all', 'best-seller', 'Best-sellers')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Best-sellers</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Novidades ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Novidades ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Novidades ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('novidades')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="A colecao desta semana" src="assets/images/colecoes/vestidos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">A cole&ccedil;&atilde;o desta semana</p>
        </div>
      </div>
    </div>

    <!-- 3. MEGA-MENU VESTIDOS -->
    <div id="megamenu-vestidos" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por estilo</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('vestidos', 'maxi', 'Vestidos Maxi')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos maxi <span class="text-xs text-grafite">(274)</span></button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'midi', 'Vestidos Midi')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos midi <span class="text-xs text-grafite">(76)</span></button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'mini', 'Vestidos Mini')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos mini <span class="text-xs text-grafite">(241)</span></button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'festa', 'Vestidos de Festa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos de festa <span class="text-xs text-grafite">(50)</span></button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'casual', 'Vestidos Casuais')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos casual <span class="text-xs text-grafite">(45)</span></button></li>
              <li><button onclick="Store.filterCategory('vestidos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Ver tudo <span class="text-xs text-grafite">(686)</span></button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Vestidos ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Vestidos ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Vestidos ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('vestidos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="O vestido certo existe" src="assets/images/colecoes/vestidos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">O vestido certo existe</p>
        </div>
      </div>
    </div>

    <!-- 4. MEGA-MENU ROUPA -->
    <div id="megamenu-roupa" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Pe&ccedil;as de cima</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('tops', 'top', 'Tops de Alcas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Tops</button></li>
              <li><button onclick="Store.filterByOption('tops', 'blusa', 'Blusas e Camisas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Blusas e camisas</button></li>
              <li><button onclick="Store.filterByOption('tops', 'malha', 'Malhas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Malhas</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Pe&ccedil;as de baixo</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('conjuntos', 'calcas', 'Calcas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Cal&ccedil;as</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'calcoes', 'Calcoes')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Cal&ccedil;&otilde;es</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'saia', 'Saias')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Saias</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'macacao', 'Macacoes')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Macac&otilde;es</button></li>
              <li><button onclick="Store.filterByOption('tops', 'praia', 'Intimo e Praia')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">&Iacute;ntimo e praia</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('tops')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Basicos que nao sao basicos" src="assets/images/colecoes/tops.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">B&aacute;sicos que n&atilde;o s&atilde;o b&aacute;sicos</p>
        </div>
      </div>
    </div>

    <!-- 5. MEGA-MENU CASACOS -->
    <div id="megamenu-casacos" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por tipo</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('casacos', 'blazer', 'Blazers Estruturados')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Blazers <span class="text-xs text-grafite">(91)</span></button></li>
              <li><button onclick="Store.filterByOption('casacos', 'jaqueta', 'Jaquetas e Blusoes')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Jaquetas e blus&otilde;es <span class="text-xs text-grafite">(263)</span></button></li>
              <li><button onclick="Store.filterByOption('casacos', 'sobretudo', 'Sobretudos e Compridos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Sobretudos e compridos <span class="text-xs text-grafite">(1)</span></button></li>
              <li><button onclick="Store.filterByOption('casacos', 'kimono', 'Casacos Classicos e Quimonos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Cl&aacute;ssicos <span class="text-xs text-grafite">(13)</span></button></li>
              <li><button onclick="Store.filterCategory('casacos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Ver tudo <span class="text-xs text-grafite">(368)</span></button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Casacos ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Casacos ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Casacos ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('casacos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="A camada que faz o look" src="assets/images/colecoes/casacos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">A camada que faz o look</p>
        </div>
      </div>
    </div>

    <!-- 6. MEGA-MENU CONJUNTOS (EXATAMENTE COMO NA IMAGEM 2) -->
    <div id="megamenu-conjuntos" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por tipo</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('conjuntos', 'saia', 'Conjuntos com Saia')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Com saia <span class="text-xs text-grafite">(91)</span></button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'calcoes', 'Conjuntos com Calcoes')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Com cal&ccedil;&otilde;es <span class="text-xs text-grafite">(72)</span></button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'calcas', 'Conjuntos com Calcas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Com cal&ccedil;as <span class="text-xs text-grafite">(22)</span></button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'coordenado', 'Coordenados Elegantes')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Coordenados <span class="text-xs text-grafite">(62)</span></button></li>
              <li><button onclick="Store.filterCategory('conjuntos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Ver tudo <span class="text-xs text-grafite">(247)</span></button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Conjuntos ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Conjuntos ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Conjuntos ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('conjuntos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Look completo, zero esforco" src="assets/images/colecoes/conjuntos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">Look completo, zero esfor&ccedil;o</p>
        </div>
      </div>
    </div>

    <!-- 7. MEGA-MENU ACESSORIOS -->
    <div id="megamenu-acessorios" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Malas</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('acessorios', 'mala', 'Malas de Mao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Malas de m&atilde;o</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'carteira', 'Carteiras de Pele')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Carteiras</button></li>
              <li><button onclick="Store.filterCategory('acessorios')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Todas as malas</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Mais</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('acessorios', 'sapatos', 'Sapatos de Pele')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Sapatos</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'oculos', 'Oculos de Sol')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">&Oacute;culos de sol</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'chapeu', 'Chapeus de Verao')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Chap&eacute;us</button></li>
              <li><button onclick="Store.filterCategory('acessorios')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Todos os acess&oacute;rios</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Acessorios ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Acessorios ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Acessorios ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('acessorios')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Os detalhes contam" src="assets/images/colecoes/malas.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">Os detalhes contam</p>
        </div>
      </div>
    </div>

    <!-- 8. MEGA-MENU SALDOS -->
    <div id="megamenu-saldos" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Saldos</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Tudo em saldo (-50% ou mais)</button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'vestido', 'Vestidos em Saldo')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos em saldo</button></li>
              <li><button onclick="Store.filterByOption('casacos', 'casaco', 'Casacos em Saldo')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Casacos em saldo</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'conjunto', 'Conjuntos em Saldo')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Conjuntos em saldo</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'mala', 'Malas em Saldo')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Malas em saldo</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por cor</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByColor('Preto')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#1C1B16"></span>Preto</button></li>
              <li><button onclick="Store.filterByColor('Branco')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#F4F2EC"></span>Branco / Cru</button></li>
              <li><button onclick="Store.filterByColor('Bege')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#D8C9AF"></span>Bege / Camel</button></li>
              <li><button onclick="Store.filterByColor('Rosa')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#E5B8C2"></span>Rosa</button></li>
              <li><button onclick="Store.filterByColor('Azul')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#5B7A9E"></span>Azul</button></li>
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bord&ocirc;</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por pre&ccedil;o</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Saldos ate 40 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 40 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Saldos ate 50 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 50 &euro;</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Saldos ate 70 &euro;')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">At&eacute; 70 &euro;</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('saldos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Ultimas unidades em saldo" src="assets/images/produtos/vestidos/rona-v-neck-cutout-sleeveless-maxi-dress.webp" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">&Uacute;ltimas unidades</p>
        </div>
      </div>
    </div>

  </header>
'@

$indexPath = "index.html"
$raw = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

$headerStartTag = "<header"
$headerEndTag = "</header>"

$startIdx = $raw.IndexOf($headerStartTag)
$endIdx = $raw.IndexOf($headerEndTag, $startIdx)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    # Find start of comment before header
    $commentStart = $raw.LastIndexOf("<!--", $startIdx)
    if ($commentStart -ge 0 -and ($startIdx - $commentStart) -lt 200) {
        $startIdx = $commentStart
    }

    $before = $raw.Substring(0, $startIdx)
    $after = $raw.Substring($endIdx + $headerEndTag.Length)
    $newContent = $before + $headerHtml + $after

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($indexPath, $newContent, $utf8NoBom)
    Write-Host "Updated index.html header with clean entities and all 8 mega menus!"
} else {
    Write-Host "Error: Could not locate header in index.html"
}
