#!/usr/bin/env bash
set -e

REPO="LaunchSaasOrg/launchsaas-cli"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "  ${CYAN}→${RESET} $1"; }
success() { echo -e "  ${GREEN}✓${RESET} $1"; }
warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
error()   { echo -e "  ${RED}✗${RESET} $1"; }

echo ""
echo -e "${BOLD}${CYAN}  LaunchSaaS CLI — Bootstrap Installer${RESET}"
echo ""

# ─── Check OS ────────────────────────────────────────────────────────────────
OS="$(uname -s)"
if [[ "$OS" == "MINGW"* ]] || [[ "$OS" == "MSYS"* ]] || [[ "$OS" == "CYGWIN"* ]]; then
  error "Windows detected. Please use PowerShell instead:"
  echo ""
  echo -e "  ${CYAN}irm https://raw.githubusercontent.com/${REPO}/main/install.ps1 | iex${RESET}"
  echo ""
  exit 1
fi

# ─── Install Node.js if needed ───────────────────────────────────────────────
if ! command -v node &>/dev/null || [ "$(node -e 'process.stdout.write(process.version.slice(1).split(\".\")[0])')" -lt 20 ] 2>/dev/null; then
  warn "Node.js 20+ not found. Installing via fnm..."

  # Install fnm
  export FNM_DIR="${HOME}/.fnm"
  if ! command -v fnm &>/dev/null; then
    curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
  fi

  # Source fnm
  export PATH="${FNM_DIR}:${HOME}/.local/share/fnm:${PATH}"
  eval "$(fnm env --shell bash 2>/dev/null || true)"

  fnm install 20 --silent 2>/dev/null || fnm install 20
  fnm use 20
  fnm default 20

  # Re-source fnm so npm is available in this script
  eval "$(fnm env --shell bash 2>/dev/null || true)"
  success "Node.js $(node --version) installed"
else
  success "Node.js $(node --version) already installed"
fi

# ─── Install launchsaas-cli from GitHub ──────────────────────────────────────
info "Installing launchsaas-cli..."
npm install -g "github:${REPO}" --silent 2>/dev/null || npm install -g "github:${REPO}"
success "launchsaas-cli installed"

echo ""
echo -e "${BOLD}${GREEN}  Setup complete! Starting LaunchSaaS initialization...${RESET}"
echo ""

# ─── Run init ────────────────────────────────────────────────────────────────
exec launchsaas-cli init
