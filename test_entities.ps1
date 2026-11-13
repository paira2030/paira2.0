$bytes = [System.IO.File]::ReadAllBytes("index.html")
$raw = [System.Text.Encoding]::UTF8.GetString($bytes)

# Let's replace the nav and mega-menus cleanly
$navBlock = @"
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
"@

Write-Host "Nav block defined."
