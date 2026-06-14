# ZOE Sustainability Platform — Windows (PowerShell): install + start.
#
# Run ONE command from the project root in PowerShell:
#     powershell -ExecutionPolicy Bypass -File setup\windows.ps1
#
# (If you opened the folder in Windows Terminal / PowerShell, just run:
#     .\setup\windows.ps1 )
#
# What it does (safe — read-only against the shared database, deletes nothing):
#   1. Checks Node.js (installs Node 22 LTS via winget if missing)
#   2. Creates the frontend .env from the template if missing
#   3. Verifies backend\.env exists (the DB secrets — request them by email)
#   4. Installs frontend + backend dependencies, generates the Prisma client
#   5. Starts the backend (:3001) in a new window and the frontend (:5173) here

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Write-Ok   ($m) { Write-Host "  [OK] $m"   -ForegroundColor Green }
function Write-Warn ($m) { Write-Host "  [!]  $m"   -ForegroundColor Yellow }
function Write-Err  ($m) { Write-Host "  [X]  $m"   -ForegroundColor Red }

Write-Host "ZOE - Windows setup & start" -ForegroundColor Cyan
Write-Host ""

# -- 1. Node.js (install via winget if missing) -------------------------------
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Warn "Node.js not found - installing Node 22 LTS via winget..."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    Write-Warn "Node was just installed. CLOSE this window, open a NEW PowerShell, and run the script again."
    exit 1
  } else {
    Write-Err "winget is unavailable. Install Node 22 LTS manually from https://nodejs.org and re-run."
    exit 1
  }
}
$NodeMajor = [int]((node -v) -replace '^v(\d+).*','$1')
if ($NodeMajor -lt 20) {
  Write-Err "Node $(node -v) is too old - Vite 8 needs Node >= 20.19 (22 LTS recommended)."
  exit 1
}
Write-Ok "Node $(node -v)"

# -- 2. Frontend .env (not secret - just the local API URL) -------------------
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Ok "Created .env from .env.example"
} else {
  Write-Ok ".env present"
}

# -- 3. Backend .env (SECRET - cannot be auto-created) ------------------------
if (-not (Test-Path "backend\.env")) {
  Write-Err "backend\.env is MISSING - it holds the database & Supabase credentials."
  Write-Host "       Request the file from:  anshul.agrawal@fau.de"
  Write-Host "       Place it at:            $Root\backend\.env"
  exit 1
}
Write-Ok "backend\.env present"

# -- 4. Dependencies + Prisma client ------------------------------------------
if (-not (Test-Path "node_modules")) {
  Write-Host ""; Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
  npm install
}
Write-Ok "Frontend dependencies ready"
if (-not (Test-Path "backend\node_modules")) {
  Write-Host ""; Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
  Push-Location backend; npm install; Pop-Location
}
Push-Location backend; npx prisma generate | Out-Null; Pop-Location
Write-Ok "Backend dependencies + Prisma client ready"

# -- 5. Start both servers ----------------------------------------------------
Write-Host ""
Write-Host "Starting..." -ForegroundColor Cyan
Write-Host "  Backend  -> http://localhost:3001  (opens in a new window)"
Write-Host "  Frontend -> http://localhost:5173  (this window)"
Write-Host "  Close the backend window or press Ctrl+C in each to stop."
Write-Host ""

# Backend in a separate window so both run at once.
Start-Process powershell -ArgumentList "-NoExit","-Command","Set-Location '$Root\backend'; npm run dev"
# Frontend in the foreground.
npm run dev
