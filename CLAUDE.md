# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this monorepo.

## Repository Overview

This is a Tauri v2 + Next.js monorepo for building cross-platform applications (Web, Desktop, Mobile) with integrated AI chat functionality.

### Project Structure

```
/mono/
├── /apps/
│   ├── /web/        # Next.js 15 full-stack app with AI chat (Frontend + API)
│   └── /native/     # Tauri v2 app (Desktop + Mobile)
├── /packages/
│   ├── /ui/         # Shared React components, views, chat UI, and artifacts
│   ├── /typescript-config/  # Shared TypeScript configs
│   └── /eslint-config/      # Shared ESLint configs
```

## Technology Stack

- **Monorepo**: TurboRepo
- **Package Manager**: pnpm (v9.0.0+)
- **Web App**: Next.js 15, React 19, TypeScript 5.5.4
  - **AI Integration**: AI SDK with xAI (grok-2-1212)
  - **Authentication**: NextAuth v5 (beta) 
  - **Database**: PostgreSQL with Drizzle ORM
  - **Storage**: Vercel Blob
- **Native App**: Tauri v2, Vite, React 19
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Code Quality**: ESLint, Prettier, TypeScript

## Development Commands

### Root Level Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Start all apps
pnpm clean            # Clean build artifacts
pnpm lint             # Lint entire codebase
pnpm format           # Format with Prettier
pnpm check-types      # Type check all packages

# UI Component Management
pnpm shadcn add <component>  # Add new Shadcn component

# Tauri Commands
pnpm tauri <command>         # Run Tauri CLI commands
```

### Web App Commands (`/apps/web`)
```bash
# Development
pnpm --filter web dev         # Start dev server (localhost only)
pnpm --filter web dev:network # Start dev server (network accessible)

# Build & Production
pnpm --filter web build       # Build for production (includes DB migration)
pnpm --filter web start       # Start production server

# Database
pnpm --filter web db:generate # Generate DB migrations
pnpm --filter web db:migrate  # Run database migrations
pnpm --filter web db:studio   # Open Drizzle Studio
pnpm --filter web db:push     # Push schema changes
pnpm --filter web db:pull     # Pull database schema
pnpm --filter web db:check    # Check migration status
pnpm --filter web db:up       # Update to latest migration

# Code Quality
pnpm --filter web lint        # Lint web app
pnpm --filter web check-types # Type check
```

### Native App Commands (`/apps/native`)
```bash
# Desktop Development
pnpm --filter native dev      # Start Vite dev server
pnpm tauri dev               # Start Tauri desktop app

# Mobile Development (Automated)
pnpm --filter native dev:ios     # Auto-setup & start iOS dev
pnpm --filter native dev:android # Auto-setup & start Android dev

# Mobile Development (Manual)
pnpm tauri ios dev           # Start iOS app
pnpm tauri android dev       # Start Android app

