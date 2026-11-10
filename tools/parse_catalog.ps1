$raw = Get-Content -Path "payra_home.html" -Raw -Encoding utf8

$articles = [regex]::Matches($raw, '(?s)<article[^>]*>(.*?)</article>')
Write-Host "Found $($articles.Count) article cards."

$catalog = @()
$euro = [char]0x20AC

foreach ($art in $articles) {
    $content = $art.Groups[1].Value
    $slug = ""
    $title = ""
    $price = ""
    $img = ""
    $tag = ""

    if ($content -match 'href="/produto/([^"]+)"') { $slug = $matches[1] }
    if ($content -match '<h3[^>]*>([^<]+)</h3>') { $title = $matches[1] }
    if ($content -match '([0-9]+[,\.][0-9]{2}\s*(&euro;|' + $euro + '))') { $price = $matches[1] }
    if ($content -match 'src="(https://[^"]+)"') { $img = $matches[1] }
    if ($content -match 'class="etiqueta[^"]*">([^<]+)</span>') { $tag = $matches[1] }

    if ($title -ne "") {
        $catalog += [PSCustomObject]@{
            Slug = $slug
            Title = $title
            Price = $price
            Tag = $tag
        }
    }
}

Write-Host "Extracted $($catalog.Count) products:"
$catalog | Format-Table -AutoSize
