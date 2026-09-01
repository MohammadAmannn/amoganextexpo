/**
 * Amoga Design System — Central Barrel Export
 *
 * Single source of truth for all reusable tokens, core UI primitives,
 * business components, and page templates.
 */

// ── Design Tokens ────────────────────────────────────────────────────────────
export * from './tokens'

// ── Core UI Components (shadcn/ui primitives) ────────────────────────────────
export * from './components/ui/accordion'
export * from './components/ui/alert-dialog'
export * from './components/ui/alert'
export * from './components/ui/aspect-ratio'
export * from './components/ui/avatar'
export * from './components/ui/badge'
export * from './components/ui/breadcrumb'
export * from './components/ui/button'
export * from './components/ui/button-group'
export * from './components/ui/calendar'
export * from './components/ui/card'
export * from './components/ui/carousel'
export * from './components/ui/chart'
export * from './components/ui/chart-demos'

export * from './components/ui/checkbox'
export * from './components/ui/collapsible'
export * from './components/ui/command'
export * from './components/ui/context-menu'
export * from './components/ui/date-picker'
export * from './components/ui/dialog'
export * from './components/ui/drawer'
export * from './components/ui/dropdown-menu'
export * from './components/ui/empty'
export * from './components/ui/field'
export * from './components/ui/form'
export * from './components/ui/hover-card'
export * from './components/ui/input'
export * from './components/ui/input-group'
export * from './components/ui/input-otp'
export * from './components/ui/item'
export * from './components/ui/kbd'
export * from './components/ui/label'
export * from './components/ui/menubar'
export * from './components/ui/navigation-menu'
export * from './components/ui/pagination'
export * from './components/ui/popover'
export * from './components/ui/progress'
export * from './components/ui/radio-group'
export * from './components/ui/resizable'
export * from './components/ui/scroll-area'
export * from './components/ui/select'
export * from './components/ui/separator'
export * from './components/ui/sheet'
export * from './components/ui/sidebar'
export * from './components/ui/skeleton'
export * from './components/ui/slider'
export * from './components/ui/sonner'
export * from './components/ui/spinner'
export * from './components/ui/switch'
export * from './components/ui/table'
export * from './components/ui/tabs'
export * from './components/ui/textarea'
export * from './components/ui/toggle'
export * from './components/ui/toggle-group'
export * from './components/ui/tooltip'


// ── Reusable Business Components ─────────────────────────────────────────────
export { PageHeader, type PageHeaderProps } from './components/business/page-header'
export { DataTable, type DataTableProps, type ColumnDef } from './components/business/data-table'
export { StatusBadge, statusBadgeVariants, type StatusBadgeProps } from './components/business/status-badge'
export { FilterBar, type FilterBarProps, type ActiveFilter } from './components/business/filter-bar'
export { FormSection, type FormSectionProps } from './components/business/form-section'
export { MetricCard, type MetricCardProps } from './components/business/metric-card'
export { ConfirmDialog } from './components/business/confirm-dialog'
export { PasswordInput } from './components/business/password-input'
export { SignOutDialog } from './components/business/sign-out-dialog'
export { ThemeSwitch } from './components/business/theme-switch'
export { ThemeSelector } from './components/business/theme-selector'
export { SelectDropdown } from './components/business/select-dropdown'
export { LongText } from './components/business/long-text'
export { Search } from './components/business/search'
export { Stats01 } from './components/business/stats-01'
export { DatePicker } from './components/business/date-picker'
export { QrCodeDisplay, QRCodeDisplay, downloadQrCode, type QrCodeDisplayProps, type QRCodeDisplayProps } from './components/business/qr-code-display'



// ── Chat & Realtime Components ──────────────────────────────────────────────
export * from './components/chat'

// ── AI Assistant & Multi-Model Chat ─────────────────────────────────────────
export * from './components/ai-chat'

// ── Files & Document Management ─────────────────────────────────────────────
export * from './components/files'


// ── Reusable Page Templates ──────────────────────────────────────────────────
export { ListTemplate, type ListTemplateProps } from './templates/list-template'
export { DetailTemplate, type DetailTemplateProps } from './templates/detail-template'
export { FormTemplate, type FormTemplateProps } from './templates/form-template'
export { WizardTemplate, type WizardTemplateProps, type WizardStep } from './templates/wizard-template'
export { DashboardTemplate, type DashboardTemplateProps } from './templates/dashboard-template'
export { WorkspaceTemplate, type WorkspaceTemplateProps } from './templates/workspace-template'
export { AppHeader } from './templates/app-header'
export { AppLogo } from './templates/app-logo'
export { AppSidebar } from './templates/app-sidebar'
export { AppTitle } from './templates/app-title'
export { AuthenticatedLayout } from './templates/authenticated-layout'
export { Header } from './templates/header'
export { Main } from './templates/main'
export { NavGroup } from './templates/nav-group'
export { NavUser } from './templates/nav-user'
export { SidebarSearch } from './templates/sidebar-search'
export { TeamSwitcher } from './templates/team-switcher'
export { TopNav } from './templates/top-nav'
export { sidebarData } from './templates/data/sidebar-data'
export type { SidebarData, NavItem, NavGroup as NavGroupType } from './templates/types'

// ── App Settings & Auth Forms ───────────────────────────────────────────────
export { default as EmailSettingsFeature } from '@/features/email-settings'
export { useEmailSettingsStore } from '@/features/email-settings/store'
export * from '@/features/email-settings/types'
export { UserAuthForm } from '@/features/auth/sign-in/components/user-auth-form'
export { SignUpForm } from '@/features/auth/sign-up/components/sign-up-form'

