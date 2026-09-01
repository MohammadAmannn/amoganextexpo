# AmogaDS — UX Guidelines & Design Foundations

## 1. Core Principles

- **Clarity over Complexity**: Minimize cognitive load with concise labels, clear visual hierarchy, and predictable interactions.
- **Consistent Visual Rhythm**: Align all spacing, typography, and sizing to 4px/8px standard intervals (`gap-2`, `gap-4`, `p-4`, `p-6`).
- **Feedback & State Visibility**: Every user action (clicks, form submits, data loads, errors) must provide instant visual feedback (spinners, skeletons, toast notifications, badges).

---

## 2. Color System & Semantic Tokens

Never hardcode hex values (e.g. `#ffffff`, `#1e293b`). Always use semantic Tailwind color classes:

| Role | Semantic Class | Usage |
|---|---|---|
| **Canvas** | `bg-background`, `text-foreground` | Page body and primary canvas |
| **Card / Surface** | `bg-card`, `text-card-foreground` | Cards, popouts, elevated panels |
| **Primary** | `bg-primary`, `text-primary-foreground` | Key actions, active states, brand focal points |
| **Secondary** | `bg-secondary`, `text-secondary-foreground` | Secondary buttons, subtle backgrounds |
| **Muted** | `bg-muted`, `text-muted-foreground` | Disabled areas, secondary captions, metadata |
| **Accent** | `bg-accent`, `text-accent-foreground` | Hover states, list item selections |
| **Destructive** | `bg-destructive`, `text-destructive-foreground` | Delete, destructive operations, critical errors |
| **Success** | `bg-success`, `text-success-foreground` | Validations, positive indicators, approvals |
| **Warning** | `bg-warning`, `text-warning-foreground` | Non-blocking alerts, cautions, pending states |
| **Info** | `bg-info`, `text-info-foreground` | Informational callouts, neutral status indicators |
| **Border / Input** | `border-border`, `border-input`, `ring-ring` | Dividers, form boundaries, focus indicators |

---

## 3. Typography & Hierarchy

- **Page Titles**: `text-2xl font-bold tracking-tight sm:text-3xl`
- **Section Headers**: `text-lg font-semibold sm:text-xl`
- **Card / Group Titles**: `text-base font-semibold`
- **Body Text**: `text-sm leading-relaxed text-foreground`
- **Muted / Metadata / Subtitles**: `text-xs text-muted-foreground sm:text-sm`
- **Badges / Tiny Labels**: `text-[11px] font-medium` or `text-xs font-semibold`

---

## 4. Light & Dark Mode Governance

All components must render cleanly in both Light and Dark themes.
- Test contrast ratios (WCAG AA minimum 4.5:1 for normal text).
- Use `dark:` variant only when standard semantic tokens are insufficient for custom effects.
- Avoid hardcoded shadows or dark borders in light mode.

---

## 5. Responsive Behavior

- **Mobile First**: Design for small viewports first (`< 640px`), then layer desktop layouts via `sm:`, `md:`, `lg:`, and `xl:` breakpoints.
- **Header Actions**: Wrap action buttons in `flex flex-wrap gap-2` on mobile; place them aligned to the right on desktop.
- **Tables & Lists**: Use horizontal scroll containers or collapse into mobile card views when screen space is constrained.
