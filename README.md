# AmogaDS Universal Starter Monorepo

Production-oriented starter for Amoga applications. The complete pre-existing Amoga Next.js repository is preserved under `apps/web`. A new Expo SDK 57 mobile application, shared packages, Supabase starter schema, design-system theme catalog, CI/CD, and deployment configuration are added around it.

## What is included

- `apps/web` — preserved Next.js application and all original source/docs/workflows.
- `apps/mobile` — Expo Router Android/iOS starter, NativeWind, Supabase Auth, React Query, source-owned RNR-style UI baseline.
- `packages/theme` — exact web `theme.css` plus extracted full color-theme catalog and native color conversion.
- `packages/api`, `auth`, `config`, `types`, `schemas`, `permissions`, `storage`, `analytics`, `observability`, `state`, `utils`, `ui`.
- `supabase` — local CLI config, multi-tenant starter schema, RLS, profiles, memberships, organizations and CRUD example.
- `.github/workflows` — CI and EAS build automation.
- `.changeset` — package release/versioning foundation.

## 1. Prerequisites

Node 22.13+, Corepack, pnpm, Git. For local Android install Android Studio. For local iOS install Xcode on macOS. EAS cloud builds do not require local Xcode/Android Studio.

## 2. Install

```bash
corepack enable
pnpm setup
```

## 3. Configure environments

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

`pnpm setup` installs all workspaces and then runs Expo's SDK compatibility fixer for the mobile package. Commit the generated `pnpm-lock.yaml` before team development.

Set the same Supabase project URL and publishable key in both. Never place the Supabase service-role key in `apps/mobile` or any `NEXT_PUBLIC_`/`EXPO_PUBLIC_` variable.

## 4. Local Supabase (optional but recommended)

```bash
pnpm supabase:start
pnpm supabase:reset
pnpm db:types
```

Use the local Supabase values printed by the CLI in both env files.

## 5. Run web

```bash
pnpm dev:web
```

Web remains your full existing Next.js application at http://localhost:3000.

## 6. Run mobile

```bash
pnpm dev:mobile
```

Press `a` for Android or `i` for iOS. Or use:

```bash
pnpm mobile:android
pnpm mobile:ios
```

The starter mobile flow is Sign in → Dashboard → authenticated CRUD example using the same Supabase project.

## 7. React Native Reusables

The repo ships a small source-owned native baseline so it starts without an extra generation step. To import the full current React Native Reusables catalog into `apps/mobile`, run:

```bash
pnpm rnr:add:all
```

Review the generated diff and commit approved components. The application should own its RNR source; do not call the CLI at runtime.

## 8. Web deployment

Import the repository in Vercel and set **Root Directory = `apps/web`**. Add the web environment variables. PRs receive preview deployments and `main` deploys production.

## 9. EAS setup/build

```bash
cd apps/mobile
pnpm exec eas login
pnpm exec eas init
pnpm exec eas build --profile preview --platform android
pnpm exec eas build --profile production --platform all
```

`eas.json` is already included. Set the EAS project ID and store credentials during initial configuration.

## 10. Quality checks

```bash
pnpm check
pnpm build:web
pnpm mobile:doctor
```

## Architecture rule

Share tokens, schemas, types, auth contracts, APIs, permissions, state and business logic. Use platform-appropriate rendering: shadcn/Radix for web and React Native Reusables/NativeWind for mobile.

See `docs/` for architecture, design-system, developer workflow and deployment details.
