import { VERSION, CLI_NAME } from "./constants.js";
import { bold, cyan, dim } from "./output.js";

export function printHelp(): void {
  process.stdout.write(`
${bold(CLI_NAME)} v${VERSION}

${bold("USAGE")}
  ${cyan("launchsaas-cli")} [command] [options]

${bold("COMMANDS")}
  ${cyan("init")}       Set up your LaunchSaaS environment (default)
  ${cyan("resume")}     Resume a previously interrupted setup
  ${cyan("doctor")}     Check and repair your environment dependencies
  ${cyan("help")}       Show this help message
  ${cyan("version")}    Show version number

${bold("OPTIONS")}
  ${cyan("--resume")}   Resume from last completed step (same as 'resume' command)

${bold("EXAMPLES")}
  ${dim("# Start fresh setup")}
  launchsaas-cli init

  ${dim("# Resume an interrupted setup")}
  launchsaas-cli resume

  ${dim("# Check environment health")}
  launchsaas-cli doctor

${bold("GETTING STARTED")}
  Run the bootstrap script (macOS/Linux):
  ${cyan("curl -fsSL https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.sh | bash")}

  Windows (PowerShell):
  ${cyan("irm https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.ps1 | iex")}

`);
}

export function printVersion(): void {
  process.stdout.write(`${VERSION}\n`);
}
