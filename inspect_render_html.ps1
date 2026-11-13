$js = Get-Content -Path 'assets\js\store.js' -Raw -Encoding UTF8
$idx = $js.IndexOf('grid.innerHTML =')
if ($idx -ge 0) {
    Write-Host $js.Substring($idx, 1500)
}
