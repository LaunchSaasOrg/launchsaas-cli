#!/usr/bin/env node
import { parseArgs } from "./args.js";
import { printHelp, printVersion } from "./help.js";
import { banner, step, success, info, error, warn, newline, divider, bold, green, cyan } from "./output.js";
import { runPreflight, installEditor, installAiTool } from "./preflight.js";
import { askProjectName, askLocalPath, selectEditor, selectAiTool, closePrompt } from "./prompt.js";
import {
  ensureGithubAuth,
  ensureUpstreamAccess,
  forkRepo,
  cloneRepo,
  installDeps,
  getGithubUser,
} from "./github.js";
import {
  loadGlobalState,
  markGlobalDone,
  isGlobalDone,
} from "./state.js";
import { existsSync } from "node:fs";
import type { AiTool, Editor, Config } from "./types.js";

const TOTAL_STEPS = 8;

async function runInit(resume: boolean): Promise<void> {
  banner();
  info("Welcome! This will set up your LaunchSaaS vibe coding environment.\n");

  const globalState = loadGlobalState();
  const savedConfig = globalState.config as Partial<Config>;

  // ── Step 1: Preflight ────────────────────────────────────────────────────
  step(1, TOTAL_STEPS, "Checking and installing required tools...");

  if (!resume || !isGlobalDone("preflight")) {
    const result = await runPreflight();
    if (!result.ok) {
      error("Some tools could not be installed automatically.");
      info("Please fix the issues above and re-run: launchsaas-cli init --resume");
      process.exit(1);
    }
    markGlobalDone("preflight", {});
  } else {
    success("Prerequisites already satisfied (skipping)");
  }

  // ── Step 2: Editor ───────────────────────────────────────────────────────
  step(2, TOTAL_STEPS, "Editor setup...");

  let editor: Editor = savedConfig.editor ?? "skip";
  if (!resume || !isGlobalDone("editor")) {
    editor = await selectEditor();
    if (editor !== "skip") {
      const r = await installEditor(editor);
      if (r.ok) {
        success(`${editor === "vscode" ? "VS Code" : "Cursor"} installed`);
      } else {
        warn(`Could not install editor automatically: ${r.message}`);
        warn("You can install it manually later.");
        editor = "skip";
      }
    } else {
      info("Skipping editor installation");
    }
    markGlobalDone("editor", { editor });
  } else {
    success(`Editor already set up (${editor}, skipping)`);
  }

  // ── Step 3: AI tool ──────────────────────────────────────────────────────
  step(3, TOTAL_STEPS, "AI coding tool setup...");

  let aiTool: AiTool = savedConfig.aiTool ?? "skip";
  if (!resume || !isGlobalDone("ai-tool")) {
    aiTool = await selectAiTool();
    if (aiTool !== "skip") {
      const r = await installAiTool(aiTool);
      if (r.ok) {
        success(`${aiTool === "claude-code" ? "Claude Code" : "Codex CLI"} installed`);
      } else {
        warn(`Could not install AI tool automatically: ${r.message}`);
        warn("You can install it manually later.");
        aiTool = "skip";
      }
    } else {
      info("Skipping AI tool installation");
    }
    markGlobalDone("ai-tool", { aiTool });
  } else {
    success(`AI tool already set up (${aiTool}, skipping)`);
  }

  // ── Step 4: GitHub auth ──────────────────────────────────────────────────
  step(4, TOTAL_STEPS, "GitHub authentication...");

  if (!resume || !isGlobalDone("github-auth")) {
    const ok = await ensureGithubAuth();
    if (!ok) {
      error("GitHub authentication required to continue.");
      process.exit(1);
    }
    markGlobalDone("github-auth", {});
  } else {
    success("GitHub already authenticated (skipping)");
  }

  // ── Step 5: LaunchSaaS access ────────────────────────────────────────────
  step(5, TOTAL_STEPS, "Verifying LaunchSaaS access...");

  if (!resume || !isGlobalDone("upstream-access")) {
    const ok = ensureUpstreamAccess();
    if (!ok) process.exit(1);
    markGlobalDone("upstream-access", {});
  } else {
    success("LaunchSaaS access verified (skipping)");
  }

  // ── Step 6: Configure ────────────────────────────────────────────────────
  step(6, TOTAL_STEPS, "Project configuration...");

  let projectName: string = savedConfig.projectName ?? "";
  let localPath: string = savedConfig.localPath ?? "";

  if (!resume || !isGlobalDone("configure")) {
    projectName = await askProjectName();
    localPath = await askLocalPath(projectName);
    markGlobalDone("configure", { projectName, localPath });
  } else {
    success(`Project: ${projectName} → ${localPath} (skipping)`);
  }

  const githubUser = getGithubUser() ?? "";

  // ── Step 7: Fork & clone ─────────────────────────────────────────────────
  step(7, TOTAL_STEPS, "Forking and cloning LaunchSaaS...");

  if (!resume || !isGlobalDone("fork-clone")) {
    const forked = forkRepo(projectName);
    if (!forked) process.exit(1);

    const cloned = cloneRepo(githubUser, projectName, localPath);
    if (!cloned) process.exit(1);

    markGlobalDone("fork-clone", { githubUser });
  } else {
    success("Repository already forked and cloned (skipping)");
  }

  // ── Step 8: Install dependencies ─────────────────────────────────────────
  step(8, TOTAL_STEPS, "Installing project dependencies...");

  if (!resume || !isGlobalDone("install-deps")) {
    if (!existsSync(localPath)) {
      error(`Project directory not found: ${localPath}`);
      info("Try running: launchsaas-cli resume");
      process.exit(1);
    }
    const ok = installDeps(localPath);
    if (!ok) {
      warn("Dependency installation failed. You can retry with: cd " + localPath + " && pnpm install");
    } else {
      markGlobalDone("install-deps", {});
    }
  } else {
    success("Dependencies already installed (skipping)");
  }

  closePrompt();

  // ── Done ─────────────────────────────────────────────────────────────────
  newline();
  divider();
  newline();
  process.stdout.write(`  ${green("✓")} ${bold("Your LaunchSaaS environment is ready!")}\n\n`);
  process.stdout.write(`  ${bold("Project:")} ${localPath}\n`);
  process.stdout.write(`  ${bold("GitHub:")}  https://github.com/${githubUser}/${projectName}\n`);
  newline();

  process.stdout.write(`  ${bold("Next steps:")}\n\n`);

  if (aiTool === "claude-code") {
    process.stdout.write(`  1. Open your project with Claude Code:\n`);
    process.stdout.write(`     ${cyan(`cd "${localPath}" && claude`)}\n\n`);
    process.stdout.write(`  2. Inside Claude Code, run the LaunchSaaS setup skill:\n`);
    process.stdout.write(`     ${cyan("/launchsaas create")}\n\n`);
    process.stdout.write(`  This will guide you through configuring your database,\n`);
    process.stdout.write(`  environment variables, and starting the dev server.\n`);
  } else if (aiTool === "codex") {
    process.stdout.write(`  1. Open your project with Codex:\n`);
    process.stdout.write(`     ${cyan(`cd "${localPath}" && codex`)}\n\n`);
    process.stdout.write(`  2. Inside Codex, run the LaunchSaaS setup skill:\n`);
    process.stdout.write(`     ${cyan("Ask Codex to run the launchsaas create skill")}\n\n`);
    process.stdout.write(`  This will guide you through configuring your database,\n`);
    process.stdout.write(`  environment variables, and starting the dev server.\n`);
  } else {
    process.stdout.write(`  1. Install an AI coding tool (Claude Code or Codex CLI)\n\n`);
    process.stdout.write(`  2. Open your project:\n`);
    process.stdout.write(`     ${cyan(`cd "${localPath}"`)}\n\n`);
    process.stdout.write(`  3. Run the LaunchSaaS setup skill in your AI tool:\n`);
    process.stdout.write(`     Claude Code: ${cyan("/launchsaas create")}\n`);
  }

  newline();
  divider();
  newline();
}

async function runDoctor(): Promise<void> {
  banner();
  info("Checking your LaunchSaaS environment...\n");

  step(1, 1, "Running environment checks...");
  const result = await runPreflight();

  newline();
  if (result.ok) {
    success("All checks passed! Your environment is healthy.");
  } else {
    warn("Some issues were found:");
    for (const e of result.errors) {
      error(e);
    }
  }
  newline();
  closePrompt();
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  try {
    switch (args.command) {
      case "help":
        printHelp();
        break;
      case "version":
        printVersion();
        break;
      case "doctor":
        await runDoctor();
        break;
      case "init":
      case "resume":
        await runInit(args.resume || args.command === "resume");
        break;
    }
  } catch (err: unknown) {
    newline();
    error("An unexpected error occurred:");
    error(String(err));
    info("If this keeps happening, please report it at: https://github.com/LaunchSaasOrg/launchsaas-cli/issues");
    closePrompt();
    process.exit(1);
  }
}

main();
