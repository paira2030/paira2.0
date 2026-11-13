$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

# Ensure base folders exist
$baseImgDir = "assets\images\produtos"
$categories = @("vestidos", "tops-e-blusas", "casacos-e-blazers", "conjuntos-e-saias")

foreach ($cat in $categories) {
    $dir = Join-Path $baseImgDir $cat
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

New-Item -ItemType Directory -Path "assets\images\branding" -Force | Out-Null
New-Item -ItemType Directory -Path "assets\images\pagamentos" -Force | Out-Null
New-Item -ItemType Directory -Path "assets\images\hero" -Force | Out-Null
New-Item -ItemType Directory -Path "data" -Force | Out-Null

Write-Host "Directory structure created successfully!"
