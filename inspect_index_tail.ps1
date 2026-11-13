$idx = Get-Content -Path 'index.html' -Raw -Encoding UTF8

$tail = $idx.Substring($idx.Length - 2500)
Write-Host $tail
