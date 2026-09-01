'use client'

import * as React from 'react'
import { cn } from '../../../lib/utils'

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
}


export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 pb-4 md:pb-6',
        className
      )}
      {...props}
    >
      {breadcrumbs && <div className='text-sm text-muted-foreground'>{breadcrumbs}</div>}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-1.5'>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className='text-sm text-muted-foreground sm:text-base'>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className='flex flex-wrap items-center gap-2 md:self-center'>
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
