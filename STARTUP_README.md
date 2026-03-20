# Laser Safety Applications - Startup Guide

This directory contains multiple startup scripts to run both the Next.js LMS and Streamlit app together.

## Quick Start

### Option 1: Python Script (Recommended - Cross-Platform)

Works on Windows, macOS, and Linux:

```bash
# Make executable (Unix/macOS only)
chmod +x start_apps.py

# Run
python start_apps.py
```

Or on Windows:
```powershell
python start_apps.py
```

### Option 2: PowerShell (Windows)

```powershell
# Run with default settings
.\start_apps.ps1

# Or with custom ports
.\start_apps.ps1 -NextJSPort 3001 -StreamlitPort 8502

# Skip dependency check (faster startup)
.\start_apps.ps1 -SkipDependencyCheck
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 3: Batch Script (Windows - Simplest)

Double-click `start_apps.bat` or run from Command Prompt:

```cmd
start_apps.bat
```

### Option 4: Bash Script (Linux/macOS)

```bash
# Make executable
chmod +x start_apps.sh

# Run
./start_apps.sh
```

## What the Scripts Do

1. **Check Prerequisites**
   - Verify Python is installed
   - Verify Node.js/npm is installed
   - Check if ports 3000 and 8501 are available

2. **Install Dependencies** (if needed)
   - Run `npm install` in `laser-safety-lms/` directory
   - Run `pip install -r requirements.txt`

3. **Start Services**
   - Start Next.js dev server on port 3000
   - Wait for it to be ready
   - Start Streamlit app on port 8501
   - Wait for it to be ready

4. **Provide Access Information**
   - Display URLs for both applications
   - Handle graceful shutdown on Ctrl+C

## Application URLs

Once started, access your applications at:

| Application | URL |
|-------------|-----|
| Next.js LMS | http://localhost:3000 |
| Streamlit App | http://localhost:8501 |

## Troubleshooting

### Port Already in Use

If you see an error about ports being in use:

**Windows:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

Or use custom ports with the PowerShell script:
```powershell
.\start_apps.ps1 -NextJSPort 3001 -StreamlitPort 8502
```

### Python Not Found

Make sure Python is installed and in your PATH:
- **Windows:** Install from https://python.org and check "Add Python to PATH"
- **macOS:** `brew install python3` or install from python.org
- **Linux:** `sudo apt-get install python3 python3-pip` (Ubuntu/Debian)

### Node.js Not Found

Install Node.js from https://nodejs.org/

### Permission Denied (Unix/macOS)

```bash
chmod +x start_apps.py
chmod +x start_apps.sh
```

### Dependencies Fail to Install

Try manually installing:

```bash
# Python dependencies
pip install -r requirements.txt

# npm dependencies
cd laser-safety-lms
npm install
cd ..
```

## Manual Startup (If Scripts Don't Work)

If the automated scripts don't work for your setup, start the services manually:

**Terminal 1 (Next.js):**
```bash
cd laser-safety-lms
npm run dev
```

**Terminal 2 (Streamlit):**
```bash
python -m streamlit run laser_hazard_app.py --server.port=8501
```

## Script Comparison

| Script | Platform | Features | Best For |
|--------|----------|----------|----------|
| `start_apps.py` | All | Full control, cross-platform, graceful shutdown | Everyone |
| `start_apps.ps1` | Windows | Custom ports, parameter support | PowerShell users |
| `start_apps.bat` | Windows | Simple, separate windows | Windows beginners |
| `start_apps.sh` | Unix/macOS | Simple, clean output | Linux/macOS users |

## Stopping the Applications

- **Python/Bash scripts:** Press `Ctrl+C` in the terminal
- **Batch script:** Close the command windows or press any key
- **PowerShell script:** Press `Enter` or close the window
- **Manual method:** Press `Ctrl+C` in each terminal window

## Support

If you encounter issues:
1. Check the error messages in the terminal
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 8501 are available
4. Try manual startup to isolate the issue
