'use client'

import * as React from 'react'
import { PageHeader } from '../components/business/page-header'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FormTemplateProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  onBack?: () => void
  backLabel?: string
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  stickyFooter?: boolean
  secondaryActions?: React.ReactNode
}


export function FormTemplate({
  title,
  description,
  badge,
  breadcrumbs,
  onBack,
  backLabel = 'Back',
  submitLabel = 'Save changes',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  stickyFooter = false,
  secondaryActions,
  children,
  className,
  onSubmit,
  ...props
}: FormTemplateProps) {
  return (
    <div className='flex flex-col gap-6 p-4 sm:p-6 md:p-8'>
      <div className='flex flex-col gap-2'>
        {onBack && (
          <Button
            type='button'
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
        />
      </div>

      <form onSubmit={onSubmit} className={cn('space-y-8', className)} {...props}>
        <div className='space-y-6'>{children}</div>

        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 pt-6',
            stickyFooter &&
              'sticky bottom-0 -mx-4 -mb-4 bg-background/95 p-4 backdrop-blur border-t sm:-mx-6 sm:-mb-6 sm:p-6 md:-mx-8 md:-mb-8 md:p-8'
          )}
        >
          <div>{secondaryActions}</div>
          <div className='flex items-center gap-3'>
            {onCancel && (
              <Button
                type='button'
                variant='outline'
                disabled={isSubmitting}
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
            )}
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
