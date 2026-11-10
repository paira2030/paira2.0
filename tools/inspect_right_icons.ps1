$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

$idx = $h.IndexOf('aria-label="Abrir pesquisa"')
if ($idx -gt 0) {
    Write-Host "Search context:"
    Write-Host $h.Substring($idx - 50, 800)
} else {
    # Search for right buttons
    $matches = [regex]::Matches($h, '(?s)<div class="flex items-center gap-[^"]*">.*?</div>\s*</div>\s*<div class="absolute inset-x-0')
    if ($matches.Count -gt 0) {
        Write-Host "Right buttons context:"
        Write-Host $matches[0].Value
    }
}
