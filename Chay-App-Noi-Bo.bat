@echo off
title HDD FOOD - Mini App Noi Bo
color 0A
chcp 65001 >nul

echo =======================================================
echo    🥩 HDD FOOD - TRỢ LÝ ĐỊNH GIÁ VÀ CẢNH BÁO HẠN DÙNG
echo =======================================================
echo.
echo [1] Kiem tra may chu dang chay...

netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [OK] May chu dang hoat dong san tren cong 3000!
) else (
    echo [*] Dang khoi dong may chu backend Node.js...
    start /b node src/backend/server.js
    timeout /t 2 /nobreak >nul
)

echo.
echo =======================================================
echo  👉 Mo tren may tinh cua ban: http://localhost:3000
echo  👉 Mo tren dien thoai nhan vien (cung Wifi): http://192.168.1.115:3000
echo =======================================================
echo.
echo Dang tu dong mo trinh duyet...
start http://localhost:3000

pause
