#!/bin/sh
# UNTESTED on macOS/Linux. Default is a dry run with no filesystem changes.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec node "$script_dir/engine.mjs" apply "$@"

