$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

# Find the mega-menu wrapper divs
$menus = [regex]::Matches($h, '(?s)<div[^>]*class="[^"]*grid-cols-\[1fr_auto\][^"]*"[^>]*>.*?</div>\s*</div>\s*</div>')
Write-Host "Found $($menus.Count) mega-menu panels."

# Let's inspect where the mega-menus are located relative to nav
$flyoutMatches = [regex]::Matches($h, '(?s)<div[^>]*class="[^"]*absolute left-0 right-0[^"]*"[^>]*>.*?</div>\s*</div>')
Write-Host "Found $($flyoutMatches.Count) flyout containers."
