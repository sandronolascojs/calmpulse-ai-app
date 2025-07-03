#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
+set -euo pipefail

pnpm lint:fix          # fix whole repo first
git add -u             # restage possible fixes
pnpx lint-staged       # run staged-only checks
pnpm typecheck