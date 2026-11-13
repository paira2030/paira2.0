$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

# Look for occurrences of "audrey-polka-dot-tank-top"
$pos = $raw.IndexOf('audrey-polka-dot-tank-top')
if ($pos -gt 0) {
    $start = [Math]::Max(0, $pos - 300)
    $len = [Math]::Min(1200, $raw.Length - $start)
    Write-Host "Context around audrey-polka-dot-tank-top:"
    Write-Host $raw.Substring($start, $len)
}
