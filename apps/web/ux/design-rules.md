# AmogaDS — Design System Rules

## Non-Negotiable Rules

1. **Use Semantic Tokens**: Always use semantic Tailwind color utility classes (e.g. `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`, `bg-success`, `bg-warning`, `bg-info`) rather than hardcoded hex or RGB colors.
2. **Reuse Existing Components**: Always import core UI primitives and business patterns from `@/design-system`. Do not create duplicate Button, Input, or Card components in application directories.
3. **Keep Feature Logic Out of DS**: Business logic, API calls, Supabase integrations, and page routing belong in `src/features/` or `src/app/`, not inside `@/design-system`.
4. **Theme Preservation**: All components must support both Light and Dark mode seamlessly via standard semantic CSS custom properties defined in `src/design-system/tokens/theme.css`.
5. **No Visual Regressions**: Any architectural modification must preserve existing typography, spacing, colors, borders, shadows, sizing, and responsive breakpoints 100%.
