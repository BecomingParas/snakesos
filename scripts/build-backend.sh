#!/bin/bash
# Build backend using swc (bypasses TypeScript project references issues)

echo "Building backend with SWC..."
cd apps/backend
npx swc src -d dist --copy-files --ignore "**/*.spec.ts" --ignore "**/*.test.ts"
echo "✓ Backend build completed"
