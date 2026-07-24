# LaunchSaaS CLI - Windows Bootstrap Installer
# Run with: irm https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.ps1 | iex

$ErrorActionPreference = "Stop"
$REPO = "LaunchSaasOrg/launchsaas-cli"

function Write-Info    { param($msg) Write-Host "  -> $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "  v $msg"  -ForegroundColor Green }
function Write-Warn    { param($msg) Write-Host "  ! $msg"  -ForegroundColor Yellow }
function Write-Err     { param($msg) Write-Host "  x $msg"  -ForegroundColor Red }

Write-Host ""
Write-Host "  LaunchSaaS CLI - Bootstrap Installer" -ForegroundColor Cyan -NoNewline
Write-Host ""
Write-Host ""

# ─── Fix execution policy ────────────────────────────────────────────────────
$policy = Get-ExecutionPolicy -Scope CurrentUser
if ($policy -eq "Restricted") {
    Write-Info "Fixing PowerShell execution policy..."
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Success "Execution policy updated"
}

# ─── Check for winget ────────────────────────────────────────────────────────
$hasWinget = $null -ne (Get-Command winget -ErrorAction SilentlyContinue)
$hasChoco  = $null -ne (Get-Command choco  -ErrorAction SilentlyContinue)

if (-not $hasWinget -and -not $hasChoco) {
    Write-Err "No package manager found (winget or choco)."
    Write-Info "Please install 'App Installer' from the Microsoft Store to get winget:"
    Write-Host "  https://apps.microsoft.com/detail/9NBLGGH4NNS1" -ForegroundColor Cyan
    Write-Info "Then re-run this installer."
    exit 1
}

$pm = if ($hasWinget) { "winget" } else { "choco" }
Write-Info "Using $pm as package manager"

# ─── Install Node.js if needed ───────────────────────────────────────────────
$nodeOk = $false
try {
    $nodeVer = (node --version 2>$null)
    if ($nodeVer -match "v(\d+)") {
        $nodeOk = [int]$Matches[1] -ge 20
    }
} catch {}

if (-not $nodeOk) {
    Write-Warn "Node.js 20+ not found. Installing via fnm..."

    if ($pm -eq "winget") {
        winget install Schniz.fnm --silent --accept-package-agreements --accept-source-agreements | Out-Null
    } else {
        choco install fnm -y | Out-Null
    }

    # Refresh PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("PATH", "User")

    fnm install 20 | Out-Null
    fnm use 20     | Out-Null
    fnm default 20 | Out-Null

    # Refresh PATH again after fnm
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("PATH", "User")

    Write-Success "Node.js installed"
} else {
    Write-Success "Node.js $nodeVer already installed"
}

# ─── Install launchsaas-cli from GitHub ──────────────────────────────────────
Write-Info "Installing launchsaas-cli..."
npm install -g "github:$REPO" --silent 2>$null
if ($LASTEXITCODE -ne 0) {
    npm install -g "github:$REPO"
}
Write-Success "launchsaas-cli installed"

Write-Host ""
Write-Host "  Setup complete! Starting LaunchSaaS initialization..." -ForegroundColor Green
Write-Host ""

# ─── Run init ────────────────────────────────────────────────────────────────
launchsaas-cli init
