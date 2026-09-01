# AmogaDS — Central Design System (`@amogads/ui`)

Welcome to the **Amoga Design System (AmogaDS)** repository. This repository serves as the centralized source of truth for design tokens, atomic UI primitives, reusable business patterns, real-time chat components, standard page templates, and dynamic zero-env settings published directly to the public [NPM Registry](https://www.npmjs.com/package/@amogads/ui).

---

## 📑 Quick Navigation
1. [📦 Installation & Setup](#-installation--setup)
2. [🎨 Consuming Design System UI Components](#-consuming-design-system-ui-components)
3. [⚙️ App Settings & Zero-Env Configuration](#️-app-settings--zero-env-configuration)
4. [📱 React Native & Mobile Integration](#-react-native--mobile-integration)
5. [🏛 Public Package Exports](#-public-package-exports)
6. [🛠 Local Development & Publishing](#-local-development--publishing)

---

## 📦 Installation & Setup

### 1. Install Package
Install `@amogads/ui` in your Next.js, React, or Vite project:

```bash
npm install @amogads/ui
# or
pnpm add @amogads/ui
# or
yarn add @amogads/ui
```

### 2. Import Theme & Styles
In your global stylesheet (e.g. `app/globals.css` or `src/styles/globals.css`):

```css
@import "tailwindcss";
@import "@amogads/ui/theme.css";

/* Tell Tailwind CSS v4 to scan compiled package classes */
@source "../node_modules/@amogads/ui/dist";

@custom-variant dark (&:is(.dark, .dark *));

@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  body {
    @apply min-h-svh w-full bg-background text-foreground;
  }
}
```

---

## 🎨 Consuming Design System UI Components

All components displayed on the **Design System** gallery page are available as named exports directly from `@amogads/ui`.

### 1. Core UI Primitives & Dialogs
```tsx
import React, { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Badge,
} from '@amogads/ui'

export function UserConfigCard() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(true)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workspace Settings</CardTitle>
          <Badge variant={active ? 'default' : 'secondary'}>
            {active ? 'Active' : 'Paused'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Notifications</span>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>

        <Button onClick={() => setOpen(true)} className="w-full">
          Open Configuration Modal
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Environment</DialogTitle>
              <DialogDescription>
                Select your preferred cloud workspace tier.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Select defaultValue="pro">
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setOpen(false)} className="w-full">
                Save & Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
```

### 2. Business Components & Templates
```tsx
import { 
  PageHeader, 
  DataTable, 
  StatusBadge, 
  ListTemplate, 
  Button 
} from '@amogads/ui'

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'User' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => (
      <StatusBadge status={row.original.status === 'active' ? 'success' : 'warning'} dot pulse>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

const data = [
  { id: '1', name: 'Alex Rivera', status: 'active' },
  { id: '2', name: 'Sam Chen', status: 'pending' },
]

export default function UsersPage() {
  return (
    <ListTemplate
      title="User Management"
      description="Manage workspace users, roles, and security permissions."
      actions={<Button>+ Add Member</Button>}
    >
      <DataTable columns={columns} data={data} searchKey="name" />
    </ListTemplate>
  )
}
```

### 3. Full Standard Pages (Zero-Boilerplate)
You can embed ready-to-run, fully featured pages directly:

```tsx
// app/messages/page.tsx
import { MessagePage } from '@amogads/ui/pages'

export default function Page() {
  return <MessagePage />
}
```

Available standard pages from `@amogads/ui/pages`:
- `MessagePage`: Complete real-time chat, file explorer, document previewer, and scanner.
- `AiChatPage`: Multimodal AI assistant with web search, UI generation, and voice recognition.
- `AiSearchPage`: AI-powered semantic search with source citations and image cards.
- `VouchersPage`: Voucher generation, barcode/QR code engine, and export tools.
- `LinkMakerPage`: Short link creator, QR generator, and click analytics.
- `MapPage`: Interactive map view with geocoding and location markers.

---

## ⚙️ App Settings & Zero-Env Configuration

`@amogads/ui` includes an **App Settings** suite (`/app-settings`) that empowers end-users to paste their own API credentials directly into the UI. The entire application runs dynamically against their credentials without requiring any `.env` variables or server rebuilds!

### 1. Mounting the App Settings Page
```tsx
// app/settings/page.tsx
'use client'

import EmailSettingsFeature from '@amogads/ui' // or import { EmailSettingsFeature } from '@amogads/ui/pages'

export default function SettingsPage() {
  return <EmailSettingsFeature />
}
```

### 2. Available Tabs & Features

| Tab | Purpose | What Happens When Configured |
|---|---|---|
| **Profile** | User identity & bio | Customizes user display name, avatar, and personal notes. |
| **Files** | Custom Supabase Storage | `getStorageSupabaseClient()` dynamically uploads files, documents, and attachments directly to the user's Supabase bucket (`chat-files`). |
| **Chat** | Custom Supabase Real-time DB | `createClient()` automatically communicates with the user's custom Supabase URL and Publishable/Anon key for real-time messaging, channels, and contacts without any `.env`. |
| **AI API** | OpenRouter AI Models | Chat calls to `/api/chat` automatically use the user's OpenRouter API key and selected model (`Gemini 2.5 Flash`, `GPT-4o`, `Claude 3.5 Sonnet`, `DeepSeek Chat`, `Llama 3.3 70B`). |
| **Email** | Custom IMAP/SMTP | Stores custom mail accounts for incoming/outgoing email communication. |
| **Email Files** | Custom Email Attachment Storage | `getEmailStorageSupabaseClient()` dynamically stores email attachments and files in the user's custom bucket (`email-attachments`) without requiring server environment variables. |
| **Auth** | NextAuth Provider Manager | Allows adding, configuring, and toggling active/inactive any NextAuth provider (Google, GitHub, Discord, Auth0, Apple, Credentials, Custom OAuth) with custom Icon upload, Client ID, Secret, and credentials. |
| **Theme** | Look & Feel Customization | Real-time theme presets (`aura-flow`, `cyber-neo`, `midnight-glow`), dark mode, and color themes. |

### 3. Accessing Settings State Programmatically
```tsx
import { useEmailSettingsStore } from '@amogads/ui/stores'
import { createClient, getStorageSupabaseClient } from '@amogads/ui/sdk'

export function MyCustomComponent() {
  const config = useEmailSettingsStore((state) => state.config)

  // Active Chat Account
  const activeChat = config.chatAccounts?.find((a) => a.isEnabled)
  // Active Storage Account
  const activeStorage = config.storageAccounts?.find((a) => a.isEnabled)
  // Active AI Account
  const activeAi = config.aiAccounts?.find((a) => a.isEnabled)

  const handleCustomQuery = async () => {
    // createClient() automatically uses activeChat credentials if enabled!
    const supabase = createClient()
    const { data } = await supabase.from('conversations').select('*')
    console.log('Conversations from custom DB:', data)
  }

  return (
    <div>
      <p>Active Model: {activeAi?.model || 'Default Model'}</p>
      <button onClick={handleCustomQuery}>Query Real-time DB</button>
    </div>
  )
}
```

---

## 📱 React Native & Mobile Integration

`@amogads/ui` is architected for universal web, hybrid mobile (Capacitor), and React Native applications.

### 1. Using Design Tokens in React Native
Exported tokens in `@amogads/ui/tokens` provide raw color values, radius definitions, and typography scales compatible with React Native's `StyleSheet` and NativeWind:

```tsx
import { SEMANTIC_TOKENS, RADIUS_TOKENS } from '@amogads/ui/tokens'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export function NativeCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Amoga Mobile Card</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#6366f1', // Primary brand token
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
})
```

### 2. Capacitor & Native Device Features
`@amogads/ui` integrates directly with Capacitor for native device workflows:
- **Native Document Scanner**: Automatic edge detection, perspective correction, and document enhancement.
- **Camera Bridge**: High-resolution image capture for attachments.
- **File Sharing & PDF Generation**: Export and share invoices, vouchers, and PDF files natively on iOS & Android.

---

## 🏛 Public Package Exports

```
@amogads/ui
├── . (Root)        → 57 UI Primitives, Business Components, Templates
├── /tokens         → Design Tokens, OKLCH scales, Semantic Token objects
├── /theme.css      → Compiled Tailwind CSS v4 design tokens & theme layers
├── /pages          → Complete standard pages (MessagePage, AiChatPage, etc.)
├── /stores         → Persistent Zustand stores (useEmailSettingsStore, auth, etc.)
├── /services       → Database, Supabase storage, AI search, and PDF utilities
├── /server         → Server route handlers (handleChatPost, handleSearchPost, etc.)
└── /sdk            → Universal API client & dynamic Supabase helpers
```

---

## 🛠 Local Development & Publishing

```bash
# 1. Install dependencies
npm install

# 2. Run local interactive gallery
npm run dev

# 3. Build distribution package
npm run build:package

# 4. Publish to NPM
npm publish --access public
```

---

## 📄 License
MIT © [Amoga Technologies](https://amoga.app)
