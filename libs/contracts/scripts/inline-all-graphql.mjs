#!/usr/bin/env node
/**
 * Inline all GraphQL file contents into their corresponding TypeScript files
 * This avoids runtime file reading issues in serverless environments
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contractsRoot = dirname(__dirname);
const srcDir = join(contractsRoot, 'src');

// Files already processed (shared folder)
const SKIP_FILES = new Set([
  'src/lib/graphql/shared/scalars/index.ts',
  'src/lib/graphql/shared/directives/index.ts',
  'src/lib/graphql/shared/pagination/index.ts',
  'src/lib/graphql/shared/errors/index.ts',
  'src/lib/graphql/shared/responses/index.ts',
]);

// Escape content for template literal
function escapeForTemplate(content) {
  return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// Process a directory recursively to find index.ts files using readGraphQLFile
function processDirectory(directory) {
  const entries = readdirSync(directory);

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (entry !== 'index.ts' && entry !== 'index.tsx') {
      continue;
    }

    // Check if this file is in skip list
    const relativePath = relative(contractsRoot, fullPath).replace(/\\/g, '/');
    if (SKIP_FILES.has(relativePath)) {
      console.log(`⏭️  Skipped (already done): ${relativePath}`);
      continue;
    }

    // Read the TypeScript file
    let tsContent = readFileSync(fullPath, 'utf-8');

    // Check if it uses readGraphQLFile
    if (!tsContent.includes('readGraphQLFile')) {
      continue;
    }

    console.log(`\n🔍 Processing: ${relativePath}`);

    // Find all .graphql files referenced
    const dir = dirname(fullPath);
    const graphqlFiles = readdirSync(dir).filter(f => f.endsWith('.graphql'));

    if (graphqlFiles.length === 0) {
      console.log(`   ⚠️  No .graphql files found in directory`);
      continue;
    }

    let modified = false;

    // Process each .graphql file
    for (const graphqlFile of graphqlFiles) {
      const graphqlPath = join(dir, graphqlFile);
      const graphqlContent = readFileSync(graphqlPath, 'utf-8');
      const escapedContent = escapeForTemplate(graphqlContent);
      
      const varName = graphqlFile.replace('.graphql', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const exportName = varName.includes('Enum') ? varName : `${varName}${graphqlFile.includes('schema') ? '' : 'TypeDefs'}`;

      // Check if this file is already exported
      if (tsContent.includes(`export const ${exportName}`)) {
        console.log(`   ✅ ${graphqlFile} -> Already inlined`);
        continue;
      }

      // Look for the pattern: readGraphQL('filename.graphql')
      const pattern1 = new RegExp(`readGraphQL\\(['"\`]${graphqlFile}['"\`]\\)`, 'g');
      const pattern2 = new RegExp(`readGraphQLFile\\([^,]+,\\s*['"\`]${graphqlFile}['"\`]\\)`, 'g');

      if (pattern1.test(tsContent) || pattern2.test(tsContent)) {
        // Replace the readGraphQL call with inline content
        const inlineContent = `\`${escapedContent}\``;
        
        tsContent = tsContent.replace(pattern1, inlineContent);
        tsContent = tsContent.replace(pattern2, inlineContent);
        
        console.log(`   ✅ ${graphqlFile} -> Inlined`);
        modified = true;
      }
    }

    // Remove import of readGraphQLFile if it's no longer used
    if (modified) {
      // Check if readGraphQLFile or readGraphQL is still used
      const hasReadGraphQLUsage = /readGraphQL(?:File)?\([^)]*\)/.test(tsContent);
      
      if (!hasReadGraphQLUsage) {
        // Remove the import statement
        tsContent = tsContent.replace(/import\s+{\s*readGraphQLFile\s*}\s+from\s+['"][^'"]+['"];?\s*\n/g, '');
        tsContent = tsContent.replace(/import\s+{\s*readGraphQLFile\s*}\s+from\s+['"][^'"]+['"]\s*;?\s*\n/g, '');
        
        // Remove the readGraphQL helper function and related comments
        tsContent = tsContent.replace(/\/\/\s*Read all GraphQL files\s*\n/g, '');
        tsContent = tsContent.replace(/const\s+readGraphQL\s*=\s*\([^)]*\)\s*=>\s*readGraphQLFile[^;]+;\s*\n/g, '');
        
        console.log(`   🗑️  Removed readGraphQLFile import and helper`);
      }
    }

    if (modified) {
      writeFileSync(fullPath, tsContent, 'utf-8');
      console.log(`   💾 Saved: ${relativePath}`);
    }
  }
}

console.log('🚀 Inlining GraphQL files...\n');
processDirectory(srcDir);
console.log('\n✅ Done!');
