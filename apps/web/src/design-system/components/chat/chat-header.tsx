import React from 'react'
import {
  Bell,
  Flag,
  MoreVertical,
  CornerUpLeft,
  CornerUpRight,
  Pin,
  Star,
  Heart,
  Archive,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export interface ChatHeaderProps {
  title?: string
  subtitle?: string
  avatarUrl?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  isGroup?: boolean
  memberCount?: number
  actions?: React.ReactNode
  showDefaultActions?: boolean
  onAvatarClick?: () => void
  onNotificationClick?: () => void
  onFlagClick?: () => void
  onReply?: () => void
  onForward?: () => void
  onPin?: () => void
  onStar?: () => void
  onFavorite?: () => void
  onArchive?: () => void
  onActionThis?: () => void
  onDelete?: () => void
  className?: string
}

export function ChatHeader({
  title = 'Mohammed Aman',
  subtitle = 'Last seen today at 04:58 PM',
  avatarUrl,
  status = 'online',
  isGroup = false,
  memberCount,
  actions,
  showDefaultActions = true,
  onAvatarClick,
  onNotificationClick,
  onFlagClick,
  onReply,
  onForward,
  onPin,
  onStar,
  onFavorite,
  onArchive,
  onActionThis,
  onDelete,
  className,
}: ChatHeaderProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500'
      case 'away':
        return 'bg-amber-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-slate-400'
    }
  }

  const initials =
    title
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MA'

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-border bg-background px-4 py-3 select-none',
        className
      )}
    >
      {/* Left Column: Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative cursor-pointer shrink-0" onClick={onAvatarClick}>
          <Avatar className="h-10 w-10 rounded-xl border border-border/60 shadow-2xs">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={title} className="rounded-xl" />}
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isGroup && (
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background',
                getStatusColor()
              )}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-foreground tracking-tight leading-snug">
            {title}
          </h2>
          <p className="truncate text-xs text-muted-foreground leading-tight">
            {subtitle
              ? subtitle
              : isGroup
              ? `${memberCount || 0} members`
              : <span className="capitalize">{status}</span>}
          </p>
        </div>
      </div>

      {/* Right Column: Actions (Outline Bell, Flag, 3-Dots Menu) */}
      <div className="flex items-center gap-1 shrink-0">
        {actions ? (
          actions
        ) : showDefaultActions ? (
          <div className="flex items-center gap-1">
            {/* Outline Bell Icon in Amber (No Fill) */}
            <button
              type="button"
              onClick={onNotificationClick}
              className="p-1.5 rounded-lg hover:bg-muted text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
              title="Act on this"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            {/* Quick Flag Action */}
            <button
              type="button"
              onClick={onFlagClick}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Flag"
            >
              <Flag className="h-4.5 w-4.5" />
            </button>

            {/* 3-Dot More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="More options"
                >
                  <MoreVertical className="h-4.5 w-4.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border border-border/80 bg-background shadow-lg p-1 space-y-0.5 rounded-xl"
              >
                <DropdownMenuItem
                  onClick={onReply}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <CornerUpLeft className="h-4 w-4 text-blue-500" />
                    <span>Reply</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onForward}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <CornerUpRight className="h-4 w-4 text-sky-500" />
                    <span>Forward</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onPin}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Pin className="h-4 w-4 text-purple-600" />
                    <span>Pin Message</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onStar}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Star</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onFavorite}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span>Favorite</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onArchive}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="h-4 w-4 text-indigo-600" />
                    <span>Archive</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onActionThis}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-muted/80 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-amber-500" />
                    <span>Action This</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onDelete}
                  className="cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-rose-600 rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <span>Delete</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-rose-400" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </div>
  )
}
