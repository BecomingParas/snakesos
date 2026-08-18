#!/usr/bin/env node
/**
 * Clean stale build artifacts that cause TS2305 errors.
 * Run: node clean-build.js
 */
const fs = require('fs');
const path = require('path');

const dirsToClean = [
  'libs/database/dist',
  'libs/contracts/dist',
  'libs/auth/dist',
  'libs/shared/dist',
  'libs/backend/core/dist',
  'libs/backend/modules/dist',
  'apps/backend/dist',
  '.nx/cache',
];

console.log('Cleaning stale build artifacts...\n');

for (const dir of dirsToClean) {
  const full = path.resolve(__dirname, dir);
  try {
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log(`  ✓ Removed: ${dir}`);
    } else {
      console.log(`  - Skipped (not found): ${dir}`);
    }
  } catch (e) {
    console.log(`  ✗ Error removing ${dir}: ${e.message}`);
  }
}

console.log('\nDone! Now run: yarn build:backend');
