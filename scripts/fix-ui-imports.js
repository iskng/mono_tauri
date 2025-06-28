#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const uiPackageDir = path.join(rootDir, 'packages/ui/src');

// Define import mappings
const importMappings = [
  // Fix relative UI component imports to use full paths
  { from: /from ["']\.\/ui\/button["']/g, to: 'from "@repo/ui/components/button"' },
  { from: /from ["']\.\/ui\/card["']/g, to: 'from "@repo/ui/components/card"' },
  { from: /from ["']\.\/ui\/textarea["']/g, to: 'from "@repo/ui/components/textarea"' },
  { from: /from ["']\.\/ui\/dialog["']/g, to: 'from "@repo/ui/components/dialog"' },
  { from: /from ["']\.\/ui\/dropdown-menu["']/g, to: 'from "@repo/ui/components/dropdown-menu"' },
  { from: /from ["']\.\/ui\/input["']/g, to: 'from "@repo/ui/components/input"' },
  { from: /from ["']\.\/ui\/label["']/g, to: 'from "@repo/ui/components/label"' },
  { from: /from ["']\.\/ui\/select["']/g, to: 'from "@repo/ui/components/select"' },
  { from: /from ["']\.\/ui\/separator["']/g, to: 'from "@repo/ui/components/separator"' },
  { from: /from ["']\.\/ui\/sheet["']/g, to: 'from "@repo/ui/components/sheet"' },
  { from: /from ["']\.\/ui\/sidebar["']/g, to: 'from "@repo/ui/components/sidebar"' },
  { from: /from ["']\.\/ui\/skeleton["']/g, to: 'from "@repo/ui/components/skeleton"' },
  { from: /from ["']\.\/ui\/toast["']/g, to: 'from "@repo/ui/components/toast"' },
  { from: /from ["']\.\/ui\/tooltip["']/g, to: 'from "@repo/ui/components/tooltip"' },
  { from: /from ["']\.\/ui\/alert["']/g, to: 'from "@repo/ui/components/alert"' },
  { from: /from ["']\.\/ui\/alert-dialog["']/g, to: 'from "@repo/ui/components/alert-dialog"' },
  
  // Fix @/artifacts imports
  { from: /from ["']@\/artifacts\/([^"']+)["']/g, to: 'from "@repo/ui/artifacts/$1"' },
];

// Additional mappings for Next.js specific imports that need to be handled differently
const nextSpecificComponents = [
  'sidebar-history.tsx',
  'sidebar-history-item.tsx',
  'chat.tsx',
  'model-selector.tsx',
  'message-editor.tsx',
  'sign-out-form.tsx',
];

async function fixImports() {
  console.log('🔧 Fixing UI component imports...\n');

  // Find all TypeScript/JavaScript files in the UI package
  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: uiPackageDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
  });

  let totalFixed = 0;
  const fileChanges = {};

  for (const file of files) {
    const relativePath = path.relative(uiPackageDir, file);
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Apply import mappings
    for (const mapping of importMappings) {
      const matches = content.match(mapping.from);
      if (matches) {
        content = content.replace(mapping.from, mapping.to);
        changes += matches.length;
      }
    }

    // Check if this file has Next.js specific imports
    const fileName = path.basename(file);
    if (nextSpecificComponents.includes(fileName)) {
      // Mark these files as needing special handling
      if (content.includes('next/navigation') || content.includes('next/link') || content.includes('next-auth')) {
        console.log(`⚠️  ${relativePath} - Contains Next.js specific imports (needs wrapper component)`);
      }
    }

    if (changes > 0) {
      fs.writeFileSync(file, content);
      fileChanges[relativePath] = changes;
      totalFixed += changes;
      console.log(`✅ ${relativePath} - Fixed ${changes} import(s)`);
    }
  }

  console.log(`\n✨ Fixed ${totalFixed} imports across ${Object.keys(fileChanges).length} files`);

  // Report files that need Next.js wrappers
  console.log('\n📋 Components that need platform-specific wrappers:');
  for (const component of nextSpecificComponents) {
    console.log(`   - ${component}`);
  }
}

// Also create a script to check for remaining issues
async function checkRemainingIssues() {
  console.log('\n🔍 Checking for remaining import issues...\n');

  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: uiPackageDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
  });

  const issues = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(uiPackageDir, file);

    // Check for remaining problematic imports
    if (content.match(/from ["']\.\/ui\//)) {
      issues.push(`${relativePath} - Still has ./ui/ imports`);
    }
    if (content.match(/from ["']next\//)) {
      issues.push(`${relativePath} - Has Next.js imports`);
    }
    if (content.match(/from ["']@\/app\//)) {
      issues.push(`${relativePath} - Has app-specific imports`);
    }
  }

  if (issues.length > 0) {
    console.log('⚠️  Found remaining issues:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ No remaining import issues found!');
  }
}

// Run the fixes
fixImports()
  .then(() => checkRemainingIssues())
  .catch(console.error);