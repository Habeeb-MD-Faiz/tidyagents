# Adapter contract

An adapter connects a canonical source to a tool consumer. Declare this record before execution:

| Field | Required meaning |
|---|---|
| Consumer | Tool, version, surface, profile, scope, and starting directory |
| Source and target | Concrete absolute local paths; approved physical roots |
| Mechanism | Import wrapper, generated copy, new symlink, or Windows junction |
| Precedence | Competing sources and why this one will load |
| Content | Owner clearance, encoding, line endings, preserved unrelated settings |
| State | Pinned source fingerprint and expected target fingerprint or absence |
| Authority | Owner decision and exact reviewed plan hash |
| Preservation | Backup, retained original, interrupted-run recovery |
| Tests | File check, idempotence, live loading, isolation, rewrite, and restore |
| Limits | Unsupported settings, OS features, tool paths, or enforcement gaps |

## Executable plan

CSV columns, in this exact order:

```text
id,tool,profile,operation,source,target,source_sha256,expected_target,reviewed,decision,content_reviewed
```

Use the template's comments as the field dictionary. CSV quoting supports commas, quotes, CRLF/LF, and embedded newlines in cells. Paths must not contain control characters. Import paths as text in spreadsheets; CSV quoting does not neutralize formulas.

Supported operations:
- copy: ordinary file to absent target or an ordinary file with the expected hash.
- symlink: file or directory source to an absent target.
- junction: Windows directory source to an absent target.

No directory copying, hardlinking, link replacement, JSON merging, shell evaluation, or recursive relocation is implemented. Represent imports and narrow settings changes as pre-rendered ordinary files. Create target parent directories as a separate reviewed preparation step.

Source and target must be outside opaque paths. Their ancestors must not be links. Ordinary source/target files with multiple hardlinks are refused. UNC/device paths are refused. Overlapping source/target trees and overlapping plan rows are refused. Paths are local and concrete; placeholders are not expanded.

All rows are checked before any execution writes. Each row is rechecked before mutation. An already-correct target is a no-op even if the original target precondition no longer applies. This is the idempotence rule.

## Fingerprints

A file fingerprint is SHA-256 of its bytes. A directory fingerprint hashes the UTF-8 JSON serialization of sorted depth-first records. Each directory is `["directory","relative/path"]`; each file is `["file","relative/path","sha256"]`. Slashes are forward. The root itself is omitted. Empty child directories are included. Links, opaque names, special files, and hardlinked files stop the calculation.

Use the engine's fingerprint command so the algorithm is identical. Require content clearance for the whole tree. Hashes do not prove absence of secrets.

## Apply and failure

Default dry run prints the plan result and hash only. It creates no directory, lock, backup, or report. Execute requires that hash and a new run directory with an existing parent. A fully current execution returns no-op without creating the run directory.

Before replacing a file, copy it to the run's backup, verify its hash, then retain the original in `.tidyagents-archive/<run-name>-<id>/` beside the target. Record prepared and archived manifest rows. Create the successor exclusively and verify it. New files/links have no prior bytes to back up; the reviewed plan and change log record their creation.

Never delete files, even after success or failure. A failure may leave a backup, archived original, or partial successor. Stop and inspect the change log. Recover using a new reviewed plan, not automatic rollback.

This is single-writer tooling, not a transaction or security boundary. Stop tools and competing jobs. Rechecks reduce accidents but do not prevent hostile races, path substitution, or same-user bypass. Do not run plans concurrently.

## Doctor

Doctor checks source fingerprints, expected target existence, copy bytes, and link targets. Exit 0 means every row currently matches. Exit 1 means drift. Exit 2 means invalid input or an operational failure. Discovery uses 2 for incomplete access; intentional exclusions are reported without declaring full coverage.

Reports go to stdout by default. OutputCsv creates a new report in an existing parent outside scanned/planned trees. Existing report files are refused. The report is the only write by discover/doctor.

Doctor does not test instruction precedence, auth, hook interception, model behavior, permissions, or runtime loading. Use the verification report for those checks.

