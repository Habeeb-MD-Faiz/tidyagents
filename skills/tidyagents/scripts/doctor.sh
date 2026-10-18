#!/bin/sh
# UNTESTED on macOS/Linux. Requires Node on PATH. No installation is performed.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec node "$script_dir/engine.mjs" doctor "$@"

