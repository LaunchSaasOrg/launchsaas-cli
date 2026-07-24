export interface Args {
  command: "init" | "doctor" | "resume" | "help" | "version";
  resume: boolean;
}

export function parseArgs(argv: string[]): Args {
  const args = argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "init") {
    return { command: "init", resume: args.includes("--resume") };
  }
  if (cmd === "resume") return { command: "resume", resume: true };
  if (cmd === "doctor") return { command: "doctor", resume: false };
  if (cmd === "--help" || cmd === "-h" || cmd === "help") return { command: "help", resume: false };
  if (cmd === "--version" || cmd === "-v" || cmd === "version") return { command: "version", resume: false };

  return { command: "init", resume: false };
}
