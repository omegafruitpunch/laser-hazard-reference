@echo off
setlocal EnableDelayedExpansion

echo ============================================================
echo   Laser Safety Applications Launcher
echo ============================================================
echo.

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    exit /b 1
)
for /f "tokens=*" %%a in ('python --version 2^>^&1') do echo [OK] %%a

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do echo [OK] Node.js: %%a
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH
    exit /b 1
)
for /f "tokens=*" %%a in ('npm --version') do echo [OK] npm: %%a

echo.
echo Checking ports...

REM Check port 3000
netstat -ano | findstr ":3000 " >nul
if %errorlevel% equ 0 (
    echo [ERROR] Port 3000 is already in use
    exit /b 1
)
echo [OK] Port 3000 is available

REM Check port 8501
netstat -ano | findstr ":8501 " >nul
if %errorlevel% equ 0 (
    echo [ERROR] Port 8501 is already in use
    exit /b 1
)
echo [OK] Port 8501 is available

echo.
echo Checking dependencies...

REM Check if node_modules exists
if not exist "laser-safety-lms\node_modules\" (
    echo Installing npm dependencies...
    cd laser-safety-lms
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies
        exit /b 1
    )
    cd ..
) else (
    echo [OK] npm dependencies already installed
)

REM Check Python dependencies (simple check for streamlit)
python -c "import streamlit" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Python dependencies...
    python -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Python dependencies
        exit /b 1
    )
) else (
    echo [OK] Python dependencies already installed
)

echo.
echo ============================================================
echo   Starting services...
echo ============================================================
echo.

REM Start Next.js in a new window
start "Next.js LMS (Port 3000)" cmd /c "cd laser-safety-lms && echo Starting Next.js... && npm run dev && pause"

echo [OK] Next.js starting in new window...
echo [INFO] Waiting for Next.js to be ready...

REM Wait for port 3000 to be ready
call :wait_for_port 3000 60
if %errorlevel% neq 0 (
    echo [ERROR] Next.js failed to start within 60 seconds
    exit /b 1
)
echo [OK] Next.js is ready on port 3000

REM Start Streamlit in a new window
start "Streamlit App (Port 8501)" cmd /c "echo Starting Streamlit... && python -m streamlit run laser_hazard_app.py --server.port=8501 && pause"

echo [OK] Streamlit starting in new window...
echo [INFO] Waiting for Streamlit to be ready...

REM Wait for port 8501 to be ready
call :wait_for_port 8501 60
if %errorlevel% neq 0 (
    echo [ERROR] Streamlit failed to start within 60 seconds
    exit /b 1
)
echo [OK] Streamlit is ready on port 8501

echo.
echo ============================================================
echo   Applications are running!
echo ============================================================
echo.
echo   Next.js LMS:       http://localhost:3000
echo   Streamlit App:     http://localhost:8501
echo.
echo   Close the command windows to stop the services
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
