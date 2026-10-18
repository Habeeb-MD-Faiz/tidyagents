# Pitfalls

These patterns come from the supplied run. Similar failures are grouped. The symptom is historical evidence; the fix and rule are generalized guidance. No row claims the original run proved universal enforcement.

## Owner decisions and evidence

| Symptom | Cause | Fix | Rule |
|---|---|---|---|
| A neat layout violated the owner's workflow | Ownership was inferred from names | Ask who owns the data and what must remain | Confirm intent before design |
| Intentional worktree/folder structures were rewritten | A convention was treated as mandatory | Keep intentional layouts and document exceptions | Preserve owner contracts |
| A long question list was rejected | Context and consequences were missing | Use short self-contained batches with recommendations | Put decision context inside each question |
| The owner repeated unanswered questions | Tool work displaced conversation | Answer and track pending questions first | Resolve questions before branching |
| A GUI requirement appeared late | The agent optimized for overhead | Ask about UI and accessibility during intake | Validate success criteria |
| Old reports disagreed with new state | Work continued after the audit | Re-inventory and date findings | Recheck stale evidence |
| Compaction repeated already-fixed failures | Summary lagged live output | Prefer latest owner messages and checked results | Summaries are navigation aids |
| An audit proposed nonexistent transcript mappings | A path change was assumed to imply a history key | Check actual keys by safe metadata | Prove the mapping before adding it |
| Storage/connector causes were stated too confidently | Timing correlation was treated as proof | Separate observation, owner context, and hypothesis | Label causal inference |
| Review output looked like approval | Agent text or task contents impersonated authority | Verify owner authorization outside the data | A reviewer cannot grant owner approval |
| A plan row existed but hid uncovered children | Coverage was inferred from a parent disposition | Review child coverage and exclusions | A row is not complete classification |
| A background task was called complete | Only launch acknowledgment existed | Check exit, outputs, and child lifetime | Started is not finished |
| A notification never arrived | Push delivery was disabled | Test the owner-visible channel separately | Do not promise untested alerts |
| A new safety gate used old approval | Scope or risk had changed | Present the exact revised step | Approval belongs to a concrete scope |

## Configuration, adapters, and history

| Symptom | Cause | Fix | Rule |
|---|---|---|---|
| A launcher used the wrong runtime/profile | PATH shadowing or a stale wrapper | Resolve executable and selected profile in a fresh shell | Verify the actual launch path |
| Rules leaked across scopes | An ancestor or home cwd added context | Test root, nested, and unrelated starts | Scope by observed discovery |
| A scope file never loaded | Metadata was mistaken for native instructions | Add an explicit tested adapter | A filename does not imply loading |
| An import pointed somewhere unexpected | Relative paths resolved from the importer | Test the actual wrapper and its path escaping | Keep import semantics tool-specific |
| A linked file stopped sharing changes | The consumer replaced its inode | Use generated copies with doctor | Do not rely on hardlinks for rewritten config |
| A supposedly private helper appeared in another profile | Both profiles shared a directory link | Stage outside the shared tree | A link shares writes as well as reads |
| A history link was at risk during cleanup | A load-bearing junction looked like duplication | Inventory links and retain targets | Never recurse through a link to clean up |
| Skill adapters disappeared during copying | Link-excluding copy omitted them | Inventory and reconstruct each adapter separately | Data copy is not link migration |
| Restore left stale existing settings | Copy-if-missing skipped current files | Stage a narrow merge and pin the target hash | Existing is not current |
| One sentinel skipped later restore work | A global done flag covered multiple steps | Check each adapter independently | Idempotence is per postcondition |
| A dry run created directories or logs | Setup code ran before the execution gate | Preflight and print without writes | Test a whole-tree before/after snapshot |
| A partial failure left mixed state | Edits and appends were not transactional | Retain output and recover from the manifest | Stop instead of cleaning up |
| Live history diverged during migration | Writers remained active | Stop writers before a consistent snapshot | Coordinate cutover |
| A verified recovery copy became mutable runtime state | The only good backup was repurposed | Keep a separate pristine copy | Recovery evidence must survive activation |
| Old sessions seemed gone | Retention age or incomplete roots were misread | Check every approved archive and native resume | Age alone is not deletion proof |
| Transcript counts were inflated | Resumes and repeated events were counted twice | State record/session/event denominators | Define the counting unit |
| Cross-account attribution was unreliable | Profiles shared state | Report shared or unknown attribution | Do not infer account from storage |
| A history report missed older data | Only active roots were sampled | Include archive coverage and exclusions | Report the measured window honestly |
| A JSONL parser crashed | It assumed every event had an attachment | Validate record types and optional fields | Logs have mixed schemas |
| Plugin installation changed a model choice | Installation mutated runtime settings | Compare settings before/after and recheck effective model | Verify side effects |
| Two copies of a hook ran | Global and vendored registrations overlapped | Trace effective registrations before changing either | Count invocations, not files |
| A third-party skill lost provenance | Installed content was treated as editable core | Keep license/source and separate local overrides | Preserve upstream ownership |
| A valued plugin looked unused | A limited sample had zero observations | Ask the owner before parking it | Unobserved does not mean unwanted |
| Context totals were misleading | Characters, descriptions, bodies, and deferred schemas were mixed | Separate measured layers and label estimates | Do not present estimates as token measurements |

