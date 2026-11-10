New-Item -ItemType Directory -Path "assets\images\colecoes" -Force | Out-Null

$imgs = @(
    @{ Url = "https://www.payra.pt/img/colecoes/vestidos.jpg"; Path = "assets\images\colecoes\vestidos.jpg" },
    @{ Url = "https://www.payra.pt/img/colecoes/tops.jpg"; Path = "assets\images\colecoes\tops.jpg" },
    @{ Url = "https://www.payra.pt/img/colecoes/casacos.jpg"; Path = "assets\images\colecoes\casacos.jpg" },
    @{ Url = "https://www.payra.pt/img/colecoes/conjuntos.jpg"; Path = "assets\images\colecoes\conjuntos.jpg" },
    @{ Url = "https://www.payra.pt/img/colecoes/malas.jpg"; Path = "assets\images\colecoes\malas.jpg" }
)

foreach ($item in $imgs) {
    if (-not (Test-Path $item.Path)) {
        Write-Host "Downloading $($item.Path)..."
        & curl.exe -s -L -m 15 $item.Url -o $item.Path
    } else {
        Write-Host "Exists: $($item.Path)"
    }
}
