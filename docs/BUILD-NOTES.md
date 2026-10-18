# Build notes

Date: 2026-10-19. Version: 0.1.0. Working name: harnesskit.

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

- Needs checking: live plugin installation, vendor CLI plugin validation, and effective instruction/skill/subagent loading. Static packaging checks passed; no provider process was started.
- Needs checking: real hook wiring, native permissions, MCP auth, actual account identity, and outgoing capability boundaries.
- Untested: macOS/Linux shell entry points and filesystem behavior; Windows file/directory symlink creation requiring platform permissions. Windows junctions were tested.
- Untested: Node versions other than 24, despite the intended Node 18+ baseline.
- Not implemented: automatic credential migration, history consolidation, managed cloud/registry discovery, generic settings merge, link replacement, software installation, or scheduled execution. The workflow provides owner-led steps and explicit gaps for these cases.
- Not guaranteed: hostile-race resistance, transactional rollback, ACL/alternate-stream/extended-attribute preservation, cloud-placeholder handling, or same-user secrets isolation. Use locally hydrated ordinary files and a single writer.
- Discovery intentionally excludes .git, node_modules, runs, archives, and archive directories, records those exclusions, and caps enumeration at 50,000 entries. Approve narrower follow-up roots when needed.
- Generic apply cannot archive whole existing profile directories. Stage canonical files separately and keep profiles/history intact. New directory links need unused targets.

## Open owner/run questions

No answer is required to complete this kit build. Each real run must choose scopes, profiles, model classes, content clearance, enforcement boundaries, and acceptance checks. The final project name remains a later decision; harnesskit is used consistently.

## Review next

Run the smoke and release checks. Inspect the adapter contract and optional guard. Then perform a synthetic live provider pilot before using the kit on real configuration. Commit only after lead review.

