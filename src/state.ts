import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { STATE_FILE } from "./constants.js";
import type { State, Config } from "./types.js";

function getStateFilePath(projectPath: string): string {
  return join(projectPath, STATE_FILE);
}

export function loadState(projectPath: string): State {
  const file = getStateFilePath(projectPath);
  if (!existsSync(file)) return { completedSteps: [], config: {} };
  try {
    return JSON.parse(readFileSync(file, "utf8")) as State;
  } catch {
    return { completedSteps: [], config: {} };
  }
}

export function saveState(projectPath: string, state: State): void {
  const file = getStateFilePath(projectPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(state, null, 2));
}

export function markDone(projectPath: string, stepId: string, config: Partial<Config>): void {
  const state = loadState(projectPath);
  if (!state.completedSteps.includes(stepId)) {
    state.completedSteps.push(stepId);
  }
  state.config = { ...state.config, ...config };
  saveState(projectPath, state);
}

export function isDone(projectPath: string, stepId: string): boolean {
  const state = loadState(projectPath);
  return state.completedSteps.includes(stepId);
}

// Global state dir for steps before the project is cloned
export function getGlobalStateDir(): string {
  return join(homedir(), ".launchsaas-cli");
}

export function loadGlobalState(): State {
  const file = join(getGlobalStateDir(), "state.json");
  if (!existsSync(file)) return { completedSteps: [], config: {} };
  try {
    return JSON.parse(readFileSync(file, "utf8")) as State;
  } catch {
    return { completedSteps: [], config: {} };
  }
}

export function saveGlobalState(state: State): void {
  const dir = getGlobalStateDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "state.json"), JSON.stringify(state, null, 2));
}

export function markGlobalDone(stepId: string, config: Partial<Config>): void {
  const state = loadGlobalState();
  if (!state.completedSteps.includes(stepId)) {
    state.completedSteps.push(stepId);
  }
  state.config = { ...state.config, ...config };
  saveGlobalState(state);
}

export function isGlobalDone(stepId: string): boolean {
  return loadGlobalState().completedSteps.includes(stepId);
}
