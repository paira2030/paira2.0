$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

# Check the classes on nav items
$items = [regex]::Matches($h, '(?s)<li[^>]*>.*?</li>')
Write-Host "Found $($items.Count) li elements in header."
for ($i = 0; $i -lt [Math]::Min(10, $items.Count); $i++) {
    Write-Host "--- LI $i ---"
    Write-Host $items[$i].Value.Substring(0, [Math]::Min(400, $items[$i].Value.Length))
}
