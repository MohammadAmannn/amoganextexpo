import React, { useRef, useEffect, useState } from 'react'
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Camera,
  X,
  ImagePlus,
  Video,
  FileText,
  MapPin,
  FileImage,
  RefreshCw,
  Scan,
  ScanLine,
  FileCode2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export type AttachmentOptionType =
  | 'images'
  | 'videos'
  | 'documents'
  | 'location'
  | 'image-converter'
  | 'doc-converter'
  | 'doc-scanner'
  | 'scan-document'
  | 'extract-text'

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  maxLength?: number
  replyMessage?: {
    senderName?: string
    content?: string
    onClear?: () => void
  }
  showAttachments?: boolean
  showEmoji?: boolean
  showCamera?: boolean
  showVoice?: boolean
  onAttachmentClick?: () => void
  onSelectAttachmentType?: (type: AttachmentOptionType) => void
  onEmojiClick?: () => void
  onCameraClick?: () => void
  onVoiceClick?: () => void
  customActions?: React.ReactNode
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Message',
  disabled = false,
  isLoading = false,
  maxLength,
  replyMessage,
  showAttachments = true,
  showEmoji = true,
  showCamera = true,
  showVoice = true,
  onAttachmentClick,
  onSelectAttachmentType,
  onEmojiClick,
  onCameraClick,
  onVoiceClick,
  customActions,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isAttachOpen, setIsAttachOpen] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled && !isLoading) {
        onSend()
      }
    }
  }

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const hasText = value.trim().length > 0

  const handleSelectOption = (type: AttachmentOptionType) => {
    setIsAttachOpen(false)
    onSelectAttachmentType?.(type)
    if (type === 'images' || type === 'documents') {
      onAttachmentClick?.()
    }
  }

  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {/* Replying Banner */}
      {replyMessage && (
        <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-foreground">Replying to {replyMessage.senderName || 'Message'}:</span>
            <span className="truncate">{replyMessage.content}</span>
          </div>
          {replyMessage.onClear && (
            <button
              onClick={replyMessage.onClear}
              className="ml-2 rounded-sm p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Bar: Pill Container + Circular Action Button */}
      <div className="flex items-center gap-2">
        {/* Rounded Pill Input Bar */}
        <div className="flex flex-1 items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 shadow-2xs transition-all focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30">
          {/* Emoji Button on Left */}
          {showEmoji && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEmojiClick}
              disabled={disabled || isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full shrink-0"
            >
              <Smile className="h-4.5 w-4.5" />
            </Button>
          )}

          {/* Text Input / Auto-resizing textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            rows={1}
            className="max-h-28 min-h-[24px] w-full resize-none bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50 leading-normal"
          />

          {/* Paperclip Button with Exact Attachment Menu from Screenshot */}
          {showAttachments && (
            <DropdownMenu open={isAttachOpen} onOpenChange={setIsAttachOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled || isLoading}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full shrink-0"
                  title="Attachments"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56 rounded-2xl p-1.5 shadow-xl border border-border/80 bg-background text-foreground">
                <DropdownMenuItem
                  onClick={() => handleSelectOption('images')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <ImagePlus className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Images</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('videos')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <Video className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Videos</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('documents')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Documents</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('location')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Location</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('image-converter')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <FileImage className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Image Converter</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('doc-converter')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Doc Converter</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('doc-scanner')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <Scan className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Doc Scanner</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('scan-document')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <ScanLine className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Scan Document</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSelectOption('extract-text')}
                  className="gap-3 py-2 px-2.5 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                >
                  <FileCode2 className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Extract Text</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Camera Button */}
          {showCamera && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCameraClick}
              disabled={disabled || isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full shrink-0"
              title="Camera"
            >
              <Camera className="h-4.5 w-4.5" />
            </Button>
          )}

          {customActions}
        </div>

        {/* Circular Action Button on Right (Mic or Send) */}
        {hasText ? (
          <button
            type="button"
            onClick={onSend}
            disabled={disabled || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            title="Send message"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        ) : showVoice ? (
          <button
            type="button"
            onClick={onVoiceClick}
            disabled={disabled || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            title="Voice message"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={true}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/50 text-white shadow-md cursor-not-allowed"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </div>
  )
}
