# AmogDS Consumer Integration & Architecture Guide

Welcome to the **Amoga Design System (`@amogads/ui`)** consumer guide. This document explains how any web or mobile application can install, consume, and keep up to date with AmogDS.

---

## 1. Architectural Blueprint

```
AmogDS Platform (@amogads/ui)
 ├── @amogads/ui              # UI Primitives, Layouts & Shared Components
 ├── @amogads/ui/tokens       # OKLCH Token Definitions & Radii Scales
 ├── @amogads/ui/theme.css    # Central Design System CSS Variables
 ├── @amogads/ui/pages        # 6 Standard Pages (Message, AI Chat, Search, Vouchers, Link Maker, Map)
 ├── @amogads/ui/stores       # Zustand Stores (Auth, Notifications, Vouchers, Link Maker)
 ├── @amogads/ui/services     # Repositories & Business Logic (PostgREST, Geocoding, Short URL, etc.)
 ├── @amogads/ui/server       # Next.js Serverless Route Handlers
 └── @amogads/ui/sdk          # Client SDK & QueryBuilder
       │
       ├───► AmogaNext (Web Application)
       ├───► React Web / Vite Applications
       └───► React Native / Mobile Applications (Headless Repositories & SDK)
```

---

## 2. Installation

### In an npm project:
```bash
npm install @amogads/ui
```

### Peer Dependencies:
Ensure your project has the required base React dependencies:
```bash
npm install react react-dom lucide-react clsx tailwind-merge zustand
```

---

## 3. Importing Tokens & Styles

In your root layout or global stylesheet (`app/globals.css` or `src/index.css`):

```css
@import '@amogads/ui/theme.css';
```

Or import JavaScript token objects:
```typescript
import { colors, radii, typography } from '@amogads/ui/tokens'
```

---

## 4. Consuming Standard Pages

All 6 standard pages can be embedded directly as complete page views with zero boilerplate:

### 4.1 Message & Realtime Chat
```tsx
'use client'
import { MessagePage, ChatTemplatePage } from '@amogads/ui/pages'

export default function ChatRoute() {
  return <MessagePage />
}
```

### 4.2 AI Chat & UI Schema Generator
```tsx
'use client'
import { AiChatPage } from '@amogads/ui/pages'

export default function AiChatRoute() {
  return <AiChatPage />
}
```

### 4.3 AI Search (5 Tool Categories)
```tsx
'use client'
import { AiSearchPage } from '@amogads/ui/pages'

export default function AiSearchRoute() {
  return <AiSearchPage />
}
```

### 4.4 Vouchers & Invoice Studio
```tsx
'use client'
import { VouchersPage } from '@amogads/ui/pages'

export default function VouchersRoute() {
  return <VouchersPage />
}
```

### 4.5 Link Maker & Smart Mockup Preview
```tsx
'use client'
import { LinkMakerPage } from '@amogads/ui/pages'

export default function LinkMakerRoute() {
  return <LinkMakerPage />
}
```

### 4.6 Interactive Map & Geocoding
```tsx
'use client'
import { MapTemplatePage } from '@amogads/ui/pages'

export default function MapRoute() {
  return <MapTemplatePage />
}
```

### 4.7 Standalone Chat & AI Components (Fine-Grained UI Control)
If your application needs a customized chat screen instead of full pre-baked pages, import modular chat primitives directly from `@amogads/ui`:

```tsx
import { ChatHeader, ChatBubble, ChatInput, TypingIndicator, AiChatBubble } from '@amogads/ui'
import { useChatStore } from '@amogads/ui/stores'
```

---

## 5. Consuming Serverless API Handlers

In Next.js App Router API routes (`app/api/.../route.ts`):

```typescript
// app/api/chat/route.ts
export { handleChatPost as POST } from '@amogads/ui/server'

// app/api/search/route.ts
export { handleSearchPost as POST } from '@amogads/ui/server'

// app/api/geocode/route.ts
export { handleGeocodeRequest as GET } from '@amogads/ui/server'

// app/api/shorten/route.ts
export { handleShortenPost as POST, handleShortenOptions as OPTIONS } from '@amogads/ui/server'

// app/api/vouchers/route.ts
export { handleVouchersGet as GET, handleVouchersPost as POST } from '@amogads/ui/server'

// app/api/messages/route.ts
export { handleMessagesGet as GET, handleMessagesPost as POST } from '@amogads/ui/server'
```

---

## 6. Consuming State Stores & SDK

### Zustand Stores:
```typescript
import { useAuthStore, useNotificationStore, useVoucherStore, useLinkMakerStore } from '@amogads/ui/stores'

const { notifications, unreadCount } = useNotificationStore()
```

### PostgREST SDK & QueryBuilder:
```typescript
import { apiClient, createQuery } from '@amogads/ui/sdk'

const query = createQuery().select('*').eq('status', 'active')
const results = await apiClient.get(`/rest/v1/items${query.toString()}`)
```

---

## 7. React Native & Mobile Consumer Workflow

Because the service layer in `@amogads/ui/services` and `@amogads/ui/sdk` is decoupled from DOM dependencies:
- **React Native** can import `@amogads/ui/services` directly for PostgREST repositories, authentication, and offline queues.
- UI components can be rendered using standard React Native elements or embedded WebViews for standard pages.

---

## 8. Versioning & Publishing Updates

1. **Local Development / Monorepo Sync**:
   ```bash
   npm run sync:amogads
   ```
2. **Publishing to NPM Registry**:
   ```bash
   cd amogads
   npm version minor # or patch
   npm run build:package
   npm publish --access public
   ```
3. **Updating Consumers**:
   ```bash
   npm update @amogads/ui
   ```
