$raw = Get-Content -Path "tools\reference-backup\payra_home.html" -Raw -Encoding utf8

$headerIdx = $raw.IndexOf('<header')
$headerEnd = $raw.IndexOf('</header>')
if ($headerIdx -gt 0 -and $headerEnd -gt 0) {
    $headerHtml = $raw.Substring($headerIdx, $headerEnd - $headerIdx + 9)
    # Save header to file
    [System.IO.File]::WriteAllText("tools\payra_header_extracted.html", $headerHtml, [System.Text.Encoding]::UTF8)
    Write-Host "Saved payra_header_extracted.html successfully!"
}
