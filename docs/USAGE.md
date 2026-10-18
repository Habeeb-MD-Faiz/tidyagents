# First run

You need an installed agent with local file access, permission to use it with the selected data, and time to answer owner questions. The kit supplies a procedure and bounded file helpers. It does not supply accounts or install tools.

## Load the procedure

For any agent, open this kit and ask it to read AGENTS.md and start intake. This is an explicit reading request, not a claim of automatic discovery.

For Claude Code, follow the local marketplace commands in README. Review the installation, then invoke the namespaced skill. No hook is installed automatically. Installation formats and sources are in the [tool matrix](../skills/tidyagents/references/tool-matrix.md).

Keep the entire skills/tidyagents folder together. Its references and scripts are part of the workflow.

## Prepare private records

Agree on scan roots, excluded data, and a private record directory outside scanned trees. Keep runs out of public repositories and plugin caches. The repository's ignored runs folder is suitable for synthetic tests.

Start STATE and intake from templates. Label facts verified, inferred, or needs checking. The owner confirms accounts; do not inspect auth files.

CSV templates have comment lines starting with # and one non-executable example. Replace examples. The scripts accept comments; remove comments from a copy for a spreadsheet importer if needed. Import every path as text, because a filename can look like a formula.

## Discover on Windows

Require PowerShell 5.1 and an existing Node 18+ on PATH. Node 24 is tested. Replace all placeholders with approved absolute paths.

```powershell
$kitRoot = '<CONFIG-REPO>'
$homeRoot = '<OWNER-HOME>'
$repoRoot = '<SCOPE>'
$recordRoot = '<PRIVATE-RUN>'
$scriptRoot = Join-Path $kitRoot 'skills\tidyagents\scripts'
$inventoryPath = Join-Path $recordRoot 'inventory.csv'
& powershell.exe -NoProfile -File (Join-Path $scriptRoot 'discover.ps1') -HomeRoot $homeRoot -RepoRoot $repoRoot -OutputCsv $inventoryPath
if ($LASTEXITCODE -ne 0) { throw 'Discovery is incomplete' }
```

The record directory must already exist. Choose a new report filename. With HomeRoot, the scan ignores the current shell's real profile overrides. Omit HomeRoot only when intentionally scanning the current user's defaults and documented overrides.

Discover lists metadata, skips secret-looking names without reading them, and records links without following them. It never reads ordinary file contents by default. An optional ApprovedFilesCsv with a single path column permits hashes of exactly those cleared files. It cannot authorize reading opaque names.

Add other profiles, system files, launchers, and approved exports with RootsCsv containing path,tool. The scanner does not discover every managed service or editor database. Fill the coverage table and unknown list manually.

## Decide and stage

Review findings and answer the short question batches. Approve the canonical layout, scope/account rules, model classes, and enforcement gaps.

Stage ordinary non-secret files in the canonical repository. Leave originals intact. Do not put credentials or histories in it. For settings, prepare and review a narrow merged file that preserves unrelated fields. Mixed credential settings require owner-handled changes outside generic apply.

Create target parents as a separate reviewed preparation step. Do not use a secret-looking name for the run directory. No placeholder is expanded by the scripts.

## Build a reviewed plan

Use the exact columns from templates/adapter-plan.csv. Supported operations are file copy and new links. Read the [adapter contract](../skills/tidyagents/references/adapter-contract.md) before selecting paths.

For a cleared file or directory, calculate its fingerprint:

```powershell
$sourcePath = '<CANONICAL-SOURCE>'
& node (Join-Path $scriptRoot 'engine.mjs') fingerprint --path $sourcePath --content-reviewed yes
if ($LASTEXITCODE -ne 0) { throw 'Fingerprint failed' }
```

Record the source fingerprint and the existing target fingerprint, or absent. Content clearance means the owner established that the entire selected source and target are non-secret. A SHA-256 value is not a secret scan.

Set reviewed and content_reviewed to yes only after those reviews. Link the owner decision. Those fields and the plan hash prevent accidental stale execution; they do not authenticate the human.

## Preview, apply, and check

```powershell
$planPath = Join-Path $recordRoot 'adapter-plan.csv'
& powershell.exe -NoProfile -File (Join-Path $scriptRoot 'apply.ps1') -Plan $planPath
if ($LASTEXITCODE -ne 0) { throw 'Preview failed' }
```

The preview changes nothing. Read every row and the printed PLAN SHA256. Have the owner approve that exact plan. Stop affected tools and competing writers.

```powershell
$reviewedHash = '<REVIEWED-PLAN-SHA256>'
$attemptPath = Join-Path $recordRoot 'apply-01'
& powershell.exe -NoProfile -File (Join-Path $scriptRoot 'apply.ps1') -Plan $planPath -RunDir $attemptPath -ReviewedPlanSha256 $reviewedHash -Execute
if ($LASTEXITCODE -ne 0) { throw 'Apply stopped; keep all artifacts' }
& powershell.exe -NoProfile -File (Join-Path $scriptRoot 'doctor.ps1') -Plan $planPath -OutputCsv (Join-Path $recordRoot 'doctor-01.csv')
if ($LASTEXITCODE -ne 0) { throw 'Drift or incomplete check' }
```

Use a new attempt directory each time. Apply creates it only after preflight. Inspect change-log.csv and archive-manifest.csv. Existing ordinary targets are backed up and retained beside the target before replacement. No delete operation is used. New links require absent targets.

Repeat the same authorized plan with a fresh unused RunDir to prove no-op behavior. If everything is already current, that directory is not created. Do not relax a precondition to make an unexpected state pass.

| Result | Meaning |
|---|---|
| discover exit 0 | Selected scan completed; read exclusions before claiming coverage |
| discover exit 2 | Invalid input or incomplete access; investigate |
| dry run exit 0 | Plan preflight passed; no change made |
| apply exit 0 | Supported rows applied or already current |
| doctor exit 0 | Files and links match at check time |
| doctor exit 1 | Drift or unmet plan state |
| other exit 2 | Invalid input or operational refusal |

No command proves real tool loading, identity, or enforcement. Complete phase 7 in fresh sessions.

## Guard and restore

The optional guard is Claude-specific and deliberately conservative. Prepare its non-secret policy and exact registration through phase 6. Native permissions and external isolation remain necessary for mandatory controls.

Bootstrap accepts the same parameters as apply and is dry by default. It recreates adapters from a reviewed plan on a prepared machine. It does not install software or restore authentication.

To restore an ordinary file, use the verified backup as source in a new plan. Pin the current successor hash. Apply retains that successor before restoring the old bytes. For a created link, use the separately reviewed single-link relocation procedure in the Windows reference. Never remove its target.

Keep a private restore guide and deferred list. Choose doctor frequency with the owner; no schedule is created automatically.

## Run the synthetic smoke test

From the kit root:

```powershell
powershell.exe -NoProfile -File .\tests\smoke.ps1
```

Or pass -WorkDir with a new nonexistent local path. The suite retains every fixture and exits nonzero on failure. It checks fake Claude/Codex/Gemini/Cursor roots, dry-run purity, apply, backups, junctions, idempotence, deliberate drift, restore, refusals, and guard JSON decisions.

The shell versions use --home, --repo, --plan, --run, --output, --reviewed-plan-sha256, and --execute. See [macOS/Linux recipes](../skills/tidyagents/references/recipes-macos-linux.md). They are untested on those platforms.

If a run stops, retain originals, backups, logs, and partial targets. Record the last verified step in STATE. Ask for the smallest missing fact; do not widen permissions or clean up evidence to get a green result.

