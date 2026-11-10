$raw = Get-Content -Path "payra_product.html" -Raw -Encoding utf8

Write-Host "=== Title ==="
if ($raw -match '<title>(.*?)</title>') { Write-Host $matches[1] }

Write-Host "`n=== JSON LD Product ==="
if ($raw -match '(?s)<script type="application/ld\+json">(.*?)</script>') {
    Write-Host $matches[1]
}

Write-Host "`n=== All Image URLs ==="
$pattern = 'https://[^"''\s]+\.(?:jpg|jpeg|png|webp)'
$imgMatches = [regex]::Matches($raw, $pattern) | ForEach-Object { $_.Value } | Select-Object -Unique
$imgMatches | ForEach-Object { Write-Host $_ }
