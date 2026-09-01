import React, { useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/design-system/components/ui/scroll-area'

export interface ChatMessageListProps {
  children?: React.ReactNode
  isLoadingMore?: boolean
  onLoadMore?: () => void
  autoScrollToBottom?: boolean
  emptyState?: React.ReactNode
  className?: string
}

export function ChatMessageList({
  children,
  isLoadingMore = false,
  onLoadMore,
  autoScrollToBottom = true,
  emptyState,
  className,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [children, autoScrollToBottom])

  const hasChildren = React.Children.count(children) > 0

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-1 flex-col overflow-y-auto p-4 space-y-2', className)}
    >
      {/* Top Loading Indicator for Infinite Scroll */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary mr-1.5" />
          <span className="text-xs">Loading older messages...</span>
        </div>
      )}

      {/* Main Messages Content or Empty State */}
      {hasChildren ? (
        children
      ) : emptyState ? (
        <div className="flex flex-1 items-center justify-center h-full">
          {emptyState}
        </div>
      ) : null}

      {/* Scroll Anchor */}
      <div ref={bottomRef} className="h-0 w-0" />
    </div>
  )
}
