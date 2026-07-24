# launchsaas-cli

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>

# launchsaas-cli (English)

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

---

<a name="中文"></a>

# launchsaas-cli（中文）

一条命令，完成 [LaunchSaaS](https://launchsaas.org) 的全套环境初始化，从零开始，直接开始 vibe coding。

## 它会做什么

自动安装并配置你需要的一切：

- Node.js 20+、Git、pnpm、GitHub CLI、Docker
- 你选择的编辑器（VS Code 或 Cursor）
- 你选择的 AI 编码工具（Claude Code 或 Codex CLI）
- 将 LaunchSaaS 仓库 Fork 并克隆到你的 GitHub 账号
- 安装项目依赖
- 引导你用 `/launchsaas create` 开始 vibe coding

## 前提条件

- 购买了 [LaunchSaaS](https://launchsaas.org) 授权（需要私有仓库访问权限）
- GitHub 账号（没有的话 CLI 会引导你注册）

## 第一步 — 打开终端

不知道终端是什么？没关系，按照下面的步骤操作：

**Mac：**
1. 按 `Command (⌘) + 空格` 打开 Spotlight 搜索
2. 输入 `终端` 或 `Terminal`，按回车

**Windows：**
1. 按 `Windows 键 + R`
2. 输入 `powershell`，按回车
3. 如果弹出"是否允许此应用更改你的设备？"，点击**是**

**Linux：**
按 `Ctrl + Alt + T`

## 第二步 — 运行安装命令

复制下面的命令，粘贴到终端窗口，按回车。

**Mac / Linux：**

```bash
curl -fsSL https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.sh | bash
```

**Windows：**

```powershell
irm https://raw.githubusercontent.com/LaunchSaasOrg/launchsaas-cli/main/install.ps1 | iex
```

> **终端里怎么粘贴：**
> - Mac：`Command (⌘) + V`
> - Windows：在终端窗口内右键，点击"粘贴"
> - Linux：`Ctrl + Shift + V`

搞定！之后按照向导提示一步步操作即可，全程有中文引导。

## 命令说明

```bash
launchsaas-cli init      # 开始全新安装（默认）
launchsaas-cli resume    # 继续上次中断的安装
launchsaas-cli doctor    # 检查并修复环境问题
launchsaas-cli --help    # 显示帮助
```

## 安装完成后

CLI 完成后，用你选的 AI 工具打开项目并运行 LaunchSaaS skill：

**Claude Code：**
```bash
cd ~/projects/你的项目名 && claude
# 然后运行：/launchsaas create
```

**Codex：**
```bash
cd ~/projects/你的项目名 && codex
# 然后让 Codex 运行 launchsaas create skill
```

## 许可证

MIT
