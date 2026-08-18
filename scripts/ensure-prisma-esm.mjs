import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJsonPath = resolve(
  'libs/database/src/prisma/generated/package.json'
);
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

if (packageJson.type !== 'module') {
  packageJson.type = 'module';
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
