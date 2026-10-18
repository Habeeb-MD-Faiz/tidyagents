# Externalize an embedded MCP credential

Use this owner-run recipe from phases 2 and 6. The agent names only the containing file and key name. It never reads, prints, copies, backs up, hashes, compares, or tests the value. Stop content review of the mixed file until the owner has finished and cleared it.

## Owner steps

1. Stop the affected tool and other writers. Identify the server and credential key yourself. Keep the value out of chat, command arguments, transcripts, exports, and kit records.
2. Put the value in a user environment variable with the name the server expects, such as `API_KEY`. On Windows, open **Edit environment variables for your account**, create that user variable, and enter its value privately. Alternatively, save it through your OS/user secret store's own interface and use your existing trusted launcher to inject just that variable into the tool process. A store entry alone does not populate an environment variable. Store-specific retrieval commands are unverified here; have the owner establish that launcher before continuing. Do not create a plaintext credential file for this recipe.
3. In your editor, replace the literal using the matching fragment below. Preserve the server's existing command, arguments, and unrelated settings. Remove any competing literal assignment for the same key. For Codex, remove the `env.API_KEY` entry and add its name to `env_vars`, preserving other forwarded names. Do not add a literal fallback.
4. Save the changed file. Start a new tool process from the environment or launcher you prepared; existing processes may retain the old environment. Any credential-use or authentication check is owner-run, outside agent observation. Report only the outcome, never a value or environment dump.
5. Clear the entire changed file as non-secret before agent review, hashing, or ordinary backups. If other credentials remain, provide the safe export described below instead. Keep that mixed file outside generic apply.

## Tool-native reference fragments

Verified against vendor docs on 2026-10-19; URLs and limits are in [BUILD-NOTES](../../../docs/BUILD-NOTES.md#k01-vendor-verification). These fragments belong inside an existing local STDIO server definition; they do not install or start a server.

| Tool and config | Fragment inside the server entry |
|---|---|
| Claude Code project `.mcp.json`, `mcpServers.<server>` | `"env": {"API_KEY": "${API_KEY}"}` |
| Codex `config.toml`, `[mcp_servers.<server>]` | `env_vars = ["API_KEY"]` |
| Gemini CLI `settings.json`, `mcpServers.<server>` | `"env": {"API_KEY": "${API_KEY}"}` |
| Cursor `.cursor/mcp.json`, `mcpServers.<server>` | `"env": {"API_KEY": "${env:API_KEY}"}` |

Claude Code settings distinction: `settings.json` is not the project MCP server registry. If its top-level `env` contains the literal, the owner removes that assignment after supplying the variable externally, then uses the `.mcp.json` server reference. User/local MCP entries live in `.claude.json`, which remains opaque to the agent. Expansion in a top-level settings `env` value is **unverified**; do not transplant the MCP fragment there.

Codex uses name forwarding here, not `${API_KEY}` interpolation in a TOML `env` value. That interpolation is **unverified**. Direct secret-store references and runtime expansion on every installed tool version are also **unverified**. Do not guess syntax for them.

## Check without the value

After full content clearance, the agent checks only the new shape: JSON's named key must hold the complete reference from the table, with no literal prefix, suffix, or fallback. For Codex, `env_vars` must contain the key name and `env` must no longer assign that key. Any other shape fails the check; never print the rejected slot. No old-value comparison, secret search, environment read, or authenticated MCP call is needed.

If the file remains mixed, the owner supplies a new non-secret export containing only the filename, key name, the replacement reference (or forwarding name), and booleans `reference_present` and `literal_slot_absent`. The owner checks these against the saved file privately. The agent can verify the export's shape and record the owner's attestation; the underlying file remains **needs checking by owner**, not agent-verified. A merely redacted placeholder does not prove migration.

## Preservation and completion

Exclude the original credential-bearing file from kit backup, archive, hashing, and apply plans. Log the filename/key and `excluded: embedded credential; owner-handled` in the private preservation record, with no digest or content. The owner may keep their own protected copy outside kit backups. Only a fully cleared successor can enter a later ordinary backup plan; do not claim a backup of the original.

Synthetic fixtures use the same recipe. When the owner explicitly declares an obviously fake marker non-secret and authorizes that fixture's mutation, the run may complete the replacement and shape check itself, without inspecting, printing, comparing, testing, or backing up the old marker. Record that declaration and the backup exclusion. Use only the file-only track; this proves neither real credential migration nor authentication.

Gate: the selected slot has a documented reference/forwarding shape, the old literal assignment is absent, and the preservation exception is recorded. Missing clearance or uncertain syntax holds that item's work. Owner-only evidence must stay labeled as such; it must not silently become a verified live result.
