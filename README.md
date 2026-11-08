# PAIRA LISBOA — E-Commerce de Moda Feminina

Plataforma de comércio eletrónico de alta-costura contemporânea inspirada no layout editorial de `payra.pt`, desenvolvida com identidade própria (**Paira**), código limpo, catálogo reativo, carrinho com régua de portes grátis para Portugal, checkout transparente e **Painel ADM exclusivo com integração para developers.mypos**.

---

## 📁 Estrutura Organizada do Projeto

```text
payla/
├── index.html                   # Loja online principal (Home, Vitrines, PDP, Carrinho, Checkout)
├── admin.html                   # Painel Administrativo restrito (Gestão de Peças & myPOS)
├── iniciar-loja.bat             # Inicializador de 1 clique para Windows
├── server.ps1                   # Servidor HTTP nativo de alta performance (sem dependências externas)
│
├── data/
│   └── products.json            # Catálogo oficial das 23 peças com preços em €, tamanhos e dados
│
├── assets/
│   ├── css/
│   │   └── style.css            # Design System editorial (variáveis de cor, tipografia e animações)
│   ├── js/
│   │   ├── store.js             # Lógica de vitrine, filtros, PDP modal, carrinho reativo e wishlist
│   │   ├── checkout.js          # Fluxo de checkout (MB WAY, Multibanco e myPOS Cartão 3DS2)
│   │   └── admin.js             # CRUD de produtos e painel de configuração developers.mypos
│   └── images/
│       ├── branding/            # Logótipos vetoriais Paira (SVG) e Favicon
│       ├── hero/                # Fotografias de alta resolução da coleção e lifestyle
│       ├── pagamentos/          # SVGs de MB WAY, Multibanco, Visa, Mastercard, myPOS e Livro de Reclamações
│       └── produtos/            # PASTA DE IMAGENS DETALHADA E SEPARADA POR CATEGORIAS:
│           ├── vestidos/        # 12 modelos de vestidos maxi, midi, mini e gala
│           ├── casacos-e-blazers/ # 4 modelos de blazers, quimonos e trench coats
│           ├── tops-e-blusas/   # 4 modelos de tops de bolinhas, cetins e chiffon
│           └── conjuntos-e-saias/# 4 modelos de coordenados, minissaias e macacões
```

---

## 🚀 Como Executar o Projeto

Você tem duas opções fáceis:

### Opção 1: Inicializador Automático (Recomendado)
* Dê duplo clique no ficheiro `iniciar-loja.bat`.
* A loja abrirá imediatamente no seu navegador padrão em: **`http://localhost:3000/`**.

### Opção 2: Abrir Diretamente o Ficheiro HTML
* Dê duplo clique em `index.html` para abrir diretamente no navegador (Google Chrome, Edge, Firefox, Safari).

---

## 🔒 Acesso à Aba ADM & Configuração do Gateway

* **URL de Acesso:** `http://localhost:3000/admin.html` (ou clique no link "ADM" no topo/rodapé da loja).
* **Palavra-passe / PIN Padrão:** `paira2026`

### Recursos do Painel ADM:
1. **Gestão do Catálogo:**
   * Tabela em tempo real de todas as peças.
   * Adicionar novas peças com foto, tamanhos, cores, descrição e preço em Euros.
   * Editar preços, estoques e etiquetas (*Best-seller, Oferta, Novo*).
   * Exportar o catálogo em JSON para backup.
2. **Central de Configuração developers.mypos:**
   * Alternância entre **Ambiente de Testes (Sandbox)** e **Produção (Live)**.
   * Inserção do **Store ID (SID)** e **Client / Wallet Number**.
   * Gestão de **Chaves Criptográficas RSA (SHA-256 with RSA)**: Chave Privada do Comerciante e Certificado Público do myPOS.
   * Definição de URLs de retorno (`URL_OK`, `URL_CANCEL`) e Webhook de notificação instantânea (`URL_NOTIFY`).
   * Ativação/desativação de métodos em Portugal: **Multibanco**, **MB WAY** e **Cartão 3D Secure**.
   * Testador de conectividade com resposta simulada em tempo real.

---

## 🇵🇹 Conformidade com o Mercado Português e Banco de Portugal

* **Moeda:** Euro (`€`) formatado no padrão português (`XX,XX €`).
* **Regulamentação Fiscal:** Todos os preços com indicação de *IVA incluído à taxa legal em vigor (23%)*.
* **Métodos de Pagamento Nacionais:**
  * **MB WAY:** Com validação do número de telemóvel e aviso de notificação push de 5 minutos.
  * **Multibanco:** Emissão instantânea de Entidade (5 dígitos) e Referência (9 dígitos).
  * **myPOS Checkout:** Conformidade com a diretiva PSD2 europeia e autenticação forte do cliente (3D Secure 2.0).
* **Defesa do Consumidor:** Ligação direta e selo oficial do **Livro de Reclamações Online** (`livroreclamacoes.pt`) e política de devoluções em 30 dias.
