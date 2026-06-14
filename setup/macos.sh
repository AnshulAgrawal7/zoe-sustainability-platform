#!/usr/bin/env bash
#
# ZOE Sustainability Platform — macOS: install everything + start the app.
#
# Run ONE command from the project root:
#     bash setup/macos.sh
#
# What it does (safe — read-only against the shared database, deletes nothing):
#   1. Checks Node.js (installs via Homebrew if missing)
#   2. Creates the frontend .env from the template if missing
#   3. Verifies backend/.env exists (the DB secrets — request them by email)
#   4. Installs frontend + backend dependencies, generates the Prisma client
#   5. Starts the backend (:3001) and the frontend (:5173) — Ctrl+C stops both
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
err()  { printf "  \033[31m✗\033[0m %s\n" "$1" >&2; }

bold "ZOE — macOS setup & start"
echo

# ── 1. Node.js ───────────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  warn "Node.js not found."
  if command -v brew >/dev/null 2>&1; then
    bold "Installing Node.js via Homebrew…"
    brew install node
  else
    err "Homebrew is not installed, so Node cannot be installed automatically."
    echo "    Install Homebrew first (https://brew.sh), then re-run this script:"
    echo '    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
  fi
fi
NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  err "Node $(node -v) is too old — Vite 8 needs Node >= 20.19 (22 LTS recommended)."
  echo "    brew upgrade node"
  exit 1
fi
ok "Node $(node -v)"

# ── 2. Frontend .env (not secret — just the local API URL) ───────────────────
if [ ! -f ".env" ]; then
  cp .env.example .env
  ok "Created .env from .env.example"
else
  ok ".env present"
fi

# ── 3. Backend .env (SECRET — cannot be auto-created) ────────────────────────
if [ ! -f "backend/.env" ]; then
  err "backend/.env is MISSING — it holds the database & Supabase credentials."
  echo "    1. Request the file from:  anshul.agrawal@fau.de"
  echo "    2. Save it as:             $ROOT/backend/.env"
  echo "       (Use the file you received as-is. Do NOT edit .env.example.)"
  echo "    See README → 'Step 1' for details."
  exit 1
fi
ok "backend/.env present"

# ── 4. Dependencies + Prisma client ──────────────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo; bold "Installing frontend dependencies…"; npm install
fi
ok "Frontend dependencies ready"
if [ ! -d "backend/node_modules" ]; then
  echo; bold "Installing backend dependencies…"; ( cd backend && npm install )
fi
( cd backend && npx prisma generate >/dev/null )
ok "Backend dependencies + Prisma client ready"

# ── 5. Start both servers ────────────────────────────────────────────────────
echo
( cd backend && npm run dev ) &
BACKEND_PID=$!
cleanup() { pkill -P "$BACKEND_PID" 2>/dev/null || true; kill "$BACKEND_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

bold "Starting…"
echo "  👉 OPEN THIS IN YOUR BROWSER:  http://localhost:5173   (the ZOE website)"
echo "     Backend API (do not open):  http://localhost:3001   (runs in background)"
echo "  Keep this window open while using the site. Press Ctrl+C to stop both."
echo
npm run dev
