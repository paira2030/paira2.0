@echo off
title PAIRA LISBOA - E-commerce & Painel ADM
color 0A
echo =========================================================
echo       PAIRA LISBOA - MODA FEMININA CONTEMPORANEA
echo =========================================================
echo.
echo A iniciar o servidor local e a abrir a loja no seu navegador...
echo.
echo Loja Principal: http://localhost:3000/
echo Painel ADM:     http://localhost:3000/admin.html (PIN: paira2026)
echo.
powershell -ExecutionPolicy Bypass -File server.ps1
pause
