$idx = Get-Content -Path 'index.html' -Raw -Encoding UTF8

Write-Host "Index.html length: $($idx.Length)"

# Let's inspect the head and top of index.html
$head = $idx.Substring(0, 1500)
Write-Host $head