# Utilities
pnpm --filter native detect-ip   # Detect network IP
pnpm --filter native clean       # Clean build artifacts
```

### UI Package Commands (`/packages/ui`)
```bash
pnpm --filter @repo/ui shadcn add <component>  # Add Shadcn component
```

## Architecture Details

### Web App (`/apps/web`)
- **Port**: 3000
- **Structure**: Next.js App Router with route groups
- **Main Routes**:
  - `/` - Redirects to chat
  - `/chat` - AI-powered chat interface with sidebar
  - `/chat/[id]` - Specific chat conversation
  - `/login`, `/register` - Authentication pages
  - `/analyze-text` - Text analysis functionality
- **API Routes**: 
  - `/api/auth/*` - Authentication endpoints
  - `/api/chat` - Chat streaming endpoint
  - `/api/document`, `/api/files/*` - Document and file management
  - `/api/text-analysis` - Text analysis API
- **Features**: 
  - AI chat with xAI integration
  - Real-time streaming responses
  - Document artifacts (code, text, image, sheet)
  - Authentication (regular + guest users)
  - File uploads with Vercel Blob
  - Text analysis API
  - CORS support for native apps
- **Network Mode**: Use `dev:network` for mobile development
- **Required Environment Variables**:
  - `AUTH_SECRET` - Authentication secret
  - `XAI_API_KEY` - xAI API key for chat
  - `POSTGRES_URL` - PostgreSQL connection
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
  - `REDIS_URL` - Optional for resumable streams

### Native App (`/apps/native`)
- **Dev Port**: 1420 (Vite)
- **Platforms**: Windows, macOS, Linux, iOS, Android
- **API Connection**: Configurable via `VITE_API_HOST` env var
- **Mobile Setup**: Automatic IP detection and backend startup

### Shared UI (`/packages/ui`)
- **Components**: 
  - Basic UI: Button, Card, Textarea, Input, Select, etc. (Shadcn-based)
  - Chat UI: Chat, Messages, Message, MultimodalInput, ModelSelector
  - Auth: AuthForm, SubmitButton, SignOutForm
  - Sidebar: AppSidebar, SidebarProvider, SidebarHistory
  - Artifacts: CodeEditor, ImageEditor, SheetEditor, TextEditor
  - Support: Markdown, CodeBlock, Weather, Toast, ThemeProvider
- **Views**: 
  - ChatView - Main chat interface
  - LoginView, RegisterView - Authentication views
  - AnalyzeTextView - Text analysis UI
- **Hooks**: 
  - useArtifact, useAutoResume, useChatVisibility
  - useMessages, useMobile, useScrollToBottom
- **Artifacts**: Code, Image, Sheet, Text editors as separate modules
- **Utilities**: API client, network config, types
- **Styling**: Shared Tailwind config and global styles with chat-specific CSS

## Mobile Development

For mobile development, the native app needs to connect to the web API:

1. **Automatic Setup** (Recommended):
   ```bash
   pnpm --filter native dev:ios     # For iOS
   pnpm --filter native dev:android # For Android
   ```
   This automatically:
   - Detects your network IP
   - Starts the web backend if needed
   - Configures the app to connect to the API

2. **Manual Setup**:
   - Start web backend: `pnpm --filter web dev:network`
   - Set your network IP: `VITE_API_HOST=<your-ip>`
   - Start mobile app: `pnpm tauri ios dev`

## Important Notes

1. **Package Manager**: Always use pnpm (NOT npm or yarn)
2. **Node Version**: Requires Node.js 18 or higher
3. **Platform Requirements**:
   - Desktop: Rust toolchain required
   - iOS: Xcode required
   - Android: Android Studio required
4. **Database Setup**: 
   - PostgreSQL required for chat functionality
   - Run migrations before first use: `pnpm --filter web db:migrate`
5. **Environment Variables**: Copy `.env.example` to `.env.local` and fill in required values
6. **API Communication**: All platforms communicate with the web app's API
7. **Port Configuration**:
   - Web API: http://localhost:3000
   - Native Dev: http://localhost:1420
8. **Type Safety**: Shared types in `@repo/ui/types/*`
9. **Component Sharing**: All UI components are in `@repo/ui`
10. **Authentication**: Uses NextAuth v5 beta with guest user support

## Common Tasks

### Adding a New Shared Component
```bash
# Add to UI package
pnpm shadcn add <component-name>

# Import in apps
import { ComponentName } from "@repo/ui/components/component-name"
```

### Creating a New API Endpoint
1. Add route in `/apps/web/app/api/[endpoint]/route.ts`
2. Add types in `/packages/ui/src/types/`
3. Update CORS in `next.config.ts` if needed
4. Use shared API utilities from `@repo/ui/lib/api`

### Running on Mobile Device
```bash
# iOS (automatic setup)
pnpm --filter native dev:ios

# Android (automatic setup)
pnpm --filter native dev:android
```

### Building for Production
```bash
# Web app
pnpm --filter web build

# Desktop apps
pnpm tauri build

# Mobile apps
pnpm tauri ios build
pnpm tauri android build
```

## Troubleshooting

### Mobile Connection Issues
- Ensure web backend is running with `dev:network`
- Check firewall settings
- Verify correct network IP in app config
- Use automatic setup scripts for easier configuration

### Build Errors
- Clear caches: `pnpm clean`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version (18+)
- Ensure Rust is installed for Tauri builds

### Type Errors
- Run `pnpm check-types` to identify issues
- Ensure shared types are properly exported from `@repo/ui`
- Check import paths match package exports

## Best Practices

1. **Component Development**: Always add new components to `@repo/ui` for sharing
2. **API Design**: Use the shared API utilities for consistent error handling
3. **Type Safety**: Define types in the UI package and import everywhere
4. **Mobile Testing**: Test on actual devices when possible
5. **Code Quality**: Run lint and type checks before committing
6. **Documentation**: Update this file when adding major features or changing architecture