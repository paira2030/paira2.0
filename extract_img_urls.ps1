$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

$regex = [regex]'<img[^>]+src="([^"]+)"[^>]*alt="([^"]+)"'
$matches = $regex.Matches($content)
foreach ($m in $matches) {
    Write-Host "ALT: $($m.Groups[2].Value)"
    Write-Host "SRC: $($m.Groups[1].Value)`n"
}
