# harnesskit

Reconcile an AI agent setup across tools and accounts. Start with the owner's needs. Inventory what exists, decide what belongs together, and connect each tool to a canonical configuration repository.

The kit is a Claude Code plugin and a plain-file workflow for Codex, Gemini CLI, Cursor, or another agent with local file access. It does not install tools, move credentials, change accounts, or enable hooks on installation.

## Start

Open this folder in your agent and ask:

> Read AGENTS.md. Use harnesskit to understand my tools and goals. Start with intake and read-only discovery.

For Claude Code, add this local folder as a marketplace, then install the plugin through the conversation:

```text
/plugin marketplace add <CONFIG-REPO>
/plugin install harnesskit@harnesskit
```

Here, replace `<CONFIG-REPO>` with the absolute path to this kit checkout. Review the plugin prompt. Invoke `/harnesskit:harnesskit`. Keep the entire skill folder together. See the [first-run guide](docs/USAGE.md) and [dated installation sources](skills/harnesskit/references/tool-matrix.md).

## What a run produces

| Stage | Result |
|---|---|
| Understand and discover | Intake, configuration inventory, loading evidence, usage report |
| Analyse and decide | Findings, short owner questions, decisions, canonical layout |
| Restructure and link | Reviewed adapter plan, retained originals, verified backups |
| Guard and verify | Per-tool enforcement matrix, fixtures, fresh-session checks |
| Hand over | STATE, bootstrap plan, doctor results, restore guide, deferred work |

Read the [procedure](skills/harnesskit/SKILL.md). Do not jump to apply.

## What the scripts prove

Verified: the synthetic Windows smoke suite runs on PowerShell 5.1 and Node 24. It checks metadata discovery, reviewed file replacement, directory junctions, backups, idempotence, drift detection, restore of an ordinary file, and guard decisions.

Needs checking: each owner's real tool versions, effective loading, credentials, native permissions, and hook wiring. The shell entry points and macOS/Linux filesystem behavior are untested.

Discovery and doctor do not change configuration. They write only a new report when requested. Apply defaults to a dry run with no filesystem writes. Execution needs a reviewed plan hash. Existing ordinary files are backed up and retained in an archive before replacement. Conflicts stop the run.

Scripts need Node 18 or newer on PATH; only Node 24 was tested. No package installation is required. The wrappers share one [engine](skills/harnesskit/scripts/engine.mjs) to keep safety checks consistent.

## Boundaries

Instructions are advice. A hook is a tool-level control. Neither prevents a same-user process from bypassing it. Use an external boundary for secrets and other policies that must withstand bypass. The [enforcement matrix](skills/harnesskit/references/policy-enforcement.md) states the gaps.

Keep runs private. Paths and filenames can identify people. Never attach real inventories, histories, settings, or logs to public issues. See [SECURITY.md](SECURITY.md).

```powershell
powershell.exe -NoProfile -File .\tests\smoke.ps1
```

Tests retain their fixtures under ignored `runs/`. No live provider session is started.

MIT licensed. See [LICENSE](LICENSE).

