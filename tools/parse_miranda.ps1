$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

Write-Host "File size: $($content.Length) characters"

# Let's inspect the main sections and containers
# We can find the top-level divs and section tags inside <main>
$regex = [regex]'<section[^>]*class="([^"]*)"[^>]*>'
$matches = $regex.Matches($content)
Write-Host "`nSections found: $($matches.Count)"
foreach ($m in $matches) {
    Write-Host "Section class: $($m.Groups[1].Value)"
}

# Look for headers
$hregex = [regex]'<(h[1-6])[^>]*>(.*?)</\1>'
$hmatches = $hregex.Matches($content)
Write-Host "`nHeadings found: $($hmatches.Count)"
foreach ($m in $hmatches) {
    $text = [System.Text.RegularExpressions.Regex]::Replace($m.Groups[2].Value, '<[^>]+>', ' ')
    Write-Host "$($m.Groups[1].Value): $($text.Trim())"
}

# Look for interactive elements / forms / buttons
$bregex = [regex]'<button[^>]*class="([^"]*)"[^>]*>(.*?)</button>'
$bmatches = $bregex.Matches($content)
Write-Host "`nButtons found: $($bmatches.Count)"
foreach ($m in $bmatches) {
    $text = [System.Text.RegularExpressions.Regex]::Replace($m.Groups[2].Value, '<[^>]+>', ' ')
    $text = $text.Trim()
    if ($text.Length -gt 0) {
        Write-Host "Button: '$text' | class: $($m.Groups[1].Value.Substring(0, [Math]::Min(40, $m.Groups[1].Value.Length)))"
    }
}
