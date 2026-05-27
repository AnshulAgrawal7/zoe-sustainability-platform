#!/bin/bash
# Sets up Playwright browser dependencies on WSL2 without root access.
# Downloads and extracts required shared libraries into /tmp/playwright-libs.
# Run once before `npm run test:e2e`.

set -e

LIBS_DIR="/tmp/playwright-libs"
LIB_PATH="$LIBS_DIR/usr/lib/x86_64-linux-gnu"

if [ -f "$LIB_PATH/libnspr4.so" ]; then
  echo "Playwright libs already present at $LIBS_DIR"
  exit 0
fi

echo "Downloading Playwright browser dependencies to $LIBS_DIR ..."
mkdir -p "$LIBS_DIR"
cd /tmp

PACKAGES=(
  libnspr4
  libnss3
  libasound2t64
  libxkbcommon0
  libxcomposite1
  libxdamage1
  libxfixes3
  libxrandr2
  libgbm1
  libpango-1.0-0
  libcairo2
)

for pkg in "${PACKAGES[@]}"; do
  apt-get download "$pkg" 2>/dev/null && echo "  Downloaded: $pkg" || echo "  Skipped: $pkg (not found or already present)"
done

for deb in /tmp/*.deb; do
  dpkg-deb -x "$deb" "$LIBS_DIR" 2>/dev/null && echo "  Extracted: $(basename $deb)"
done

echo ""
echo "Done. Run E2E tests with: npm run test:e2e"
echo "Library path is set automatically via npm script."
