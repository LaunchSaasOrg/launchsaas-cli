import { run, runInteractive, commandExists } from "./commands.js";
import { info, success, error, warn } from "./output.js";
import { UPSTREAM_REPO, GITHUB_SIGNUP_URL, LAUNCHSAAS_PURCHASE_URL } from "./constants.js";

export function getGithubUser(): string | null {
  const r = run("gh api user --jq .login", { silent: true });
  return r.ok ? r.stdout.trim() : null;
}

export function isGhAuthenticated(): boolean {
  const r = run("gh auth status", { silent: true });
  return r.ok;
}

export function checkUpstreamAccess(): boolean {
  const r = run(`gh repo view ${UPSTREAM_REPO}`, { silent: true });
  return r.ok;
}

export async function ensureGithubAuth(): Promise<boolean> {
  if (isGhAuthenticated()) {
    const user = getGithubUser();
    if (user) success(`Logged in to GitHub as ${user}`);
    return true;
  }

  warn("You are not logged in to GitHub.");
  info(`If you don't have a GitHub account yet, sign up at: ${GITHUB_SIGNUP_URL}`);
  info("Starting GitHub login (this will open your browser)...");

  const ok = runInteractive("gh auth login --web");
  if (!ok) {
    error("GitHub login failed. Please try again.");
    return false;
  }
  const user = getGithubUser();
  if (user) success(`Logged in to GitHub as ${user}`);
  return isGhAuthenticated();
}

export function ensureUpstreamAccess(): boolean {
  if (checkUpstreamAccess()) return true;
  error("You don't have access to the LaunchSaaS repository.");
  info(`Please purchase LaunchSaaS at ${LAUNCHSAAS_PURCHASE_URL}`);
  info("Once you have been granted access, re-run: launchsaas-cli init");
  return false;
}

export function forkRepo(projectName: string): boolean {
  info(`Forking ${UPSTREAM_REPO} as ${projectName}...`);
  const r = run(
    `gh repo fork ${UPSTREAM_REPO} --clone=false --fork-name ${projectName} --default-branch-only`
  );
  if (!r.ok) {
    // If fork already exists, that's fine
    if (r.stderr.includes("already exists")) {
      warn(`Fork ${projectName} already exists, continuing.`);
      return true;
    }
    error(`Failed to fork repository: ${r.stderr}`);
    return false;
  }
  success(`Forked to your GitHub account as ${projectName}`);
  return true;
}

export function cloneRepo(githubUser: string, projectName: string, localPath: string): boolean {
  info(`Cloning to ${localPath}...`);
  const r = run(`git clone https://github.com/${githubUser}/${projectName} "${localPath}"`);
  if (!r.ok) {
    error(`Failed to clone repository: ${r.stderr}`);
    return false;
  }
  success(`Cloned to ${localPath}`);
  return true;
}

export function installDeps(localPath: string): boolean {
  info("Installing dependencies (pnpm install)...");
  const r = run("pnpm install", { cwd: localPath });
  if (!r.ok) {
    error(`Failed to install dependencies: ${r.stderr}`);
    return false;
  }
  success("Dependencies installed");
  return true;
}
