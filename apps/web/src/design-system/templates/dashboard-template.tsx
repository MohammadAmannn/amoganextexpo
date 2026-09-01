'use client'

import * as React from 'react'
import { PageHeader } from '../components/business/page-header'
import { cn } from '../../lib/utils'

export interface DashboardTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  metrics?: React.ReactNode
  charts?: React.ReactNode
  activity?: React.ReactNode
  children?: React.ReactNode
}


export function DashboardTemplate({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  metrics,
  charts,
  activity,
  children,
  className,
  ...props
}: DashboardTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-6 p-4 sm:p-6 md:p-8', className)} {...props}>
      <PageHeader
        title={title}
        description={description}
        badge={badge}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      {metrics && (
        <section aria-label='Key Metrics' className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {metrics}
        </section>
      )}

      {charts && (
        <section aria-label='Charts and Visualizations' className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {charts}
        </section>
      )}

      {activity && (
        <section aria-label='Recent Activity' className='space-y-4'>
          {activity}
        </section>
      )}

      {children && <div className='space-y-6'>{children}</div>}
    </div>
  )
}
