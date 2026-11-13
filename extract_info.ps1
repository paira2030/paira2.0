$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

Write-Host "=== JSON LD Data ==="
if ($raw -match '(?s)<script type="application/ld\+json">(.*?)</script>') {
    Write-Host $matches[1]
}

Write-Host "`n=== Links found ==="
$links = [regex]::Matches($raw, 'href="(/[^"#?]+)"') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
$links | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Sample Products / Slugs ==="
$prodSlugs = [regex]::Matches($raw, '/produtos/([a-zA-Z0-9\-_]+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
$prodSlugs | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Sample Categories ==="
$catSlugs = [regex]::Matches($raw, '/categoria/([a-zA-Z0-9\-_]+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
$catSlugs | ForEach-Object { Write-Host $_ }
