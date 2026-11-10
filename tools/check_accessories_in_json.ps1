$products = Get-Content -Path 'data\products.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$francia = $products | Where-Object { $_.title -like "*Francia*" -or $_.slug -like "*francia*" }
$sophia = $products | Where-Object { $_.title -like "*Sophia*" -or $_.slug -like "*sophia*" }

Write-Host "Francia found: $($francia.Count)"
Write-Host "Sophia found: $($sophia.Count)"
