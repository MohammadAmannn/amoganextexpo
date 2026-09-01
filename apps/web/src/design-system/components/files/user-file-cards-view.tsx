import React, { useState, useMemo } from 'react'
import {
  Search,
  X,
  FolderOpen,
  ArrowLeft,
  Filter,
  ArrowUpDown,
  ArrowLeftRight,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckSquare,
  Square,
  Trash2,
  Download,
  Bell,
  Flag,
  MoreVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FileCardItem, FileItemData, FileCategoryType, formatBytes } from './file-card-item'
import { FolderItemData } from './folder-tree-item'
import { Button } from '@/design-system/components/ui/button'
import { Input } from '@/design-system/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/design-system/components/ui/dropdown-menu'

export interface UserFileCardsViewProps {
  folder?: FolderItemData | null
  files: FileItemData[]
  selectedFileId?: string | null
  onSelectFileForPreview?: (file: FileItemData) => void
  onDownloadFile?: (file: FileItemData) => void
  onDeleteFile?: (file: FileItemData) => void
  onCopyLink?: (file: FileItemData) => void
  onRenameFile?: (file: FileItemData) => void
  onShareFile?: (file: FileItemData) => void
  onUploadClick?: () => void
  onBack?: () => void
  onClose?: () => void
  className?: string
}

