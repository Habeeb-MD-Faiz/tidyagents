# STATE: harnesskit build

Updated: 2026-10-19 by build agent.

## Goal

Deliver a shareable, anonymized harness reconciliation kit with owner-led phases, adapters, preservation, enforcement gaps, smoke tests, and a review handoff.

## Current state

- Verified: all requested deliverable categories exist under this kit.
- Verified: Windows PowerShell 5.1 and Node 24 synthetic smoke passed.
- Verified: release checks passed for source anonymity patterns, local links, manifests, CSV examples, and skill length.
- Needs checking: live provider loading, plugin installation, real hook wiring, other OS behavior, and non-junction symlink creation.
- See BUILD-NOTES.md for exact boundaries and undocumented tool facts.

## Decisions

- Use one dependency-free Node engine behind the PowerShell and shell entry points, because safety behavior must stay consistent.
- Keep discovery metadata-only unless exact file contents are cleared, because settings may mix credentials.
- Require a pinned reviewed plan for execution, because a draft CSV is not approval.
- Keep all originals and synthetic test runs, because failures need recovery evidence.
- Ship an optional Claude-only guard with conservative asks, because hook schemas and coverage vary.
- Provide bootstrap through the same apply contract, because a second restore engine would drift.

## Rejected options

- Generic settings deep merge: it can damage unrelated fields and credential state.
- Automatic profile/history consolidation: it requires separate owner-controlled preservation and native tests.
- Portable enforcement claims: current tools have different boundaries.
- Deletion-based cleanup: originals and partial outputs must remain.

## Owner constraints, verbatim

- "Do NOT run git commit; the lead commits."
- "Anonymize completely."
- "Every real failure in the notes becomes a pitfall: symptom → cause → fix → rule."

## Open threads / next three steps

1. Lead reviews BUILD-NOTES.md, adapter-contract.md, guard, and tests.
2. Run a synthetic provider session to verify plugin loading and hook interception.
3. Test macOS/Linux adapters before use on those platforms.

Waiting on owner: nothing required for the build; final name is deferred.

## Pointers

- README.md: entry point and boundaries.
- skills/harnesskit/SKILL.md: reconciliation procedure.
- skills/harnesskit/references/tool-matrix.md: dated vendor evidence.
- docs/BUILD-NOTES.md: validation and unknowns.
- tests/smoke.ps1: retained synthetic Windows suite.
- tests/release-check.mjs: read-only package and identifier checks.
- runs/: ignored private synthetic evidence; do not share.
- Branch: main. No commits or pushes made.

