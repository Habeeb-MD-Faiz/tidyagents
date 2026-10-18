# Policy and enforcement

This is a design map, not an installed configuration. Vendor mechanisms and dates are in [tool-matrix.md](tool-matrix.md). Record the exact local rule and observed result in policy-matrix.csv.

| Policy | Claude Code | Codex | Gemini CLI | Cursor | Residual gap / required boundary |
|---|---|---|---|---|---|
| Follow owner writing and scope rules | Advice only: instruction files | Advice only: AGENTS | Advice only: context files | Advice only: rules/AGENTS | Model compliance is not access control |
| Do not read secrets | Native permission rules plus optional shipped hook | Native sandbox/permission profile; separately reviewed native hook | Native user/admin policy and separately reviewed BeforeTool hook | Separately reviewed beforeReadFile/preToolUse hook | External boundary: keep secret bytes outside agent OS identity or expose a narrow broker |
| Ask before config changes | Optional shipped hook asks for recognized config writes and all shell calls | Native approvals/protected paths; hook if configured | Native policy ask_user; hook if configured | Native hook ask decision if configured | Same-user edits or other tools can bypass local controls |
| Ask before system changes | Native approval plus shipped hook asks on all shell calls | Native sandbox and approvals | Native policy and sandbox selected for runtime | Native approval/hook selected for runtime | External boundary: restricted OS account or administrator-controlled service |
| Prevent unapproved sending/publishing | Native tool permissions and optional guard asks on unfamiliar tools | Native MCP filters and approvals | Native policy/tool filters | Native hook/MCP controls | External boundary: service credentials and destination restrictions; inspect tool effects |
| Keep identities separate | Advice only plus explicit launcher/profile check | Advice only plus profile check | Advice only plus explicit launcher check | Advice only plus workspace/account check | External boundary: separate service accounts or OS identities; profile labels are not proof |
| Preserve histories and originals | Advice only in model; apply script preserves supported ordinary files | Same | Same | Same | External boundary: owner-managed backups and retention; kit does not govern unrelated processes |
| Restrict child credential use | External boundary recommended | External boundary recommended | External boundary recommended | External boundary recommended | A wrapper injecting env into arbitrary commands is not isolation |
| Enforce budget or schedule | Advice only unless external controller exists | Same | Same | Same | External boundary: authoritative quota/scheduler; stale warnings are not hard limits |
| Prevent disabling the guard | External boundary required | External boundary required | External boundary required | External boundary required | Store mandatory policy outside the agent's write authority |

The shipped guard only implements its documented Claude rows. Other hook cells name native mechanisms to design and test, not supplied integrations. Current Gemini docs warn that workspace policy files are disabled; use verified user/admin enforcement.

For MCP, distinguish registration, available tool, authenticated service, permitted operation, and observed successful read. Do not allow unknown tools by naming convention. Approve exact capabilities, including side effects and destination scope.

Treat a model-based judge as advice. A probabilistic classification must not create owner approval. If a control is unavailable, choose a stricter external boundary or record advice only and the owner's accepted limitation.

