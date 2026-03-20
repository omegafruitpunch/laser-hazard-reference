@echo off
setlocal EnableDelayedExpansion

echo ============================================================
echo   Laser Safety LMS Launcher
echo ============================================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Get it from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do echo [OK] Node.js: %%a
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)
for /f "tokens=*" %%a in ('npm --version') do echo [OK] npm: %%a

echo.
REM Check port 3000
netstat -ano | findstr ":3000 " >nul
if %errorlevel% equ 0 (
    echo [ERROR] Port 3000 is already in use
    exit /b 1
)
echo [OK] Port 3000 is available

echo.
REM Install npm deps if needed
if not exist "laser-safety-lms\node_modules\" (
    echo Installing npm dependencies...
    cd laser-safety-lms
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ============================================================
echo   Starting Laser Safety LMS...
echo ============================================================
echo.

start "Laser Safety LMS (Port 3000)" cmd /c "cd laser-safety-lms && npm run dev && pause"

echo [INFO] Waiting for server to be ready...
call :wait_for_port 3000 60
if %errorlevel% neq 0 (
    echo [ERROR] Next.js failed to start within 60 seconds
    exit /b 1
)

echo.
echo ============================================================
echo   Laser Safety LMS is running!
echo ============================================================
echo.
echo   http://localhost:3000
echo.
echo   Close the command window to stop
echo ============================================================
echo.
pause
exit /b 0

:wait_for_port
set port=%1
set timeout_sec=%2
set counter=0
:wait_loop
netstat -ano | findstr ":%port% " >nul
if %errorlevel% equ 0 exit /b 0
timeout /t 1 /nobreak >nul
set /a counter+=1
if %counter% geq %timeout_sec% exit /b 1
goto wait_loop
