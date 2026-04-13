#!/usr/bin/env bash
# install.sh — Zero-config scaffold for an itgkey project
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/deropiee/itgkey/main/install.sh | bash -s my-app-name
#
# Or, if you already have the repo cloned:
#   bash install.sh my-app-name
#
# Requirements:
#   - Node.js 18+
#   - npm, npx, or pnpm
#   - A GitHub Personal Access Token (PAT) with the "read:packages" scope
#     (only needed the first time you install from GitHub Packages)

set -euo pipefail

SCOPE="@deropiee"
PACKAGE="${SCOPE}/create-itgkey"
REGISTRY="https://npm.pkg.github.com"
APP_NAME="${1:-my-itgkey-app}"

# ── Colour helpers ──────────────────────────────────────────────────────────
bold=$(tput bold 2>/dev/null || true)
reset=$(tput sgr0 2>/dev/null || true)
green=$(tput setaf 2 2>/dev/null || true)
yellow=$(tput setaf 3 2>/dev/null || true)
cyan=$(tput setaf 6 2>/dev/null || true)

info()  { echo "${cyan}${bold}→${reset} $*"; }
ok()    { echo "${green}${bold}✔${reset} $*"; }
warn()  { echo "${yellow}${bold}!${reset} $*"; }

# ── Check prerequisites ─────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌  Node.js is required but not found. Install it from https://nodejs.org" >&2
  exit 1
fi

if ! command -v npx &>/dev/null; then
  echo "❌  npx is required but not found. Upgrade npm: npm install -g npm" >&2
  exit 1
fi

# ── GitHub Packages authentication ─────────────────────────────────────────
NPMRC="$HOME/.npmrc"
REGISTRY_AUTH_LINE="//${REGISTRY#https://}/:_authToken"

if grep -q "${SCOPE}:registry" "$NPMRC" 2>/dev/null && grep -q "${REGISTRY_AUTH_LINE}" "$NPMRC" 2>/dev/null; then
  ok "GitHub Packages registry already configured for ${SCOPE}."
else
  warn "GitHub Packages requires a Personal Access Token (PAT) with the 'read:packages' scope."
  warn "Create one at: https://github.com/settings/tokens/new?scopes=read:packages"
  echo ""
  read -rsp "  Enter your GitHub PAT (input is hidden): " GH_PAT
  echo ""

  if [ -z "$GH_PAT" ]; then
    echo "❌  No token entered. Aborting." >&2
    exit 1
  fi

  info "Writing registry config to ${NPMRC} ..."
  {
    echo ""
    echo "${SCOPE}:registry=${REGISTRY}"
    echo "${REGISTRY_AUTH_LINE}=${GH_PAT}"
  } >> "$NPMRC"

  ok "Registry configured."
fi

# ── Run the CLI ─────────────────────────────────────────────────────────────
info "Scaffolding project: ${bold}${APP_NAME}${reset}"
echo ""

npx "${PACKAGE}" "${APP_NAME}"
