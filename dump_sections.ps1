$content = Get-Content -Path 'tools\miranda_main.html' -Raw -Encoding UTF8

# Let's inspect the exact reviews and specs
$rev = [regex]::Match($content, '<section id="avaliacoes".*?</section>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($rev.Success) {
    Write-Host "REVIEWS SECTION:"
    Write-Host $rev.Value
}

$cross = [regex]::Match($content, '<section aria-label="Completa o look".*?</section>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($cross.Success) {
    Write-Host "`nCROSS SELL SECTION:"
    Write-Host $cross.Value
}
