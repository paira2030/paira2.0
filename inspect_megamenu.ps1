$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

# Check how mega-menus are structured in payra
# Search for div with mega-menu classes or similar
$megaMatches = [regex]::Matches($h, '(?s)<div[^>]*aria-label="Menu[^"]*"[^>]*>.*?</div>')
Write-Host "Found $($megaMatches.Count) menu containers by aria-label"

# Let's search for "Toda a Coleção Verão" context
$pos = $h.IndexOf('Toda a Cole')
if ($pos -gt 0) {
    Write-Host "Found mega-menu context:"
    Write-Host $h.Substring([Math]::Max(0, $pos - 300), 1200)
}
