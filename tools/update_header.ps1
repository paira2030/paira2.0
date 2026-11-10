[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$headerHtml = @'
  <!-- ==========================================
       HEADER FIXO (STICKY HEADER COM MEGA-MENUS PAYRA)
       ========================================== -->
  <header class="sticky top-0 z-40 bg-linho/95 backdrop-blur-md border-b border-costura transition-all duration-200">
    <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">
      
      <!-- Lado Esquerdo: Mobile Menu + Logótipo PAIRA -->
      <div class="flex items-center gap-4">
        <button type="button" onclick="Store.openMobileMenu()" class="p-2 lg:hidden text-tinta hover:text-oliva" aria-label="Abrir menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <a aria-label="Paira - página inicial" href="/" class="flex items-center text-tinta select-none transition-opacity hover:opacity-80">
          <span class="font-display text-2xl lg:text-[1.85rem] tracking-[0.16em] font-normal uppercase text-tinta leading-none">PAIRA</span>
        </a>
      </div>

      <!-- Navegação Desktop (8 Departamentos Idênticos à Payra) -->
      <nav aria-label="Departamentos" class="hidden lg:block">
        <ul class="flex items-center gap-7 lg:gap-8">
          <li class="py-5" onmouseenter="Store.openMegaMenu('verao')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('verao')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">VERÃO</button>
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
            <button onclick="Store.filterCategory('acessorios')" class="label-etiqueta transition-colors duration-200 hover:text-oliva">ACESSÓRIOS</button>
          </li>
          <li class="py-5" onmouseenter="Store.openMegaMenu('saldos')" onmouseleave="Store.closeMegaMenu()">
            <button onclick="Store.filterCategory('saldos')" class="label-etiqueta transition-colors duration-200 text-promo">SALDOS</button>
          </li>
        </ul>
      </nav>

      <!-- Ações do Header à Direita (Pesquisa, Conta/ADM, Wishlist, Carrinho) -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button type="button" onclick="Store.openSearchModal()" aria-label="Pesquisar (atalho: /)" class="p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </button>
        <a href="admin.html" aria-label="A minha conta / ADM" class="hidden sm:block p-2 text-tinta transition-colors hover:text-oliva" title="Acesso ADM & myPOS">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </a>
        <button type="button" onclick="Store.filterCategory('all'); Store.showToast('Visualizando peças favoritas!');" aria-label="Favoritos" class="hidden sm:block relative p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span class="wishlist-count-badge absolute top-1 right-1 w-4 h-4 rounded-full bg-oliva text-white text-[9px] font-bold hidden items-center justify-center">0</span>
        </button>
        <button type="button" onclick="Store.openCart()" aria-label="Carrinho" class="relative p-2 text-tinta transition-colors hover:text-oliva">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span class="cart-count-badge absolute top-1 right-1 w-4 h-4 rounded-full bg-tinta text-linho text-[9px] font-bold hidden items-center justify-center">0</span>
        </button>
      </div>

    </div>

    <!-- Barra de Pesquisa Expansível (Drop-down) -->
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

    <!-- 1. MEGA-MENU VERÃO -->
    <div id="megamenu-verao" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">A edição da estação</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('verao', '', 'Toda a Coleção Verão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Toda a Coleção Verão</button></li>
              <li><button onclick="Store.filterByOption('vestidos', 'verao', 'Vestidos de Verão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Vestidos de Verão</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'verao', 'Conjuntos de Verão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Conjuntos de Verão</button></li>
              <li><button onclick="Store.filterByOption('tops', 'verao', 'Tops de Verão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Tops de Verão</button></li>
              <li><button onclick="Store.filterByOption('verao', 'praia', 'Íntimo e Praia')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Íntimo e praia</button></li>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Verão até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Verão até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Verão até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('verao')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="A edição da estação" src="assets/images/hero/hero-colecao-mobile.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">A edição da estação</p>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Novidades até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Novidades até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Novidades até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('novidades')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="A coleção desta semana" src="assets/images/colecoes/vestidos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">A coleção desta semana</p>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Vestidos até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Vestidos até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Vestidos até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
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
            <p class="label-etiqueta mb-4 text-grafite">Peças de cima</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('tops', 'top', 'Tops de Alças')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Tops</button></li>
              <li><button onclick="Store.filterByOption('tops', 'blusa', 'Blusas e Camisas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Blusas e camisas</button></li>
              <li><button onclick="Store.filterByOption('tops', 'malha', 'Malhas Finas')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Malhas</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Peças de baixo</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('conjuntos', 'calcas', 'Calças')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Calças</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'calcoes', 'Calções')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Calções</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'saia', 'Saias')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Saias</button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'macacao', 'Macacões')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Macacões</button></li>
              <li><button onclick="Store.filterByOption('tops', 'praia', 'Íntimo e Praia')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Íntimo e praia</button></li>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('tops')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Básicos que não são básicos" src="assets/images/colecoes/tops.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">Básicos que não são básicos</p>
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
              <li><button onclick="Store.filterByOption('casacos', 'jaqueta', 'Jaquetas e Blusões')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Jaquetas e blusões <span class="text-xs text-grafite">(263)</span></button></li>
              <li><button onclick="Store.filterByOption('casacos', 'sobretudo', 'Sobretudos e Compridos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Sobretudos e compridos <span class="text-xs text-grafite">(1)</span></button></li>
              <li><button onclick="Store.filterByOption('casacos', 'kimono', 'Casacos Clássicos e Quimonos')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Clássicos <span class="text-xs text-grafite">(13)</span></button></li>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Casacos até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Casacos até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Casacos até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
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
              <li><button onclick="Store.filterByOption('conjuntos', 'calcoes', 'Conjuntos com Calções')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Com calções <span class="text-xs text-grafite">(72)</span></button></li>
              <li><button onclick="Store.filterByOption('conjuntos', 'calcas', 'Conjuntos com Calças')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Com calças <span class="text-xs text-grafite">(22)</span></button></li>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Conjuntos até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Conjuntos até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Conjuntos até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
              <li><button onclick="Store.filterCategory('saldos')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-promo transition-colors duration-200 hover:underline">Em saldo (-50%)</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('conjuntos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Look completo, zero esforço" src="assets/images/colecoes/conjuntos.jpg" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">Look completo, zero esforço</p>
        </div>
      </div>
    </div>

    <!-- 7. MEGA-MENU ACESSÓRIOS -->
    <div id="megamenu-acessorios" class="megamenu-panel" onmouseenter="Store.keepMegaMenuOpen()" onmouseleave="Store.closeMegaMenu()">
      <div class="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] gap-12 px-6 lg:px-12 py-10">
        <div class="flex flex-wrap gap-12 lg:gap-16">
          <div>
            <p class="label-etiqueta mb-4 text-grafite">Malas</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('acessorios', 'mala', 'Malas de Mão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Malas de mão</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'carteira', 'Carteiras de Pele')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Carteiras</button></li>
              <li><button onclick="Store.filterCategory('acessorios')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Todas as malas</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Mais</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByOption('acessorios', 'sapatos', 'Sapatos de Pele')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Sapatos</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'oculos', 'Óculos de Sol')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Óculos de sol</button></li>
              <li><button onclick="Store.filterByOption('acessorios', 'chapeu', 'Chapéus de Verão')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Chapéus</button></li>
              <li><button onclick="Store.filterCategory('acessorios')" class="group/link inline-flex items-center gap-2 text-sm font-semibold text-tinta transition-colors duration-200 hover:text-oliva">Todos os acessórios</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Acessórios até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Acessórios até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Acessórios até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
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
              <li><button onclick="Store.filterByColor('Vermelho')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva"><span class="h-3 w-3 rounded-full border border-costura transition-transform duration-200 group-hover/link:scale-110" style="background-color:#B03A2E"></span>Vermelho / Bordô</button></li>
            </ul>
          </div>

          <div>
            <p class="label-etiqueta mb-4 text-grafite">Por preço</p>
            <ul class="space-y-2.5">
              <li><button onclick="Store.filterByPrice(40, 'Saldos até 40 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 40 €</button></li>
              <li><button onclick="Store.filterByPrice(50, 'Saldos até 50 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 50 €</button></li>
              <li><button onclick="Store.filterByPrice(70, 'Saldos até 70 €')" class="group/link inline-flex items-center gap-2 text-sm text-tinta transition-colors duration-200 hover:text-oliva">Até 70 €</button></li>
            </ul>
          </div>
        </div>

        <div onclick="Store.filterCategory('saldos')" class="group block w-56 cursor-pointer">
          <div class="relative aspect-[4/5] overflow-hidden bg-linho shadow-sm">
            <img alt="Últimas unidades em saldo" src="assets/images/produtos/vestidos/rona-v-neck-cutout-sleeveless-maxi-dress.webp" class="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]" />
          </div>
          <p class="mt-3 font-display italic text-base text-tinta">Últimas unidades</p>
        </div>
      </div>
    </div>

  </header>
'@

$indexPath = "index.html"
$raw = Get-Content -Path $indexPath -Raw -Encoding utf8

$startTag = "<!-- ==========================================`r`n       HEADER FIXO (STICKY HEADER)"
if (-not $raw.Contains($startTag)) {
    $startTag = "<!-- ==========================================`n       HEADER FIXO (STICKY HEADER)"
}
$endTag = "</header>"

$startIdx = $raw.IndexOf($startTag)
$endIdx = $raw.IndexOf($endTag, $startIdx)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $before = $raw.Substring(0, $startIdx)
    $after = $raw.Substring($endIdx + $endTag.Length)
    $newContent = $before + $headerHtml + $after
    [System.IO.File]::WriteAllText($indexPath, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "index.html header updated successfully with all 8 mega menus!"
} else {
    Write-Host "Could not locate header tags: startIdx=$startIdx, endIdx=$endIdx"
}
