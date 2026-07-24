const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";

export function banner(): void {
  process.stdout.write(`
${BOLD}${CYAN}  ██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗${RESET}
${BOLD}${CYAN}  ██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝██║  ██║${RESET}
${BOLD}${CYAN}  ██║     ███████║██║   ██║██╔██╗ ██║██║     ███████║${RESET}
${BOLD}${CYAN}  ██║     ██╔══██║██║   ██║██║╚██╗██║██║     ██╔══██║${RESET}
${BOLD}${CYAN}  ███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╗██║  ██║${RESET}
${BOLD}${CYAN}  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝${RESET}
${BOLD}${CYAN}  ███████╗ █████╗  █████╗ ███████╗${RESET}
${BOLD}${CYAN}  ██╔════╝██╔══██╗██╔══██╗██╔════╝${RESET}
${BOLD}${CYAN}  ███████╗███████║███████║███████╗${RESET}
${BOLD}${CYAN}  ╚════██║██╔══██║██╔══██║╚════██║${RESET}
${BOLD}${CYAN}  ███████║██║  ██║██║  ██║███████║${RESET}
${BOLD}${CYAN}  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝${RESET}

${DIM}  Your vibe coding environment, one command away.${RESET}
`);
}

export function step(index: number, total: number, label: string): void {
  process.stdout.write(`\n${BOLD}[${index}/${total}]${RESET} ${label}\n`);
}

export function success(msg: string): void {
  process.stdout.write(`  ${GREEN}✓${RESET} ${msg}\n`);
}

export function info(msg: string): void {
  process.stdout.write(`  ${CYAN}→${RESET} ${msg}\n`);
}

export function warn(msg: string): void {
  process.stdout.write(`  ${YELLOW}⚠${RESET}  ${msg}\n`);
}

export function error(msg: string): void {
  process.stdout.write(`  ${RED}✗${RESET} ${msg}\n`);
}

export function dim(msg: string): void {
  process.stdout.write(`  ${DIM}${msg}${RESET}\n`);
}

export function newline(): void {
  process.stdout.write("\n");
}

export function divider(): void {
  process.stdout.write(`${DIM}  ${"─".repeat(50)}${RESET}\n`);
}

export function bold(msg: string): string {
  return `${BOLD}${msg}${RESET}`;
}

export function green(msg: string): string {
  return `${GREEN}${msg}${RESET}`;
}

export function cyan(msg: string): string {
  return `${CYAN}${msg}${RESET}`;
}