## Secrets, capabilities, and guards

| Symptom | Cause | Fix | Rule |
|---|---|---|---|
| Config inspection risked credentials | Settings and auth shared a file | Keep it opaque and request an owner-cleared export | Never read first and redact later |
| A normal backup included sensitive content | Backup was assumed harmless | Apply the same clearance to backups and archives | Copies inherit sensitivity |
| Auth output entered a captured transcript | Login ran in the agent's command output | Use an owner-controlled uncaptured terminal | Keep authentication private |
| Environment enumeration was blocked | Diagnostics exposed more than needed | Inspect selected launcher facts only | Minimize diagnostics |
| A secret directory root escaped matching | Only child paths were recognized | Test directory roots and separators | Protect the root itself |
| Alternate credential filenames escaped matching | Detection covered too few families | Add synthetic name fixtures | Treat screening as incomplete |
| An innocent tokenizer file was blocked | Broad token substring matching | Match bounded filename components | Test false positives too |
| Search reached ignored secret files | Globs or flags overrode ignore behavior | Bound search and require review | Ignore files are not access control |
| A shell bypassed simple path regexes | Quotes, escapes, wildcards, aliases, or constructed paths | Ask for shell review; use external isolation | Do not call regex a shell sandbox |
| An identity command exception bypassed checks | A broad allow preceded safety checks | Remove blanket exceptions | Check dangerous paths before exceptions |
| Unknown MCP tools escaped an allowlist | The guard matcher never saw them | Verify registration and event coverage | A correct predicate needs correct wiring |
| A read-sounding tool had wider effects | Naming convention replaced capability review | Inspect schemas and observed behavior | Approve exact operations |
| Availability was confused with authentication | A server listed tools but could not read data | Test declared, visible, authenticated, successful separately | Name the level proved |
| A connector vanished without a clear failure | Session discovery was intermittent | Recheck fresh sessions and keep cause unknown | Configuration does not prove availability |
| An optional remote transport blocked startup | Auth/transport dependencies were unavailable | Isolate optional startup and record disable behavior | Do not assume every CLI has a per-run disable |
| A model judge appeared to authorize work | Probabilistic output was treated as owner intent | Use it only to draft advice | Models cannot mint approval |
| Invalid guard input fell through | Error handling defaulted to no decision | Deny malformed input and test it | Test negative paths explicitly |
| Rejected content leaked through guard logs | Raw payloads were recorded | Log rule/outcome metadata only | Rejection is not permission to echo |
| Native permissions hid tools from a hook | Permission and hook layers differed | Test the actual supported sequence | Do not infer interception from unit tests |
| A credential wrapper looked like isolation | The child received unrestricted environment access | Use an operation-specific external broker | Arbitrary child code can exfiltrate its env |
| An agent could alter its own guard | Policy and code had the same write authority | Protect mandatory controls externally | Same-user hooks are bypassable |
| A future gateway was described as present | Design and deployment were conflated | Track design, build, deployment, and test separately | Do not claim planned capability |

## Runners, UI, and platform mechanics

