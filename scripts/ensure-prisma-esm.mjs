import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJsonPath = resolve(
  'libs/database/src/prisma/generated/package.json'
);

try {
  // Check if file exists
  await access(packageJsonPath);
  
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

  if (packageJson.type !== 'module') {
    packageJson.type = 'commonjs'; // Use CommonJS for compatibility
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    console.log('✓ Updated Prisma Client package.json to use CommonJS');
  } else {
    console.log('✓ Prisma Client already configured for ESM');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('⚠ Prisma Client package.json not found - skipping ESM configuration');
    console.log('  This is normal if Prisma Client generated to a different location');
  } else {
    throw error;
  }
}
