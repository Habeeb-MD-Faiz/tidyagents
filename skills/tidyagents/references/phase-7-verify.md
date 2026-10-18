# Phase 7: verify

Run smoke in an isolated fresh work directory. Run doctor on the real reviewed plan. Keep both reports and their limits.

Carry forward the [phase-5 track](phase-5-link-adapters.md). File-only runs require source/copy/link integrity, previewed no-op reapply, preservation (including recorded credential exclusions), and a synthetic restore. Mark the live behavior rows below untested; they gate live activation, not completion of an authorized file-only fixture run. Required unresolved fixture work still blocks file-only completion.

| Check | Evidence needed |
|---|---|
| Source integrity | Pinned source fingerprints still match |
| Generated copies | Target bytes match source |
| Links | Stored link target resolves to the planned source |
| Idempotence | Second apply changes nothing |
| Preservation | Backup and retained-original hashes match the prior target |
| Effective instructions | Fresh root and nested sessions show intended scope, with harmless sentinel behavior |
| Isolation | Unrelated scope does not receive scoped rules |
| Skills and agents | Intended entries appear and a harmless task invokes the correct body |
| Hooks | Real event reaches expected hook; ask and deny are observed |
| MCP | Declared, available, authenticated, and successful read are checked separately |
| Identity | Owner confirms intended provider, connector, and outgoing account |
| UI components | Owner sees the expected display, with fresh telemetry |
| History/memory | Owner-selected old session resumes; counts alone are insufficient |
| Restore | A synthetic restore succeeds and originals remain |

Use a temporary harmless rule with a unique synthetic phrase in a fixture scope. Record whether it loads at startup or only on relevant file access. Retain the fixture; do not leave it active in production.

Never use a real secret as a guard test. Do not send a message or make a business write to test a connector without explicit approval. Inspect the actual tool description; a read-sounding name may still change remote state.

Check invalid hook input, unknown tools, quoted shell syntax, secret-directory roots, links, and disabled/missing wiring. State bypasses openly. Check that deny or ask did not merely print a message while execution continued.

For scheduled runners, test timezone, actual account, approval source, child lifetime, lock identity, stale telemetry, timeout exit, and notification delivery in a separate authorized fixture. The kit ships no runner.

Gate: every required row passes or has an explicit owner-accepted limitation. A failed mandatory policy blocks activation.

