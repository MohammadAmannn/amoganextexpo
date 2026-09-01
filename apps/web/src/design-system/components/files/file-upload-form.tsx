'use client'

import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Paperclip,
  Save,
  ArrowLeft,
  Download,
  Eye,
  X,
  Loader2,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/design-system/components/ui/button'
import { Label } from '@/design-system/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/ui/select'
import { FileItemData, FileCategoryType, formatBytes } from './file-card-item'

export interface AttachmentItem {
  id: string
  name: string
  type: string
  size: string
  url?: string
  fileObj?: File
  progress?: number
  isUploading?: boolean
}

export interface FileUploadFormProps {
  userEmail?: string | null
  folders?: { id: string; name: string }[]
  initialSubject?: string
  initialFolder?: string
  initialSubFolder?: string
  warningMessage?: string | null
  onClose?: () => void
  onSave?: (data: {
    subject: string
    folder: string
    subFolder: string
    remarks: string
    body: string
    attachments: AttachmentItem[]
  }) => void | Promise<void> | any
  onSaveDraft?: (data: {
    subject: string
    folder: string
    subFolder: string
    remarks: string
    body: string
    attachments: AttachmentItem[]
  }) => void | Promise<void> | any
  onUploadSuccess?: (newItems?: FileItemData[]) => void
  onPreviewAttachment?: (attachment: { name: string; url?: string }) => void
  className?: string
}

const FOLDER_OPTIONS = ['Finance', 'Chat', 'Files', 'Email', 'AI Chat', 'Order']
const SUB_FOLDER_OPTIONS: FileCategoryType[] = [
  'Pdf',
  'Doc',
  'Xls',
  'Images',
  'Videos',
  'Ppt',
  'Txt',
  'Csv',
  'Zip',
  'Other',
]

