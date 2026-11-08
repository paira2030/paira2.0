$main = Get-Content -Path "tools\miranda_main.html" -Raw -Encoding utf8

$idx = $main.IndexOf('O que dizem as clientes')
if ($idx -gt 0) {
    $revSection = $main.Substring($idx, [Math]::Min(5000, $main.Length - $idx))
    $reviews = [regex]::Matches($revSection, '(?s)<article[^>]*>(.*?)</article>')
    Write-Host "Found $($reviews.Count) customer review articles:"
    foreach ($r in $reviews) {
        Write-Host "--- Review ---"
        Write-Host ($r.Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ')
    }
}
