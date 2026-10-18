# Canonical layout
<!-- Layout = proposed editable sources; ownership = who edits each fact; adapters = consumers; excluded = private state kept elsewhere. Replace this example to match the owner. -->
```text
<CONFIG-REPO>/
  AGENTS.md
  scopes/<SCOPE>.md
  profiles/<PROFILE>.md
  skills/
  agents/
  adapters/<TOOL>/
  hooks/
  docs/
```

| Source | Owner/editor | Consumer | Reason |
|---|---|---|---|
| AGENTS.md | <OWNER> | Reviewed per-tool adapters | One source for shared rules |

Excluded from tracked content: auth, secrets, histories, private inventories, and machine-specific state.
Example decision: D-01 stages a scope rule without copying private project details into global instructions.

