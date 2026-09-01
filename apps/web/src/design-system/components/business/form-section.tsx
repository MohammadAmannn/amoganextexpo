'use client'

import * as React from 'react'
import { Separator } from '../ui/separator'
import { cn } from '../../../lib/utils'

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  separator?: boolean
  columns?: 1 | 2 | 3 | 4
}


export function FormSection({
  title,
  description,
  actions,
  separator = true,
  columns = 1,
  className,
  children,
  ...props
}: FormSectionProps) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn('space-y-4 py-2', className)} {...props}>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-base font-semibold text-foreground sm:text-lg'>
            {title}
          </h2>
          {description && (
            <p className='text-xs text-muted-foreground sm:text-sm'>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className='flex items-center gap-2 pt-2 sm:pt-0'>
            {actions}
          </div>
        )}
      </div>

      {separator && <Separator />}

      <div className={cn('grid gap-4 sm:gap-6', gridColsClass)}>
        {children}
      </div>
    </div>
  )
}
