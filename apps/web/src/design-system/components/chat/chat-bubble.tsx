import React from 'react'
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Download,
  FileText,
  MapPin,
  Eye,
  MoreHorizontal,
  CornerUpLeft,
  CornerUpRight,
  Pin,
  Star,
  Heart,
  Flag,
  Archive,
  Bell,
  Trash2,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface ChatAttachmentItem {
  id?: string
  name: string
  url?: string
  size?: number
  type?: 'image' | 'file' | 'audio' | 'video' | 'pdf' | string
  mimeType?: string
  duration?: number
  statusText?: string
}

export interface ChatLocationItem {
  latitude: number
  longitude: number
  address?: string
  title?: string
}

export interface ChatBubbleProps {
  id?: string
  content?: string
  isOwn?: boolean
  senderName?: string
  senderAvatar?: string
  time?: string | Date
  status?: ChatMessageStatus
  attachments?: ChatAttachmentItem[]
  location?: ChatLocationItem
  reactions?: Array<{ emoji: string; count: number; users?: string[] }>
  replyTo?: {
    senderName?: string
    content?: string
    id?: string
  }
  isHighlighted?: boolean
  showActions?: boolean
  className?: string
  bubbleClassName?: string
  onReply?: () => void
  onForward?: () => void
  onPin?: () => void
  onStar?: () => void
  onFavorite?: () => void
  onFlag?: () => void
  onArchive?: () => void
  onActionThis?: () => void
  onDelete?: () => void
  onThumbsUp?: () => void
  onThumbsDown?: () => void
  onCopy?: () => void
  onShare?: () => void
  onActionClick?: (action: string) => void
  onAttachmentClick?: (attachment: ChatAttachmentItem) => void
  onAttachmentPreview?: (attachment: ChatAttachmentItem) => void
  onLocationClick?: (location: ChatLocationItem) => void
  children?: React.ReactNode
}

