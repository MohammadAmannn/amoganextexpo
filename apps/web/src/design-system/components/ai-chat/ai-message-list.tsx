import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { AiPromptSuggestions, AiPromptSuggestionItem } from './ai-prompt-suggestions'

export interface AiMessageListProps {
  children?: React.ReactNode
  isEmpty?: boolean
  suggestions?: AiPromptSuggestionItem[]
  onSelectPrompt?: (prompt: string, tool?: string) => void
  autoScrollToBottom?: boolean
  className?: string
}

export function AiMessageList({
  children,
  isEmpty = false,
  suggestions,
  onSelectPrompt,
  autoScrollToBottom = true,
  className,
}: AiMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [children, autoScrollToBottom])

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex-1 w-full overflow-y-auto px-4 py-4 space-y-4 no-scrollbar',
        className
      )}
    >
      {isEmpty ? (
        <AiPromptSuggestions
          suggestions={suggestions}
          onSelectPrompt={onSelectPrompt}
        />
      ) : (
        children
      )}
    </div>
  )
}
