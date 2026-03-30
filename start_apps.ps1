# Laser Safety LMS Launcher
# Starts the Next.js LMS on port 3000

param(
    [switch]$SkipDependencyCheck,
    [int]$NextJSPort = 3000
)

$NEXTJS_DIR = "laser-safety-lms"
$script:processes = @()

function Write-Header($text) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}
function Write-Success($text) { Write-Host "  ✓ $text" -ForegroundColor Green }
function Write-Err($text)     { Write-Host "  ✗ $text" -ForegroundColor Red }
function Write-Info($text)    { Write-Host "  ℹ $text" -ForegroundColor Yellow }

function Test-Command($command) {
    try { $null = Get-Command $command -ErrorAction Stop; return $true } catch { return $false }
}

function Test-PortInUse($port) {
    try {
        $l = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $l.Start(); $l.Stop(); return $false
    } catch { return $true }
}

function Wait-ForPort($port, $timeoutSeconds = 60) {
    $elapsed = 0
    while ($elapsed -lt $timeoutSeconds) {
        if (Test-PortInUse $port) { return $true }
        Start-Sleep -Seconds 1; $elapsed++
    }
    return $false
}

function Stop-AllProcesses {
    Write-Header "Shutting down..."
    foreach ($proc in $script:processes) {
        if ($proc -and -not $proc.HasExited) {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

trap { Stop-AllProcesses; break }

Write-Header "Laser Safety LMS Launcher"

# Check Node.js
if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
    Write-Err "Node.js/npm not found. Install from https://nodejs.org/"
    exit 1
}
Write-Success "Node.js: $(node --version)  |  npm: $(npm --version)"

# Check port
if (Test-PortInUse $NextJSPort) {
    Write-Err "Port $NextJSPort is already in use"
    exit 1
}
Write-Success "Port $NextJSPort is available"

# Install deps if needed
if (-not $SkipDependencyCheck) {
    if (-not (Test-Path "$NEXTJS_DIR/node_modules") -or -not (Get-ChildItem "$NEXTJS_DIR/node_modules")) {
        Write-Info "Installing npm dependencies..."
        Push-Location $NEXTJS_DIR
        npm install | Out-String | Write-Host
        Pop-Location
        if ($LASTEXITCODE -ne 0) { Write-Err "npm install failed"; exit 1 }
        Write-Success "Dependencies installed"
    } else {
        Write-Success "Dependencies already installed"
    }
}

# Start Next.js
Write-Header "Starting Laser Safety LMS..."
$env:PORT = $NextJSPort
$proc = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $NEXTJS_DIR -PassThru -WindowStyle Normal
$script:processes += $proc

Write-Info "Waiting for server to be ready..."
if (-not (Wait-ForPort $NextJSPort 60)) {
    Write-Err "Server failed to start within 60 seconds"
    Stop-AllProcesses; exit 1
}
Start-Sleep -Seconds 2

Write-Header "Laser Safety LMS is running!"
Write-Host ""
Write-Host "  http://localhost:$NextJSPort"
Write-Host ""
Write-Host "  Press Enter to stop"
Write-Host "============================================================"

$null = [Console]::ReadLine()
Stop-AllProcesses
