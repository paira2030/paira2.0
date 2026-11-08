$raw = Get-Content -Path "tools\payra_miranda.html" -Raw -Encoding utf8

$mainMatch = [regex]::Match($raw, '(?s)<main.*?</main>')
if ($mainMatch.Success) {
    [System.IO.File]::WriteAllText("tools\miranda_main.html", $mainMatch.Value, [System.Text.Encoding]::UTF8)
    Write-Host "Extracted miranda_main.html successfully!"
}

# Find all headings h1, h2, h3 in main
$headings = [regex]::Matches($mainMatch.Value, '<(h[1-4])[^>]*>(.*?)</\1>')
foreach ($h in $headings) {
    Write-Host "$($h.Groups[1].Value): $($h.Groups[2].Value -replace '<[^>]+>', '')"
}
