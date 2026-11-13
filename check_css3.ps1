$css = Get-Content -Path 'assets\css\style.css' -Raw -Encoding UTF8
$css.Substring(6000)
