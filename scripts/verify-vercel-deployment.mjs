#!/usr/bin/env node
/**
 * Vercel Deployment Verification Script
 * 
 * Run this before deploying to Vercel to catch common issues:
 * node scripts/verify-vercel-deployment.mjs
 */

import { execSync } from 'child_process';
import { existsSync, statSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT_DIR = resolve(process.cwd());
const FRONTEND_DIR = join(ROOT_DIR, 'apps', 'frontend');
const PUBLIC_DIR = join(FRONTEND_DIR, 'public');

console.log('🔍 SnakeSOS Vercel Deployment Verification\n');

let hasErrors = false;
let hasWarnings = false;

// ===================================================================
// 1. Check if vercel.json exists
// ===================================================================
console.log('📋 Checking configuration files...');
if (existsSync(join(ROOT_DIR, 'vercel.json'))) {
  console.log('✅ vercel.json found');
} else {
  console.log('❌ vercel.json missing');
  hasErrors = true;
}

// ===================================================================
// 2. Check required directories
// ===================================================================
console.log('\n📁 Checking directory structure...');
const requiredDirs = [
  'apps/frontend',
  'libs/contracts',
  'libs/shared',
];

const optionalDirs = [
  'libs/frontend',
  'libs/frontend/core',
  'libs/frontend/ui',
  'libs/frontend/features',
];

for (const dir of requiredDirs) {
  if (existsSync(join(ROOT_DIR, dir))) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} missing`);
    hasErrors = true;
  }
}

// Check if any frontend lib directories exist
let hasFrontendLibs = false;
for (const dir of optionalDirs) {
  if (existsSync(join(ROOT_DIR, dir))) {
    console.log(`✅ ${dir} exists`);
    hasFrontendLibs = true;
  }
}

if (!hasFrontendLibs) {
  console.log('⚠️  No frontend library directories found (optional)');
  hasWarnings = true;
}

// ===================================================================
// 3. Check next.config.mjs
// ===================================================================
console.log('\n⚙️  Checking Next.js configuration...');
const nextConfigPath = join(FRONTEND_DIR, 'next.config.mjs');
if (existsSync(nextConfigPath)) {
  console.log('✅ next.config.mjs found');
  
  try {
    const config = readFileSync(nextConfigPath, 'utf-8');
    if (config.includes('@snake-rescue/contracts') && config.includes('@snake-rescue/shared')) {
      console.log('✅ Monorepo packages configured in transpilePackages');
    } else {
      console.log('⚠️  transpilePackages might need @snake-rescue packages');
      hasWarnings = true;
    }
  } catch (err) {
    console.log('⚠️  Could not read next.config.mjs');
    hasWarnings = true;
  }
} else {
  console.log('❌ next.config.mjs missing');
  hasErrors = true;
}

// ===================================================================
// 4. Check for large files in public/
// ===================================================================
console.log('\n📹 Checking public assets...');
if (existsSync(PUBLIC_DIR)) {
  const checkDir = (dir) => {
    const files = [];
    try {
      const items = require('fs').readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...checkDir(fullPath));
        } else if (stat.isFile()) {
          files.push({ path: fullPath, size: stat.size });
        }
      }
    } catch (err) {
      // Ignore errors
    }
    return files;
  };

  const files = checkDir(PUBLIC_DIR);
  const largeFiles = files.filter(f => f.size > 10 * 1024 * 1024); // 10MB

  if (largeFiles.length > 0) {
    console.log('⚠️  Large files found (>10MB):');
    for (const file of largeFiles) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`   - ${file.path.replace(ROOT_DIR, '.')} (${sizeMB} MB)`);
    }
    console.log('   Consider compressing or moving to CDN');
    hasWarnings = true;
  } else {
    console.log('✅ No large files detected in public/');
  }
}

// ===================================================================
// 5. Test production build
// ===================================================================
console.log('\n🏗️  Testing production build...');
console.log('Running: npx nx build frontend --prod\n');

try {
  execSync('npx nx build frontend --prod', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    }
  });
  console.log('\n✅ Production build successful!');
} catch (err) {
  console.log('\n❌ Production build failed!');
  console.log('Fix build errors before deploying to Vercel');
  hasErrors = true;
}

// ===================================================================
// 6. Check environment variables
// ===================================================================
console.log('\n🌍 Environment variable checklist:');
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_GRAPHQL_URL',
  'NEXT_PUBLIC_AUTH_URL',
  'NEXT_PUBLIC_FRONTEND_URL',
  'NEXT_PUBLIC_APP_URL',
];

console.log('\nMake sure these are set in Vercel:');
for (const envVar of requiredEnvVars) {
  console.log(`   - ${envVar}`);
}

// ===================================================================
// 7. Check if backend secrets are accidentally in frontend
// ===================================================================
console.log('\n🔒 Security check...');
const dangerousVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'OPENROUTER_API_KEY',
  'SMTP_PASSWORD',
];

let foundDangerousVars = false;
try {
  // Exclude API routes (they run server-side) and documentation pages
  const frontendFiles = execSync(
    'grep -r "DATABASE_URL\\|JWT_SECRET" apps/frontend/src --include="*.ts" --include="*.tsx" --exclude-dir="app/api" --exclude="**/development/**" || true',
    { cwd: ROOT_DIR, encoding: 'utf-8' }
  );
  
  if (frontendFiles.trim()) {
    console.log('⚠️  Found potential backend secrets in frontend code:');
    console.log(frontendFiles);
    hasWarnings = true;
    foundDangerousVars = true;
  }
} catch (err) {
  // grep not available or no matches
}

if (!foundDangerousVars) {
  console.log('✅ No backend secrets found in client-side frontend code');
  console.log('   (API routes are server-side and can safely use secrets)');
}

// ===================================================================
// Summary
// ===================================================================
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ DEPLOYMENT VERIFICATION FAILED');
  console.log('Fix the errors above before deploying to Vercel');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  DEPLOYMENT VERIFICATION COMPLETED WITH WARNINGS');
  console.log('Review the warnings above before deploying');
  process.exit(0);
} else {
  console.log('✅ DEPLOYMENT VERIFICATION PASSED');
  console.log('Your frontend is ready to deploy to Vercel!');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub');
  console.log('2. Connect repository to Vercel');
  console.log('3. Configure environment variables in Vercel dashboard');
  console.log('4. Deploy!');
  process.exit(0);
}
