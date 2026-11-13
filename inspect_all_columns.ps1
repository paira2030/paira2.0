$files = Get-ChildItem tools\megamenu_*.html
foreach ($f in $files) {
    Write-Host "================== $($f.Name) =================="
    $c = Get-Content $f.FullName -Raw -Encoding utf8
    # Extract columns
    $cols = [regex]::Matches($c, '(?s)<p class="label-etiqueta[^"]*">([^<]+)</p>\s*<ul[^>]*>(.*?)</ul>')
    foreach ($col in $cols) {
        Write-Host "COL: $($col.Groups[1].Value)"
        $links = [regex]::Matches($col.Groups[2].Value, '<a[^>]*>(.*?)</a>')
        foreach ($l in $links) {
            $txt = $l.Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' '
            Write-Host "   - $txt"
        }
    }
}
