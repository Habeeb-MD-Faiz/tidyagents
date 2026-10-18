# Phase 2: analyse and ask

Group findings by impact: exposure, wrong identity/scope, conflicting policy, broken loading, drift, duplication, dead reference, or unknown. Use findings.csv. Include evidence, confidence, consequence, and a proposed next check.

Compare content only after clearance. Equal hashes show equal bytes, not equal authority. Different files may be intentional scope overrides. A missing reference can be a disabled feature rather than dead configuration.

For secrets-in-config, flag the containing filename and location category only. Stop content review. Have the owner replace embedded values with an approved external mechanism. Do not quote, redact after reading, copy, or test the value.

Identify contradictions between tool defaults, owner policy, permissions, hooks, launchers, and scheduled processes. Check whether a plugin or local setting overrides the intended model or connector boundary.

Draft batches of at most four questions with the question template. State the evidence and consequence inside each question. Give a recommendation, alternatives, Other, and defer. Keep an unanswered list and answer the owner's own questions first.

Do not turn a tentative question into a decision. If the owner says decide, record the choice and reason. Separate implementation delegation from permission to publish, use another identity, or touch credentials.

Gate: every decision needed for the next phase is answered or explicitly deferred with its dependent work held.

