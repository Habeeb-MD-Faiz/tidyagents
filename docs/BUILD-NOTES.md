# Build notes

Date: 2026-10-19. Version: 0.1.0. Working name: tidyagents.

## Method and scope

Verified: the kit follows the supplied reconciliation extracts and the sister kit's phase/reference/template/script/agent/test structure. Source-run identifiers and owner-specific configuration were replaced with generic roles and placeholders. Current tool claims have official URLs and access dates in the tool matrix.

Verified: all build edits and synthetic test artifacts are inside this kit. No git commit, push, deployment, message, provider installation, auth flow, or real harness change was performed. The repository remains on its initial main branch with uncommitted files.

## Implementation decisions

| Decision | Reason |
|---|---|
| Add engine.mjs and lib/safety.mjs | Use one CSV parser, path policy, and apply implementation behind both OS wrappers |
| Require Node for all scripts | The guard already needs Node; avoid divergent PowerShell/shell safety behavior |
| Default discovery to metadata | Harmless-looking settings may contain credentials |
| Require exact content clearance before hashing | Hashing reads bytes even when it prints no content |
| Require reviewed plan SHA-256 for Execute | Prevent accidental execution of a changed plan |
| Require existing target parents | Keep the mutation list bounded and visible |
| Back up and retain replaced ordinary files | Preserve two recovery paths without deleting originals |
| Refuse conflicting links and directory replacement | Avoid accidentally traversing or moving live trees |
| Ship bootstrap wrappers | Make adapter restoration use the same reviewed, idempotent engine |
| Keep settings merge outside the engine | Key/array precedence and mixed secrets need a tool-specific review |
| Ask on every shell command and write in the optional guard | System effects cannot be classified reliably from filename or shell regex alone |
| Add fixtures.mjs and release-check.mjs | Keep smoke cases readable and make packaging/anonymity checks reproducible |
| Keep PULL_REQUEST_TEMPLATE.md at root | Match the requested layout without a duplicate template |
| Add this file and STATE.md | Preserve build evidence and a review handoff |

## Verified checks

Environment: Windows PowerShell 5.1.26100.9444 and Node 24.21.0.

Smoke exercises fake user/config roots for Claude Code, Codex, Gemini CLI, and Cursor. It checks metadata-only discovery, exact approved hashes, opaque name handling, nested rules, pure dry run, pinned execution, backups, retained originals, ordinary-file copies, junctions, idempotence, doctor drift, cross-row overlap refusal, missing parents, secret trees, hardlinks, CSV parsing, file restore, and guard decisions.

The last successful smoke ended:

```text
REFUSALS / RESTORE: PASS (conflicts, opaque paths, overlap, review, CSV, retained successor)
GUARD: PASS (direct secrets, linked secrets, asks, unknown tools, malformed input)
RETENTION: PASS (all synthetic originals and test artifacts kept)
SCOPE: synthetic Windows checks only; no live provider sessions tested
POWERSHELL 5.1 PARSE: PASS
SMOKE PASS
```

The release checker validates source files, local Markdown links, allowed official-source domains, JSON manifests, CSV example rows, skill length, PowerShell ASCII source, and prose dash rules.

Anonymity scan: source files passed a source-derived private-name pattern plus generic drive-path, email, and UUID checks. Public URLs are confined to official vendor documentation. The private matching pattern was passed to the checker at runtime and was not saved in the kit.

The scan excludes .git and ignored runs. Synthetic runs necessarily contain local absolute paths in executable plans and reports. Retain them privately and exclude runs from any shared copy or archive. A regex scan is evidence for these checked patterns, not a guarantee against every possible identifier.

## Facts not established by vendor documentation

| Fact | Status / follow-up |
|---|---|
| Cursor User Rules stable on-disk schema | Not documented in inspected rules docs; use the current UI and fixture |
| Cursor MCP duplicate-name precedence | Not documented in inspected MCP docs; test before resolving collisions |
| General Gemini profile-home environment override | Not established in inspected docs; use explicit approved roots |
| Portable history key remapping and memory migration | No common documented contract; preserve data and test native resume |
| Atomic-rewrite behavior of all config consumers | Not established as a portable contract; test the actual editor/tool |
| Cross-provider API for owner-installed UI mods or runners | No common contract established; inspect each tool's current public/build-local docs |

Do not turn these unknowns into claims that a feature is absent.

## Remaining validation and limits

