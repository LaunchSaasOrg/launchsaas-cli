# launchsaas-cli

One-command setup for [LaunchSaaS](https://launchsaas.org) — bootstrap your entire vibe coding environment from scratch.

## What it does

Installs and configures everything you need to start building with LaunchSaaS:

- Node.js 20+, Git, pnpm, GitHub CLI, Docker
- Your choice of editor (VS Code or Cursor)
- Your choice of AI coding tool (Claude Code or Codex CLI)
- Forks & clones the LaunchSaaS repository to your GitHub account
- Installs project dependencies
- Guides you to start vibe coding with `/launchsaas create`

## Requirements

- A [LaunchSaaS](https://launchsaas.org) license (you need access to the private repo)
- A GitHub account (the CLI will help you create one if needed)

## Install & Run

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.ps1 | iex
```

That's it. The script installs Node.js if needed, installs the CLI, and immediately starts the setup wizard.

## Commands

```bash
launchsaas-cli init      # Start fresh setup (default)
launchsaas-cli resume    # Resume an interrupted setup
launchsaas-cli doctor    # Check and repair environment
launchsaas-cli --help    # Show help
```

## After setup

Once the CLI finishes, open your project with your AI coding tool and run the LaunchSaaS skill:

**Claude Code:**
```bash
cd ~/projects/your-project && claude
# then: /launchsaas create
```

**Codex:**
```bash
cd ~/projects/your-project && codex
# then ask Codex to run the launchsaas create skill
```

## License

MIT
