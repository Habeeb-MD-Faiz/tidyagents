# Phase 1: discover and measure

Read the dated tool matrix. Confirm installed versions before relying on current documentation. Capture the executable path and launch cwd without dumping environment values.

Run discover against the selected home and repository. It inventories names and metadata, not content. It records links without following them. Missing, excluded, unreadable, and metadata-only are distinct results.

The scanner covers documented per-user directories, recognized repo instruction names, nested tool directories, and ancestor instruction names within the selected boundary. Ancestors stop at an explicit containing HomeRoot, otherwise RepoRoot; choose another approved inclusive boundary with AncestorRoot. See the [command guide](../../../docs/USAGE.md#discover-on-windows). Path-component lstat safety checks are separate from instruction discovery. It does not query registry, managed policy services, editor databases, remote machines, or account connectors. Add owner-approved physical roots with a two-column `path,tool` CSV. Review system locations, launchers, shell profiles, status lines, mods, scheduled runners, and other machines separately.

Do not claim every config was found until the coverage table lists each tool/profile, root, source, result, exclusions, and next action. A denied scan is not an empty directory. A linked profile requires a separately approved scan of its physical target.

Classify records as instructions, rules, profiles, settings, hooks, skills, agents, MCP, models, launchers, UI components, schedules, history, memory, or unknown. File extensions alone do not establish purpose. The scanner's kind is a filesystem kind; put semantic classification in the usage report.

Before reading contents, have the owner clear exact ordinary files or supply sanitized exports. Optional approved-files CSV contains one `path` column. It enables hashing only those exact regular files. Hashes read contents. Secret-looking names remain opaque even when listed.

Map the load graph: launcher -> executable -> profile root -> global/project/local/managed settings -> instructions -> skills/agents/hooks/MCP. Record actual resolved paths, precedence, and duplicated registrations. Inspect a fresh session started at root, nested folder, and unrelated scope.

Measure three things separately:
- Declared: file or registration exists.
- Effective: current session reports loading it or a harmless fixture demonstrates it.
- Used: a dated, bounded sample shows invocation.

Use owner-cleared summaries for history analysis. Validate optional JSONL fields and record types. State roots, time window, denominator, resumed-session handling, missing timestamps, and duplicate-event counting. Never dedupe-delete transcripts.

Estimate context only with a named method. Characters divided by four is a rough estimate, not measured model tokens. Separate instruction text, skill descriptions, loaded skill bodies, MCP catalog/deferred schemas, and conversation history.

Gate: complete the coverage table and unknown list. Record valued but unobserved features for owner review, not removal.

