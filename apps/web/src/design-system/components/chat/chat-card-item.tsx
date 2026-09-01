import React from 'react'
import { Users, MoreHorizontal, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/design-system/components/ui/badge'

export interface ChatCardItemProps {
  id: string
  title: string
  badgeLabel?: string
  lastMessage?: string
  time?: string | Date
  membersCount?: number
  onlineCount?: number
  unreadCount?: number
  isActive?: boolean
  isGroup?: boolean
  onClick?: () => void
  onMoreClick?: (e: React.MouseEvent) => void
  className?: string
}

export function ChatCardItem({
  id,
  title,
  badgeLabel = 'Chat',
  lastMessage,
  time,
  membersCount = 2,
  onlineCount = 0,
  unreadCount = 0,
  isActive = false,
  isGroup = false,
  onClick,
  onMoreClick,
  className,
}: ChatCardItemProps) {
  const formattedTime = time instanceof Date ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : time

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col gap-1 rounded-xl p-3 cursor-pointer transition-all duration-150 select-none border',
        isActive
          ? 'bg-indigo-500/10 border-indigo-200/60 dark:bg-indigo-950/30 dark:border-indigo-900/50 shadow-2xs'
          : 'bg-background hover:bg-muted/40 border-transparent hover:border-border/40',
        unreadCount > 0 && !isActive && 'bg-primary/5',
        className
      )}
    >
      {/* Active Left Indicator Bar */}
      {isActive && (
        <div className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-l-md bg-indigo-600 dark:bg-indigo-500" />
      )}

      {/* Row 1: Name, Badge, Timestamp */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h4 className={cn('truncate text-sm font-semibold tracking-tight text-foreground')}>
            {title}
          </h4>
          {badgeLabel && (
            <Badge className="h-4.5 rounded-full border border-emerald-200/40 bg-emerald-500/10 dark:bg-emerald-950/40 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 gap-1 shrink-0">
              <span className="text-[9px]">💬</span>
              <span>{badgeLabel}</span>
            </Badge>
          )}
        </div>

        {formattedTime && (
          <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
            {formattedTime}
          </span>
        )}
      </div>

      {/* Row 2: Members Count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
        <Users className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {membersCount} Members • {onlineCount} Online
        </span>
      </div>

      {/* Row 3: Last Message Snippet */}
      {lastMessage && (
        <p className="line-clamp-1 text-xs text-muted-foreground/70 truncate">
          {lastMessage}
        </p>
      )}

      {/* Optional More Menu on hover */}
      {onMoreClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onMoreClick(e)
          }}
          className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted text-muted-foreground"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
