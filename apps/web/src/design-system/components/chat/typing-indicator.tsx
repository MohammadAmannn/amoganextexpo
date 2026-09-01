import React from 'react'
import { cn } from '@/lib/utils'

export interface TypingIndicatorProps {
  label?: string
  avatarUrl?: string
  className?: string
}

export function TypingIndicator({ label = 'Typing...', avatarUrl, className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground', className)}>
      <div className="flex items-center gap-1 rounded-full bg-muted/80 px-2.5 py-1.5 border border-border/50">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" />
      </div>
      {label && <span className="text-[11px] font-normal italic">{label}</span>}
    </div>
  )
}
