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

## Step 1 — Open your terminal

Don't know what a terminal is? No worries. Here's how to open it:

**Mac:**
1. Press `Command (⌘) + Space` to open Spotlight
2. Type `Terminal` and press `Enter`

**Windows:**
1. Press `Windows key + R`
2. Type `powershell` and press `Enter`
3. If asked "Do you want to allow this app to make changes?", click **Yes**

**Linux:**
Press `Ctrl + Alt + T`

---

## Step 2 — Run the setup command

Copy the command below, paste it into the terminal window, and press `Enter`.

**Mac / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.sh | bash
```

**Windows:**

```powershell
irm https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.ps1 | iex
```

> **How to paste in the terminal:**
> - Mac: `Command (⌘) + V`
> - Windows: right-click inside the window, then click Paste
> - Linux: `Ctrl + Shift + V`

That's it. The setup wizard will guide you through everything — just follow the on-screen prompts.

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
