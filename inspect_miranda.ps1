$raw = Get-Content -Path "tools\payra_miranda.html" -Raw -Encoding utf8

Write-Host "=== Title ==="
if ($raw -match '<title>(.*?)</title>') { Write-Host $matches[1] }

Write-Host "`n=== JSON-LD Product Data ==="
$jsonLd = [regex]::Matches($raw, '(?s)<script type="application/ld\+json">(.*?)</script>')
foreach ($j in $jsonLd) {
    if ($j.Groups[1].Value.Contains('"Product"')) {
        Write-Host $j.Groups[1].Value
    }
}

Write-Host "`n=== Images of Miranda ==="
$imgs = [regex]::Matches($raw, 'https://rrdy2lpd9eaudi3n\.public\.blob\.vercel-storage\.com/products/[a-zA-Z0-9\-_]+\.(?:webp|jpg|png)') | ForEach-Object { $_.Value } | Select-Object -Unique
$imgs | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Main Sections in Miranda PDP ==="
$mainMatch = [regex]::Match($raw, '(?s)<main.*?</main>')
if ($mainMatch.Success) {
    Write-Host "Found <main> with length: $($mainMatch.Length)"
}
