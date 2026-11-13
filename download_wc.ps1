$url1 = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/50eb08607b5b3c9e5fd0-sm.webp"
$dest1 = "assets\images\produtos\acessorios\francia-small-woven-tote-bag.webp"
$url2 = "https://rrdy2lpd9eaudi3n.public.blob.vercel-storage.com/products/1cb5e060ba7468df70f9-sm.webp"
$dest2 = "assets\images\produtos\acessorios\sophia-striped-shoulder-bag.webp"

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")
$wc.DownloadFile($url1, (Resolve-Path .).Path + "\" + $dest1)
$wc.DownloadFile($url2, (Resolve-Path .).Path + "\" + $dest2)

Get-ChildItem assets\images\produtos\acessorios
