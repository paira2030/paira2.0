$raw = Get-Content -Path "tools\reference-backup\payra_home.html" -Raw -Encoding utf8

$headerIdx = $raw.IndexOf('<header')
$headerEnd = $raw.IndexOf('</header>')
if ($headerIdx -gt 0 -and $headerEnd -gt 0) {
    $headerHtml = $raw.Substring($headerIdx, $headerEnd - $headerIdx + 9)
    # Search for all links inside header
    $links = [regex]::Matches($headerHtml, 'href="([^"]+)"[^>]*>([^<]+)</a>')
    Write-Host "Found $($links.Count) links in header:"
    foreach ($l in $links) {
        Write-Host "$($l.Groups[1].Value) -> $($l.Groups[2].Value)"
    }
}
