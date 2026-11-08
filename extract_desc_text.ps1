$main = Get-Content -Path "tools\miranda_main.html" -Raw -Encoding utf8

$descIdx = $main.IndexOf('Vestido maxi Miranda em malha canelada para mulheres')
if ($descIdx -gt 0) {
    Write-Host "=== Description & Specs ==="
    Write-Host $main.Substring($descIdx, [Math]::Min(3000, $main.Length - $descIdx))
}
