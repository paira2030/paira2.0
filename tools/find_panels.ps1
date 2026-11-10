$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

$idx = $h.IndexOf('grid-cols-[1fr_auto]')
while ($idx -gt -1) {
    $start = [Math]::Max(0, $idx - 300)
    Write-Host "--- Found panel at $idx ---"
    Write-Host $h.Substring($start, [Math]::Min(500, $h.Length - $start))
    $idx = $h.IndexOf('grid-cols-[1fr_auto]', $idx + 1)
}
