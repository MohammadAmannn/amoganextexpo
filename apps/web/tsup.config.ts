import { defineConfig } from 'tsup'
import * as fs from 'fs'
import * as path from 'path'

const commonExternals = [
  'react',
  'react-dom',
  'next',
  'next/server',
  'next/navigation',
  'lucide-react',
  'clsx',
  'tailwind-merge',
  'class-variance-authority',
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-dialog',
  '@radix-ui/react-direction',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-icons',
  '@radix-ui/react-label',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
  'sonner',
  'next-themes',
  'date-fns',
  'react-day-picker',
  'cmdk',
  'vaul',
  'recharts',
  'embla-carousel-react',
  'zustand',
  'zustand/middleware',
  '@supabase/supabase-js',
  '@supabase/ssr',
  'next-auth',
  'ai',
  '@openrouter/ai-sdk-provider',
  '@json-render/core',
  '@json-render/react',
  'axios',
  'maplibre-gl',
  'jspdf',
  'pdf-lib',
  'react-qr-code',
  'react-markdown',
  'framer-motion',
  'react-hook-form',
  'zod',
  '@hookform/resolvers',
  'immer',
  'zundo',
  'fs',
  'path',
  'crypto',
  'node:fs',
  'node:fs/promises',
  'node:path',
  'node:crypto',
]

export default defineConfig([
  // 1. Client & Universal Modules (Design System, Pages, Stores, Services, SDK, Tokens)
  {
    entry: {
      index: 'src/design-system/index.ts',
      tokens: 'src/design-system/tokens/index.ts',
      pages: 'src/standard-pages/index.ts',
      stores: 'src/stores/index.ts',
      services: 'src/services/index.ts',
      sdk: 'src/sdk/index.ts',
    },
    tsconfig: 'tsconfig.build.json',
    format: ['esm', 'cjs'],
    dts: false,
    clean: false,
    sourcemap: true,
    minify: false,
    splitting: false,
    outDir: 'dist',
    banner: {
      js: "'use client';",
    },
    external: commonExternals,
  },
  // 2. Server Modules (Node / Edge API Route Handlers)
  {
    entry: {
      server: 'src/server/index.ts',
    },
    tsconfig: 'tsconfig.build.json',
    format: ['esm', 'cjs'],
    dts: false,
    clean: false,
    sourcemap: true,
    minify: false,
    splitting: false,
    platform: 'node',
    outDir: 'dist',
    external: commonExternals,
    onSuccess: async () => {
      // 1. Copy central theme.css into dist root for consumers
      const srcTheme = path.resolve(__dirname, 'src/design-system/tokens/theme.css')
      const distTheme = path.resolve(__dirname, 'dist/theme.css')
      if (fs.existsSync(srcTheme)) {
        fs.copyFileSync(srcTheme, distTheme)
        console.log('✓ Successfully copied theme.css to dist/theme.css')
      }

      // 2. Standalone type declarations (.d.ts) for robust consumer consumption
      const serverDts = `import { NextRequest, NextResponse } from 'next/server';

export declare function handleChatPost(request: NextRequest): Promise<NextResponse>;
export declare function handleGeocodeRequest(request: NextRequest): Promise<NextResponse>;
export declare function handleShortenPost(request: NextRequest): Promise<NextResponse>;
export declare function handleShortenOptions(): NextResponse;
export declare function handleVouchersGet(request: NextRequest): Promise<NextResponse>;
export declare function handleVouchersPost(request: NextRequest): Promise<NextResponse>;
export declare function handleSearchPost(request: NextRequest): Promise<NextResponse>;
export declare function handleMessagesGet(request: NextRequest): Promise<NextResponse>;
export declare function handleMessagesPost(request: NextRequest): Promise<NextResponse>;
export declare function handleContactsGet(request: NextRequest): Promise<NextResponse>;
export declare function handleContactsPost(request: NextRequest): Promise<NextResponse>;
export declare function handleConversationsGet(request: NextRequest): Promise<NextResponse>;
export declare function handleGroupsGet(request: NextRequest): Promise<NextResponse>;
export declare function handleGroupsPost(request: NextRequest): Promise<NextResponse>;
export declare function handleProfilesGet(request: NextRequest): Promise<NextResponse>;
export declare function handleNotificationsGet(request: NextRequest): Promise<NextResponse>;
export declare function handleNotificationsPost(request: NextRequest): Promise<NextResponse>;
export declare function handleNotificationsPatch(request: NextRequest): Promise<NextResponse>;
`
      fs.writeFileSync(path.resolve(__dirname, 'dist/server.d.ts'), serverDts, 'utf8')
      fs.writeFileSync(path.resolve(__dirname, 'server.d.ts'), serverDts, 'utf8')
      fs.writeFileSync(path.resolve(__dirname, 'server.js'), `module.exports = require('./dist/server.js');\n`, 'utf8')

      const pagesDts = `import * as React from 'react';

export declare function MessagePage(): React.JSX.Element;
export declare function ChatTemplatePage(): React.JSX.Element;
export declare function MessageFeature(): React.JSX.Element;
export declare function ChatTemplate(): React.JSX.Element;
export declare function AiChatPage(): React.JSX.Element;
export declare function AiChat(): React.JSX.Element;
export declare function AiSearchPage(): React.JSX.Element;
export declare function AiSearch(): React.JSX.Element;
export declare function VouchersPage(): React.JSX.Element;
export declare function VouchersFeature(): React.JSX.Element;
export declare function LinkMakerPage(): React.JSX.Element;
export declare function LinkMakerFeature(): React.JSX.Element;
export declare function MapTemplatePage(): React.JSX.Element;
export declare function MapPage(): React.JSX.Element;
`
      fs.writeFileSync(path.resolve(__dirname, 'dist/pages.d.ts'), pagesDts, 'utf8')
      fs.writeFileSync(path.resolve(__dirname, 'pages.d.ts'), pagesDts, 'utf8')
      fs.writeFileSync(path.resolve(__dirname, 'pages.js'), `module.exports = require('./dist/pages.js');\n`, 'utf8')

      const genericDts = [
        { name: 'index', target: './src/design-system' },
        { name: 'tokens', target: './src/design-system/tokens' },
        { name: 'stores', target: './src/stores' },
        { name: 'services', target: './src/services' },
        { name: 'sdk', target: './src/sdk' },
      ]

      for (const entry of genericDts) {
        const dtsContent = `export * from '${entry.target}';\n`
        fs.writeFileSync(path.resolve(__dirname, `dist/${entry.name}.d.ts`), dtsContent, 'utf8')
        fs.writeFileSync(path.resolve(__dirname, `${entry.name}.d.ts`), dtsContent, 'utf8')
        fs.writeFileSync(path.resolve(__dirname, `${entry.name}.js`), `module.exports = require('./dist/${entry.name}.js');\n`, 'utf8')
      }
      console.log('✓ Successfully generated standalone TypeScript entry declarations (.d.ts)')
    },
  },
])
