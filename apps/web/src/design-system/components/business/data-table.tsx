'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '../ui/empty'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface ColumnDef<T> {
  key: string
  header: React.ReactNode
  cell?: (row: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  loadingRowCount?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ReactNode
  onRowClick?: (row: T) => void
  keyExtractor?: (row: T, index: number) => string | number
  pagination?: {
    pageIndex: number
    pageSize: number
    totalCount: number
    onPageChange: (page: number) => void
  }
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  loadingRowCount = 5,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records matching your criteria.',
  emptyIcon,
  onRowClick,
  keyExtractor,
  pagination,
  className,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))
    : 1

  return (
    <div className={cn('space-y-4', className)}>
      <div className='rounded-md border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: loadingRowCount }).map((_, rIdx) => (
                <TableRow key={`loading-${rIdx}`}>
                  {columns.map((col) => (
                    <TableCell key={`loading-${rIdx}-${col.key}`} className={col.className}>
                      <Skeleton className='h-5 w-full max-w-[160px]' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-48 text-center'>
                  <Empty className='py-6'>
                    <EmptyHeader>
                      {emptyIcon && <EmptyMedia>{emptyIcon}</EmptyMedia>}
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rIdx) => {
                const key = keyExtractor ? keyExtractor(row, rIdx) : rIdx
                return (
                  <TableRow
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      onRowClick && 'cursor-pointer hover:bg-muted/50 transition-colors'
                    )}
                  >
                    {columns.map((col) => (
                      <TableCell key={`${key}-${col.key}`} className={col.className}>
                        {col.cell
                          ? col.cell(row, rIdx)
                          : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className='flex items-center justify-between px-2 text-sm text-muted-foreground'>
          <div>
            Showing{' '}
            <span className='font-medium text-foreground'>
              {data.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className='font-medium text-foreground'>
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                pagination.totalCount
              )}
            </span>{' '}
            of{' '}
            <span className='font-medium text-foreground'>
              {pagination.totalCount}
            </span>{' '}
            results
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={pagination.pageIndex <= 0 || isLoading}
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
            >
              <ChevronLeft className='mr-1 h-4 w-4' />
              Previous
            </Button>
            <span className='text-xs'>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={pagination.pageIndex + 1 >= totalPages || isLoading}
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
            >
              Next
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
