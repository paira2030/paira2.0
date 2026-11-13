Get-ChildItem -Path assets\images -Recurse -File | Select-Object FullName, Length | Format-Table -AutoSize
