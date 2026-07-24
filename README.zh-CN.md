# launchsaas-cli（中文）

> English version: [README.md](./README.md)

一条命令，完成 [LaunchSaaS](https://launchsaas.org) 的全套环境初始化，从零开始，直接开始 vibe coding。

## LaunchSaaS 是什么？

[LaunchSaaS](https://launchsaas.org) 是一个生产级 SaaS 项目模板，基于 Next.js 构建。它内置了 SaaS 产品所需的一切——用户认证、支付、管理后台、邮件、博客、文档和多语言支持——让你跳过所有基础建设，直接用 AI 打造自己的产品核心功能。

你可以把它理解成：一个完整的、经过验证的 SaaS 商业模板，拿来就能用 vibe coding 改造成你自己的产品。

## 这个 CLI 会做什么

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

搞定！之后按照向导提示一步步操作即可。

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
