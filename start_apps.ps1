# Laser Safety Applications Launcher
# Starts both the Next.js LMS (port 3000) and Streamlit app (port 8501)

param(
    [switch]$SkipDependencyCheck,
    [int]$NextJSPort = 3000,
    [int]$StreamlitPort = 8501
)

$NEXTJS_DIR = "laser-safety-lms"
$STREAMLIT_APP = "laser_hazard_app.py"
$REQUIREMENTS_FILE = "requirements.txt"

# Track processes for cleanup
$script:processes = @()

function Write-Header($text) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Write-Success($text) {
    Write-Host "  ✓ $text" -ForegroundColor Green
}

function Write-Error($text) {
    Write-Host "  ✗ $text" -ForegroundColor Red
}

function Write-Info($text) {
    Write-Host "  ℹ $text" -ForegroundColor Yellow
}

function Test-Command($command) {
    try {
        $null = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-PortInUse($port) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        $listener.Stop()
        return $false
    } catch {
        return $true
    }
}

function Wait-ForPort($port, $timeoutSeconds = 60) {
    $elapsed = 0
    while ($elapsed -lt $timeoutSeconds) {
        if (Test-PortInUse $port) {
            return $true
        }
        Start-Sleep -Seconds 1
        $elapsed++
    }
    return $false
}

function Install-NpmDependencies {
    Write-Info "Installing npm dependencies..."
    Push-Location $NEXTJS_DIR
    try {
        npm install | Out-String | Write-Host
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Success "npm dependencies installed"
        return $true
    } catch {
        Write-Error "Failed to install npm dependencies: $_"
        return $false
    } finally {
        Pop-Location
    }
}

function Install-PythonDependencies {
    Write-Info "Installing Python dependencies..."
    try {
        python -m pip install -r $REQUIREMENTS_FILE | Out-String | Write-Host
        if ($LASTEXITCODE -ne 0) {
            throw "pip install failed"
        }
        Write-Success "Python dependencies installed"
        return $true
    } catch {
        Write-Error "Failed to install Python dependencies: $_"
        return $false
    }
}

function Start-NextJS {
    Write-Info "Starting Next.js dev server on port $NextJSPort..."
    
    $env:PORT = $NextJSPort
    
    $process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $NEXTJS_DIR -PassThru -WindowStyle Normal
    $script:processes += $process
    return $process
}

function Start-Streamlit {
    Write-Info "Starting Streamlit app on port $StreamlitPort..."
    
    $process = Start-Process -FilePath "python" -ArgumentList "-m", "streamlit", "run", $STREAMLIT_APP, "--server.port=$StreamlitPort" -PassThru -WindowStyle Normal
    $script:processes += $process
    return $process
}

function Stop-AllProcesses {
    Write-Host ""
    Write-Header "Shutting down services..."
    
    foreach ($proc in $script:processes) {
        if ($proc -and -not $proc.HasExited) {
            try {
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Success "Stopped process $($proc.Id)"
            } catch {
                Write-Error "Failed to stop process $($proc.Id): $_"
            }
        }
    }
}

# Register cleanup
trap {
    Stop-AllProcesses
    break
}

# Main script
Write-Header "Laser Safety Applications Launcher"

Write-Host ""
Write-Host "Checking dependencies..."

# Check Python
if (-not (Test-Command "python")) {
    Write-Error "Python is not installed or not in PATH"
    exit 1
}
$pythonVersion = (python --version 2>&1)
Write-Success $pythonVersion

# Check Node.js
if (-not (Test-Command "node")) {
    Write-Error "Node.js is not installed or not in PATH"
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}
$nodeVersion = (node --version)
Write-Success "Node.js: $nodeVersion"

if (-not (Test-Command "npm")) {
    Write-Error "npm is not installed or not in PATH"
    exit 1
}
$npmVersion = (npm --version)
Write-Success "npm: $npmVersion"

# Check ports
Write-Host ""
Write-Host "Checking ports..."

if (Test-PortInUse $NextJSPort) {
    Write-Error "Port $NextJSPort is already in use"
    exit 1
}
Write-Success "Port $NextJSPort is available"

if (Test-PortInUse $StreamlitPort) {
    Write-Error "Port $StreamlitPort is already in use"
    exit 1
}
Write-Success "Port $StreamlitPort is available"

# Check/Install dependencies
if (-not $SkipDependencyCheck) {
    Write-Host ""
    Write-Host "Checking dependencies..."
    
    if (-not (Test-Path "$NEXTJS_DIR/node_modules") -or -not (Get-ChildItem "$NEXTJS_DIR/node_modules")) {
        if (-not (Install-NpmDependencies)) {
            exit 1
        }
    } else {
        Write-Success "npm dependencies already installed"
    }
    
    try {
        python -c "import streamlit" 2>$null
        Write-Success "Python dependencies already installed"
    } catch {
        if (-not (Install-PythonDependencies)) {
            exit 1
        }
    }
}

# Start services
Write-Host ""
Write-Header "Starting services..."

# Start Next.js
$nextjsProc = Start-NextJS
if (-not $nextjsProc) {
    exit 1
}

Write-Info "Waiting for Next.js to be ready..."
if (-not (Wait-ForPort $NextJSPort 60)) {
    Write-Error "Next.js failed to start within 60 seconds"
    Stop-AllProcesses
    exit 1
}
Start-Sleep -Seconds 2
Write-Success "Next.js is ready on port $NextJSPort"

# Start Streamlit
$streamlitProc = Start-Streamlit
if (-not $streamlitProc) {
    Stop-AllProcesses
    exit 1
}

Write-Info "Waiting for Streamlit to be ready..."
if (-not (Wait-ForPort $StreamlitPort 60)) {
    Write-Error "Streamlit failed to start within 60 seconds"
    Stop-AllProcesses
    exit 1
}
Start-Sleep -Seconds 2
Write-Success "Streamlit is ready on port $StreamlitPort"

# Print URLs
Write-Host ""
Write-Header "Applications are running!"
Write-Host ""
Write-Host "  🚀 Next.js LMS:       http://localhost:$NextJSPort"
Write-Host "  📊 Streamlit App:     http://localhost:$StreamlitPort"
Write-Host ""
Write-Host "  Close this window or press Ctrl+C to stop both services"
Write-Host "============================================================"
Write-Host ""

# Wait for user input
Write-Host "Press Enter to stop all services..."
$null = [Console]::ReadLine()

Stop-AllProcesses