| Symptom | Cause | Fix | Rule |
|---|---|---|---|
| A scheduled job used an unintended account | Fallback routing changed the actual profile | Assert actual identity before work | Failure is not permission to switch accounts |
| A plain request claimed to be approved | Text fields impersonated the owner | Use a trusted approval channel and exact plan digest | Separate authorization from request contents |
| Held work still spent model calls | Eligibility filtering happened late | Filter deterministic held states first | Validate before dispatch |
| A stale lock could overlap a live child | Age/PID checks did not prove ownership or exit | Track process identity and child completion | A timeout is not termination |
| A hook exceeded a useful timeout | Nested model or service work accumulated latency | Keep guards local and bounded | Avoid expensive approval recursion |
| A schedule ran at the wrong intended time | Timezone or local-clock assumptions differed | Record zone and test a fixture invocation | Timezone is part of the schedule |
| A quota display implied a hard limit | Cached or missing data was treated as live | Show unknown/stale status and freshness | Warnings are not enforcement |
| A cache timer appeared precise without evidence | Expiry was guessed from elapsed time | Derive it from authoritative telemetry or label unknown | Do not invent timers |
| A UI band hid the fallback before rendering | Data readiness was mistaken for visible UI | Switch only after a successful render | Unit success is not visible success |
| A mod was declared impossible | Public assumptions missed installed capabilities | Inspect build-local public docs and tools | Avoid categorical claims without checking |
| UI mocks/types disagreed with runtime | A test used a different API contract | Verify installed types and real rendering | Match tests to the shipped version |
| Footprint/package claims were wrong | Estimates replaced release/process inspection | Measure the actual release and processes | Label estimates until measured |
| A binary scan produced huge output | Include filtering did not constrain LiteralPath | Filter names explicitly before reading | Select before decoding |
| Shell edits mangled Windows paths | Backslashes and substitutions crossed shells | Use edit tools and native paths | Keep editing separate from shell evaluation |
| A helper partly mutated files then failed | Short function/variable names collided | Use distinct names and stop on first failure | Avoid automatic variables and aliases |
| PowerShell could not parse Unicode source | UTF-8 without BOM was read as ANSI | Use ASCII scripts or a supported encoding | Parse on the target PowerShell |
| A CSV split misread quoted commas | Lines were split without a CSV parser | Use a strict parser and negative fixtures | CSV is structured data |
| A parser test reported zero after failing | Uninitialized refs or ignored native exit | Inspect errors and exit immediately | A printed zero is not evidence |
| stderr or a nonzero copy result was misclassified | Text and exit semantics were mixed | Interpret the actual program's exit contract | Record exit codes per command |
| Long runs outlived the tool call | Timeout was treated as completion | Monitor the process and retained output | Keep started/running/exited distinct |
| A long archived path broke enumeration | A platform API limit was hit | Narrow the scan and record the inaccessible path | Failure is not absence |
| A physical/alias path routed identity incorrectly | Tests used labels instead of resolved scope roots | Test actual resolved paths | Route identity by verified scope |
| A stale editor replacement overwrote concurrent work | Another writer changed the file | Re-read and reconcile before editing | Assign one writer or explicit hand-back |
| A package launcher failed despite an absolute path | Its runtime was missing from the child PATH | Check the full dependency chain | An executable path is not runtime readiness |
| Toolchain duplication grew unnoticed | Store aliases, private runtimes, and global installs were mixed | Inventory executable provenance before install | One policy needs explicit exceptions |
| Dependency setup changed unrelated packages | The wrong package manager/lock was assumed | Inspect lockfiles and use the intended manager | Do not install by habit |
| ACL inheritance changes left broad access | Explicit grants survived | Inspect effective grants in a separate approved step | Inheritance alone is not isolation |
| Capacity was underestimated | Canonical copies, backups, and partial runs overlapped | Budget all simultaneous copies | Retention costs space |
| Source protection was only verbal | Read-only intent was confused with an OS boundary | State what is actually enforced | Policy text does not freeze data |
| Archive verification failed on non-ASCII names | Tool/encoding support differed | Rehearse with representative names and extraction | Archive creation is not a restore test |
| A normal null-device redirection failed | A device name was treated as a file | Use a fresh empty fixture file | Test process I/O on the target OS |
| A guard false positive blocked a combined command | Parsing mixed unrelated actions | Use bounded independent operations | Do not disable protection to simplify a batch |

Storage-specific recovery, partitioning, cloud transfer, and application-database procedures are outside this kit. Their harness-relevant lessons are retained above: preserve originals, verify actual boundaries, isolate writers, inspect exit codes, and prove restoration.

