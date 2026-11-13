$raw = Get-Content -Path "tools\reference-backup\payra_home.html" -Raw -Encoding utf8

$headerIdx = $raw.IndexOf('<header')
$headerEnd = $raw.IndexOf('</header>')
if ($headerIdx -gt 0 -and $headerEnd -gt 0) {
    $headerHtml = $raw.Substring($headerIdx, $headerEnd - $headerIdx + 9)
    Write-Host "Header length: $($headerHtml.Length)"
    
    # Extract nav links and any submenus
    $navMatch = [regex]::Match($headerHtml, '(?s)<nav.*?</nav>')
    if ($navMatch.Success) {
        Write-Host "Nav HTML:"
        Write-Host $navMatch.Value
    }
}
