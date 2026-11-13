$deptNames = @("VERAO", "NOVIDADES", "VESTIDOS", "ROUPA", "CASACOS", "CONJUNTOS", "ACESSORIOS", "SALDOS")
foreach ($d in $deptNames) {
    $path = "tools\megamenu_$d.html"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding utf8
        Write-Host "=== $d ==="
        $imgMatch = [regex]::Match($content, 'src="([^"]+)"')
        $textMatch = [regex]::Match($content, '<p class="mt-3 font-display italic[^"]*">([^<]+)</p>')
        Write-Host "Image: $($imgMatch.Groups[1].Value) | Caption: $($textMatch.Groups[1].Value)"
    }
}
