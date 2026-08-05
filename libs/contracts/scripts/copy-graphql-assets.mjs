import { cpSync, mkdirSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceRoot = join(root, 'src');
const outputRoot = join(root, 'dist');

const copyGraphQLFiles = async (directory) => {
  const { readdirSync, statSync } = await import('fs');

  for (const entry of readdirSync(directory)) {
    const sourcePath = join(directory, entry);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      await copyGraphQLFiles(sourcePath);
      continue;
    }

    if (!entry.endsWith('.graphql')) {
      continue;
    }

    const outputPath = join(outputRoot, relative(sourceRoot, sourcePath));
    mkdirSync(dirname(outputPath), { recursive: true });
    cpSync(sourcePath, outputPath);
  }
};

await copyGraphQLFiles(sourceRoot);
