# Tool matrix

Access date for every source below: **2026-10-19**. Status: **verified against vendor documentation**, not a claim about an installed version. Recheck after updates. A real run records its installed version and fresh-session evidence beside these facts.

`~` means the user's home. Bare dot-directories are relative to the relevant project. Documentation may describe terminal, IDE, app, and cloud behavior differently. Do not transfer a fact between those surfaces without checking.

## Claude Code

| Area | Documented fact and adapter consequence | Source | Accessed |
|---|---|---|---|
| Instructions | User `~/.claude/CLAUDE.md`; project `CLAUDE.md` or `.claude/CLAUDE.md`; local `CLAUDE.local.md`. Ancestors load at startup; descendant instructions load when relevant files are read. | [Memory](https://code.claude.com/docs/en/memory) | 2026-10-19 |
| Imports | `@` imports resolve relative to the importing file; absolute paths work. Depth is limited. Escape spaces in import paths. Test the actual wrapper. | [Memory](https://code.claude.com/docs/en/memory) | 2026-10-19 |
| AGENTS | Recent versions document AGENTS fallback, conditional on Claude instruction files. Do not assume unconditional discovery or identical Codex override behavior. Use a tested Claude wrapper when needed. | [Memory](https://code.claude.com/docs/en/memory) | 2026-10-19 |
| Settings | User `~/.claude/settings.json`, project `.claude/settings.json`, local `.claude/settings.local.json`, managed sources. Highest first: managed, command-line settings, local, project, user. Lists and individual flags/env pairs have exceptions. Local placement varies with platform, worktree, and version. | [Settings](https://code.claude.com/docs/en/settings) | 2026-10-19 |
| Profile location | `CLAUDE_CONFIG_DIR` relocates configuration state including settings/history/plugins. Windows home normally uses USERPROFILE. `~/.claude.json` mixes sign-in, MCP, and project state; keep it opaque. | [Settings](https://code.claude.com/docs/en/settings) | 2026-10-19 |
| Loading evidence | `/status` lists setting sources, not each key's origin. `/context` helps inspect loaded instruction context. Confirm behavior too. | [Settings](https://code.claude.com/docs/en/settings), [Memory](https://code.claude.com/docs/en/memory) | 2026-10-19 |
| Skills | `SKILL.md` under user `~/.claude/skills`, project `.claude/skills`, or a plugin. Skill descriptions and invoked bodies are different context costs. | [Skills](https://code.claude.com/docs/en/skills) | 2026-10-19 |
| Subagents | Markdown definitions under `~/.claude/agents`, `.claude/agents`, or plugin `agents/`; frontmatter includes name, description, and tools. | [Subagents](https://code.claude.com/docs/en/sub-agents) | 2026-10-19 |
| Plugin packaging | `.claude-plugin/plugin.json` identifies a plugin; skills and agents belong at the plugin root. A marketplace lists plugins and local sources. Local marketplace add and plugin install are supported. Namespaced skills use plugin:skill. | [Plugin reference](https://code.claude.com/docs/en/plugins-reference), [Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) | 2026-10-19 |
| Hooks | PreToolUse receives JSON on stdin with tool_name, tool_input, cwd, and hook_event_name. A command hook can return hookSpecificOutput with permissionDecision deny/ask/allow. No decision leaves normal permission flow. Matcher `*` covers matching tools. | [Hooks](https://code.claude.com/docs/en/hooks) | 2026-10-19 |
| MCP | Project `.mcp.json` uses `mcpServers`; local/user registrations can be in opaque `~/.claude.json`. Stdio entries use command/args; HTTP uses type and url. Configuration presence does not prove authentication or tool availability. | [MCP](https://code.claude.com/docs/en/mcp) | 2026-10-19 |

## Codex

| Area | Documented fact and adapter consequence | Source | Accessed |
|---|---|---|---|
| Instructions | Global CODEX_HOME checks AGENTS.override.md then AGENTS.md. From repository root to cwd, one instruction file per directory is selected: override, AGENTS, then configured fallbacks. Later/closer text takes precedence. Outside a repository, use cwd rules described by the vendor. | [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 2026-10-19 |
| Home | `CODEX_HOME` changes the default `~/.codex` state/config root. Do not infer authentication identity from the directory name. | [Environment variables](https://learn.chatgpt.com/docs/config-file/environment-variables) | 2026-10-19 |
| Settings | User `~/.codex/config.toml`; trusted project `.codex/config.toml`. Current order: CLI overrides, closest project config, selected `profile-name.config.toml`, user, cloud-managed defaults, Unix `/etc/codex/config.toml`, built-ins. Enforced requirements are separate constraints. | [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic) | 2026-10-19 |
| Skills | `.agents/skills` is discovered from cwd through the repo root; user `~/.agents/skills` and system `/etc/codex/skills` are documented. Keep the whole skill directory. Same-name skills are not automatically one merged skill. | [Skills](https://learn.chatgpt.com/docs/build-skills) | 2026-10-19 |
| Subagents | Native definitions include project `.codex/agents/*.toml`. This is not the Claude Markdown frontmatter format. Convert explicitly and verify native loading. | [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | 2026-10-19 |
| Plugins | Current Agent Plugins support a portable plugin manifest and compatibility formats. This kit ships a Claude manifest; its Codex route is explicit AGENTS/skill reading, not a tested native plugin installation. | [Plugin authoring](https://developers.openai.com/plugins/build/plugins) | 2026-10-19 |
| Hooks | Current docs support `~/.codex/hooks.json`, `.codex/hooks.json`, and inline hooks configuration. Matching hooks accumulate. Trust and feature settings matter. PreToolUse coverage has exclusions, including some hosted or specialized paths; continued shell stdin is not a new shell approval. | [Hooks](https://learn.chatgpt.com/docs/hooks) | 2026-10-19 |
| Permissions | Native sandbox and approval controls constrain local execution. Protected paths, platform implementation, managed requirements, and available approval modes vary. Use the installed runtime's effective policy. | [Approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security) | 2026-10-19 |
| MCP | `[mcp_servers.<name>]` in config.toml supports stdio command/args or a remote url. Environment-variable references and tool filters are documented. Never generate literal credentials in an env block. | [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) | 2026-10-19 |

## Gemini CLI

| Area | Documented fact and adapter consequence | Source | Accessed |
|---|---|---|---|
| Instructions | `~/.gemini/GEMINI.md`, workspace/ancestor context, and just-in-time context are documented. `context.fileName` can select other names. Imports support referenced files. Use `/memory show` and `/memory reload` for context checks. | [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) | 2026-10-19 |
| Settings | `~/.gemini/settings.json` and `.gemini/settings.json`. Low to high: defaults, system defaults, user, project, system, environment, CLI. | [Configuration](https://geminicli.com/docs/reference/configuration/) | 2026-10-19 |
| System roots | Linux `/etc/gemini-cli`; macOS `/Library/Application Support/GeminiCli`; Windows `%ProgramData%/gemini-cli`. System filenames include settings.json and system-defaults.json. GEMINI_CLI_SYSTEM_SETTINGS_PATH and GEMINI_CLI_SYSTEM_DEFAULTS_PATH override those files. | [Configuration](https://geminicli.com/docs/reference/configuration/) | 2026-10-19 |
| Skills | User/project `.gemini/skills` and `.agents/skills` aliases are documented. Workspace takes precedence over user; the alias has precedence within its tier. Native skills use SKILL.md. | [Skills](https://geminicli.com/docs/cli/skills/) | 2026-10-19 |
| Subagents | Markdown definitions in `.gemini/agents` and `~/.gemini/agents` are documented. Verify feature settings and frontmatter for the installed version. | [Subagents](https://geminicli.com/docs/core/subagents/) | 2026-10-19 |
| Extensions | Native extensions bundle capabilities. Claude plugin installation is not established by this fact; use explicit reading for this kit. | [Extensions](https://geminicli.com/docs/extensions/) | 2026-10-19 |
| Hooks | Gemini has native hooks including BeforeTool. Its event/output schema differs from Claude's. Write and test a native adapter instead of reusing the shipped hook unchanged. | [Hook reference](https://geminicli.com/docs/hooks/reference/) | 2026-10-19 |
| Policy | User `~/.gemini/policies/*.toml` supports allow, deny, and ask_user with priorities. The current page explicitly marks workspace policies disabled. Do not put mandatory policy only in project `.gemini/policies`. | [Policy engine](https://geminicli.com/docs/reference/policy-engine/) | 2026-10-19 |
| MCP | settings.json uses `mcpServers`. Stdio supports command/args; HTTP uses httpUrl, SSE uses url. Tool inclusion/exclusion and trust controls are documented. Do not copy another client's transport keys blindly. | [MCP](https://geminicli.com/docs/tools/mcp-server/) | 2026-10-19 |

## Cursor

| Area | Documented fact and adapter consequence | Source | Accessed |
|---|---|---|---|
| Project rules | `.cursor/rules/*.mdc` uses description, globs, and alwaysApply metadata. Plain .md is not the same rule format. | [Rules](https://cursor.com/docs/rules) | 2026-10-19 |
| AGENTS and precedence | Root and nested AGENTS.md are supported; nearer instructions win. Team, Project, then User Rules are merged with earlier sources winning conflicts. User Rules are managed in Customize > Rules. A stable on-disk User Rules schema is not documented on this page. | [Rules](https://cursor.com/docs/rules) | 2026-10-19 |
| Skills | Project/user `.cursor/skills` and `.agents/skills` are documented. Native skill discovery and cloud availability need separate checks. | [Skills](https://cursor.com/docs/skills) | 2026-10-19 |
| Subagents | Project `.cursor/agents` and user `~/.cursor/agents` hold Markdown agent definitions. Verify the native frontmatter before conversion. | [Subagents](https://cursor.com/docs/subagents) | 2026-10-19 |
| Plugins | Cursor has its own plugin/marketplace mechanism. This kit's plain-file route does not claim Claude manifest compatibility. | [Plugins](https://cursor.com/docs/plugins) | 2026-10-19 |
| Hooks | `~/.cursor/hooks.json` and project `.cursor/hooks.json` are documented. Native events include preToolUse, beforeReadFile, and beforeShellExecution. Matching hooks combine; deny takes precedence over ask and allow. | [Hooks](https://cursor.com/docs/hooks) | 2026-10-19 |
| MCP | Project `.cursor/mcp.json` and user `~/.cursor/mcp.json` use mcpServers. Stdio uses command/args; remote configuration uses url. Collision precedence is not documented on the inspected page. | [MCP](https://cursor.com/docs/mcp) | 2026-10-19 |

## Discovery boundary

The scanner checks the user roots above, shared `~/.agents/skills`, recognized instructions in the supplied repo and its ancestors, and nested tool directories. With an explicit HomeRoot, it ignores the caller's real CLAUDE_CONFIG_DIR and CODEX_HOME, so fake-home tests stay isolated. Without HomeRoot, it adds those two overrides when set.

Use RootsCsv for other profiles, system paths, launchers, approved schedule exports, mods, remote exports, or managed-file locations. It accepts literal roots; it does not evaluate configuration or environment references inside them. It does not inspect editor databases, registry, managed cloud policy, keychains, or authenticated accounts.

No universal location or discovery contract for owner-defined scope files, launchers, status-line mods, schedules, history encodings, or memory formats is documented across all four tools. Inventory them from owner-supplied roots and installed documentation. Preserve state; do not invent a universal migration rule.

## Facts left open

| Fact | Status and next check |
|---|---|
| Stable Cursor User Rules storage and MCP collision precedence | Not documented in the inspected pages; inspect current UI and a safe fixture |
| A general Gemini profile-home environment override | Not established by the inspected docs; use explicit approved roots |
| Stable cross-tool history remapping or atomic-rewrite contract | Not documented as a portable contract; test native resume and rewrite behavior |
| A portable API for private UI mods or scheduled runners | Not documented; inspect installed public contracts separately |
| This kit loading in a real provider session | Needs checking; no provider sessions were started during build |
| macOS/Linux scripts and filesystem semantics | Untested; perform the platform pilot before use |

These are limitations of the verified matrix, not claims that a feature cannot exist.

