#!/usr/bin/env bash
#
# ZOE Sustainability Platform — macOS one-time setup.
#
# SAFE BY DESIGN: this script installs dependencies and generates the Prisma
# client only. It NEVER runs migrations, seeds, or resets — it does not touch
# or delete any data in the (shared, remote) Supabase database.
#
# Usage:   bash setup-mac.sh
# Then:    bash start-mac.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
err()  { printf "  \033[31m✗\033[0m %s\n" "$1" >&2; }

bold "ZOE — macOS Setup (non-destructive)"
echo

# ── 1. Node.js ───────────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  err "Node.js is not installed."
  echo "    Install Node 22 LTS:  brew install node"
  echo "    (Homebrew not installed? See https://brew.sh)"
  exit 1
fi
NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  err "Node $(node -v) is too old. Vite 8 needs Node >= 20.19 (22 LTS recommended)."
  echo "    brew install node     # or use nvm"
  exit 1
fi
ok "Node $(node -v)"

# ── 2. Environment files ─────────────────────────────────────────────────────
# Frontend .env is not secret (just the API URL) — create it from the template
# if missing. Backend .env holds the database credentials and is NOT in git;
# it must be copied over from the Windows machine.
if [ ! -f ".env" ]; then
  cp .env.example .env
  ok "Created .env from .env.example (localhost defaults)"
else
  ok ".env present"
fi

if [ ! -f "backend/.env" ]; then
  warn "backend/.env is MISSING."
  warn "It holds the database credentials and is not stored in git."
  warn "Copy it from the Windows machine into:  $ROOT/backend/.env"
  warn "Setup will continue, but 'start-mac.sh' won't work until it's there."
else
  ok "backend/.env present"
fi

# ── 3. Frontend dependencies ─────────────────────────────────────────────────
echo
bold "Installing frontend dependencies…"
npm install
ok "Frontend dependencies installed"

# ── 4. Backend dependencies + Prisma client ──────────────────────────────────
echo
bold "Installing backend dependencies…"
cd backend
npm install
ok "Backend dependencies installed"
# generate only — does NOT connect to or modify the database
npx prisma generate
ok "Prisma client generated"
cd "$ROOT"

echo
bold "Setup complete ✅"
echo "Start the app with:   bash start-mac.sh"
echo "Then open:            http://localhost:5173"
