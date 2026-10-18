# Phase 5: link tools through adapters

Read the adapter contract and tool matrix. Build a separate pilot plan for one tool/profile before broad changes.

Declare the source, consumer path, mechanism, scope, precedence, encoding, behavior on tool rewrite, backup, restore, tests, and unsupported features. Render import wrappers into staged source files. For a settings change, stage a narrow, reviewed merged result that preserves unrelated fields. Never apply a generic deep merge across arrays or credential-bearing settings.

Pin source hashes and expected existing-target hashes. Use `absent` only after checking absence. Mark reviewed/content_reviewed yes only after actual review. Record the decision reference.

Preview the full plan. The scripts require concrete local absolute paths and existing target parents. Review storage and stop concurrent writers. Review the plan SHA-256 printed by dry run, then execute that exact hash with a new private run directory.

The engine backs up each replaced ordinary file, verifies it, retains the original in a sibling archive, and creates the successor without overwrite. New links require an absent target. Conflicting links and existing directories stop. It does not delete or recursively move trees.

Run doctor immediately. An identical second apply must be a no-op. Test fresh loading before expanding to the next profile. Keep each account's unrelated local settings intact.

Gate: manifests, doctor, idempotence, and the pilot's fresh-session evidence pass. Activation of broader scopes needs its own reviewed plan.

