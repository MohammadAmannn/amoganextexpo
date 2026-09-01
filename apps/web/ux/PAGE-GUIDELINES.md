# AmogaDS — Page Guidelines & Template Specifications

## 1. Page Template Archetypes

AmogaDS provides 6 standard architectural page templates located in `src/design-system/templates/`:

### 1. `ListTemplate`
- **Use Case**: Data grids, searchable tables, inventory lists, audit logs, file repositories.
- **Key Slots**:
  - `title`, `description`, `badge`, `breadcrumbs`
  - `actions` (e.g. Primary "Create Record" button, Export button)
  - `searchPlaceholder`, `searchValue`, `onSearchChange`
  - `filters` (Select dropdowns, DatePickers)
  - `activeFilters`, `onClearAllFilters`
  - `children` (e.g. `DataTable` or Card grid)
  - `footer` (Pagination or summary)

### 2. `DetailTemplate`
- **Use Case**: Single entity review, user profiles, voucher view, ticket inspection.
- **Key Slots**:
  - `onBack`, `backLabel`
  - `title`, `description`, `badge`, `actions` (Edit, Delete, Share)
  - `highlights` (Summary KPI cards or metadata pills)
  - `children` (Primary details, tabs, activity log)
  - `sidebar` (Contextual panel: assignee info, timestamps, quick actions)

### 3. `FormTemplate`
- **Use Case**: Creation workflows, settings pages, profile updates, configuration editors.
- **Key Slots**:
  - `onBack`, `title`, `description`
  - `children` (One or more `FormSection` components containing inputs)
  - `stickyFooter` (Pins the action bar to the viewport bottom on scroll)
  - `onCancel`, `cancelLabel`, `submitLabel`, `isSubmitting`, `secondaryActions`

### 4. `WizardTemplate`
- **Use Case**: Multi-step onboarding, checkout flows, complex setup procedures.
- **Key Slots**:
  - `steps: WizardStep[]` (`id`, `title`, `description`)
  - `currentStepIndex`, `onStepChange`
  - `children` (Current step's input viewport)
  - `onPrevious`, `onNext`, `onSubmit`, `canProceed`, `isSubmitting`

### 5. `DashboardTemplate`
- **Use Case**: Executive overviews, operational analytics, metric hubs.
- **Key Slots**:
  - `title`, `description`, `actions` (Time range filter, export)
  - `metrics` (Grid of `MetricCard` components)
  - `charts` (Grid of chart visualizers)
  - `activity` (Recent events or mini data table)

### 6. `WorkspaceTemplate`
- **Use Case**: Dense productivity environments, visual builders, rich editors, canvas tools.
- **Key Slots**:
  - `header` (Top toolbar & action bar)
  - `leftSidebar` (Tool pallet or document outline tree)
  - `children` (Main interactive canvas)
  - `rightSidebar` (Properties inspector or configuration pane)
  - `footer` (Status bar or breadcrumbs)

---

## 2. Layout Standards & Spacing

- All full-page views should adopt consistent padding: `p-4 sm:p-6 md:p-8`.
- Maintain clear vertical rhythm between sections with `space-y-6` or `space-y-8`.
- Responsive behavior must ensure touch targets are at least 44x44px on mobile viewports.
