'use client'

import * as React from 'react'
import { PageHeader } from '../components/business/page-header'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DetailTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  onBack?: () => void
  backLabel?: string
  highlights?: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
}


export function DetailTemplate({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  onBack,
  backLabel = 'Back',
  highlights,
  sidebar,
  children,
  className,
  ...props
}: DetailTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-6 p-4 sm:p-6 md:p-8', className)} {...props}>
      <div className='flex flex-col gap-2'>
        {onBack && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onBack}
            className='w-fit gap-1.5 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground'
          >
            <ArrowLeft className='h-3.5 w-3.5' />
            {backLabel}
          </Button>
        )}
        <PageHeader
          title={title}
          description={description}
          badge={badge}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
      </div>

      {highlights && <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>{highlights}</div>}

      <div
        className={cn(
          'grid gap-6',
          sidebar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
        )}
      >
        <div className={cn(sidebar ? 'lg:col-span-2 space-y-6' : 'space-y-6')}>
          {children}
        </div>
        {sidebar && (
          <aside className='space-y-6 lg:col-span-1'>
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  )
}
