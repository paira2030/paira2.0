$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$prods = [regex]::Matches($raw, '\{[^{}]*"title":"([^"]+)"[^{}]*"slug":"([^"]+)"[^{}]*\}')
Write-Host "Found $($prods.Count) matches by title/slug regex."
if ($prods.Count -eq 0) {
    # Let's search for "slug" or "/produto/"
    $slugMatches = [regex]::Matches($raw, '"/produto/([^"]+)"')
    Write-Host "Found $($slugMatches.Count) slug matches."
    $slugMatches | ForEach-Object { Write-Host $_.Groups[1].Value } | Select-Object -Unique
}
