@echo off
REM ===================================================================
REM Setup Mobile Device Access
REM This script helps you configure your backend to accept connections
REM from mobile devices on the same WiFi network
REM ===================================================================

echo.
echo ========================================
echo  Snake Rescue - Mobile Access Setup
echo ========================================
echo.

REM Get computer's IP address
echo Finding your computer's IP address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Found IP: !IP!
)

echo.
echo ========================================
echo  Your Computer's IP Address
echo ========================================
echo.
echo   !IP!
echo.
echo ========================================
echo.

echo NEXT STEPS:
echo.
echo 1. Open: apps\backend\.env.local
echo.
echo 2. Find this line:
echo    CORS_ORIGINS=....,http://192.168.1.100:4200
echo.
echo 3. Replace 192.168.1.100 with: !IP!
echo.
echo 4. Save the file
echo.
echo 5. Restart backend: yarn dev:backend
echo.
echo 6. On your mobile device:
echo    - Make sure you're on the SAME WiFi
echo    - Open browser
echo    - Go to: http://!IP!:4200
echo.

pause
