# Design System

`tweakcn`/existing Amoga web themes are the design-authoring source. `apps/web/src/design-system/tokens/theme.css` is preserved exactly and copied to `packages/theme/src/theme.web.css`. The full `colorThemes` catalog from the existing web provider is extracted into `packages/theme/src/color-themes.ts`.

## Component hierarchy

Foundation → Components → Blocks → Patterns → Templates → Feature screens.

## Web

Continue using the existing shadcn/Radix components under `apps/web/src/design-system`.

## Mobile

Use React Native Reusables as source-owned components under `apps/mobile/components/ui`. `pnpm rnr:add:all` can import the current catalog. Compose business blocks in `apps/mobile/components/blocks` or promote broadly reusable contracts into `packages/ui`.

## Rules

- No hard-coded brand colors in feature code.
- Use semantic tokens: primary, background, foreground, card, muted, border, destructive, success, warning, info.
- Business blocks receive data and callbacks; they do not call Supabase directly.
- Web and native may render differently while preserving the same intent and prop contracts.
- Add light/dark and at least one alternate skin test when adding a reusable component.
