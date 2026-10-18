#!/bin/sh
# UNTESTED on macOS/Linux. Restores adapters only; delegates to the same reviewed plan.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec node "$script_dir/engine.mjs" apply "$@"

