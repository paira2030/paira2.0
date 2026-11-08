$mirandaImgs = @(
    @{ Url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/f66dad843885f78ff808-lg.webp"; Path = "assets\images\produtos\vestidos\miranda-01-frente.webp" },
    @{ Url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/808d5f798174f7a1603a-lg.webp"; Path = "assets\images\produtos\vestidos\miranda-02-angulo.webp" },
    @{ Url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/ccb84a29522784555eeb-lg.webp"; Path = "assets\images\produtos\vestidos\miranda-03-detalhe.webp" },
    @{ Url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/98cc521b2d3e34a32bb0-lg.webp"; Path = "assets\images\produtos\vestidos\miranda-04-costas.webp" },
    @{ Url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/39764c8da4a63f746870-lg.webp"; Path = "assets\images\produtos\vestidos\miranda-05-lifestyle.webp" }
)

foreach ($item in $mirandaImgs) {
    if (-not (Test-Path $item.Path)) {
        Write-Host "Downloading $($item.Path)..."
        & curl.exe -s -L -m 15 $item.Url -o $item.Path
    } else {
        Write-Host "Already exists: $($item.Path)"
    }
}
