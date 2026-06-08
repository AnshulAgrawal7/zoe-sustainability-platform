#!/usr/bin/env bash
#
# ZOE Sustainability Platform — start backend + frontend locally (macOS).
#
# Runs both dev servers on localhost only. Read-only against the database for
# normal use; nothing is deleted. Press Ctrl+C to stop both.
#
#   Backend  → http://localhost:3001
#   Frontend → http://localhost:5173
#
# Run 'bash setup-mac.sh' once before the first start.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

err() { printf "\033[31m✗\033[0m %s\n" "$1" >&2; }

# ── Pre-flight checks ────────────────────────────────────────────────────────
if [ ! -f "backend/.env" ]; then
  err "backend/.env is missing — copy it from the Windows machine first."
  exit 1
fi
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ]; then
  err "Dependencies not installed. Run 'bash setup-mac.sh' first."
  exit 1
fi

# ── Start backend in the background; stop it when this script exits ───────────
( cd backend && npm run dev ) &
BACKEND_PID=$!

cleanup() {
  # Kill the backend process and any children it spawned (ts-node-dev respawn).
  pkill -P "$BACKEND_PID" 2>/dev/null || true
  kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

printf "\033[1mBackend\033[0m  starting → http://localhost:3001  (PID %s)\n" "$BACKEND_PID"
printf "\033[1mFrontend\033[0m starting → http://localhost:5173\n"
echo "Press Ctrl+C to stop both."
echo

# ── Frontend runs in the foreground (Ctrl+C here triggers cleanup) ────────────
npm run dev
