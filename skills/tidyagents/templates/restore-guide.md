# Restore guide
<!-- Prerequisites = installed tools and stopped writers; artifacts = source/plan/backups; bootstrap = recreate adapters; rollback = retain successor then restore; validation = file and runtime evidence; owner-only = credentials and privileged steps. -->

## Prerequisites
Example: install the approved tool separately; stop its writer; choose new private evidence paths.

## Artifacts
| Item | Location | Integrity check |
|---|---|---|
| Canonical instructions | <CONFIG-REPO>/AGENTS.md | Pinned SHA-256 |
| Reviewed plan | <PRIVATE-RUN>/adapter-plan.csv | Owner-reviewed plan SHA-256 |
| Original and backup | archive-manifest.csv pointers | Prior target hash |

## Bootstrap
Review paths and preconditions for this machine. Preview bootstrap.ps1 or bootstrap.sh. Execute only with the reviewed plan hash.

## Rollback
For an ordinary file, use the verified backup as source in a new copy plan and pin the current target hash. Retain the successor through apply.
For a new link, review relocation of that exact link object into a fresh sibling archive. Never recurse or remove its target.

## Validate
Run doctor, fresh loading, identity confirmation, and an owner-selected native resume test.

## Owner-only steps
Sign in privately. Restore secrets through the owner's secure process. Do not include values here.

