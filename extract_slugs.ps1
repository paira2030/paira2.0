$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

# Find product links and context
$prodRegex = [regex]'/produto/([a-z0-9\-]+)'
$matches = $prodRegex.Matches($raw)
$slugs = @()
foreach ($m in $matches) {
    if (-not $slugs.Contains($m.Groups[1].Value)) {
        $slugs += $m.Groups[1].Value
    }
}

Write-Host "Unique product slugs found: $($slugs.Count)"
$slugs | ForEach-Object { Write-Host $_ }
