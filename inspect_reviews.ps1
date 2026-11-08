$main = Get-Content -Path "tools\miranda_main.html" -Raw -Encoding utf8

# Check reviews
$revMatch = [regex]::Match($main, '(?s)<section[^>]*aria-label="Avaliações[^"]*"[^>]*>.*?</section>')
if (-not $revMatch.Success) {
    # Find text around "O que dizem as clientes"
    $idx = $main.IndexOf('O que dizem as clientes')
    if ($idx -gt 0) {
        Write-Host "=== Reviews Block ==="
        Write-Host $main.Substring($idx, [Math]::Min(3000, $main.Length - $idx))
    }
}
