#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * 
 * Verifies that all required code changes and files exist
 * before deployment to production.
 * 
 * Usage:
 *   node scripts/verify-production-ready.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Check results
const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✓ ${description}`);
    return true;
  } else {
    checks.failed.push(`✗ ${description} - File not found: ${filePath}`);
    return false;
  }
}

function checkFileContains(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    checks.failed.push(`✗ ${description} - File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(searchString)) {
    checks.passed.push(`✓ ${description}`);
    return true;
  } else {
    checks.failed.push(`✗ ${description} - String not found in ${filePath}`);
    return false;
  }
}

function checkDirectoryExists(dirPath, description) {
  const fullPath = path.join(rootDir, dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    checks.passed.push(`✓ ${description}`);
    return true;
  } else {
    checks.failed.push(`✗ ${description} - Directory not found: ${dirPath}`);
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('SNAKE RESCUE - PRODUCTION READINESS VERIFICATION', colors.cyan);
console.log('='.repeat(60) + '\n');

// ============================================================================
// 1. CORE FILES
// ============================================================================
log('1. Checking Core Files...', colors.blue);
checkFileExists('package.json', 'package.json exists');
checkFileExists('vercel.json', 'vercel.json exists');
checkFileExists('nx.json', 'nx.json exists');
checkFileExists('tsconfig.base.json', 'tsconfig.base.json exists');

// ============================================================================
// 2. DEPLOYMENT DOCUMENTATION
// ============================================================================
log('\n2. Checking Deployment Documentation...', colors.blue);
checkFileExists('DEPLOYMENT_AUDIT_REPORT.md', 'Deployment Audit Report');
checkFileExists('DEPLOYMENT_EXECUTIVE_SUMMARY.md', 'Executive Summary');
checkFileExists('DEPLOYMENT_CHECKLIST.md', 'Deployment Checklist');
checkFileExists('DEPLOYMENT_SUMMARY.md', 'Deployment Summary');
checkFileExists('NEON_SETUP_GUIDE.md', 'Neon Setup Guide');
checkFileExists('DEPLOY_NOW.md', 'Quick Deploy Guide');
checkFileExists('.env.production.example', 'Production Environment Template');

// ============================================================================
// 3. DATABASE CONFIGURATION
// ============================================================================
log('\n3. Checking Database Configuration...', colors.blue);
checkFileExists('libs/database/src/client.ts', 'Prisma client file');
checkFileContains(
  'libs/database/src/client.ts',
  'pg.Pool',
  'Connection pooling with pg.Pool'
);
checkFileContains(
  'libs/database/src/client.ts',
  'PrismaPg',
  'Prisma PostgreSQL adapter'
);
checkFileContains(
  'libs/database/prisma/schema.prisma',
  'directUrl',
  'Prisma schema has directUrl'
);
checkDirectoryExists('libs/database/prisma/migrations', 'Migrations directory exists');

// ============================================================================
// 4. SERVERLESS API ROUTES
// ============================================================================
log('\n4. Checking Serverless API Routes...', colors.blue);
checkFileExists(
  'apps/frontend/src/app/api/graphql/route.ts',
  'GraphQL API route'
);
checkFileContains(
  'apps/frontend/src/app/api/graphql/route.ts',
  'startServerAndCreateNextHandler',
  'GraphQL route uses Next.js integration'
);
checkFileExists(
  'apps/frontend/src/app/api/auth/[...all]/route.ts',
  'Better Auth API route'
);
checkFileContains(
  'apps/frontend/src/app/api/auth/[...all]/route.ts',
  'toNextJsHandler',
  'Auth route uses Better Auth Next.js handler'
);

// ============================================================================
// 5. APOLLO CLIENT CONFIGURATION
// ============================================================================
log('\n5. Checking Apollo Client Configuration...', colors.blue);
checkFileExists('apps/frontend/src/lib/apollo/client.ts', 'Apollo Client file');
checkFileContains(
  'apps/frontend/src/lib/apollo/client.ts',
  '/api/graphql',
  'Apollo Client points to /api/graphql'
);

// ============================================================================
// 6. VERCEL CONFIGURATION
// ============================================================================
log('\n6. Checking Vercel Configuration...', colors.blue);
checkFileContains(
  'vercel.json',
  'functions',
  'Vercel.json has functions configuration'
);
checkFileContains(
  'vercel.json',
  'apps/frontend/src/app/api/**/*.ts',
  'Vercel.json configures API routes'
);

// ============================================================================
// 7. ENVIRONMENT VARIABLES TEMPLATE
// ============================================================================
log('\n7. Checking Environment Variables...', colors.blue);
checkFileContains(
  '.env.production.example',
  'DATABASE_URL',
  'Production template has DATABASE_URL'
);
checkFileContains(
  '.env.production.example',
  'DIRECT_URL',
  'Production template has DIRECT_URL'
);
checkFileContains(
  '.env.production.example',
  'NEXT_PUBLIC_GRAPHQL_URL',
  'Production template has NEXT_PUBLIC_GRAPHQL_URL'
);
checkFileContains(
  '.env.production.example',
  'BETTER_AUTH_URL',
  'Production template has BETTER_AUTH_URL'
);

// ============================================================================
// 8. DEPENDENCIES
// ============================================================================
log('\n8. Checking Dependencies...', colors.blue);
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);

const requiredDeps = [
  '@prisma/adapter-pg',
  '@prisma/client',
  'pg',
  '@apollo/server',
  '@as-integrations/next',
  'better-auth',
  'next',
  'react',
  'prisma',
];

requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    checks.passed.push(`✓ Dependency: ${dep}`);
  } else {
    checks.failed.push(`✗ Missing dependency: ${dep}`);
  }
});

