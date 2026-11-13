$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

$regex = [regex]'<img[^>]+>'
$matches = $regex.Matches($content)
Write-Host "Found $($matches.Count) images:"
foreach ($m in $matches) {
    Write-Host $m.Value
}
