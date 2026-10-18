# Phase 5: link tools through adapters

Read the adapter contract and tool matrix. Build a separate pilot plan for one tool/profile before broad changes.

Declare the source, consumer path, mechanism, scope, precedence, encoding, behavior on tool rewrite, backup, restore, tests, and unsupported features. Render import wrappers into staged source files. For a settings change, stage a narrow, reviewed merged result that preserves unrelated fields. Never apply a generic deep merge across arrays or credential-bearing settings.

Pin source hashes and expected existing-target hashes. Use `absent` only after checking absence. Mark reviewed/content_reviewed yes only after actual review. Record the decision reference.

Preview the full plan. The scripts require concrete local absolute paths and existing target parents. Review storage and stop concurrent writers. Review the plan SHA-256 printed by dry run, then execute that exact hash with a new private run directory.

The engine backs up each replaced ordinary file, verifies it, retains the original in a sibling archive, and creates the successor without overwrite. New links require an absent target. Conflicting links and existing directories stop. It does not delete or recursively move trees.

Run doctor immediately. Preview the same plan again and check its hash before the second apply; it must be a no-op. Keep each account's unrelated local settings intact. Record one of these tracks before the pilot:

| Track | Pilot gate before expanding | Completion and NO-GO |
|---|---|---|
| File-only (synthetic fixtures or explicitly staged, inactive files) | Reviewed plan and preview hash; manifests and preservation exceptions reviewed; doctor passes; previewed reapply is a no-op | May expand to other authorized fixture/staging profiles with their own plans. Complete only the file checks. NO-GO for a drift, unexpected write, missing preservation evidence, or unresolved required fixture item. Live activation remains unverified and is not authorized by this gate. |
| Live activation | All file-only evidence plus the pilot's fresh-session loading and intended scope/precedence checks pass | Each broader scope needs its own reviewed plan and activation approval. NO-GO for failed/missing live loading, wrong scope, unresolved required credential work, or a failed mandatory control. File doctor PASS alone never clears this gate. |

Use the same track in phase 7 and closeout. A file-only run records live loading, authentication, and enforcement as untested; it does not claim full live reconciliation. A required fixture item cannot be hidden by calling it a deferred live test. For owner-declared fake credentials, follow the [externalization recipe](externalize-mcp-auth.md).

