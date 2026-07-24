export type Platform = "macos" | "linux" | "windows";

export type AiTool = "claude-code" | "codex" | "skip";

export type Editor = "vscode" | "cursor" | "skip";

export interface Config {
  projectName: string;
  localPath: string;
  aiTool: AiTool;
  editor: Editor;
  githubUser: string;
}

export interface State {
  completedSteps: string[];
  config: Partial<Config>;
}

export interface Step {
  id: string;
  label: string;
  run: () => Promise<void>;
}
