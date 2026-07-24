import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { bold, cyan } from "./output.js";
import type { AiTool, Editor } from "./types.js";

const rl = createInterface({ input, output });

export async function ask(question: string, defaultValue?: string): Promise<string> {
  const hint = defaultValue ? ` ${cyan(`[${defaultValue}]`)}` : "";
  const answer = await rl.question(`  ${bold("?")} ${question}${hint}: `);
  return answer.trim() || defaultValue || "";
}

export async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? cyan("[Y/n]") : cyan("[y/N]");
  const answer = await rl.question(`  ${bold("?")} ${question} ${hint}: `);
  const trimmed = answer.trim().toLowerCase();
  if (!trimmed) return defaultYes;
  return trimmed === "y" || trimmed === "yes";
}

export async function selectEditor(): Promise<Editor> {
  process.stdout.write(`\n  ${bold("?")} Choose an editor to install:\n`);
  process.stdout.write(`    ${cyan("1")} VS Code       (free, popular)\n`);
  process.stdout.write(`    ${cyan("2")} Cursor        (AI-first IDE, recommended for vibe coding)\n`);
  process.stdout.write(`    ${cyan("3")} Skip          (I'll install it myself)\n`);
  const answer = await rl.question(`  Choice [1-3]: `);
  const choice = answer.trim();
  if (choice === "2") return "cursor";
  if (choice === "3") return "skip";
  return "vscode";
}

export async function selectAiTool(): Promise<AiTool> {
  process.stdout.write(`\n  ${bold("?")} Choose an AI coding tool to install:\n`);
  process.stdout.write(`    ${cyan("1")} Claude Code   (recommended — runs /launchsaas skills natively)\n`);
  process.stdout.write(`    ${cyan("2")} Codex CLI     (OpenAI — also supports launchsaas skills)\n`);
  process.stdout.write(`    ${cyan("3")} Skip          (I'll install it myself)\n`);
  const answer = await rl.question(`  Choice [1-3]: `);
  const choice = answer.trim();
  if (choice === "2") return "codex";
  if (choice === "3") return "skip";
  return "claude-code";
}

export async function askProjectName(): Promise<string> {
  const name = await ask("Project name (will be your GitHub repo name)", "my-saas");
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
}

export async function askLocalPath(projectName: string): Promise<string> {
  const { homedir } = await import("node:os");
  const { join } = await import("node:path");
  const defaultPath = join(homedir(), "projects", projectName);
  return ask("Local path to clone into", defaultPath);
}

export function closePrompt(): void {
  rl.close();
}