export function ChatBubble({
  id,
  content,
  isOwn = false,
  senderName = 'Mohammed Aman',
  senderAvatar,
  time,
  status,
  attachments = [],
  location,
  reactions = [],
  replyTo,
  isHighlighted = false,
  showActions = true,
  className,
  bubbleClassName,
  onReply,
  onForward,
  onPin,
  onStar,
  onFavorite,
  onFlag,
  onArchive,
  onActionThis,
  onDelete,
  onThumbsUp,
  onThumbsDown,
  onCopy,
  onShare,
  onActionClick,
  onAttachmentClick,
  onAttachmentPreview,
  onLocationClick,
  children,
}: ChatBubbleProps) {
  const formattedTime = time instanceof Date ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : time

  const renderStatusIcon = () => {
    if (!status) return null
    switch (status) {
      case 'sending':
        return <Clock className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" />
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      case 'read':
        return <CheckCheck className="h-3.5 w-3.5 text-sky-500 shrink-0" />
      case 'failed':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
      default:
        return null
    }
  }

  const handleCopy = () => {
    if (content) {
      navigator.clipboard?.writeText(content)
    }
    onCopy?.()
  }

  const imageAttachments = attachments.filter((att) => att.type === 'image' || att.url?.match(/\.(jpeg|jpg|gif|png|webp)/i))
  const fileAttachments = attachments.filter((att) => att.type !== 'image' && !att.url?.match(/\.(jpeg|jpg|gif|png|webp)/i))

  const initials = senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'MO'

  return (
    <div
      id={id ? `chat-bubble-${id}` : undefined}
      className={cn(
        'group relative flex w-full gap-3 py-2 transition-colors duration-150',
        isHighlighted && 'bg-primary/5 rounded-xl px-2',
        className
      )}
    >
      {/* Avatar on Left */}
      <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-border/50 rounded-full">
        {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
        <AvatarFallback className="text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Main Column */}
      <div className="flex flex-col min-w-0 flex-1 items-start relative">
        {/* Sender Name */}
        {senderName && (
          <span className="text-xs font-semibold text-foreground/85 mb-1">
            {senderName}
          </span>
        )}

        {/* Reply Quote Banner */}
        {replyTo && (
          <div
            onClick={onReply}
            className="mb-1 cursor-pointer rounded-lg border-l-2 border-indigo-600 bg-muted/60 p-1.5 text-xs transition-opacity hover:opacity-80"
          >
            <div className="font-medium text-[10px]">{replyTo.senderName || 'Replying to message'}</div>
            <div className="line-clamp-1 text-[11px] text-muted-foreground">{replyTo.content}</div>
          </div>
        )}

        {/* Message Content */}
        {children ? (
          children
        ) : (
          <div className="space-y-2 w-full">
            {/* Plain Text Message */}
            {content && (
              <p className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            )}

            {/* Document / PDF Card (Matching User Screenshot) */}
            {fileAttachments.map((att, idx) => (
              <div
                key={att.id || idx}
                className="w-full max-w-[340px] rounded-2xl border border-border/80 bg-background p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-border transition-all duration-150"
              >
                {/* Orange Document Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>

                {/* Info Column */}
                <div className="min-w-0 flex-1">
                  <h5 className="truncate text-xs font-bold text-foreground">
                    {att.name}
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    {att.size ? `${(att.size / 1024).toFixed(0)} KB • ` : ''}
                    {att.type?.toUpperCase() || 'PDF'}
                  </p>
                  {att.statusText && (
                    <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {att.statusText}
                    </span>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => onAttachmentPreview?.(att)}
                    className="p-1 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAttachmentClick?.(att)}
                    className="p-1 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Location Card */}
            {location && (
              <div
                onClick={() => onLocationClick?.(location)}
                className="w-full max-w-[340px] rounded-2xl border border-border/80 bg-background overflow-hidden shadow-2xs cursor-pointer hover:border-border transition-all duration-150"
              >
                <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                    <MapPin className="h-5 w-5 fill-white text-emerald-600" />
                  </div>
                  <div className="absolute bottom-1 left-2 rounded bg-background/80 px-1.5 py-0.5 text-[9px] text-muted-foreground backdrop-blur-xs">
                    © CARTO, © OpenStreetMap
                  </div>
                </div>
                <div className="p-3 flex items-start gap-2.5 bg-muted/30">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-foreground">
                      {location.title || 'Current Location'}
                    </h5>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Attachments */}
            {imageAttachments.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => onAttachmentClick?.(img)}
                className="w-full max-w-[340px] rounded-2xl overflow-hidden border border-border/80 bg-background shadow-2xs cursor-pointer group/img"
              >
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-44 object-cover transition-transform duration-200 group-hover/img:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-44 bg-slate-900 flex items-center justify-center text-white text-xs">
                    {img.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp and Delivery Checkmarks Underneath */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground select-none">
          {formattedTime && <span>{formattedTime}</span>}
          {renderStatusIcon()}
        </div>

        {/* Hover Action Bar: Pill Bar with ThumbsUp, ThumbsDown, Copy, Share, 3-dots (Matching Screenshot 2) */}
        {showActions && (
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-background/95 backdrop-blur-xs px-3 py-1 shadow-md">
              <button
                type="button"
                onClick={onThumbsUp}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Like"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onThumbsDown}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Dislike"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Copy"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onShare}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>

              {/* 3-Dot More Menu Matching Screenshot 2 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="top"
                  sideOffset={8}
                  className="w-48 rounded-2xl p-1.5 shadow-2xl border border-border/80 bg-background text-foreground space-y-0.5"
                >
                  <DropdownMenuItem
                    onClick={onReply}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <CornerUpLeft className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Reply</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onForward}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <CornerUpRight className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>Forward</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onPin}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <Pin className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Pin Message</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onStar}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <Star className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Star</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onFavorite}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>Favorite</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onFlag}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <Flag className="h-4 w-4 text-red-600 shrink-0" />
                    <span>Flag</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onArchive}
                    className="gap-2.5 py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <Archive className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Archive</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onActionThis}
                    className="flex items-center justify-between py-1.5 px-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="h-4 w-4 text-orange-500 shrink-0" />
                      <span>Action This</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={onDelete}
                    className="flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trash2 className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>Delete</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-rose-400" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Emoji Reactions Row */}
        {reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {reactions.map((react, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs shadow-2xs cursor-pointer hover:bg-muted"
              >
                <span>{react.emoji}</span>
                <span className="font-semibold text-[10px] text-muted-foreground">{react.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