export function UserFileCardsView({
  folder,
  files,
  selectedFileId,
  onSelectFileForPreview,
  onDownloadFile,
  onDeleteFile,
  onCopyLink,
  onRenameFile,
  onShareFile,
  onUploadClick,
  onBack,
  onClose,
  className,
}: UserFileCardsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = viewMode === 'grid' ? 12 : 20

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filter & Search Logic
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // 1. Strict folder subcategory filtering if folder represents a category
      if (folder) {
        if (folder.category) {
          const cat = folder.category.toLowerCase()
          if (cat === 'xls') {
            if (f.category.toLowerCase() !== 'xls' && f.category.toLowerCase() !== 'csv') return false
          } else if (f.category.toLowerCase() !== cat) {
            return false
          }
        } else if (
          folder.level === 2 ||
          ['Images', 'Pdf', 'Doc', 'Xls', 'Videos', 'Ppt', 'Txt', 'Csv', 'Zip', 'Other'].includes(
            folder.name
          )
        ) {
          const cat = folder.name.toLowerCase()
          if (cat === 'xls') {
            if (f.category.toLowerCase() !== 'xls' && f.category.toLowerCase() !== 'csv') return false
          } else if (f.category.toLowerCase() !== cat) {
            return false
          }
        }
      }

      // 2. Toolbar Category Filter
      const matchCategory =
        selectedCategory === 'all' ||
        f.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Xls' && (f.category === 'Csv' || f.category === 'Xls'))

      // 3. Search Filter
      const matchSearch =
        !searchQuery.trim() ||
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.folderPath && f.folderPath.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchCategory && matchSearch
    })
  }, [files, folder, selectedCategory, searchQuery])

  // Sorting
  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      let compare = 0
      if (sortBy === 'date') {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        compare = timeB - timeA
      } else if (sortBy === 'name') {
        compare = a.fileName.localeCompare(b.fileName)
      } else if (sortBy === 'size') {
        compare = (b.fileSize || 0) - (a.fileSize || 0)
      }
      return sortOrder === 'asc' ? -compare : compare
    })
  }, [filteredFiles, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedFiles.length / itemsPerPage) || 1
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedFiles.slice(start, start + itemsPerPage)
  }, [sortedFiles, currentPage, itemsPerPage])

  const totalBytes = useMemo(() => {
    return files.reduce((acc, curr) => acc + (curr.fileSize || 0), 0)
  }, [files])

  const handleBulkDownload = () => {
    const toDownload = files.filter((f) => selectedIds.has(f.id))
    toDownload.forEach((f) => onDownloadFile?.(f))
  }

  const handleBulkDelete = () => {
    const toDelete = files.filter((f) => selectedIds.has(f.id))
    toDelete.forEach((f) => onDeleteFile?.(f))
    setSelectedIds(new Set())
  }

  const folderDisplayName = folder?.name || 'Images'
  const folderDisplayPath = folder?.path || 'Chat/amanmicropay@gmail.com/Images'

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background select-none',
        className
      )}
    >
      {/* ── 1. TOP HEADER (Exact Screenshot 1 Style) ────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/40 shrink-0 shadow-2xs">
            <FolderOpen className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-bold text-foreground tracking-tight">
                {folderDisplayName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-normal text-muted-foreground shrink-0">
                {filteredFiles.length} files
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              Storage folder: {folderDisplayPath}
            </p>
          </div>
        </div>

        {/* Action icons on top right: Bell, Flag, 3-dot, Close (X without border) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-amber-500 hover:bg-muted transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Flag / Report"
          >
            <Flag className="h-4 w-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 shadow-lg">
              {onUploadClick && (
                <DropdownMenuItem onClick={onUploadClick} className="gap-2 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Upload Files
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} className="gap-2 text-xs">
                {viewMode === 'grid' ? <ListIcon className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
                Switch to {viewMode === 'grid' ? 'Table' : 'Card'} View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(onClose || onBack) && (
            <button
              type="button"
              onClick={onClose || onBack}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. TOOLBAR (LTR, FILTER, SORT, SHORT, VIEW TOGGLE) ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-bold text-muted-foreground rounded-xl border-border px-3 shrink-0"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
            LTR
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-bold text-muted-foreground rounded-xl border-border px-3 shrink-0"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            FILTER
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-bold text-muted-foreground rounded-xl border-border px-3 shrink-0"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                SORT
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 rounded-xl p-1 shadow-lg">
              <DropdownMenuItem onClick={() => setSortBy('date')} className="text-xs">
                Date Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')} className="text-xs">
                File Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')} className="text-xs">
                File Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-bold text-muted-foreground rounded-xl border-border px-3 shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            SHORT
          </Button>
        </div>

        {/* View Toggle Button */}
        <Button
          onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs px-3.5 shrink-0 cursor-pointer"
        >
          {viewMode === 'grid' ? (
            <>
              <LayoutGrid className="h-3.5 w-3.5" />
              VIEW: CARD
            </>
          ) : (
            <>
              <ListIcon className="h-3.5 w-3.5" />
              VIEW: TABLE
            </>
          )}
        </Button>
      </div>

      {/* ── 2.5 CATEGORY PILLS BAR ─────────────────────────────────────────── */}
      {(!folder || folder.level < 2) && (
        <div className="flex items-center gap-1.5 px-4 pb-2 overflow-x-auto no-scrollbar shrink-0">
          {['all', 'Images', 'Pdf', 'Doc', 'Xls', 'Videos', 'Ppt', 'Txt', 'Zip'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat === 'all' ? 'All Files' : cat}
            </button>
          ))}
        </div>
      )}

      {/* ── 3. SEARCH BAR ───────────────────────────────────────────────────── */}
      <div className="px-4 pb-2 shrink-0">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search files by name, format, or sender..."
            className="h-10 pl-10 pr-9 text-sm rounded-xl bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── 4. SUBHEADER: COUNT & PAGINATION ────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground font-medium shrink-0">
        <span>{filteredFiles.length} files</span>
        <div className="flex items-center gap-2">
          <span>
            {sortedFiles.length === 0
              ? '0 of 0'
              : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                  currentPage * itemsPerPage,
                  sortedFiles.length
                )} of ${sortedFiles.length}`}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── 5. FILE LIST / GRID CONTENT ─────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {paginatedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 rounded-2xl border border-dashed border-border/80 bg-muted/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 mb-3">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No files found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              {searchQuery
                ? `No files match your query "${searchQuery}" in this folder.`
                : 'This folder is currently empty. Upload documents or media to get started.'}
            </p>
            {onUploadClick && (
              <Button
                size="sm"
                onClick={onUploadClick}
                className="mt-4 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload First File
              </Button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Storage Space</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFiles.map((file) => (
                  <FileCardItem
                    key={file.id}
                    file={file}
                    viewMode="table"
                    isSelected={selectedIds.has(file.id)}
                    onSelect={() => {
                      setSelectedIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(file.id)) next.delete(file.id)
                        else next.add(file.id)
                        return next
                      })
                    }}
                    onPreview={onSelectFileForPreview}
                    onDownload={onDownloadFile}
                    onDelete={onDeleteFile}
                    onCopyLink={onCopyLink}
                    onRename={onRenameFile}
                    onShare={onShareFile}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedFiles.map((file) => (
              <FileCardItem
                key={file.id}
                file={file}
                viewMode="grid"
                isSelected={selectedIds.has(file.id)}
                onPreview={onSelectFileForPreview}
                onDownload={onDownloadFile}
                onDelete={onDeleteFile}
                onCopyLink={onCopyLink}
                onRename={onRenameFile}
                onShare={onShareFile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
