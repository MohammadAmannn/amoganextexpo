import React from 'react'
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Film,
  Archive,
  File,
  Eye,
  Download,
  MoreHorizontal,
  Copy,
  Share2,
  Trash2,
  Edit2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/design-system/components/ui/dropdown-menu'

export type FileCategoryType =
  | 'Pdf'
  | 'Doc'
  | 'Xls'
  | 'Images'
  | 'Videos'
  | 'Ppt'
  | 'Txt'
  | 'Csv'
  | 'Zip'
  | 'Other'

export interface FileItemData {
  id: string
  fileName: string
  fileUrl: string
  fileSize?: number
  updatedAt?: string
  category: FileCategoryType | string
  folderPath?: string
  senderName?: string
  senderEmail?: string
  section?: string
}

export interface FileCardItemProps {
  file: FileItemData
  viewMode?: 'grid' | 'table'
  isSelected?: boolean
  onSelect?: (file: FileItemData) => void
  onPreview?: (file: FileItemData) => void
  onDownload?: (file: FileItemData) => void
  onDelete?: (file: FileItemData) => void
  onCopyLink?: (file: FileItemData) => void
  onRename?: (file: FileItemData) => void
  onShare?: (file: FileItemData) => void
  className?: string
}

export function formatBytes(bytes?: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function getFileCategoryTheme(category: string | FileCategoryType) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('pdf')) {
    return {
      name: 'Pdf',
      icon: FileText,
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
    }
  }
  if (cat.includes('doc') || cat.includes('word') || cat.includes('txt')) {
    return {
      name: 'Doc',
      icon: FileText,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    }
  }
  if (cat.includes('xls') || cat.includes('csv') || cat.includes('sheet')) {
    return {
      name: 'Spreadsheet',
      icon: FileSpreadsheet,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    }
  }
  if (cat.includes('image') || cat.includes('img') || cat.includes('png') || cat.includes('jpg')) {
    return {
      name: 'Images',
      icon: ImageIcon,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50',
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    }
  }
  if (cat.includes('video') || cat.includes('mp4') || cat.includes('mov')) {
    return {
      name: 'Videos',
      icon: Film,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    }
  }
  if (cat.includes('zip') || cat.includes('rar') || cat.includes('tar')) {
    return {
      name: 'Archives',
      icon: Archive,
      badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    }
  }
  return {
    name: 'Other',
    icon: File,
    badgeColor: 'bg-muted text-muted-foreground border-border/80',
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/40',
  }
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'recently'
  try {
    const d = new Date(dateString)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }
    const days = Math.floor(diff / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } catch {
    return 'recently'
  }
}

export function FileCardItem({
  file,
  viewMode = 'grid',
  isSelected = false,
  onSelect,
  onPreview,
  onDownload,
  onDelete,
  onCopyLink,
  onRename,
  onShare,
  className,
}: FileCardItemProps) {
  const theme = getFileCategoryTheme(file.category)
  const isImage =
    theme.name === 'Images' ||
    file.fileName.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ||
    (file.fileUrl && file.fileUrl.startsWith('http') && !file.fileUrl.endsWith('.pdf'))

  // ─── Table View Row ────────────────────────────────────────────────────────
  if (viewMode === 'table') {
    return (
      <tr
        className={cn(
          'group border-b border-border/60 transition-colors hover:bg-muted/40 text-xs',
          isSelected && 'bg-primary/5',
          className
        )}
      >
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg shrink-0',
                theme.bgColor,
                theme.iconColor
              )}
            >
              <theme.icon className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-foreground truncate max-w-[200px]">
              {file.fileName}
            </span>
          </div>
        </td>

        <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[140px]">
          {file.folderPath || file.section || 'General'}
        </td>

        <td className="py-2.5 px-3 text-muted-foreground font-mono">
          {formatBytes(file.fileSize)}
        </td>

        <td className="py-2.5 px-3 text-muted-foreground">
          {formatTimeAgo(file.updatedAt)}
        </td>

        <td className="py-2.5 px-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onPreview?.(file)}
              className="h-7 px-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDownload?.(file)}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-lg">
                <DropdownMenuItem onClick={() => onPreview?.(file)} className="gap-2 text-xs">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload?.(file)} className="gap-2 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyLink?.(file)} className="gap-2 text-xs">
                  <Copy className="h-3.5 w-3.5" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(file)}
                  className="gap-2 text-xs text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    )
  }

  // ─── Grid View Card (Matches Screenshot 1 Exactly) ─────────────────────────
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-2.5 shadow-2xs hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-700 select-none',
        isSelected && 'ring-2 ring-indigo-500 bg-indigo-500/5',
        className
      )}
    >
      <div>
        {/* Media Thumbnail */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted/60 mb-2.5 flex items-center justify-center">
          {isImage && file.fileUrl ? (
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 w-full h-full p-4',
                theme.bgColor
              )}
            >
              <theme.icon className={cn('h-10 w-10', theme.iconColor)} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {theme.name}
              </span>
            </div>
          )}
        </div>

        {/* File Name & Path Info */}
        <div className="px-1 min-w-0">
          <h3
            className="text-sm font-bold text-foreground truncate tracking-tight"
            title={file.fileName}
          >
            {file.fileName}
          </h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
            <span>{file.folderPath || `Chat/${file.senderEmail || 'amanmicropay@gmail.com'}`}</span>
            <span>·</span>
            <span>{formatTimeAgo(file.updatedAt)}</span>
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-border/40 px-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPreview?.(file)}
          className="h-7 px-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold gap-1.5 flex-1 justify-center cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDownload?.(file)}
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Download"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="More actions"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-lg">
            <DropdownMenuItem onClick={() => onPreview?.(file)} className="gap-2 text-xs">
              <Eye className="h-3.5 w-3.5" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload?.(file)} className="gap-2 text-xs">
              <Download className="h-3.5 w-3.5" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopyLink?.(file)} className="gap-2 text-xs">
              <Copy className="h-3.5 w-3.5" /> Copy Link
            </DropdownMenuItem>
            {onShare && (
              <DropdownMenuItem onClick={() => onShare?.(file)} className="gap-2 text-xs">
                <Share2 className="h-3.5 w-3.5" /> Share
              </DropdownMenuItem>
            )}
            {onRename && (
              <DropdownMenuItem onClick={() => onRename?.(file)} className="gap-2 text-xs">
                <Edit2 className="h-3.5 w-3.5" /> Rename
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(file)}
              className="gap-2 text-xs text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