- Verified: `claude plugin validate .` passed after the targeted sandbox fixes. Needs checking: live plugin installation and effective instruction/skill/subagent loading; manifest validation does not prove these.
- Needs checking: real hook wiring, native permissions, MCP auth, actual account identity, and outgoing capability boundaries.
- Untested: macOS/Linux shell entry points and filesystem behavior; Windows file/directory symlink creation requiring platform permissions. Windows junctions were tested.
- Untested: Node versions other than 24, despite the intended Node 18+ baseline.
- Not implemented: automatic credential migration, history consolidation, managed cloud/registry discovery, generic settings merge, link replacement, software installation, or scheduled execution. The workflow provides owner-led steps and explicit gaps for these cases.
- Not guaranteed: hostile-race resistance, transactional rollback, ACL/alternate-stream/extended-attribute preservation, cloud-placeholder handling, or same-user secrets isolation. Use locally hydrated ordinary files and a single writer.
- Discovery intentionally excludes .git, node_modules, runs, archives, and archive directories, records those exclusions, and caps enumeration at 50,000 entries. Approve narrower follow-up roots when needed.
- Generic apply cannot archive whole existing profile directories. Stage canonical files separately and keep profiles/history intact. New directory links need unused targets.

## K01 vendor verification

Checked 2026-10-19 by web search and opening the official pages. These are documentation checks, not live credential or provider tests. The [owner-run recipe](../skills/tidyagents/references/externalize-mcp-auth.md) uses only the verified local STDIO forms.

| Tool | Verified form and source | Limits |
|---|---|---|
| Claude Code | `.mcp.json` server `env` supports `${NAME}`: [MCP variable expansion](https://code.claude.com/docs/en/mcp#environment-variable-expansion-in-mcpjson). [Settings files](https://code.claude.com/docs/en/settings) distinguishes settings from `.claude.json` MCP state. | Top-level settings `env` interpolation is unverified. Remove an obsolete literal there through the owner; use the documented MCP reference. The agent does not inspect `.claude.json`. |
| Codex | `[mcp_servers.<server>]` supports `env_vars = ["API_KEY"]` to forward the named environment variable: [MCP configuration](https://developers.openai.com/codex/mcp), now redirected to [MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli). | Remove the literal `env.API_KEY` assignment. `${...}` interpolation in TOML `env` is unverified; do not substitute it for forwarding. |
| Gemini CLI | Server `env` in `settings.json` supports `${NAME}` and `$NAME`: [MCP environment expansion](https://geminicli.com/docs/tools/mcp-server/#environment-variable-expansion). | The recipe uses `${NAME}`. Explicit `env` mapping is needed for sensitive names sanitized from inherited environment. |
| Cursor | Server `env` in `mcp.json` supports `${env:NAME}`: [MCP config interpolation](https://cursor.com/docs/mcp#config-interpolation). | This documents the config shape; installed IDE/CLI versions still need their own owner-run activation check. |

Unverified: direct OS/user secret-store reference syntax, store-specific retrieval commands, top-level Claude settings interpolation, Codex TOML `env` interpolation, and runtime expansion/authentication on installed providers. The recipe uses an owner-supplied environment or established store launcher; it does not guess a portable secret-store API.

## Targeted sandbox fixes

Verified by source review: K01 adds the shared owner-run externalization recipe and backup exception; K02 bounds ancestor discovery separately from lstat safety; K03 separates file-only and live gates; K04 previews positive fixture executions and pins each printed hash; K05 adds stderr run summaries without changing doctor CSV columns or adapter exit-code semantics.

Regression coverage: fixture parent rules excluded by default and explicit repo boundary, inclusive home/explicit boundaries, invalid boundary refusal, zero-write previews for apply/no-op/restore, labeled negative preview/Execute refusals, and doctor blocked/deferred counts, unchanged CSV, unresolved coverage, drift, and invalid records. Retained smoke runs remain private.

Verified on 2026-10-19: `tests/smoke.ps1` finished with `SMOKE PASS`, including PowerShell 5.1 parse checks. `claude plugin validate .` finished with `Validation passed`. `git diff --check` found no whitespace errors in these fixes. No commits, pushes, or deployments were made.

Release gate currently blocked: `node tests/release-check.mjs` exits 1 with `Non-vendor URL: README.md`. The concurrently edited README links to the project website, which the existing vendor-source allowlist rejects. README and assets were excluded from this fix job's edits; the release checker was not weakened. The earlier release PASS above describes the original build, not this working tree. Rerun the release check after the separate README compatibility decision.

## Open owner/run questions

The current release gate needs the separate README compatibility decision described above. Each real run must choose scopes, profiles, model classes, content clearance, enforcement boundaries, and acceptance checks. The final project name remains a later decision; tidyagents is used consistently.

## Review next

Run the smoke and release checks. Inspect the adapter contract and optional guard. Then perform a synthetic live provider pilot before using the kit on real configuration. Commit only after lead review.

