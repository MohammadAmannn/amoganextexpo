import React from 'react'
import {
  Sparkles,
  Bot,
  ArrowLeft,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export interface AiChatHeaderProps {
  title?: string
  subtitle?: string
  modelName?: string
  showSparkles?: boolean
  showDefaultActions?: boolean
  onBack?: () => void
  actions?: React.ReactNode
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

export function AiChatHeader({
  title = 'AI Assistant',
  subtitle = 'Powered by AI · Ask anything',
  modelName,
  showSparkles = true,
  showDefaultActions = true,
  onBack,
  actions,
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
}: AiChatHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-border bg-background select-none',
        className
      )}
    >
      {/* Left Column: Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40 shrink-0 shadow-2xs">
          <Bot className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold text-foreground tracking-tight leading-snug">
              {title}
            </h3>
            {showSparkles && (
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground leading-tight">
            {subtitle ? subtitle : modelName ? `Powered by ${modelName}` : 'Powered by AI · Ask anything'}
          </p>
        </div>
      </div>

      {/* Right Column: Actions (Outline Bell, Flag, 3-Dots Menu) */}
      <div className="flex items-center gap-1 shrink-0">
        {actions ? (
          actions
        ) : showDefaultActions ? (
          <div className="flex items-center gap-1">
            {/* Outline Bell Icon in Amber (No fill) */}
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
