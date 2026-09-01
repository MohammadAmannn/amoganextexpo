'use client'

import * as React from 'react'
import { PageHeader } from '../components/business/page-header'
import { Button } from '../components/ui/button'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface WizardStep {
  id: string | number
  title: string
  description?: string
}

export interface WizardTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  steps: WizardStep[]
  currentStepIndex: number
  onStepChange?: (index: number) => void
  onNext?: () => void
  onPrevious?: () => void
  onSubmit?: () => void
  nextLabel?: string
  previousLabel?: string
  submitLabel?: string
  isSubmitting?: boolean
  canProceed?: boolean
  children: React.ReactNode
}


export function WizardTemplate({
  title,
  description,
  steps,
  currentStepIndex,
  onStepChange,
  onNext,
  onPrevious,
  onSubmit,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  submitLabel = 'Complete',
  isSubmitting = false,
  canProceed = true,
  children,
  className,
  ...props
}: WizardTemplateProps) {
  const isLastStep = currentStepIndex === steps.length - 1
  const isFirstStep = currentStepIndex === 0

  return (
    <div className={cn('flex flex-col gap-6 p-4 sm:p-6 md:p-8', className)} {...props}>
      <PageHeader title={title} description={description} />

      {/* Steps Navigation Bar */}
      <nav aria-label='Wizard Progress' className='py-2'>
        <ol className='flex items-center justify-between gap-2 overflow-x-auto pb-2'>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isClickable = onStepChange && idx < currentStepIndex

            return (
              <li
                key={step.id}
                className='flex flex-1 items-center gap-2.5 min-w-[120px]'
              >
                <button
                  type='button'
                  disabled={!isClickable}
                  onClick={isClickable ? () => onStepChange(idx) : undefined}
                  className={cn(
                    'flex items-center gap-2 text-left transition-colors',
                    isClickable && 'cursor-pointer hover:opacity-80'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      isCompleted && 'bg-primary text-primary-foreground',
                      isCurrent && 'border-2 border-primary bg-primary/10 text-primary font-bold',
                      !isCompleted && !isCurrent && 'border border-border bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <Check className='h-4 w-4' /> : idx + 1}
                  </span>
                  <div className='hidden sm:block'>
                    <div
                      className={cn(
                        'text-xs font-medium',
                        isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </div>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 rounded-full',
                      idx < currentStepIndex ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <div className='flex-1 rounded-lg border bg-card p-4 sm:p-6'>
        {children}
      </div>

      {/* Wizard Footer Navigation */}
      <div className='flex items-center justify-between pt-2'>
        <Button
          type='button'
          variant='outline'
          disabled={isFirstStep || isSubmitting}
          onClick={onPrevious}
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          {previousLabel}
        </Button>

        {isLastStep ? (
          <Button
            type='button'
            disabled={!canProceed || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        ) : (
          <Button
            type='button'
            disabled={!canProceed || isSubmitting}
            onClick={onNext}
          >
            {nextLabel}
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
