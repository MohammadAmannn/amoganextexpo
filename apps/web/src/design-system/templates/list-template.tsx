'use client'

import * as React from 'react'
import { PageHeader } from '../components/business/page-header'
import { FilterBar, type ActiveFilter } from '../components/business/filter-bar'
import { cn } from '../../lib/utils'

export interface ListTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (val: string) => void
  filters?: React.ReactNode
  activeFilters?: ActiveFilter[]
  onClearAllFilters?: () => void
  filterActions?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}


export function ListTemplate({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onClearAllFilters,
  filterActions,
  children,
  footer,
  className,
  ...props
}: ListTemplateProps) {
  const hasFilterBar =
    Boolean(onSearchChange) ||
    Boolean(filters) ||
    (activeFilters && activeFilters.length > 0) ||
    Boolean(filterActions)

  return (
    <div className={cn('flex flex-col gap-6 p-4 sm:p-6 md:p-8', className)} {...props}>
      <PageHeader
        title={title}
        description={description}
        badge={badge}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      {hasFilterBar && (
        <FilterBar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={filters}
          activeFilters={activeFilters}
          onClearAll={onClearAllFilters}
          actions={filterActions}
        />
      )}

      <div className='flex-1'>{children}</div>

      {footer && <div className='pt-2'>{footer}</div>}
    </div>
  )
}