// ============================================================================
// 9. BUILD VERIFICATION
// ============================================================================
log('\n9. Checking Build Artifacts...', colors.blue);
if (fs.existsSync(path.join(rootDir, 'apps/frontend/.next'))) {
  checks.warnings.push(
    '⚠ .next directory exists (previous build). Run fresh build before deployment.'
  );
} else {
  checks.passed.push('✓ No stale build artifacts');
}

// ============================================================================
// 10. GIT STATUS
// ============================================================================
log('\n10. Checking Git Status...', colors.blue);
if (fs.existsSync(path.join(rootDir, '.git'))) {
  checks.passed.push('✓ Git repository initialized');
  
  // Check for .env in .gitignore
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (gitignore.includes('.env') || gitignore.includes('*.env')) {
      checks.passed.push('✓ .env files are ignored by git');
    } else {
      checks.warnings.push('⚠ .env might not be in .gitignore');
    }
  }
} else {
  checks.warnings.push('⚠ Not a git repository');
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(60));
log('VERIFICATION SUMMARY', colors.cyan);
console.log('='.repeat(60) + '\n');

log(`Passed: ${checks.passed.length}`, colors.green);
checks.passed.forEach((check) => log(check, colors.green));

if (checks.warnings.length > 0) {
  log(`\nWarnings: ${checks.warnings.length}`, colors.yellow);
  checks.warnings.forEach((warning) => log(warning, colors.yellow));
}

if (checks.failed.length > 0) {
  log(`\nFailed: ${checks.failed.length}`, colors.red);
  checks.failed.forEach((failure) => log(failure, colors.red));
}

console.log('\n' + '='.repeat(60));

if (checks.failed.length === 0) {
  log('✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT!', colors.green);
  console.log('='.repeat(60) + '\n');
  
  console.log('Next steps:');
  console.log('1. Read: DEPLOY_NOW.md');
  console.log('2. Setup Neon database');
  console.log('3. Deploy to Vercel');
  console.log('4. Configure environment variables');
  console.log('5. Test production deployment\n');
  
  process.exit(0);
} else {
  log('❌ VERIFICATION FAILED - FIX ERRORS BEFORE DEPLOYING', colors.red);
  console.log('='.repeat(60) + '\n');
  
  console.log('Please fix the failed checks above and run this script again.\n');
  
  process.exit(1);
}
