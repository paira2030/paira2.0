$idx = Get-Content -Path 'index.html' -Raw -Encoding UTF8

$annIdx = $idx.IndexOf('id="announcement-bar"')
$headerIdx = $idx.IndexOf('<header')
$mainIdx = $idx.IndexOf('<main')
$footerIdx = $idx.IndexOf('<footer')
$cartDrawerIdx = $idx.IndexOf('id="cart-drawer"')
$checkoutModalIdx = $idx.IndexOf('id="checkout-modal"')

Write-Host "announcement-bar: $annIdx"
Write-Host "header: $headerIdx"
Write-Host "main: $mainIdx"
Write-Host "footer: $footerIdx"
Write-Host "cart-drawer: $cartDrawerIdx"
Write-Host "checkout-modal: $checkoutModalIdx"
