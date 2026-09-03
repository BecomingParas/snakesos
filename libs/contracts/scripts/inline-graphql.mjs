#!/usr/bin/env node
/**
 * Inline GraphQL files into TypeScript files
 * This converts all .graphql files to .graphql.ts files with inlined content
 * to avoid runtime file reading issues in serverless environments like Vercel
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

// Escape backticks and backslashes in GraphQL content
function escapeGraphQL(content) {
  return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// Process a directory recursively
function processDirectory(directory) {
  const entries = readdirSync(directory);

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.endsWith('.graphql')) {
      continue;
    }

    // Read GraphQL file
    const graphqlContent = readFileSync(fullPath, 'utf-8');
    const escapedContent = escapeGraphQL(graphqlContent);

    // Create corresponding .ts file in dist
    const relativePath = relative(srcDir, fullPath);
    const tsPath = join(distDir, relativePath + '.ts');
    
    // Ensure directory exists
    mkdirSync(dirname(tsPath), { recursive: true });

    // Write TypeScript file with exported constant
    const tsContent = `// Auto-generated from ${entry} - DO NOT EDIT MANUALLY
export default \`${escapedContent}\`;
`;

    writeFileSync(tsPath, tsContent, 'utf-8');
    console.log(`✅ Inlined: ${relativePath} -> ${relativePath}.ts`);
  }
}

// Start processing
console.log('🔄 Inlining GraphQL files...');
processDirectory(srcDir);
console.log('✅ Done! All GraphQL files have been inlined.');
