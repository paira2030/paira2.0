$h = Get-Content -Path "tools\payra_header_extracted.html" -Raw -Encoding utf8

# Find all 8 mega menu blocks
$panels = [regex]::Matches($h, '(?s)<div class="absolute inset-x-0 top-full hidden border-b border-costura bg-papel shadow-\[[^\]]+\] lg:block pointer-events-none invisible".*?(?=(?:<div class="absolute inset-x-0 top-full hidden border-b border-costura bg-papel)|(?:</header>))')
Write-Host "Matched $($panels.Count) panels."

$deptNames = @("VERAO", "NOVIDADES", "VESTIDOS", "ROUPA", "CASACOS", "CONJUNTOS", "ACESSORIOS", "SALDOS")
for ($i = 0; $i -lt $panels.Count; $i++) {
    $outPath = "tools\megamenu_$($deptNames[$i]).html"
    [System.IO.File]::WriteAllText($outPath, $panels[$i].Value, [System.Text.Encoding]::UTF8)
    Write-Host "Saved $outPath ($($panels[$i].Value.Length) chars)"
}
