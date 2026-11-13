$products = Get-Content -Path 'data\products.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$miranda = $products | Where-Object { $_.localImage -like "*miranda*" -or $_.title -like "*Miranda*" }
$miranda | ConvertTo-Json -Depth 5
