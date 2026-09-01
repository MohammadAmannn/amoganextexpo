# Developer Integration & Usage Guide — `@amogads/ui`

Welcome to the developer guide for consuming **`@amogads/ui`** (Amoga Design System) in your Next.js and React applications.

---

## 📑 Table of Contents
1. [Installation & Setup](#1-installation--setup)
2. [Tailwind CSS v4 Configuration](#2-tailwind-css-v4-configuration)
3. [Dark Mode & Theme Setup](#3-dark-mode--theme-setup)
4. [Component Usage Examples](#4-component-usage-examples)
   - [Core UI Primitives](#41-core-ui-primitives)
   - [Reusable Business Components](#42-reusable-business-components)
   - [Architectural Page Templates](#43-architectural-page-templates)
5. [Design Tokens & Semantic Rules](#5-design-tokens--semantic-rules)
6. [Cross-Repository Upgrades & Registration](#6-cross-repository-upgrades--registration)
7. [App Settings & Zero-Env Runtime Configuration](#7-app-settings--zero-env-runtime-configuration)
8. [React Native & Mobile Integration Guide](#8-react-native--mobile-integration-guide)

---

## 1. Installation & Setup

Install `@amogads/ui` into your Next.js application from the public NPM registry:

```bash
npm install @amogads/ui
# or
pnpm add @amogads/ui
# or
yarn add @amogads/ui
```

### Peer Dependencies
Ensure your project has the required peer dependencies installed:
```json
{
  "dependencies": {
    "@amogads/ui": "^1.0.1",
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^1.33.0"
  }
}
```

---

## 2. Tailwind CSS v4 Configuration

In your project's global stylesheet (e.g. `app/globals.css` or `src/styles/globals.css`), import Tailwind v4, the theme tokens, and the `@source` directive:

```css
@import "tailwindcss";
@import "@amogads/ui/theme.css";

/* ⚡ CRITICAL: Tell Tailwind v4 to scan package distribution files for utility classes */
@source "../node_modules/@amogads/ui/dist";

/* Custom dark mode variant */
@custom-variant dark (&:is(.dark, .dark *));

/* Base layer & scrollbar defaults */
@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  body {
    @apply min-h-svh w-full bg-background text-foreground;
  }
  button:not(:disabled),
  [role='button']:not(:disabled) {
    cursor: pointer;
  }
}
```

> **Note on `@source` path:**
> * If `globals.css` is in `app/globals.css` -> `@source "../node_modules/@amogads/ui/dist";`
> * If `globals.css` is in `src/styles/globals.css` -> `@source "../../node_modules/@amogads/ui/dist";`

---

## 3. Dark Mode & Theme Setup

In your root layout (`app/layout.tsx`), configure `next-themes` and font variables:

```tsx
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'My Application',
  description: 'Built with @amogads/ui',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={openSans.variable}>
      <body className={openSans.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 4. Component Usage Examples

All tokens, primitives, business components, and templates are available directly from the top-level barrel export:

```tsx
import { ... } from '@amogads/ui'
```

---

### 4.1 Core UI Primitives

#### Buttons & Badges
```tsx
import { Button, Badge } from '@amogads/ui'

export function ActionSection() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="default">Primary Action</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Badge variant="secondary">In Review</Badge>
    </div>
  )
}
```

#### Cards & Dialogs
```tsx
'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label,
} from '@amogads/ui'

export function UserSettingsCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Manage your public personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click edit to modify your username.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setOpen(true)}>Edit Profile</Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your username and save changes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="john_doe" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

### 4.2 Reusable Business Components

#### PageHeader & StatusBadge
```tsx
import { PageHeader, StatusBadge, Button } from '@amogads/ui'
import { Plus } from 'lucide-react'

export function OrdersHeader() {
  return (
    <PageHeader
      title="Customer Orders"
      description="View, filter, and process inbound orders."
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      }
    >
      <div className="flex items-center gap-2">
        <StatusBadge status="success" dot pulse>
          Live Gateway
        </StatusBadge>
      </div>
    </PageHeader>
  )
}
```

#### MetricCard Grid
```tsx
import { MetricCard } from '@amogads/ui'

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        title="Total Revenue"
        value="$124,500.00"
        change="+14.2% from last month"
        trend="up"
      />
      <MetricCard
        title="Active Users"
        value="1,420"
        change="+5.1% this week"
        trend="up"
      />
      <MetricCard
        title="Bounce Rate"
        value="2.4%"
        change="-0.8% decrease"
        trend="down"
      />
    </div>
  )
}
```

---

### 4.3 Architectural Page Templates

#### `ListTemplate` + `DataTable`
```tsx
'use client'

import { ListTemplate, DataTable, StatusBadge, Button, type ColumnDef } from '@amogads/ui'

interface Customer {
  id: string
  name: string
  email: string
  tier: string
  status: 'active' | 'suspended'
}

const columns: ColumnDef<Customer>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'tier', header: 'Subscription' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.original.status === 'active' ? 'success' : 'destructive'} dot>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

const customers: Customer[] = [
  { id: '1', name: 'Alice Cooper', email: 'alice@example.com', tier: 'Enterprise', status: 'active' },
  { id: '2', name: 'Bob Marley', email: 'bob@example.com', tier: 'Starter', status: 'suspended' },
]

export default function CustomersPage() {
  return (
    <ListTemplate
      title="Customers"
      description="Manage registered organization accounts."
      actions={<Button>Add Customer</Button>}
      searchPlaceholder="Search by name or email..."
      onSearchChange={(q) => console.log('Searching:', q)}
    >
      <DataTable columns={columns} data={customers} />
    </ListTemplate>
  )
}
```

---

### 4.4 Chat & Realtime Components (Modular UI Building Blocks)

You can build custom messaging and AI chat interfaces using standalone chat primitives from `@amogads/ui` without having to mount full standard pages:

#### Complete Master-Detail Chat Application Example
```tsx
import React, { useState } from 'react'
import {
  ChatSidebar,
  ChatCardItem,
  ChatMessageList,
  ChatBubble,
  ChatInput,
  ChatHeader,
  TypingIndicator,
  ChatEmptyState,
  Button
} from '@amogads/ui'
import { Phone, Video, MoreVertical } from 'lucide-react'

export function CustomChatApp() {
  const [activeTab, setActiveTab] = useState('chats')
  const [activeChatId, setActiveChatId] = useState('1')
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')

  const conversations = [
    {
      id: '1',
      title: 'Aman',
      badgeLabel: 'Chat',
      lastMessage: 'images (1).jpg',
      time: 'about 3 hours ago',
      membersCount: 2,
      onlineCount: 0,
      isActive: activeChatId === '1',
    },
    {
      id: '2',
      title: 'DB Alerts',
      badgeLabel: 'Chat',
      lastMessage: 'Contact Created 🟢 Contact Added By: Bhanuprasad...',
      time: '10 days ago',
      membersCount: 3,
      onlineCount: 0,
      isActive: activeChatId === '2',
    }
  ]

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      senderName: 'Mohammed Aman',
      time: '01:05 PM',
      status: 'read' as const,
      attachments: [
        {
          name: 'Dev_ops resume.pdf',
          size: 507904,
          type: 'pdf',
          statusText: 'Parsed',
        }
      ]
    },
    {
      id: 'm2',
      senderName: 'Mohammed Aman',
      content: 'hy',
      time: '09:06 AM',
      status: 'read' as const,
    },
    {
      id: 'm3',
      senderName: 'Aman',
      content: 'heello',
      time: '09:07 AM',
    },
    {
      id: 'm4',
      senderName: 'Aman',
      content: 'hyy',
      time: '09:52 AM',
    },
    {
      id: 'm5',
      senderName: 'Mohammed Aman',
      content: 'checking from amogds',
      time: '09:52 AM',
      status: 'read' as const,
    }
  ])

  const handleSend = () => {
    if (!inputText.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        senderName: 'Mohammed Aman',
        content: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read' as const,
      }
    ])
    setInputText('')
  }

  return (
    <div className="flex h-[750px] w-full border border-border rounded-2xl overflow-hidden bg-background shadow-lg">
      {/* 1. Left Sidebar: Subtabs, Search, Divider & Conversation Cards */}
      <ChatSidebar
        tabs={[
          { id: 'chats', label: 'Chats' },
          { id: 'contact', label: 'Contact' },
          { id: 'groups', label: 'Groups' },
          { id: 'folder', label: 'Folder' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={search}
        onSearchChange={setSearch}
        sectionLabel="CHATS"
        sectionCount={conversations.length}
      >
        {conversations.map((c) => (
          <ChatCardItem
            key={c.id}
            id={c.id}
            title={c.title}
            badgeLabel={c.badgeLabel}
            lastMessage={c.lastMessage}
            time={c.time}
            membersCount={c.membersCount}
            onlineCount={c.onlineCount}
            isActive={activeChatId === c.id}
            onClick={() => setActiveChatId(c.id)}
          />
        ))}
      </ChatSidebar>

      {/* 2. Main Chat Conversation Panel */}
      <div className="flex flex-1 flex-col h-full bg-background/50">
        <ChatHeader
          title="Aman"
          subtitle="Active now"
          status="online"
          actions={
            <>
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </>
          }
        />

        {/* 3. Message Thread Feed (PDFs, Images, Locations, Text) */}
        <ChatMessageList autoScrollToBottom emptyState={<ChatEmptyState />}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              senderName={msg.senderName}
              content={msg.content}
              time={msg.time}
              status={msg.status}
              attachments={msg.attachments}
            />
          ))}
          <TypingIndicator label="Aman is typing..." />
        </ChatMessageList>

        {/* 4. Rounded Pill Input Composer */}
        <div className="p-3 border-t border-border bg-background">
          <ChatInput
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            placeholder="Message"
            showEmoji={true}
            showAttachments={true}
            showCamera={true}
            showVoice={true}
          />
        </div>
      </div>
    </div>
  )
}
```

#### 💬 Chat Suite Components Reference

##### 1. `ChatSidebar` & `ChatCardItem`
```tsx
import React, { useState } from 'react'
import { ChatSidebar, ChatCardItem } from '@amogads/ui'

export function SidebarExample() {
  const [activeTab, setActiveTab] = useState('chats')
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState('1')

  const items = [
    {
      id: '1',
      title: 'Aman',
      badgeLabel: 'Chat',
      lastMessage: 'images (1).jpg',
      time: 'about 3 hours ago',
      membersCount: 2,
      onlineCount: 0,
      isActive: selectedChat === '1',
    },
    {
      id: '2',
      title: 'DB Alerts',
      badgeLabel: 'Chat',
      lastMessage: 'Contact Created 🟢 Contact Added By: Bhanuprasad...',
      time: '10 days ago',
      membersCount: 3,
      onlineCount: 0,
      isActive: selectedChat === '2',
    }
  ]

  return (
    <ChatSidebar
      tabs={[
        { id: 'chats', label: 'Chats' },
        { id: 'contact', label: 'Contact' },
        { id: 'groups', label: 'Groups' },
        { id: 'folder', label: 'Folder' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={search}
      onSearchChange={setSearch}
      sectionLabel="CHATS"
      sectionCount={items.length}
    >
      {items.map((c) => (
        <ChatCardItem
          key={c.id}
          {...c}
          onClick={() => setSelectedChat(c.id)}
        />
      ))}
    </ChatSidebar>
  )
}
```

##### 2. `ChatBubble` (Hover Bar, 3-Dot Menu, PDF Cards & Locations)
```tsx
import React from 'react'
import { ChatBubble } from '@amogads/ui'

export function ChatMessagesDemo() {
  return (
    <div className="space-y-4 max-w-xl p-4">
      {/* Document / PDF Message with Parsed badge */}
      <ChatBubble
        senderName="Mohammed Aman"
        time="01:05 PM"
        status="read"
        attachments={[
          {
            name: 'Dev_ops resume.pdf',
            size: 507904,
            type: 'pdf',
            statusText: 'Parsed',
          }
        ]}
        onAttachmentPreview={(att) => console.log('Preview', att.name)}
        onAttachmentClick={(att) => console.log('Download', att.name)}
        onReply={() => console.log('Reply')}
        onForward={() => console.log('Forward')}
        onPin={() => console.log('Pin')}
        onStar={() => console.log('Star')}
        onFavorite={() => console.log('Favorite')}
        onFlag={() => console.log('Flag')}
        onArchive={() => console.log('Archive')}
        onActionThis={() => console.log('Action This')}
        onDelete={() => console.log('Delete')}
      />

      {/* Plain text message */}
      <ChatBubble
        senderName="Mohammed Aman"
        content="checking from amogds"
        time="09:52 AM"
        status="read"
      />
    </div>
  )
}
```

##### 3. `ChatInput` (Pill Composer with 9-Option Attachments Menu)
```tsx
import React, { useState } from 'react'
import { ChatInput } from '@amogads/ui'

export function ComposerExample() {
  const [text, setText] = useState('')

  return (
    <ChatInput
      value={text}
      onChange={setText}
      onSend={() => {
        console.log('Sending:', text)
        setText('')
      }}
      placeholder="Message"
      showAttachments={true}
      showEmoji={true}
      showCamera={true}
      showVoice={true}
      onSelectAttachmentType={(type) => {
        // 'images' | 'videos' | 'documents' | 'location' | 'image-converter' | 'doc-converter' | 'doc-scanner' | 'scan-document' | 'extract-text'
        console.log('Selected tool:', type)
      }}
    />
  )
}
```

##### 4. Contact & Group Managers (`ContactManager`, `GroupManager`)
```tsx
import React from 'react'
import { ContactManager, GroupManager } from '@amogads/ui'

export function ContactManagementSection() {
  const contacts = [
    { id: '1', name: 'Aman', email: 'amanmicropay@gmail.com', initials: 'AM', isEnabled: true }
  ]

  const groups = [
    { id: 'g1', name: 'jj', membersCount: 3, ownerEmail: 'itsaman00786@gmail.com', isEnabled: true },
    { id: 'g2', name: 'demo', membersCount: 3, ownerEmail: 'itsaman00786@gmail.com', isEnabled: true }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <ContactManager
        contacts={contacts}
        onChatClick={(c) => console.log('Chat with', c.name)}
        onAddContact={(newC) => console.log('Added', newC)}
        onDeleteClick={(c) => console.log('Delete', c.id)}
      />

      <GroupManager
        groups={groups}
        onChatClick={(g) => console.log('Open group', g.name)}
        onAddGroup={(newG) => console.log('Create group', newG)}
        onDeleteClick={(g) => console.log('Delete group', g.id)}
      />
    </div>
  )
}
```

---

#### 🤖 AI Assistant Suite Components Reference

##### 1. `AiChatInput` (with `AiModelSelector` and `AiToolSelector`)
```tsx
import React, { useState } from 'react'
import { AiChatInput } from '@amogads/ui'

export function AiInputExample() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('google/gemini-2.5-flash')
  const [tool, setTool] = useState('chat')

  return (
    <AiChatInput
      value={prompt}
      onChange={setPrompt}
      onSend={() => {
        console.log('Prompt:', prompt, 'Model:', model, 'Tool:', tool)
        setPrompt('')
      }}
      placeholder="Ask a question about your data..."
      model={model}
      onModelChange={setModel}
      tool={tool}
      onToolChange={setTool}
      onVoiceToggle={() => console.log('Voice toggle')}
      onHistoryClick={() => console.log('Open History')}
      onNewChatClick={() => console.log('New Chat')}
    />
  )
}
```

##### 2. `AiMessageList` & `AiMessageBubble`
```tsx
import React from 'react'
import { AiMessageList, AiMessageBubble } from '@amogads/ui'

export function AiFeedExample() {
  return (
    <AiMessageList>
      {/* User prompt */}
      <AiMessageBubble
        role="user"
        content="hy"
      />

      {/* Assistant response */}
      <AiMessageBubble
        role="assistant"
        content="Hello! How can I help you today?"
        modelName="Gemini 2.5 Flash"
      />
    </AiMessageList>
  )
}
```

##### 3. Complete AI Workspace Page
```tsx
import React, { useState } from 'react'
import {
  AiChatHeader,
  AiMessageList,
  AiMessageBubble,
  AiChatInput,
} from '@amogads/ui'

export function CustomAiChat() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('google/gemini-2.5-flash')
  const [tool, setTool] = useState('chat')

  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'user' as const,
      content: 'hy',
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Hello! How can I help you today?',
      modelName: 'Gemini 2.5 Flash',
    },
  ])

  const handleSend = (userText?: string) => {
    const textToSend = userText || prompt
    if (!textToSend.trim()) return

    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: textToSend },
      { id: String(Date.now() + 1), role: 'assistant', content: 'Here is what I found for you...', modelName: 'Gemini 2.5 Flash' },
    ])
    setPrompt('')
  }

  return (
    <div className="flex flex-col h-[700px] w-full border border-border rounded-3xl overflow-hidden bg-background shadow-xl">
      {/* 1. Header with Model Badge */}
      <AiChatHeader
        title="AI Assistant"
        subtitle="Multi-model intelligence workspace"
        modelName="Gemini 2.5 Flash"
      />

      {/* 2. Scrollable Message Feed */}
      <AiMessageList
        isEmpty={messages.length === 0}
        onSelectPrompt={(selectedPrompt) => handleSend(selectedPrompt)}
      >
        <div className="space-y-4 max-w-3xl mx-auto w-full">
          {messages.map((m) => (
            <AiMessageBubble
              key={m.id}
              role={m.role}
              content={m.content}
              modelName={m.modelName}
            />
          ))}
        </div>
      </AiMessageList>

      {/* 3. Rounded-3xl Pill Input Composer */}
      <div className="p-4 bg-background border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <AiChatInput
            value={prompt}
            onChange={setPrompt}
            onSend={() => handleSend()}
            placeholder="Ask a question about your data..."
            model={model}
            onModelChange={setModel}
            tool={tool}
            onToolChange={setTool}
            onVoiceToggle={() => console.log('Voice toggle')}
            onHistoryClick={() => console.log('Open history')}
            onNewChatClick={() => setMessages([])}
          />
        </div>
      </div>
    </div>
  )
}
```

#### 📱 How to Use in React Native / Mobile Apps
In React Native, you can install `@amogads/ui` to share the same Design Tokens, Business Services, and State Stores:
```bash
npm install @amogads/ui
```
```tsx
import { SEMANTIC_TOKENS } from '@amogads/ui/tokens'
import { useAuthStore, useNotificationStore } from '@amogads/ui/stores'
import { chatService } from '@amogads/ui/services'

export function MobileChatScreen() {
  const user = useAuthStore((s) => s.auth.user)
  // Consumes the exact shared business logic & tokens across web and mobile
}
```

---

## 5. Design Tokens & Semantic Rules

Never use hardcoded hex values (`#ffffff`, `#1e293b`). Always use semantic Tailwind utility classes:

| Token Class | Role / Purpose |
|---|---|
| `bg-background`, `text-foreground` | Page body canvas & default text |
| `bg-card`, `text-card-foreground` | Cards, popovers, elevated surfaces |
| `bg-primary`, `text-primary-foreground` | Main action buttons, active badges |
| `bg-secondary`, `text-secondary-foreground` | Secondary action buttons |
| `bg-muted`, `text-muted-foreground` | Subtle labels, captions, disabled states |
| `border-border`, `border-input` | Component dividers and form outlines |
| `bg-success`, `text-success-foreground` | Approvals, active status, success toast |
---

### 4.5 Files & Document Management Suite

Amoga Design System provides an enterprise-ready suite for file management, cloud storage explorer, document composers, and storage analytics.

```tsx
import React, { useState } from 'react'
import {
  UserFileCardsView,
  FileCardItem,
  FileUploadForm,
  FolderTreeItem,
  StorageStatCard,
} from '@amogads/ui'

// 1. File Manager Explorer View
export function FileManagerExample() {
  const [selectedFolder, setSelectedFolder] = useState({
    id: 'finance-folder',
    name: 'Finance & Invoices',
    path: 'Files/user/Finance',
    fileCount: 12,
    level: 1,
  })

  return (
    <UserFileCardsView
      folder={selectedFolder}
      files={[
        {
          id: 'pdf-1',
          fileName: 'Audit_Report_2026.pdf',
          fileUrl: 'https://example.com/doc.pdf',
          fileSize: 2450000,
          updatedAt: new Date().toISOString(),
          category: 'Pdf',
          section: 'Finance',
        },
      ]}
      onSelectFileForPreview={(file) => console.log('Preview:', file)}
      onDownloadFile={(file) => console.log('Download:', file)}
      onDeleteFile={(file) => console.log('Delete:', file)}
      onUploadClick={() => console.log('Open uploader')}
    />
  )
}

// 2. Individual File Card Item
export function FileCardExample() {
  return (
    <FileCardItem
      file={{
        id: 'img-1',
        fileName: 'Product_Hero.png',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        fileSize: 4850000,
        updatedAt: new Date().toISOString(),
        category: 'Images',
        section: 'Design',
      }}
      viewMode="grid"
      onPreview={(file) => console.log('Preview:', file)}
      onDownload={(file) => console.log('Download:', file)}
    />
  )
}

// 3. Document Composer & File Uploader
export function FileUploadFormExample() {
  return (
    <FileUploadForm
      initialSubject="Q3 Financial Statements"
      initialFolder="Finance"
      initialSubFolder="Pdf"
      onClose={() => console.log('Close')}
      onSave={async (data) => {
        console.log('Saving document with attachments:', data)
      }}
    />
  )
}
```

---

## 6. Synchronizing `@amogads/ui` Updates with Consuming Apps (`amoganextapp`)

When changes are made to `@amogads/ui` inside `amogads`, follow this 3-step manual workflow to synchronize updates into `amoganextapp` (or any other consumer):

### 🔄 The 3-Step Synchronization Cycle

```
Step 1: Update & Publish amogads
  └─► Edit UI/tokens in amogads -> npm run build:package -> npm version patch -> npm publish

Step 2: Create Branch on Consumer App (amoganextapp)
  └─► git checkout -b chore/update-amogads-vX.Y.Z -> npm install @amogads/ui@latest -> npm run build

Step 3: Merge with Main
  └─► git checkout main -> git merge chore/update-amogads-vX.Y.Z -> git push origin main
```

---

### 💻 Step-by-Step Code Example

#### 1. In `amogads/` (Make changes and publish):
```bash
cd amogads

# 1. Modify component or token (e.g., src/design-system/components/ui/card.tsx)
# 2. Build the package bundle
npm run build:package

# 3. Bump version (e.g. 1.0.2 -> 1.0.3)
npm version patch

# 4. Publish to NPM
npm publish --access public
```

#### 2. In `amoganextapp/` (Create branch and adopt changes):
```bash
# Return to root of amoganextapp
cd ..

# 1. Create a fresh branch for this upgrade
git checkout -b chore/update-amogads-v1.0.3

# 2. Install the new package version from NPM
npm install @amogads/ui@latest

# 3. Verify locally
npm run dev
npm run build
```

#### 3. Merge branch into `main`:
```bash
# 1. Commit updated package.json & lockfile
git add package.json package-lock.json
git commit -m "chore(deps): update @amogads/ui to v1.0.3"

# 2. Merge to main branch
git checkout main
git merge chore/update-amogads-v1.0.3

# 3. Push to remote
git push origin main
```

---

### 🛡 Consumer Registry & Automation Status

Consuming applications are tracked in [`consumers-registry.json`](consumers-registry.json):
* `"automationStatus": "disabled"` *(Current Default)*: Background GitHub Action PR bots are paused. You have full manual control over when branches are created and merged in `amoganextapp`.
* `"automationStatus": "enabled"`: GitHub Actions automatically pushes branches and opens PRs on every release.

To inspect consumer version status:
```bash
npm run consumers:status
```

---

## 7. App Settings & Zero-Env Runtime Configuration

`@amogads/ui` includes an end-user **App Settings** suite (`/app-settings`) providing dynamic runtime configuration. When users enter credentials in the UI, the application immediately routes requests to their personal services without needing `.env` keys.

### 7.1 Mounting App Settings in Your App
```tsx
// app/app-settings/page.tsx
'use client'

import EmailSettingsFeature from '@amogads/ui'
// Or named import from pages:
// import { EmailSettingsFeature } from '@amogads/ui/pages'

export default function SettingsPage() {
  return <EmailSettingsFeature />
}
```

### 7.2 The 6 Settings Tabs

```
App Settings Tabs
├── 1. Profile  → Display name, bio description, and avatar
├── 2. Files    → Custom Supabase project URL & Anon Key for file storage
├── 3. Chat     → Custom Supabase project URL & Anon Key for real-time chat & database
├── 4. AI API   → OpenRouter API Key and AI model selection
├── 5. Email    → Custom IMAP/SMTP accounts
└── 6. Theme    → Design system presets, dark mode, and color themes
```

### 7.3 How Zero-Env Dynamic Runtime Works

```tsx
import { useEmailSettingsStore } from '@amogads/ui/stores'
import { createClient, getStorageSupabaseClient } from '@amogads/ui/sdk'

export function DynamicIntegrationExample() {
  const { config } = useEmailSettingsStore()

  const queryUserDatabase = async () => {
    // createClient() automatically reads localStorage ('email-settings-workspace')
    // If user configured a Chat Supabase account and enabled it,
    // this client connects to THEIR Supabase project directly.
    const supabase = createClient()
    const { data, error } = await supabase.from('conversations').select('*')
    console.log('Conversations from dynamic Supabase instance:', data)
  }

  const uploadToUserStorage = async (file: File) => {
    // getStorageSupabaseClient() automatically targets the user's custom bucket
    const storageClient = getStorageSupabaseClient()
    const bucket = config.storageAccounts?.[0]?.bucketName || 'chat-files'
    
    const { data, error } = await storageClient.storage
      .from(bucket)
      .upload(`uploads/${file.name}`, file)
    console.log('Uploaded to custom storage:', data)
  }

  return (
    <div className="space-y-4">
      <button onClick={queryUserDatabase}>Test Dynamic DB Connection</button>
    </div>
  )
}
```

---

## 8. React Native & Mobile Integration Guide

`@amogads/ui` provides design tokens and device bridges for React Native and Capacitor mobile apps.

### 8.1 Using Design Tokens in React Native

Tokens from `@amogads/ui/tokens` can be directly consumed in React Native `StyleSheet` objects or NativeWind:

```tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SEMANTIC_TOKENS, RADIUS_TOKENS } from '@amogads/ui/tokens'

export function MobileCard({ title, subtitle, onPress }: any) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.description}>{subtitle}</Text>
      <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.actionText}>View Details</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#18181b', // Zinc 900
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
  },
  description: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#6366f1', // Indigo 500
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
})
```

### 8.2 Native Scanner & Camera Hooks (Capacitor / Hybrid Mobile)

```tsx
import { useCapacitorDocScanner } from '@amogads/ui/services'

export function MobileScannerWidget() {
  const { isAvailable, startScan } = useCapacitorDocScanner()

  const handleScan = async () => {
    if (isAvailable) {
      const result = await startScan()
      console.log('Scanned pages:', result.scannedImages)
    }
  }

  return (
    <button onClick={handleScan}>
      📷 Scan Document with Device Camera
    </button>
  )
}
```
