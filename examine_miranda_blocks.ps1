$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

# Let's inspect the breadcrumbs, main grid, right column, accordions, reviews, and cross sell
Write-Host "--- RIGHT COLUMN INSPECTION ---"
$rightColStart = $content.IndexOf('<div class="lg:sticky lg:top-24 lg:self-start">')
if ($rightColStart -ge 0) {
    $rightCol = $content.Substring($rightColStart, 6000)
    Write-Host $rightCol
}

Write-Host "`n--- REVIEWS SECTION ---"
$revStart = $content.IndexOf('O que dizem as clientes')
if ($revStart -ge 0) {
    $revBlock = $content.Substring($revStart - 100, 3000)
    Write-Host $revBlock
}

Write-Host "`n--- BOTTOM STICKY BAR ---"
$stickyStart = $content.IndexOf('Adicionar ao carrinho')
$lastSticky = $content.LastIndexOf('Adicionar ao carrinho')
if ($lastSticky -gt $stickyStart) {
    Write-Host $content.Substring($lastSticky - 200, 500)
}
