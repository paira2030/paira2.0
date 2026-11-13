$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$headerMatches = [regex]::Matches($raw, '(?s)<header.*?</header>')
if ($headerMatches.Count -gt 0) {
    Write-Host "Found header HTML:"
    Write-Host $headerMatches[0].Value.Substring(0, [Math]::Min(1500, $headerMatches[0].Value.Length))
} else {
    Write-Host "No explicit <header> tag found directly in raw HTML or inside Next payload."
    # Check for announcement bar text
    $announcement = [regex]::Matches($raw, '"[^"]*(?:portes|devolu|promo|oferta|envio)[^"]*"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    Write-Host "Announcement matches:"
    $announcement | Select-Object -First 10 | ForEach-Object { Write-Host $_.Value }
}
