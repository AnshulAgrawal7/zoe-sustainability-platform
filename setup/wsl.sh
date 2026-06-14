#!/usr/bin/env bash
#
# ZOE Sustainability Platform — WSL2 (Ubuntu on Windows): install + start.
#
# Run ONE command from the project root inside your WSL2 terminal:
#     bash setup/wsl.sh
#
# What it does (safe — read-only against the shared database, deletes nothing):
#   1. Checks Node.js (installs Node 22 LTS via nvm — no sudo needed — if missing)
#   2. Creates the frontend .env from the template if missing
#   3. Verifies backend/.env exists (the DB secrets — request them by email)
#   4. Installs frontend + backend dependencies, generates the Prisma client
#   5. Starts the backend (:3001) and the frontend (:5173) — Ctrl+C stops both
#
# IMPORTANT: keep the project inside the Linux filesystem (e.g. ~/projects/…),
# NOT under /mnt/c/… — npm is far slower and file-watching breaks on /mnt/c.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
err()  { printf "  \033[31m✗\033[0m %s\n" "$1" >&2; }

bold "ZOE — WSL2 setup & start"
echo

# ── 1. Node.js (via nvm if missing — user-space, no sudo) ────────────────────
if ! command -v node >/dev/null 2>&1; then
  warn "Node.js not found — installing Node 22 LTS via nvm…"
  if ! command -v curl >/dev/null 2>&1; then
    err "curl is required to install nvm. Install it first, then re-run:"
    echo "    sudo apt-get update && sudo apt-get install -y curl"
    exit 1
  fi
  export NVM_DIR="$HOME/.nvm"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  fi
  # nvm.sh reads unset variables internally; relax `set -u` while loading/using it.
  set +u
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm install 22
  nvm use 22
  set -u
fi
NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  err "Node $(node -v) is too old — Vite 8 needs Node >= 20.19 (22 LTS recommended)."
  echo "    Install nvm (https://github.com/nvm-sh/nvm) and run:  nvm install 22"
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
echo "  👉 OPEN THIS IN YOUR WINDOWS BROWSER:  http://localhost:5173   (the ZOE website)"
echo "     Backend API (do not open):          http://localhost:3001   (runs in background)"
echo "  Keep this window open while using the site. Press Ctrl+C to stop both."
echo
npm run dev
