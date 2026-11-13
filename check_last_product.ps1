$products = Get-Content -Path 'data\products.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$last = $products[-1]
Write-Host "Last product: $($last.id) - $($last.title)"
Write-Host "Total products: $($products.Count)"
