$css = Get-Content -Path 'assets\css\style.css' -Raw -Encoding UTF8
Write-Host "CSS length: $($css.Length)"
$css.Substring(0, [Math]::Min(2000, $css.Length))
