# Amoga Design System (AmogaDS) — Architecture & System Overview

## 1. Overview & Vision

**AmogaDS** is the centralized, multi-app design system powering Amoga applications. It establishes strict architectural boundaries between design tokens, low-level UI primitives, composite business patterns, page templates, and consuming application features.

---

## 2. Directory & Layer Architecture

The design system is partitioned into clear layers:

```
src/
├── design-system/                  # Central Design System
│   ├── tokens/                     # Semantic tokens, typography, radius, themes
│   │   ├── theme.css               # Core CSS custom properties (:root, .dark, @theme inline)
│   │   ├── index.ts                # Token constants & TypeScript metadata
│   │   └── _variables.scss         # SCSS tokens if needed
│   ├── components/
│   │   ├── ui/                     # Primitives (Button, Input, Card, Dialog, Table, etc.)
│   │   └── business/               # Business patterns (PageHeader, DataTable, StatusBadge, etc.)
│   ├── templates/                  # Architectural templates (List, Detail, Form, Wizard, Dashboard, Workspace)
│   └── index.ts                    # Single public entry point
│
├── ux/                             # Design guidelines & governance
│   ├── DESIGN-SYSTEM.md            # System overview & architectural boundaries
│   ├── UX-GUIDELINES.md            # UX standards, interactions, responsiveness & a11y
│   ├── COMPONENT-GUIDELINES.md     # Component creation, prop patterns & styling
│   ├── PAGE-GUIDELINES.md          # Template usage, layout standards & navigation
│   └── AI-DEVELOPMENT-GUIDELINES.md# Mandatory guidelines for AI coding assistants
│
├── components/                     # App-specific and backward-compatibility layers
├── features/                       # Application domains, business logic & galleries
├── hooks/                          # App-specific hooks
├── services/                       # API clients, auth & external services
└── stores/                         # State management (Zustand)
```

---

## 3. Component Hierarchy

1. **Design Tokens (`tokens/`)**:
   - Single source of truth for colors, radiuses, shadows, typography, and animation variables.
   - Built on modern `oklch` color spaces with seamless Light/Dark mode support.

2. **Core UI Primitives (`components/ui/`)**:
   - Accessible, headless or styled base components (Radix primitives styled with Tailwind).
   - Zero business logic, zero state stores, zero API calls.

3. **Reusable Business Components (`components/business/`)**:
   - Multi-app composites: `PageHeader`, `DataTable`, `StatusBadge`, `FilterBar`, `FormSection`, `MetricCard`, `ConfirmDialog`, `PasswordInput`, etc.
   - Domain-agnostic, reusable across multiple Amoga applications.

4. **Page Templates (`templates/`)**:
   - High-level layout blueprints: `ListTemplate`, `DetailTemplate`, `FormTemplate`, `WizardTemplate`, `DashboardTemplate`, `WorkspaceTemplate`.
   - Provide standard scaffolding for responsive layouts, headers, filters, actions, and sidebars.

---

## 4. Consumption Rules

- **Import from `@/design-system`**: Always consume tokens, primitives, business components, and templates from the central entry point.
- **No Direct Mutation**: Never override or mutate central CSS variables inside app-specific CSS.
- **Separation of Concerns**: Features (`src/features/*`), stores (`src/stores/*`), and API services (`src/services/*`) must never be imported into `src/design-system/*`.
