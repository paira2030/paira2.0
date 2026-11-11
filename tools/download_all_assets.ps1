$euroChar = [char]0x20AC
$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$articles = [regex]::Matches($raw, '(?s)<article[^>]*>(.*?)</article>')
Write-Host "Analyzing $($articles.Count) product cards from reference..."

$productsMap = @{}

foreach ($art in $articles) {
    $content = $art.Groups[1].Value
    $slug = ""
    $title = ""
    $price = 49.99
    $img = ""
    $tag = ""

    if ($content -match 'href="/produto/([^"]+)"') { $slug = $matches[1] }
    if ($content -match '<h3[^>]*>([^<]+)</h3>') { $title = $matches[1] }
    if ($content -match '([0-9]+[,\.][0-9]{2})') { 
        $price = [double]($matches[1] -replace ',', '.')
    }
    if ($content -match 'src="(https://[^"]+)"') { $img = $matches[1] }
    if ($content -match 'class="etiqueta[^"]*">([^<]+)</span>') { $tag = $matches[1] }

    if ($slug -ne "" -and -not $productsMap.ContainsKey($slug)) {
        $category = "vestidos"
        $catFolder = "vestidos"
        if ($slug -match "blazer|coat|jacket|casaco|trench") {
            $category = "casacos"
            $catFolder = "casacos-e-blazers"
        } elseif ($slug -match "top|blouse|tank|blusa|malha") {
            $category = "tops"
            $catFolder = "tops-e-blusas"
        } elseif ($slug -match "skirt|saia|shorts|calcoes|jumpsuit|macacao|set|conjunto") {
            $category = "conjuntos"
            $catFolder = "conjuntos-e-saias"
        }

        $cleanFileName = "$slug.webp"
        $targetPath = "assets/images/produtos/$catFolder/$cleanFileName"

        $productsMap[$slug] = @{
            id = "PAIR-" + ($productsMap.Count + 101)
            title = $title
            slug = $slug
            category = $category
            categoryFolder = $catFolder
            price = $price
            oldPrice = [Math]::Round(($price * 1.25), 2)
            tag = if ($tag -ne "") { $tag } else { "Colecao Verao" }
            imageUrl = $img
            localImage = $targetPath
            description = "Peca sofisticada com corte impecavel de alfaiataria contemporanea. Confecionada com materiais nobres para caimento perfeito e conforto superior. Edicao exclusiva Maelle Lisboa."
            sizes = @("XS", "S", "M", "L", "XL")
            colors = @("Creme / Linho Natural", "Preto Noite", "Oliva Editorial")
            stock = 15
            inStock = $true
            rating = 4.9
            reviewsCount = 24
        }
    }
}

Write-Host "Discovered $($productsMap.Count) unique products."

# Download images
foreach ($key in $productsMap.Keys) {
    $p = $productsMap[$key]
    $outPath = $p.localImage.Replace('/', [IO.Path]::DirectorySeparatorChar)
    if (-not (Test-Path $outPath)) {
        Write-Host "Downloading $($p.slug)..."
        & curl.exe -s -L -m 15 $p.imageUrl -o $outPath
    }
}

# Hero & Payments
$extra = @(
    @{ Url = "https://www.payra.pt/img/hero-verao-desktop.jpg"; Path = "assets\images\hero\hero-colecao-desktop.jpg" },
    @{ Url = "https://www.payra.pt/img/hero-verao-mobile.jpg"; Path = "assets\images\hero\hero-colecao-mobile.jpg" },
    @{ Url = "https://www.payra.pt/img/pagamentos/mbway.svg"; Path = "assets\images\pagamentos\mbway.svg" },
    @{ Url = "https://www.payra.pt/img/pagamentos/multibanco.svg"; Path = "assets\images\pagamentos\multibanco.svg" },
    @{ Url = "https://www.payra.pt/img/pagamentos/visa.svg"; Path = "assets\images\pagamentos\visa.svg" },
    @{ Url = "https://www.payra.pt/img/pagamentos/mastercard.svg"; Path = "assets\images\pagamentos\mastercard.svg" },
    @{ Url = "https://www.payra.pt/img/livro-reclamacoes.png"; Path = "assets\images\pagamentos\livro-reclamacoes.png" }
)

foreach ($ex in $extra) {
    if (-not (Test-Path $ex.Path)) {
        Write-Host "Downloading extra $($ex.Path)..."
        & curl.exe -s -L -m 15 $ex.Url -o $ex.Path
    }
}

# Save products.json
$productList = @($productsMap.Values)
$json = $productList | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("data\products.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Successfully saved data\products.json with $($productList.Count) products!"
