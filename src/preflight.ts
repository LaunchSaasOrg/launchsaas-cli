import { run, runInteractive, commandExists, getPlatform, getVersion, getMajorVersion } from "./commands.js";
import { success, info, warn, error, dim } from "./output.js";

type InstallResult = { ok: boolean; message?: string };

// ─── Node.js ────────────────────────────────────────────────────────────────

export function checkNode(): boolean {
  if (!commandExists("node")) return false;
  const v = getVersion("node");
  if (!v) return false;
  return getMajorVersion(v) >= 20;
}

async function installNode(): Promise<InstallResult> {
  const platform = getPlatform();
  info("Installing Node.js 20 via fnm...");

  if (platform === "windows") {
    const r = run("winget install Schniz.fnm --silent --accept-package-agreements --accept-source-agreements");
    if (!r.ok) return { ok: false, message: "Failed to install fnm via winget" };
    const r2 = run("fnm install 20 && fnm use 20 && fnm default 20");
    return r2.ok ? { ok: true } : { ok: false, message: "Failed to install Node.js 20 via fnm" };
  }

  // macOS / Linux: install fnm via curl, then Node 20
  const installScript = `
    curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
    export PATH="$HOME/.local/share/fnm:$HOME/.fnm:$PATH"
    eval "$(fnm env --shell bash 2>/dev/null || true)"
    fnm install 20
    fnm use 20
    fnm default 20
  `;
  const r = run(`bash -c '${installScript.replace(/'/g, "'\\''")}'`);
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install Node.js via fnm" };
}

// ─── Git ────────────────────────────────────────────────────────────────────

export function checkGit(): boolean {
  return commandExists("git");
}

async function installGit(): Promise<InstallResult> {
  const platform = getPlatform();
  info("Installing Git...");

  if (platform === "windows") {
    const r = run("winget install Git.Git --silent --accept-package-agreements --accept-source-agreements");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Git via winget" };
  }
  if (platform === "macos") {
    const r = run("brew install git");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Git via brew" };
  }
  // Linux
  run("apt-get update -y");
  const r = run("apt-get install -y git");
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install Git via apt-get" };
}

// ─── pnpm ───────────────────────────────────────────────────────────────────

export function checkPnpm(): boolean {
  return commandExists("pnpm");
}

async function installPnpm(): Promise<InstallResult> {
  info("Installing pnpm...");
  const r = run("npm install -g pnpm@latest");
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install pnpm" };
}

// ─── GitHub CLI ─────────────────────────────────────────────────────────────

export function checkGh(): boolean {
  return commandExists("gh");
}

async function installGh(): Promise<InstallResult> {
  const platform = getPlatform();
  info("Installing GitHub CLI...");

  if (platform === "windows") {
    const r = run("winget install GitHub.cli --silent --accept-package-agreements --accept-source-agreements");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install GitHub CLI via winget" };
  }
  if (platform === "macos") {
    const r = run("brew install gh");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install GitHub CLI via brew" };
  }
  // Linux (Debian/Ubuntu)
  const aptScript = `
    (type -p wget >/dev/null || (apt-get update && apt-get install wget -y)) \
    && mkdir -p -m 755 /etc/apt/keyrings \
    && wget -nv -O /etc/apt/keyrings/githubcli-archive-keyring.gpg https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
       > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install gh -y
  `;
  const r = run(`bash -c '${aptScript.replace(/'/g, "'\\''")}'`);
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install GitHub CLI" };
}

// ─── Docker ─────────────────────────────────────────────────────────────────

export function checkDocker(): boolean {
  return commandExists("docker");
}

