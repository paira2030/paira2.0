$bytes = [System.IO.File]::ReadAllBytes("c:\Users\kikit\Desktop\payla\tools\miranda_main.html")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Search for "malha canelada para"
$m = [regex]::Match($content, 'Vestido maxi Miranda em malha canelada para mulheres.*?O que dizem', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($m.Success) {
    Write-Host "Found description block length: $($m.Value.Length)"
    Write-Host $m.Value
} else {
    Write-Host "Not matched via regex"
}
