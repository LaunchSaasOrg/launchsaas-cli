import { execSync, spawnSync } from "node:child_process";
import type { Platform } from "./types.js";

export function getPlatform(): Platform {
  if (process.platform === "darwin") return "macos";
  if (process.platform === "win32") return "windows";
  return "linux";
}

export function commandExists(cmd: string): boolean {
  const platform = getPlatform();
  const check =
    platform === "windows"
      ? spawnSync("where", [cmd], { stdio: "ignore" })
      : spawnSync("which", [cmd], { stdio: "ignore" });
  return check.status === 0;
}

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
}

export function run(
  cmd: string,
  opts: { cwd?: string; env?: NodeJS.ProcessEnv; silent?: boolean } = {}
): RunResult {
  try {
    const stdout = execSync(cmd, {
      cwd: opts.cwd,
      env: { ...process.env, ...opts.env },
      encoding: "utf8",
      stdio: opts.silent ? "pipe" : ["inherit", "pipe", "pipe"],
    });
    return { ok: true, stdout: stdout ?? "", stderr: "" };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string };
    return {
      ok: false,
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? String(err),
    };
  }
}

export function runInteractive(cmd: string, opts: { cwd?: string } = {}): boolean {
  const result = spawnSync(cmd, {
    shell: true,
    stdio: "inherit",
    cwd: opts.cwd,
  });
  return result.status === 0;
}

export function getVersion(cmd: string): string | null {
  const result = run(`${cmd} --version`, { silent: true });
  if (!result.ok) return null;
  return result.stdout.trim();
}

export function getMajorVersion(versionStr: string): number {
  const match = versionStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
