$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

$descIndex = $content.IndexOf('Vestido maxi Miranda em malha canelada para mulheres')
if ($descIndex -ge 0) {
    Write-Host $content.Substring($descIndex - 200, 4000)
}
