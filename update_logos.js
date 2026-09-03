const fs = require('fs');
const path = require('path');

// Update Sidebar logo (dashboard)
const sidebarPath = path.join(__dirname, 'apps/frontend/src/components/dashboard/sidebar.tsx');
let sidebar = fs.readFileSync(sidebarPath, 'utf8');

sidebar = sidebar.replace(
  'className="h-12 w-auto sm:h-14 sm:w-auto lg:h-8 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:hidden"',
  'className="h-14 w-auto sm:h-16 sm:w-auto lg:h-16 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:hidden"'
);

sidebar = sidebar.replace(
  'className="hidden h-12 w-auto sm:h-14 sm:w-auto lg:h-20 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:block"',
  'className="hidden h-14 w-auto sm:h-16 sm:w-auto lg:h-16 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:block"'
);

fs.writeFileSync(sidebarPath, sidebar, 'utf8');
console.log('✓ Updated sidebar logo');

// Update Public Header logo
const headerPath = path.join(__dirname, 'apps/frontend/src/components/layout/header.tsx');
let header = fs.readFileSync(headerPath, 'utf8');

header = header.replace(
  'className="h-16 w-16 sm:h-20 sm:w-20 lg:h-48 lg:w-48 object-contain transition-transform group-hover:scale-105 dark:hidden"',
  'className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain transition-transform group-hover:scale-105 dark:hidden"'
);

header = header.replace(
  'className="hidden h-16 w-16 sm:h-20 sm:w-20 lg:h-48 lg:w-48 object-contain transition-transform group-hover:scale-105 dark:block"',
  'className="hidden h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain transition-transform group-hover:scale-105 dark:block"'
);

fs.writeFileSync(headerPath, header, 'utf8');
console.log('✓ Updated public header logo');

console.log('\n✅ All logos updated!');
