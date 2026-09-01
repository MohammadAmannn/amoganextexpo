'use client'

import * as React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Search as SearchIcon, X } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface ActiveFilter {
  key: string
  label: string
  value: string
  onRemove: () => void
}

export interface FilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: React.ReactNode
  activeFilters?: ActiveFilter[]
  onClearAll?: () => void
  actions?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  activeFilters = [],
  onClearAll,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {onSearchChange && (
            <div className='relative w-full sm:w-64 md:w-80'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className='pl-8'
              />
            </div>
          )}
          {filters}
        </div>
        {actions && (
          <div className='flex items-center gap-2 shrink-0'>
            {actions}
          </div>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className='flex flex-wrap items-center gap-2 pt-1'>
          <span className='text-xs font-medium text-muted-foreground'>
            Active filters:
          </span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant='secondary'
              className='gap-1 pr-1 text-xs'
            >
              <span>{filter.label}:</span>
              <span className='font-normal text-foreground'>{filter.value}</span>
              <button
                type='button'
                onClick={filter.onRemove}
                className='rounded-full p-0.5 hover:bg-muted-foreground/20'
                aria-label={`Remove filter ${filter.label}`}
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}
          {onClearAll && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearAll}
              className='h-6 px-2 text-xs text-muted-foreground hover:text-foreground'
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
