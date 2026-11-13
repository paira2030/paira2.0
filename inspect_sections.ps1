$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$sections = [regex]::Matches($raw, '(?s)<section.*?</section>')
Write-Host "Found $($sections.Count) sections on page."
for ($i = 0; $i -lt $sections.Count; $i++) {
    Write-Host "--- Section $i ---"
    $sec = $sections[$i].Value
    $firstLine = $sec.Substring(0, [Math]::Min(300, $sec.Length)) -replace '\s+', ' '
    Write-Host $firstLine
}
