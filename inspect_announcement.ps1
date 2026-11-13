$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$headerIdx = $raw.IndexOf('<header')
if ($headerIdx -gt 0) {
    $beforeHeader = $raw.Substring([Math]::Max(0, $headerIdx - 1500), [Math]::Min(1500, $headerIdx))
    Write-Host "Before header:"
    Write-Host $beforeHeader
}
