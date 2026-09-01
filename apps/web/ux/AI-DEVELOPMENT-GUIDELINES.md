# AmogaDS — AI Development Guidelines

This document provides mandatory operational rules for AI coding assistants working in the AmogaDS codebase.

---

## 1. Non-Negotiable Core Rules

1. **Search Before Creating**:
   - Always inspect `@/design-system` before writing any new UI component, modal, badge, button, or layout pattern.
   - Reuse existing primitives and business components whenever possible.

2. **Use Semantic Tokens**:
   - Never write raw hex codes (`#1e293b`), rgb values, or arbitrary pixel values when semantic tokens exist.
   - Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-success`, `bg-warning`, `bg-info`, `bg-destructive`.

3. **Never Recreate Core Primitives**:
   - Do not create custom buttons, inputs, dialogs, badges, or tables in application feature directories.
   - Always import primitives from `@/design-system` or `@/components/ui/*`.

4. **Multi-App Components Belong in AmogaDS**:
   - If a UI pattern or composite component is generic and usable across multiple apps, place it in `src/design-system/components/business/`.
   - Export it in `src/design-system/index.ts`.

5. **App-Specific Logic Belongs in Consuming App**:
   - Store access (`useAuthStore`, `useNotificationStore`), API endpoints (`services/*`), and database/Supabase logic must never be introduced into `src/design-system/*`.
   - Keep design system components pure, controlled via props and callbacks.

6. **Do Not Modify the Central Theme Inside Consuming Apps**:
   - Theme variables defined in `src/design-system/tokens/theme.css` represent the approved central design language.
   - Never override `--primary`, `--background`, or `--radius` locally inside feature stylesheets.

7. **Preserve Visual Baseline & Zero Regressions**:
   - Architectural refactoring must never alter visual appearance, layouts, colors, typography, or responsiveness.
   - Verify TypeScript compilation and runtime appearance after any change.
