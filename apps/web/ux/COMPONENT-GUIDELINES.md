# AmogaDS — Component Guidelines

## 1. Classification of Components

Every component belongs to one of three categories:

1. **Core UI Primitives (`src/design-system/components/ui/`)**:
   - Fundamental atomic components (e.g. `Button`, `Input`, `Dialog`, `Table`, `Tabs`, `Card`, `Badge`, `Checkbox`, `Select`, `DropdownMenu`, etc.).
   - Headless primitives powered by Radix UI and Tailwind CSS.
   - **Rule**: Never add business logic, routing, or state stores to primitives.

2. **Reusable Business Components (`src/design-system/components/business/`)**:
   - Composite patterns that solve common product requirements across multiple applications.
   - Examples: `PageHeader`, `DataTable`, `StatusBadge`, `FilterBar`, `FormSection`, `MetricCard`, `ConfirmDialog`, `PasswordInput`, `QRCodeDisplay`.
   - **Rule**: Must be generic, accept data via props, and emit changes via callback handlers (`onChange`, `onAction`). No hardcoded API endpoints or app-specific stores.

3. **App-Specific Components (`src/components/` or `src/features/<feature>/components/`)**:
   - Components tied to a specific domain, page, or state store (e.g. `UserFileCardsView`, `InvoiceMaker`, `OcrEditStudio`).
   - Reside strictly within the consuming application or feature directory.

---

## 2. Component Design Standards

### Structure & Naming
- Use PascalCase for component exports (`PageHeader`, `DataTable`).
- Use kebab-case for component file names (`page-header.tsx`, `data-table.tsx`).
- Always export component prop interfaces (`export interface PageHeaderProps`).

### Prop Patterns
- Extend native HTML attributes where appropriate (`React.HTMLAttributes<HTMLDivElement>`, `React.ButtonHTMLAttributes<HTMLButtonElement>`).
- Provide sensible defaults for optional props.
- Accept a `className` prop and merge with `cn(...)` utility.

### Accessibility (a11y)
- Support keyboard navigation (`Tab`, `Enter`, `Space`, `Escape`, `Arrow keys`).
- Provide appropriate ARIA roles, `aria-label`, and `aria-describedby` attributes where visual labels are omitted.
- Maintain focus rings using `focus:ring-2 focus:ring-ring focus:ring-offset-2`.

---

## 3. Styling Rules
- Use Tailwind CSS classes exclusively.
- Use `cva` (class-variance-authority) for components with multiple variants or sizes.
- Rely on semantic tokens (`bg-card`, `border-border`, `text-muted-foreground`, etc.).
