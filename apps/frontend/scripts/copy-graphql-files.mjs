#!/usr/bin/env node
/**
 * Copy .graphql files from contracts library to Next.js standalone output
 * This ensures .graphql files are available at runtime in Vercel deployment
 */

import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = dirname(__dirname);
const workspaceRoot = join(frontendRoot, '../..');

// Source: contracts library dist folder
const contractsSrc = join(workspaceRoot, 'libs/contracts/dist');

// Destination: Next.js standalone output
const standaloneOutput = join(frontendRoot, '.next/standalone');
const nextServerOutput = join(frontendRoot, '.next/server');

function copyGraphQLFilesRecursively(src, dest) {
  if (!existsSync(src)) {
    console.log(`⚠️  Source doesn't exist: ${src}`);
    return;
  }

  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyGraphQLFilesRecursively(srcPath, destPath);
    } else if (entry.endsWith('.graphql')) {
      mkdirSync(dirname(destPath), { recursive: true });
      cpSync(srcPath, destPath);
      console.log(`✅ Copied: ${entry}`);
    }
  }
}

console.log('🔄 Copying .graphql files to Next.js output...');

// Copy to standalone output if it exists (for production builds)
if (existsSync(standaloneOutput)) {
  const standaloneDest = join(standaloneOutput, 'libs/contracts/dist');
  copyGraphQLFilesRecursively(contractsSrc, standaloneDest);
}

// Copy to server output (for both dev and production)
if (existsSync(nextServerOutput)) {
  const serverDest = join(nextServerOutput, 'chunks');
  // Also ensure node_modules path exists
  const nodeModulesDest = join(frontendRoot, '.next/server/chunks/@snake-rescue/contracts/dist');
  copyGraphQLFilesRecursively(contractsSrc, nodeModulesDest);
}

console.log('✅ Done! GraphQL files copied to Next.js output directories.');
