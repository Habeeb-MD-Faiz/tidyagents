# Windows recipes

Verified: synthetic tests ran on Windows PowerShell 5.1 with Node 24. These recipes do not certify provider loading or OS isolation.

Use native absolute Windows paths chosen by the owner. Keep scripts ASCII or use an encoding PowerShell 5.1 can parse. Check existing line endings before editing. Use -LiteralPath for PowerShell file operations, because wildcard expansion can select the wrong file.

```powershell
$kitRoot = '<CONFIG-REPO>'
$homeRoot = '<OWNER-HOME>'
$repoRoot = '<SCOPE>'
$recordRoot = '<PRIVATE-RUN>'
$scriptRoot = Join-Path $kitRoot 'skills\harnesskit\scripts'
& powershell.exe -NoProfile -File (Join-Path $scriptRoot 'discover.ps1') -HomeRoot $homeRoot -RepoRoot $repoRoot -OutputCsv (Join-Path $recordRoot 'inventory.csv')
if ($LASTEXITCODE -ne 0) { throw 'Discovery incomplete' }
```

Choose an existing private report parent outside the scan. See USAGE for planning and apply. Use a new output file each time.

Resolve executable paths with `Get-Command node,powershell.exe`. Inspect only selected non-secret launcher fields. Never dump environments, process command lines, or auth state merely to identify a profile.

Use directory junctions only for newly created directory adapters on Windows. They share the target's contents, so writing inside either path changes the same tree. A private scratch agent under a shared agents link is not private.

If a symlink needs privileges unavailable to the owner, choose a generated copy or defer. Do not change system policy or elevate automatically. The smoke suite proves junctions on its test machine, not every Windows filesystem.

For link deactivation, review one exact link and a fresh sibling archive path. Print the resolved paths. Inspect `Get-Item -LiteralPath $linkPath -Force`, then use `Move-Item -LiteralPath $linkPath -Destination $retainedPath` only after confirming it is the link object. Never recurse or remove the destination tree. Recheck the retained link and its target.

| Trap | Rule |
|---|---|
| PowerShell 5.1 lacks newer operators | Use explicit if blocks |
| Variables ignore case; args is automatic | Use descriptive distinct names |
| Short helper names collide with aliases | Use unique function names |
| Native stderr becomes an error record | Record native exit immediately; do not infer status from text |
| Inner quotes get stripped | Pass argument arrays; put complex logic in a file |
| -Include with -LiteralPath can mislead | Filter names before reading |
| Cross-shell paths lose backslashes | Stay in one native shell |
| Parser check prints a false zero | Initialize parser refs and inspect actual errors |
| New installs leave parent PATH stale | Validate the intended executable in a fresh shell |
| Ordinary long-path enumeration fails | Record failure; narrow roots, do not report an empty tree |

No disk operations, ACL changes, installs, PATH edits, auth flows, or scheduled tasks are performed by these helpers.

