# Architecture

## Layers

1. **Apps**: `apps/web` and `apps/mobile` own routes/screens and platform-specific composition.
2. **Design system**: semantic tokens and themes live in `packages/theme`; web renders with shadcn/Radix, mobile with React Native Reusables/NativeWind.
3. **Platform packages**: API, schemas, auth contracts, permissions, storage, state, analytics and observability are app-agnostic.
4. **Backend**: Supabase Auth/Postgres/Storage/Realtime plus Next.js Route Handlers or Edge Functions for privileged operations.

## Dependency direction

Apps → packages → external services. Packages must never import from apps. UI components must not query the database directly. Feature hooks/services bind data to presentational components.

## Multi-tenancy

The starter schema includes organizations and memberships with RLS. Every tenant-owned table should include `organization_id` and enforce membership in RLS. Client-side permission checks improve UX; database RLS is the security boundary.

## Secrets

Publishable Supabase keys may be present in web/mobile bundles. Service-role keys, AI keys, SMTP credentials, payment secrets and admin tokens stay server-side only.
