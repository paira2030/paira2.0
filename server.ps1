# MAELLE LISBOA - Servidor HTTP Local Nativo
param([int]$port = 3000)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " MAELLE LISBOA - Loja Online Ativa em: $prefix" -ForegroundColor Yellow
    Write-Host " Painel ADM & developers.mypos: ${prefix}admin.html" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Pressione Ctrl+C para encerrar o servidor."
} catch {
    Write-Host "Falha ao iniciar na porta $port. Tentando porta 8080..." -ForegroundColor Red
    $port = 8080
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "Ativo em: $prefix" -ForegroundColor Yellow
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".webp" = "image/webp"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Abrir automaticamente no navegador
Start-Process $prefix

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ($urlPath -eq '' -or $urlPath -eq '/') {
        $urlPath = 'index.html'
    }

    $filePath = Join-Path (Get-Location) ($urlPath -replace '/', [IO.Path]::DirectorySeparatorChar)

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType

        $bytes = [IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [Text.Encoding]::UTF8.GetBytes("Ficheiro nao encontrado: $urlPath")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }

    $response.OutputStream.Close()
}
