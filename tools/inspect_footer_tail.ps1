$idx = Get-Content -Path 'index.html' -Raw -Encoding UTF8

$footerStart = $idx.IndexOf('<!-- ==========================================')
$footerReal = $idx.IndexOf('<footer')
Write-Host "Footer start: $footerReal"

$footerAndBeyond = $idx.Substring($footerReal)
Write-Host "Length from footer to end: $($footerAndBeyond.Length)"
