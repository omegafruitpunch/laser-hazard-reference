# Laser Safety LMS - Startup Guide

## Quick Start

### Option 1: Python (Recommended - Cross-Platform)

```bash
python start_apps.py
```

### Option 2: PowerShell (Windows)

```powershell
.\start_apps.ps1

# Skip dependency check (faster)
.\start_apps.ps1 -SkipDependencyCheck

# Custom port
.\start_apps.ps1 -NextJSPort 3001
```

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 3: Batch Script (Windows)

Double-click `start_apps.bat` or run from Command Prompt:
```cmd
start_apps.bat
```

### Option 4: Bash (Linux/macOS)

```bash
chmod +x start_apps.sh
./start_apps.sh
```

## Manual Startup

```bash
cd laser-safety-lms
npm install   # first time only
npm run dev
```

Open http://localhost:3000

## Application URL

| Application | URL |
|-------------|-----|
| Laser Safety LMS | http://localhost:3000 |

## Troubleshooting

### Port 3000 Already in Use

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Node.js Not Found

Install from https://nodejs.org/

### Permission Denied (Unix/macOS)

```bash
chmod +x start_apps.sh start_apps.py
```

## Stopping

- **Python/Bash:** `Ctrl+C`
- **Batch:** Close the command window
- **PowerShell:** Press `Enter`

## Legacy Streamlit App

The previous Streamlit application has been archived to `legacy/` for reference.
