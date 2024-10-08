#!/bin/bash

# Exit on any error
set -euo pipefail

npm run lint
npm run prettier
npm run knip
npm ci
npm run test
npm run build
npx publint
SKIP_GIT_HOOKS=1 npx np --yolo --no-release-draft --any-branch
