# Contributing

Use synthetic examples, because real configuration identifies its owner.

Keep the phase gates and artifact formats consistent. Add a dated official source for each new tool fact. Mark undocumented behavior as needs checking. Do not infer parity between tools.

Keep the skill short and put details in references. Use plain sentences, imperative steps, and tables. Avoid typographic dashes in prose.

For script changes, run `powershell.exe -NoProfile -File .\tests\smoke.ps1`. Add a regression fixture for a changed safety boundary. Retain failed fixtures. State the OS, PowerShell, and Node versions. Do not describe syntax checks as runtime tests.

Do not add deletion, implicit execution, credentials, telemetry, automatic uploads, or package installation. Use the adapter contract for new operations.

Inspect the diff for private paths, names, account identifiers, logs, and secrets before proposing it. Do not commit generated runs. Report relevant limitations in the pull request.

Read [SECURITY.md](SECURITY.md) for sensitive bugs and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations.

