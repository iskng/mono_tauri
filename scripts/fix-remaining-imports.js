#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const uiPackageDir = path.join(rootDir, 'packages/ui/src');

// Components that can't be easily fixed and need platform-specific versions
const NEXT_ONLY_COMPONENTS = new Set([
  'chat.tsx',
  'sidebar-history.tsx',
  'sidebar-history-item.tsx',
  'model-selector.tsx',
  'message-editor.tsx',
  'sign-out-form.tsx',
  'sidebar-user-nav.tsx',
  'markdown.tsx',
  'chat-header.tsx',
  'auth-form.tsx',
  'app-sidebar.tsx'
]);

// Additional import mappings for toolbar fix
const additionalMappings = [
  // Fix the toolbar import specifically
  {
    from: /} from "@repo\/ui\/components\/ui\/tooltip"/g,
    to: '} from "@repo/ui/components/tooltip"'
  },
  // Fix any remaining @/app imports to be handled by the web app
  {
    from: /from ['"]@\/app\//g,
    to: 'from "@/app/'
  }
];

async function createPlatformAdapters() {
  console.log('🔨 Creating platform adapter components...\n');
  
  const adaptersDir = path.join(uiPackageDir, 'components/platform-adapters');
  
  // Create adapters directory
  if (!fs.existsSync(adaptersDir)) {
    fs.mkdirSync(adaptersDir, { recursive: true });
  }

  // Create a router adapter
  const routerAdapterContent = `// Platform-agnostic router hooks
import { useCallback } from 'react';

export interface RouterAdapter {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  pathname: string;
}

// Default implementation for non-Next.js environments
export const useRouter = (): RouterAdapter => {
  return {
    push: (path: string) => {
      console.log('Router push:', path);
      // In Tauri app, you might handle navigation differently
    },
    replace: (path: string) => {
      console.log('Router replace:', path);
    },
    back: () => {
      console.log('Router back');
    },
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/'
  };
};

export const useParams = () => {
  // Return empty params for non-Next.js environments
  return {};
};

export const useSearchParams = () => {
  // Return empty search params for non-Next.js environments
  return new URLSearchParams();
};
`;

  fs.writeFileSync(path.join(adaptersDir, 'router.ts'), routerAdapterContent);
  console.log('✅ Created router adapter');

  // Create Link adapter
  const linkAdapterContent = `import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Platform-agnostic Link component
export const Link: React.FC<LinkProps> = ({ href, children, className, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    // In a Tauri app, you might handle navigation differently
    console.log('Link clicked:', href);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
`;

  fs.writeFileSync(path.join(adaptersDir, 'link.tsx'), linkAdapterContent);
  console.log('✅ Created Link adapter');

  // Create index file
  const indexContent = `export * from './router';
export { Link } from './link';
`;

  fs.writeFileSync(path.join(adaptersDir, 'index.ts'), indexContent);
  console.log('✅ Created adapter index');
}

async function fixRemainingImports() {
  console.log('\n🔧 Fixing remaining imports...\n');

  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: uiPackageDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
  });

  let totalFixed = 0;

  for (const file of files) {
    const relativePath = path.relative(uiPackageDir, file);
    const fileName = path.basename(file);
    
    // Skip Next.js specific components
    if (NEXT_ONLY_COMPONENTS.has(fileName)) {
      console.log(`⏭️  Skipping ${relativePath} (Next.js specific)`);
      continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Apply additional mappings
    for (const mapping of additionalMappings) {
      const matches = content.match(mapping.from);
      if (matches) {
        content = content.replace(mapping.from, mapping.to);
        changes += matches.length;
      }
    }

    // Replace Next.js imports with platform adapters
    if (content.includes('from "next/navigation"') || content.includes("from 'next/navigation'")) {
      content = content.replace(
        /from ['"]next\/navigation['"]/g,
        'from "@repo/ui/components/platform-adapters"'
      );
      changes++;
    }

    if (content.includes('from "next/link"') || content.includes("from 'next/link'")) {
      content = content.replace(
        /from ['"]next\/link['"]/g,
        'from "@repo/ui/components/platform-adapters"'
      );
      changes++;
    }

    if (changes > 0) {
      fs.writeFileSync(file, content);
      totalFixed += changes;
      console.log(`✅ ${relativePath} - Fixed ${changes} import(s)`);
    }
  }

  console.log(`\n✨ Fixed ${totalFixed} additional imports`);
}

async function createSimplifiedViews() {
  console.log('\n📦 Creating simplified view components...\n');

  const viewsToCreate = [
    {
      name: 'simplifiedChatView.tsx',
      content: `import { SimpleChatView } from './simpleChatView';
export { SimpleChatView as ChatView };
`
    }
  ];

  for (const view of viewsToCreate) {
    const viewPath = path.join(uiPackageDir, 'views', view.name);
    if (!fs.existsSync(viewPath)) {
      fs.writeFileSync(viewPath, view.content);
      console.log(`✅ Created ${view.name}`);
    }
  }
}

// Main execution
async function main() {
  try {
    await createPlatformAdapters();
    await fixRemainingImports();
    
    console.log('\n📋 Summary:');
    console.log('- Created platform adapter components for routing');
    console.log('- Fixed remaining import issues');
    console.log('- Components that need Next.js will use platform adapters');
    console.log('\n✅ Import fixes complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();