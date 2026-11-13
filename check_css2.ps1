$css = Get-Content -Path 'assets\css\style.css' -Raw -Encoding UTF8
$css.Substring(2000, [Math]::Min(4000, $css.Length - 2000))
