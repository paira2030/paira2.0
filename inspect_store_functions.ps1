$js = Get-Content -Path 'assets\js\store.js' -Raw -Encoding UTF8
Write-Host "store.js length: $($js.Length)"
$matches = [regex]::Matches($js, '(function [a-zA-Z0-9_]+|const [a-zA-Z0-9_]+ =|[a-zA-Z0-9_]+\s*:\s*function|[a-zA-Z0-9_]+\([^)]*\)\s*\{)')
foreach ($m in $matches) {
    if ($m.Value -like "*cart*" -or $m.Value -like "*Cart*" -or $m.Value -like "*addToCart*" -or $m.Value -like "*openDrawer*" -or $m.Value -like "*pdp*" -or $m.Value -like "*init*") {
        Write-Host $m.Value
    }
}
