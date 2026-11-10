$path = "index.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Replace common mojibake sequences
$fixes = @{
    "VERÃƒO" = "VERÃO"
    "VERÃo" = "VERÃO"
    "ACESSÃ“RIOS" = "ACESSÓRIOS"
    "pÃ¡gina" = "página"
    "LogÃ³tipo" = "Logótipo"
    "NavegaÃ§Ã£o" = "Navegação"
    "IdÃªnticos" = "Idênticos"
    "AÃ§Ãµes" = "Ações"
    "ExpansÃ­vel" = "Expansível"
    "ediÃ§Ã£o" = "edição"
    "estaÃ§Ã£o" = "estação"
    "ColeÃ§Ã£o" = "Coleção"
    "VerÃ£o" = "Verão"
    "Ã ntimo" = "Íntimo"
    "BordÃ´" = "Bordô"
    "preÃ§o" = "preço"
    "calÃ§oes" = "calções"
    "calÃ§ões" = "calções"
    "calÃ§as" = "calças"
    "peÃ§as" = "peças"
    "Ãšltimas" = "Últimas"
    "blusÃµes" = "blusões"
    "ClÃ¡ssicos" = "Clássicos"
    "mÃ£o" = "mão"
    "Ã“culos" = "Óculos"
    "ChapÃ©us" = "Chapéus"
    "acessÃ³rios" = "acessórios"
}

foreach ($key in $fixes.Keys) {
    $content = $content.Replace($key, $fixes[$key])
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
Write-Host "Cleaned UTF8 encoding in index.html!"
