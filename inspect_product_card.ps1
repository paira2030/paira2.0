$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$pos = $raw.IndexOf('audrey-polka-dot-tank-top')
if ($pos -gt 0) {
    $start = $pos
    $len = [Math]::Min(1500, $raw.Length - $start)
    Write-Host $raw.Substring($start, $len)
}
