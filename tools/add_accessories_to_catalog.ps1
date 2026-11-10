$products = Get-Content -Path 'data\products.json' -Raw -Encoding UTF8 | ConvertFrom-Json

$francia = [PSCustomObject]@{
    id = "PAIR-024"
    title = "Francia Saco Tote Pequeno Trançado"
    slug = "francia-small-woven-tote-bag"
    category = "acessorios"
    categoryFolder = "acessorios"
    price = 49.99
    oldPrice = 64.99
    tag = "Novo"
    rating = 4.8
    reviewsCount = 14
    stock = 15
    localImage = "assets/images/produtos/acessorios/francia-small-woven-tote-bag.webp"
    sizes = @("Tamanho Único")
    colors = @("Preto", "Castanho")
    description = "Saco tote pequeno com acabamento trançado artesanal de alta qualidade. Design contemporâneo e versátil para todas as ocasiões."
    composition = "100% Fibra Natural Trançada com acabamentos em pele sintética premium."
}

$sophia = [PSCustomObject]@{
    id = "PAIR-025"
    title = "Sophia mala de ombro às riscas"
    slug = "sophia-striped-shoulder-bag"
    category = "acessorios"
    categoryFolder = "acessorios"
    price = 44.99
    oldPrice = 60.99
    tag = "Novo"
    rating = 4.7
    reviewsCount = 9
    stock = 11
    localImage = "assets/images/produtos/acessorios/sophia-striped-shoulder-bag.webp"
    sizes = @("Tamanho Único")
    colors = @("Padrão Riscas")
    description = "Mala de ombro elegante com padrão clássico às riscas. Alça estruturada e fecho metálico dourado de segurança."
    composition = "Fio de algodão estruturado com detalhes em latão envelhecido."
}

$list = [System.Collections.ArrayList]@($products)
$list.Add($francia) | Out-Null
$list.Add($sophia) | Out-Null

$jsonString = $list | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("c:\Users\kikit\Desktop\payla\data\products.json", $jsonString, [System.Text.Encoding]::UTF8)

Write-Host "Updated products.json, new count: $($list.Count)"