async function installDocker(): Promise<InstallResult> {
  const platform = getPlatform();
  info("Installing Docker Desktop...");

  if (platform === "windows") {
    const r = run("winget install Docker.DockerDesktop --silent --accept-package-agreements --accept-source-agreements");
    if (r.ok) {
      warn("Docker Desktop installed. A system restart is required before Docker can be used.");
      warn("After restarting, run: launchsaas-cli doctor");
    }
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Docker Desktop via winget" };
  }
  if (platform === "macos") {
    // Download and mount Docker Desktop DMG
    info("Downloading Docker Desktop for macOS...");
    const arch = process.arch === "arm64" ? "arm64" : "amd64";
    const url = `https://desktop.docker.com/mac/main/${arch}/Docker.dmg`;
    const r1 = run(`curl -fsSL -o /tmp/Docker.dmg "${url}"`);
    if (!r1.ok) return { ok: false, message: "Failed to download Docker Desktop" };
    const r2 = run("hdiutil attach /tmp/Docker.dmg -nobrowse -quiet");
    if (!r2.ok) return { ok: false, message: "Failed to mount Docker Desktop DMG" };
    const r3 = run('cp -R "/Volumes/Docker/Docker.app" /Applications/');
    run("hdiutil detach /Volumes/Docker -quiet");
    run("rm -f /tmp/Docker.dmg");
    if (!r3.ok) return { ok: false, message: "Failed to install Docker Desktop to /Applications" };
    // Remove quarantine
    run("xattr -d com.apple.quarantine /Applications/Docker.app 2>/dev/null || true");
    warn("Docker Desktop installed. Please open Docker.app from /Applications to start Docker.");
    return { ok: true };
  }
  // Linux
  const r = run("curl -fsSL https://get.docker.com | sh");
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install Docker via get.docker.com" };
}

// ─── Windows package manager ─────────────────────────────────────────────────

export function checkWindowsPackageManager(): "winget" | "choco" | "none" {
  if (commandExists("winget")) return "winget";
  if (commandExists("choco")) return "choco";
  return "none";
}

// ─── Windows PowerShell execution policy ────────────────────────────────────