export function FileUploadForm({
  userEmail,
  folders,
  initialSubject = '',
  initialFolder = 'Finance',
  initialSubFolder = 'Pdf',
  warningMessage,
  onClose,
  onSave,
  onSaveDraft,
  onUploadSuccess,
  onPreviewAttachment,
  className,
}: FileUploadFormProps) {
  const [folder, setFolder] = useState<string>(initialFolder)
  const [subFolder, setSubFolder] = useState<string>(initialSubFolder)
  const [remarks, setRemarks] = useState('')
  const [body, setBody] = useState('')

  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [uploadingFile, setUploadingFile] = useState<{
    name: string
    size: string
    progress: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setIsUploading(true)

      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
        setSubFolder('Images')
      } else if (ext === 'pdf') {
        setSubFolder('Pdf')
      } else if (['doc', 'docx'].includes(ext)) {
        setSubFolder('Doc')
      } else if (['xls', 'xlsx'].includes(ext)) {
        setSubFolder('Xls')
      } else if (['mp4', 'mov', 'avi'].includes(ext)) {
        setSubFolder('Videos')
      }

      setUploadingFile({
        name: file.name,
        size: formatBytes(file.size),
        progress: 20,
      })

      const reader = new FileReader()
      reader.onload = () => {
        const fileDataUrl = reader.result as string
        const newAttachment: AttachmentItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: formatBytes(file.size),
          url: fileDataUrl,
          fileObj: file,
          progress: 100,
        }

        const interval = setInterval(() => {
          setUploadingFile((prev) => {
            if (!prev) return null
            if (prev.progress >= 90) {
              clearInterval(interval)
              setTimeout(() => {
                setAttachments((a) => [...a, newAttachment])
                setUploadingFile(null)
                setIsUploading(false)
              }, 300)
              return { ...prev, progress: 100 }
            }
            return { ...prev, progress: prev.progress + 25 }
          })
        }, 150)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDownload = (attachment: AttachmentItem) => {
    if (attachment.url) {
      const a = document.createElement('a')
      a.href = attachment.url
      a.download = attachment.name || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleSaveDocument = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave({
          subject: remarks || `${folder}_${subFolder}`,
          folder,
          subFolder,
          remarks,
          body,
          attachments,
        })
      }
      onUploadSuccess?.()
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      await onSaveDraft({
        subject: remarks || `${folder}_${subFolder}`,
        folder,
        subFolder,
        remarks,
        body,
        attachments,
      })
    } else {
      await handleSaveDocument()
    }
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background select-none font-sans',
        className
      )}
    >
      {/* ── 1. Header Bar (Matches Exact Screenshot) ────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          New File Upload
        </h1>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storage</span>
          </button>
        )}
      </div>

      {/* Warning banner if Supabase storage settings are not completed */}
      {warningMessage && (
        <div className="mx-6 mt-4 flex items-center justify-between gap-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>{warningMessage}</span>
          </div>
          <a
            href="/app-settings"
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold transition-colors text-[11px] shrink-0"
          >
            Go to App Settings
          </a>
        </div>
      )}

      {/* ── 2. Form Body (Exact Screenshot Layout & Spacing) ────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Folder Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Folder</Label>
          <div className="w-full max-w-xs">
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger className="h-10 text-xs rounded-xl border border-border/80 bg-background shadow-2xs">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg">
                {(folders || FOLDER_OPTIONS.map((f) => ({ id: f, name: f }))).map((f) => (
                  <SelectItem key={f.id} value={f.name} className="text-xs">
                    📁 {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sub folder Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Sub folder</Label>
          <div className="w-full max-w-xs">
            <Select value={subFolder} onValueChange={(val) => setSubFolder(val)}>
              <SelectTrigger className="h-10 text-xs rounded-xl border border-border/80 bg-background shadow-2xs">
                <SelectValue placeholder="Select sub folder" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg">
                {SUB_FOLDER_OPTIONS.map((sub) => (
                  <SelectItem key={sub} value={sub} className="text-xs">
                    📁 {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Remarks</Label>
          <textarea
            rows={3}
            placeholder="Add a note about these attachments..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-2xs resize-y"
          />
        </div>

        {/* Description / Notes (Rich Formatting Toolbar + Editable Box) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Description / Notes</Label>
          <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xs">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-border/60 bg-muted/20 flex-wrap">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Bold"
              >
                <Bold className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Italic"
              >
                <Italic className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Underline"
              >
                <Underline className="h-3.5 w-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-border mx-1.5" />
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Bullet List"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-border mx-1.5" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                title="Attach File"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Editable Content */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type description, remarks, or notes here..."
              rows={5}
              className="w-full bg-transparent p-3.5 text-xs leading-relaxed outline-none resize-y border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div className="space-y-2 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Attachments ({attachments.length})
          </Label>

          {/* Progress Bar */}
          {uploadingFile && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2 shadow-2xs w-full">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{uploadingFile.name}</span>
                </div>
                <span className="text-primary shrink-0">{uploadingFile.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadingFile.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Attachment list */}
          {attachments.length > 0 && (
            <div className="border border-border/80 rounded-xl overflow-hidden bg-background divide-y divide-border">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 select-none hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="bg-primary/10 w-9 h-9 flex items-center justify-center rounded-lg border border-primary/20 shrink-0 text-primary">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {attachment.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{attachment.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    {attachment.url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => handleDownload(attachment)}
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => {
                        if (onPreviewAttachment && attachment.url) {
                          onPreviewAttachment({ name: attachment.name, url: attachment.url })
                        }
                      }}
                      title="View file"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      onClick={() => removeAttachment(attachment.id)}
                      title="Remove attachment"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full-width Attach Files button (Matches Exact Screenshot) */}
          <input
            type="file"
            ref={fileInputRef}
            id="file-upload-input-field"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-background py-2.5 text-xs font-medium text-foreground hover:bg-muted/40 transition-all cursor-pointer shadow-2xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Attach Files</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 3. Footer Action Bar (Matches Exact Screenshot) ─────────────────── */}
      <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-9 px-4 rounded-xl text-xs font-semibold border-border/80 cursor-pointer"
        >
          Cancel
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="h-9 px-4 rounded-xl text-xs font-semibold border-border/80 gap-1.5 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Save as Draft</span>
          </Button>
          <Button
            onClick={handleSaveDocument}
            disabled={isSaving}
            size="sm"
            className="h-9 px-5 rounded-xl text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer min-w-[80px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
