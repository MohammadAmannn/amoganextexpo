# Developer Guide & Installation Manual

Comprehensive guide for developing, installing packages, configuring environments, and running the Web and Mobile applications in this monorepo.

---

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Prerequisites](#2-prerequisites)
3. [Initial Setup & First-Time Installation](#3-initial-setup--first-time-installation)
4. [Environment Variables Configuration (.env)](#4-environment-variables-configuration-env)
5. [How to Run Applications Locally](#5-how-to-run-applications-locally)
6. [How to Install Packages in Mobile (Expo)](#6-how-to-install-packages-in-mobile-expo)
7. [How to Install Packages in Web (Next.js)](#7-how-to-install-packages-in-web-nextjs)
8. [How to Install Packages in Shared Workspace Packages](#8-how-to-install-packages-in-shared-workspace-packages)
9. [Important Monorepo Rules & Troubleshooting](#9-important-monorepo-rules--troubleshooting)

---

## 1. Project Overview & Architecture

This monorepo uses **pnpm workspaces** and **Turborepo**:

```text
amogads-v1/
├── apps/
│   ├── web/            # Next.js 16 Web Application (@amogads/ui)
│   └── mobile/         # Expo React Native App (@amoga/mobile)
├── packages/           # 13 Shared Workspace Packages
│   ├── api/            # API clients & queries
│   ├── auth/           # Authentication logic
│   ├── schemas/        # Zod validation schemas
│   ├── state/          # Zustand global stores
│   ├── theme/          # Color themes & tokens
│   ├── types/          # Shared TypeScript interfaces
│   └── ... (config, storage, permissions, etc.)
├── supabase/           # Local Supabase migrations and schemas
├── package.json        # Monorepo root scripts & pnpm overrides
├── pnpm-workspace.yaml # Workspace definitions
└── .npmrc              # Hoisting and dependency resolution rules
```

---

## 2. Prerequisites

* **Node.js**: `v20.x` or `v22.x` (recommended: Node 22.13+)
* **pnpm**: Version `10.x` (`pnpm@10.17.1`)
  * To install/update: `npm install -g pnpm@10.17.1`
* **Mobile Testing**:
  * **Physical Device**: Install the **Expo Go** app from Google Play Store or Apple App Store.
  * **Android Emulator**: Android Studio with an AVD configured.

> [!CAUTION]
> **Never use standard `npm install` or `yarn` in this monorepo.** Always use `pnpm`. Running `npm` inside subdirectories will break monorepo symlinks.

---

## 3. Initial Setup & First-Time Installation

Run all setup commands from the **root folder** (`amogads-v1`):

```powershell
# 1. Install all dependencies across all apps and packages
pnpm install

# 2. Setup environment variable files (see section 4)
Copy-Item apps\web\.env.example apps\web\.env.local
Copy-Item apps\mobile\.env.example apps\mobile\.env
```

---

## 4. Environment Variables Configuration (.env)

Each application maintains its own isolated environment configuration:

### A. Web Environment (`apps/web/.env.local`)
* **File Location**: `apps/web/.env.local`
* **Template**: `apps/web/.env.example`

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

> [!NOTE]
> In Next.js, variables accessible in the browser must be prefixed with `NEXT_PUBLIC_`. Variables without this prefix remain server-side secrets.

---

### B. Mobile Environment (`apps/mobile/.env`)
* **File Location**: `apps/mobile/.env`
* **Template**: `apps/mobile/.env.example`

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=Amoga
```

> [!CAUTION]
> In Expo, all client-accessible variables must begin with `EXPO_PUBLIC_`. **Never** store private server keys (such as `SUPABASE_SERVICE_ROLE_KEY` or payment secret keys) in `apps/mobile/.env`.

---

## 5. How to Run Applications Locally

### Option 1: Run Both Apps Together
From the root directory:
```powershell
pnpm dev
```
*(Runs Web and Mobile concurrently using Turborepo)*.

---

### Option 2: Run Web Only (Next.js)

**From the root folder:**
```powershell
pnpm dev:web
```
**Or from the `apps/web` folder:**
```powershell
cd apps/web
pnpm dev
```
* **URL**: [http://localhost:3000](http://localhost:3000)

---

### Option 3: Run Mobile Only (Expo)

**From the root folder:**
```powershell
pnpm dev:mobile
```
**Or from the `apps/mobile` folder:**
```powershell
cd apps/mobile
pnpm start
```

#### Terminal Interactive Controls:
* **Scan QR Code**: Open the **Expo Go** app on your phone and scan the terminal QR code.
* Press <kbd>a</kbd>: Opens the app in an active **Android Emulator** or USB-connected phone.
* Press <kbd>w</kbd>: Opens the mobile app preview in your **Web Browser** (`http://localhost:8081`).
* Press <kbd>r</kbd>: **Reloads** the app on your phone.
* Press <kbd>c</kbd>: Clears the terminal screen.

---

### Option 4: Share Mobile with Manager / External Users (via ngrok)

When you need to share the mobile app with your manager, client, or team members outside your local Wi-Fi:

```powershell
pnpm share:mobile
```

**What this does automatically:**
1. Starts **ngrok** tunnel on port 8081 with browser-warning bypass (`ngrok-skip-browser-warning:1`).
2. Configures Metro's manifest to route all bundle assets through the secure HTTPS tunnel.
3. Automatically prints the `exp://*.ngrok-free.dev` link and a scannable QR code.
4. Your manager opens **Expo Go**, enters the link (or scans the QR code), and views the live app from anywhere in the world!

---

## 6. How to Install Packages in Mobile (Expo)

Depending on what type of package you want to install, choose the appropriate method below:

### A. Installing Expo & Native Packages (e.g. `react-native-webview`, Camera, SecureStore)
For packages with native code or Expo SDK integrations, always use `expo install` inside `apps/mobile` so Expo selects the version verified for your SDK:

```powershell
# Step 1: Navigate to the mobile directory
cd apps/mobile

# Step 2: Use expo install
pnpm exec expo install react-native-webview
```
*Other common examples:*
```powershell
pnpm exec expo install expo-camera
pnpm exec expo install expo-secure-store
pnpm exec expo install react-native-svg
```

---

### B. Installing Pure JavaScript / UI Libraries (e.g. form libraries, lodash, date-fns)

**Method 1 (From Root Directory - Recommended):**
```powershell
pnpm --filter @amoga/mobile add <package-name>

# For development dependencies:
pnpm --filter @amoga/mobile add -D <package-name>
```

**Method 2 (Inside `apps/mobile`):**
```powershell
cd apps/mobile
pnpm add <package-name>
```

---

### C. Installing React Native Reusables (RNR) Components

React Native Reusables components are source-owned components (similar to shadcn for React Native) located in `apps/mobile/components/ui/`.

**To add all components at once:**
```powershell
# From root:
pnpm rnr:add:all
```

**To add specific RNR components interactively:**
```powershell
cd apps/mobile
pnpm dlx @react-native-reusables/cli add <component-name>
```
*Examples:*
```powershell
pnpm dlx @react-native-reusables/cli add dialog
pnpm dlx @react-native-reusables/cli add dropdown-menu
pnpm dlx @react-native-reusables/cli add avatar
pnpm dlx @react-native-reusables/cli add select
```

---

## 7. How to Install Packages in Web (Next.js)

### A. Installing Dependencies for Web

**Method 1 (From Root Directory - Recommended):**
```powershell
pnpm --filter @amogads/ui add <package-name>

# For development dependencies:
pnpm --filter @amogads/ui add -D <package-name>
```

**Method 2 (Inside `apps/web`):**
```powershell
cd apps/web
pnpm add <package-name>
```
*Examples:*
```powershell
cd apps/web
pnpm add date-fns
pnpm add axios
pnpm add -D @types/lodash
```

---

### B. Installing shadcn / Radix UI Components in Web

Inside `apps/web`:
```powershell
cd apps/web
pnpm dlx shadcn@latest add <component-name>
```
*Examples:*
```powershell
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add accordion
```

---

## 8. How to Install Packages in Shared Workspace Packages

If you want to add a utility to a shared package (like `@amoga/utils` or `@amoga/schemas`):

```powershell
# To add zod to schemas package:
pnpm --filter @amoga/schemas add zod

# To add date-fns to utils package:
pnpm --filter @amoga/utils add date-fns
```

---

## 9. Important Monorepo Rules & Troubleshooting

### Rule 1: Unified React Version (Critical)
In React 19, `react` and `react-native-renderer` must match exactly.
* Both are pinned to **`19.1.0`** via the root `package.json` overrides:
  ```json
  "pnpm": {
    "overrides": {
      "react": "19.1.0"
    }
  }
  ```
* Do not manually bump `react` in `apps/mobile` without updating the root override.

---

### Rule 2: Clearing Cache When Assets/Packages Change
If you install a new package or edit Metro configuration and changes don't show up:
```powershell
# In apps/mobile:
cd apps/mobile
pnpm start -c
```
*(The `-c` flag wipes Metro's bundler cache).*

---

### Rule 3: Cross-App Imports Are Prohibited
* **DO NOT** import from `apps/web` into `apps/mobile` or vice versa:
  * ❌ `import { something } from '../../apps/web/...'`
* **DO** place shared code (types, schemas, auth helpers, business logic) in `packages/*`:
  * ✅ `import { signInSchema } from '@amoga/schemas'`
  * ✅ `import { supabase } from '@/lib/supabase'`

---

### Rule 4: Diagnostic Health Check Commands

```powershell
# Check types across the monorepo
pnpm check

# Run mobile Expo diagnostic doctor
pnpm mobile:doctor

# Format code with Prettier
pnpm format
```