export function fixWindowsExecutionPolicy(): void {
  if (getPlatform() !== "windows") return;
  const r = run('powershell -Command "Get-ExecutionPolicy"', { silent: true });
  if (r.stdout.trim() === "Restricted") {
    info("Fixing PowerShell execution policy...");
    run('powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"');
  }
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export async function installEditor(editor: "vscode" | "cursor"): Promise<InstallResult> {
  const platform = getPlatform();

  if (editor === "vscode") {
    info("Installing VS Code...");
    if (platform === "windows") {
      const r = run("winget install Microsoft.VisualStudioCode --silent --accept-package-agreements --accept-source-agreements");
      return r.ok ? { ok: true } : { ok: false, message: "Failed to install VS Code via winget" };
    }
    if (platform === "macos") {
      const r = run("brew install --cask visual-studio-code");
      return r.ok ? { ok: true } : { ok: false, message: "Failed to install VS Code via brew" };
    }
    // Linux: download .deb
    const r1 = run("curl -fsSL -o /tmp/vscode.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64'");
    if (!r1.ok) return { ok: false, message: "Failed to download VS Code" };
    const r2 = run("dpkg -i /tmp/vscode.deb || apt-get install -f -y");
    run("rm -f /tmp/vscode.deb");
    return r2.ok ? { ok: true } : { ok: false, message: "Failed to install VS Code" };
  }

  // Cursor
  info("Installing Cursor...");
  if (platform === "windows") {
    const r = run("winget install Anysphere.Cursor --silent --accept-package-agreements --accept-source-agreements");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Cursor via winget" };
  }
  if (platform === "macos") {
    const r = run("curl -fsSL https://cursor.com/install | bash");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Cursor" };
  }
  // Linux: download .deb
  const r1 = run("curl -fsSL -o /tmp/cursor.deb 'https://api2.cursor.sh/updates/download/golden/linux-x64-deb/cursor/latest'");
  if (!r1.ok) return { ok: false, message: "Failed to download Cursor" };
  const r2 = run("dpkg -i /tmp/cursor.deb || apt-get install -f -y");
  run("rm -f /tmp/cursor.deb");
  return r2.ok ? { ok: true } : { ok: false, message: "Failed to install Cursor" };
}

// ─── AI tool ─────────────────────────────────────────────────────────────────

export async function installAiTool(tool: "claude-code" | "codex"): Promise<InstallResult> {
  const platform = getPlatform();

  if (tool === "claude-code") {
    info("Installing Claude Code...");
    if (platform === "windows") {
      // Try winget first, fall back to PowerShell installer
      const r = run("winget install Anthropic.ClaudeCode --silent --accept-package-agreements --accept-source-agreements");
      if (r.ok) return { ok: true };
      const r2 = run('powershell -Command "irm https://claude.ai/install.ps1 | iex"');
      return r2.ok ? { ok: true } : { ok: false, message: "Failed to install Claude Code" };
    }
    const r = run("curl -fsSL https://claude.ai/install.sh | bash");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Claude Code" };
  }

  // Codex CLI
  info("Installing Codex CLI...");
  if (platform === "windows") {
    const r = run("npm install -g @openai/codex");
    return r.ok ? { ok: true } : { ok: false, message: "Failed to install Codex CLI" };
  }
  const r = run("curl -fsSL https://chatgpt.com/codex/install.sh | sh");
  return r.ok ? { ok: true } : { ok: false, message: "Failed to install Codex CLI" };
}

// ─── Main preflight ──────────────────────────────────────────────────────────

export interface PreflightResult {
  ok: boolean;
  errors: string[];
}

export async function runPreflight(): Promise<PreflightResult> {
  const errors: string[] = [];
  const platform = getPlatform();

  // Windows: fix execution policy and check package manager
  if (platform === "windows") {
    fixWindowsExecutionPolicy();
    const pm = checkWindowsPackageManager();
    if (pm === "none") {
      error("Windows package manager (winget) not found.");
      info("Please install winget from the Microsoft Store: App Installer");
      info("Then re-run: launchsaas-cli init");
      return { ok: false, errors: ["winget not found"] };
    }
    dim(`Using ${pm} as package manager`);
  }

  // macOS: ensure Homebrew
  if (platform === "macos" && !commandExists("brew")) {
    info("Installing Homebrew...");
    const r = run('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    if (!r.ok) {
      errors.push("Failed to install Homebrew");
      error("Could not install Homebrew. Please install it manually: https://brew.sh");
    }
  }

  // Node.js
  if (!checkNode()) {
    warn("Node.js 20+ not found.");
    const r = await installNode();
    if (r.ok) success("Node.js 20 installed");
    else { errors.push(r.message!); error(r.message!); }
  } else {
    success(`Node.js ${getVersion("node")} already installed`);
  }

  // Git
  if (!checkGit()) {
    warn("Git not found.");
    const r = await installGit();
    if (r.ok) success("Git installed");
    else { errors.push(r.message!); error(r.message!); }
  } else {
    success("Git already installed");
  }

  // pnpm
  if (!checkPnpm()) {
    warn("pnpm not found.");
    const r = await installPnpm();
    if (r.ok) success("pnpm installed");
    else { errors.push(r.message!); error(r.message!); }
  } else {
    success("pnpm already installed");
  }

  // GitHub CLI
  if (!checkGh()) {
    warn("GitHub CLI not found.");
    const r = await installGh();
    if (r.ok) success("GitHub CLI installed");
    else { errors.push(r.message!); error(r.message!); }
  } else {
    success("GitHub CLI already installed");
  }

  // Docker
  if (!checkDocker()) {
    warn("Docker not found.");
    const r = await installDocker();
    if (r.ok) success("Docker installed");
    else { errors.push(r.message!); error(r.message!); }
  } else {
    success("Docker already installed");
  }

  return { ok: errors.length === 0, errors };
}
