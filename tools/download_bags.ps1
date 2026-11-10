$bags = @(
    @{ url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/50eb08607b5b3c9e5fd0-sm.webp"; dest = "assets\images\produtos\acessorios\francia-small-woven-tote-bag.webp" },
    @{ url = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/1cb5e060ba7468df70f9-sm.webp"; dest = "assets\images\produtos\acessorios\sophia-striped-shoulder-bag.webp" }
)

foreach ($b in $bags) {
    Write-Host "Downloading $($b.url) to $($b.dest)"
    & curl.exe -s -L -A "Mozilla/5.0" -o $b.dest $b.url
}

Get-ChildItem assets\images\produtos\acessorios
