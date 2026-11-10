$json = Get-Content -Path "data\products.json" -Raw -Encoding utf8 | ConvertFrom-Json
$missingCount = 0
foreach ($p in $json) {
    $path = $p.localImage.Replace('/', '\')
    if (-not (Test-Path $path)) {
        Write-Host "Missing: $path"
        $filter = "$($p.slug).webp"
        $found = Get-ChildItem -Recurse -Path "assets\images" -Filter $filter
        if ($found) {
            Write-Host "Found at $($found[0].FullName) -> Copying to $path"
            Copy-Item $found[0].FullName $path -Force
        } else {
            $missingCount++
        }
    } else {
        Write-Host "OK: $path"
    }
}
Write-Host "Verification complete. Missing: $missingCount"
