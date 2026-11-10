$css = Get-Content -Path "payra.css" -Raw -Encoding utf8

$rootMatches = [regex]::Matches($css, '(--[a-zA-Z0-9\-_]+:\s*[^;]+;)') | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "=== CSS Variables ==="
$rootMatches | Select-Object -First 30 | ForEach-Object { Write-Host $_ }

$fontMatches = [regex]::Matches($css, 'font-family:[^;}]+') | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "`n=== Font Families ==="
$fontMatches | ForEach-Object { Write-Host $_ }

$colorMatches = [regex]::Matches($css, '(#(?:[0-9a-fA-F]{3,8})|rgba?\([^)]+\))') | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "`n=== Sample Colors ==="
$colorMatches | Select-Object -First 25 | ForEach-Object { Write-Host $_ }
