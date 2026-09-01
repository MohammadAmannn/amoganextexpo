import React from 'react'
import { MessageSquareDashed } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatEmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function ChatEmptyState({
  title = 'No conversation selected',
  description = 'Choose a chat from the sidebar or start a new conversation to begin messaging.',
  icon,
  action,
  className,
}: ChatEmptyStateProps) {
  return (
    <div className={cn('flex flex-1 flex-col items-center justify-center p-8 text-center bg-muted/20', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground mb-4 shadow-xs">
        {icon || <MessageSquareDashed className="h-8 w-8 text-primary/70" />}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
