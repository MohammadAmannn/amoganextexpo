# Amoga Design System — UX Documentation

Welcome to the **Amoga Design System (AmogaDS)** documentation repository.

## Architecture Boundaries

```
src/
├── design-system/
│   ├── tokens/               ← Theme CSS vars, SCSS primitive variables, animation keyframes
│   ├── components/
│   │   ├── ui/               ← Atomic shadcn/ui primitive components (Button, Input, Card, etc.)
│   │   └── business/         ← Multi-app reusable business components (PageHeader, DataTable, StatusBadge, etc.)
│   ├── templates/            ← Reusable layout templates (List, Detail, Form, Wizard, Dashboard, Workspace)
│   └── index.ts              ← Unified Design System barrel export (@/design-system)
│
├── ux/                       ← Design rules, token specs, and usage guidelines
│
├── components/               ← Application-specific & single-app components (DocumentViewer, scanner, etc.)
│
└── features/                 ← Feature areas, gallery, previews, auth, message, dashboard, etc.
```

## Documentation Index

- [Design System Architecture & Boundaries](./DESIGN-SYSTEM.md)
- [UX Guidelines & Interaction Foundations](./UX-GUIDELINES.md)
- [Component Guidelines & Taxonomy](./COMPONENT-GUIDELINES.md)
- [Page Guidelines & Template Specifications](./PAGE-GUIDELINES.md)
- [AI Development Guidelines](./AI-DEVELOPMENT-GUIDELINES.md)
- [Design Rules](./design-rules.md)
- [Token Specifications](./token-specifications.md)
