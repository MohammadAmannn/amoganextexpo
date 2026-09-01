'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  change?: {
    value: string | number
    trend?: 'up' | 'down' | 'neutral'
    label?: string
  }
  footer?: React.ReactNode
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  change,
  footer,
  className,
  ...props
}: MetricCardProps) {
  const trendColor = change?.trend === 'up'
    ? 'text-emerald-600 dark:text-emerald-400'
    : change?.trend === 'down'
    ? 'text-rose-600 dark:text-rose-400'
    : 'text-muted-foreground'

  return (
    <Card className={cn('overflow-hidden shadow-xs transition-shadow hover:shadow-md', className)} {...props}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {Icon && (
          <div className='rounded-md bg-muted p-2 text-muted-foreground'>
            {typeof Icon === 'function' ? <Icon className='h-4 w-4' /> : Icon}
          </div>
        )}
      </CardHeader>
      <CardContent className='space-y-1.5'>
        <div className='text-2xl font-bold tracking-tight text-foreground'>
          {value}
        </div>
        {(change || description) && (
          <div className='flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground'>
            {change && (
              <span className={cn('inline-flex items-center font-medium', trendColor)}>
                {change.trend === 'up' && <ArrowUpRight className='mr-0.5 h-3.5 w-3.5' />}
                {change.trend === 'down' && <ArrowDownRight className='mr-0.5 h-3.5 w-3.5' />}
                {change.trend === 'neutral' && <Minus className='mr-0.5 h-3.5 w-3.5' />}
                {change.value}
              </span>
            )}
            {change?.label && <span>{change.label}</span>}
            {!change && description && <span>{description}</span>}
          </div>
        )}
        {footer && <div className='pt-2'>{footer}</div>}
      </CardContent>
    </Card>
  )
}
