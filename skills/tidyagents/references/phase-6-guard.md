# Phase 6: translate policy into controls

Fill a row per policy and per tool using policy-enforcement.md. Name the mechanism, exact coverage, bypasses, owner acceptance, and test. Mark the remainder advice only.

Start with native permissions and OS/service boundaries. Keep a vault opaque to agents. Prefer a password manager or a broker that exposes a narrow operation. Do not hand a general shell the vault.

A temporary wrapper may inject credentials into one reviewed child command. Keep values out of arguments, files, logs, and transcripts. The child must read its environment itself. Any arbitrary child can print or transmit that environment, so this is not isolation. Do not ship or generate credential values.

## Optional Claude hook

The shipped guard reads one JSON event from stdin and an explicit non-secret policy file. Populate secretRoots and configRoots with reviewed physical roots. Keep the policy outside the secret store. Empty arrays retain name screening but protect no extra owner-specific roots.

It denies recognized secret paths and malformed input. It asks for every shell command, write, broad search, unresolved path, and unfamiliar tool. Ordinary direct reads return no decision and leave native permissions intact. All writes ask because a harmless filename can still configure a system service. It never emits an unconditional allow. It records no payload.

Prepare an exact settings patch after reviewing existing settings. Register it as a PreToolUse command hook with matcher `*`, an absolute Node executable, the absolute guard path, and `--policy` followed by the absolute policy path. Quote each path for the actual shell. Do not interpolate values from hook input into the command. Use the vendor hook schema in tool-matrix.md.

For a JSON settings fragment, the shape is:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {"type": "command", "command": "<REVIEWED-COMMAND>", "timeout": 10}
        ]
      }
    ]
  }
}
```

This is a shape, not a runnable command. Stage and test the exact escaped command before owner-approved registration. Preserve other hooks. The plugin deliberately has no automatic hooks registration.

Run guard fixtures, then test a real intercepted harmless read, config-write ask, and denied synthetic secret path. Verify the event reaches the hook through the intended tool name and matcher. Unit tests alone do not prove wiring.

A hook crash, disabled registration, bypass mode, another tool, owner approval, or concurrent path substitution may defeat this control. Do not advertise comprehensive fail-closed security. Protect the guard and policy with an external boundary if the agent must not alter them.

Use each other tool's native hooks/permissions after a separate schema review. No cross-tool hook adapter ships here.

Gate: fixture results, live wiring evidence, and residual risks are recorded and accepted.

