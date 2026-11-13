$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

$idx = $content.IndexOf('Especificações')
if ($idx -ge 0) {
    Write-Host "Index of Especificações: $idx"
    Write-Host $content.Substring($idx - 300, 1500)
}

$accIdx = $content.IndexOf('Envios e devoluções')
if ($accIdx -ge 0) {
    Write-Host "`nIndex of Envios e devoluções: $accIdx"
    Write-Host $content.Substring($accIdx - 200, 1200)
}
