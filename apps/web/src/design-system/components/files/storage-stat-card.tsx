import React from 'react'
import { HardDrive, FileText, Image as ImageIcon, Film, Database, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes } from './file-card-item'

export interface StorageStatItem {
  label: string
  count: number
  sizeBytes?: number
  colorClass: string
  icon?: React.ReactNode
}

export interface StorageStatCardProps {
  totalFiles: number
  totalSizeBytes?: number
  maxStorageBytes?: number
  stats?: StorageStatItem[]
  onViewAllFiles?: () => void
  onUploadClick?: () => void
  className?: string
}

export function StorageStatCard({
  totalFiles,
  totalSizeBytes = 0,
  maxStorageBytes = 10 * 1024 * 1024 * 1024, // 10 GB default
  stats,
  onViewAllFiles,
  onUploadClick,
  className,
}: StorageStatCardProps) {
  const percentUsed = Math.min(
    100,
    Math.max(1, Math.round((totalSizeBytes / (maxStorageBytes || 1)) * 100))
  )

  const defaultStats: StorageStatItem[] = stats || [
    {
      label: 'Documents & PDFs',
      count: Math.round(totalFiles * 0.4),
      sizeBytes: Math.round(totalSizeBytes * 0.45),
      colorClass: 'bg-red-500',
      icon: <FileText className="h-4 w-4 text-red-500" />,
    },
    {
      label: 'Images & Photos',
      count: Math.round(totalFiles * 0.35),
      sizeBytes: Math.round(totalSizeBytes * 0.3),
      colorClass: 'bg-amber-500',
      icon: <ImageIcon className="h-4 w-4 text-amber-500" />,
    },
    {
      label: 'Media & Videos',
      count: Math.round(totalFiles * 0.15),
      sizeBytes: Math.round(totalSizeBytes * 0.2),
      colorClass: 'bg-purple-500',
      icon: <Film className="h-4 w-4 text-purple-500" />,
    },
    {
      label: 'Other & Archives',
      count: Math.max(0, totalFiles - Math.round(totalFiles * 0.9)),
      sizeBytes: Math.round(totalSizeBytes * 0.05),
      colorClass: 'bg-indigo-500',
      icon: <Database className="h-4 w-4 text-indigo-500" />,
    },
  ]

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs select-none',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Storage Overview</h3>
            <p className="text-[11px] text-muted-foreground">
              {totalFiles} items stored in workspace
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-foreground font-mono">
            {formatBytes(totalSizeBytes)}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            of {formatBytes(maxStorageBytes)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border/40">
          <div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-500"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{percentUsed}% capacity utilized</span>
          <span>{formatBytes(Math.max(0, maxStorageBytes - totalSizeBytes))} available</span>
        </div>
      </div>

      {/* Breakdown categories */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {defaultStats.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 p-2"
          >
            <div className="shrink-0">{item.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-foreground">
                {item.label}
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{item.count} files</span>
                <span className="font-mono">{formatBytes(item.sizeBytes)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      {(onViewAllFiles || onUploadClick) && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {onViewAllFiles && (
            <button
              type="button"
              onClick={onViewAllFiles}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Files</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
          {onUploadClick && (
            <button
              type="button"
              onClick={onUploadClick}
              className="text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Upload New
            </button>
          )}
        </div>
      )}
    </div>
  )
}
