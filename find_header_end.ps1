$idx = Get-Content -Path 'index.html' -Raw -Encoding UTF8

$endHeader = $idx.IndexOf('</header>')
Write-Host "End of header: $endHeader"
Write-Host "Length of header: $($endHeader - 2167 + 9)"

$afterHeader = $idx.Substring($endHeader, 300)
Write-Host "After header: $afterHeader"
