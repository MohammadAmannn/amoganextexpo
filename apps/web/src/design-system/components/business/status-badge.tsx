'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

export const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      status: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
        info: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30',
        destructive: 'bg-destructive/15 text-destructive border border-destructive/30',
        outline: 'text-foreground border border-border bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.25 text-[11px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'default',
    },
  }
)

const dotColorMap: Record<string, string> = {
  default: 'bg-primary',
  secondary: 'bg-secondary-foreground',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
  destructive: 'bg-destructive',
  outline: 'bg-foreground',
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean
  pulse?: boolean
  icon?: React.ReactNode
}

export function StatusBadge({
  status = 'default',
  size = 'default',
  dot = false,
  pulse = false,
  icon,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const activeStatus = status || 'default'
  return (
    <div
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {dot && (
        <span className='relative flex h-2 w-2'>
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                dotColorMap[activeStatus] || 'bg-primary'
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              dotColorMap[activeStatus] || 'bg-primary'
            )}
          />
        </span>
      )}
      {icon && <span className='shrink-0'>{icon}</span>}
      <span>{children}</span>
    </div>
  )
}
