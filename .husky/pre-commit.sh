. "$(dirname "$0")/_/husky.sh"

pnpm lint:fix
git add -u
pnpx lint-staged
pnpm typecheck