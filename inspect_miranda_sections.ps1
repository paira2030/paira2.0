$main = Get-Content -Path "tools\miranda_main.html" -Raw -Encoding utf8

# Check for breadcrumbs
$bc = [regex]::Match($main, '(?s)<nav[^>]*aria-label="Breadcrumb"[^>]*>.*?</nav>')
if ($bc.Success) {
    Write-Host "=== Breadcrumb ==="
    Write-Host $bc.Value
}

# Check for trust elements
$trust = [regex]::Matches($main, '(?s)<div[^>]*class="[^"]*(?:border|rounded)[^"]*"[^>]*>.*?(?:Envio|Portes|Devolu).*?</div>')
Write-Host "Found $($trust.Count) trust blocks."

# Check for reviews section
$reviewsIdx = $main.IndexOf('O que dizem as clientes')
if ($reviewsIdx -gt 0) {
    Write-Host "=== Reviews Preview ==="
    Write-Host $main.Substring($reviewsIdx, [Math]::Min(1500, $main.Length - $reviewsIdx))
}

# Check for "Vai bem com isto"
$crossIdx = $main.IndexOf('Vai bem com isto')
if ($crossIdx -gt 0) {
    Write-Host "=== Cross-sell Preview ==="
    Write-Host $main.Substring($crossIdx, [Math]::Min(1500, $main.Length - $crossIdx))
}
