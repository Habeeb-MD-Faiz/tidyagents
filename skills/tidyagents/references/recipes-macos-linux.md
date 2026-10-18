# macOS/Linux recipes

**Untested.** The shared engine passed Windows tests. The shell wrappers and platform filesystem behavior have not been run on macOS or Linux.

Require an existing Node 18+ installation and a POSIX shell. Only Node 24 was used during build. Do not install packages as part of discovery.

```sh
sh "<CONFIG-REPO>/skills/tidyagents/scripts/discover.sh" --home "<OWNER-HOME>" --repo "<SCOPE>"
sh "<CONFIG-REPO>/skills/tidyagents/scripts/apply.sh" --plan "<PRIVATE-RUN>/adapter-plan.csv"
sh "<CONFIG-REPO>/skills/tidyagents/scripts/doctor.sh" --plan "<PRIVATE-RUN>/adapter-plan.csv"
```

Replace placeholders before running. Use quotes around paths. Omit --execute for dry run. Execution uses --run and --reviewed-plan-sha256, as documented in USAGE.

Use symlink instead of junction. Verify case sensitivity, file permissions, extended attributes, and tool rewrite behavior in a fresh fixture. The engine does not preserve or prove all filesystem metadata.

Owner home roots may themselves be links. The engine refuses linked ancestors. Choose the reviewed physical path; do not relax the check globally.

System configurations require an explicit RootsCsv entry and owner-approved scope. Do not scan a whole system tree to find one settings file. Do not use sudo to bypass a read refusal.

Keep backups and retained originals on their approved storage. No deletion command is supplied. Rehearse restore on synthetic files before activating a real adapter.

