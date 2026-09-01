import React, { useRef, useEffect } from 'react'
import { ArrowUp, Mic, History, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiModelSelector, AiModelOption } from './ai-model-selector'
import { AiToolSelector, AiToolOption } from './ai-tool-selector'

export interface AiChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  model?: string
  onModelChange?: (model: string) => void
  models?: AiModelOption[]
  tool?: string
  onToolChange?: (tool: string) => void
  tools?: AiToolOption[]
  isListening?: boolean
  onVoiceToggle?: () => void
  onHistoryClick?: () => void
  onNewChatClick?: () => void
  className?: string
}

export function AiChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Ask a question about your data...',
  disabled = false,
  isLoading = false,
  model = 'google/gemini-2.5-flash',
  onModelChange,
  models,
  tool = 'chat',
  onToolChange,
  tools,
  isListening = false,
  onVoiceToggle,
  onHistoryClick,
  onNewChatClick,
  className,
}: AiChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [value])

  const hasText = value.trim().length > 0

  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-border/80 bg-background p-3 flex flex-col gap-2 shadow-xs transition-all focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/20',
        className
      )}
    >
      {/* Top Input Row */}
      <div className="flex items-center gap-2 px-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? '🎤 Listening... Speak now'
              : isLoading
                ? 'Thinking...'
                : placeholder
          }
          disabled={disabled || isLoading}
          rows={1}
          className="max-h-32 min-h-[26px] w-full resize-none bg-transparent text-sm sm:text-base outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed"
        />

        {/* Voice Trigger Button */}
        {onVoiceToggle && (
          <button
            type="button"
            onClick={onVoiceToggle}
            disabled={disabled || isLoading}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer',
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            title="Voice input"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Upward Circular Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!hasText || disabled || isLoading}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer shadow-xs',
            hasText && !disabled && !isLoading
              ? 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 active:scale-95'
              : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
          )}
          title="Send"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Bottom Toolbar: Model + Tool Selectors + History + New Chat */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 overflow-x-auto no-scrollbar">
        {/* Left Pickers: Model + Tool */}
        <div className="flex items-center gap-1.5 shrink-0">
          <AiModelSelector
            model={model}
            models={models}
            onModelChange={onModelChange}
            disabled={disabled || isLoading}
          />
          <AiToolSelector
            tool={tool}
            tools={tools}
            onToolChange={onToolChange}
            disabled={disabled || isLoading}
          />
        </div>

        {/* Right Actions: History & New Chat */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onHistoryClick && (
            <button
              type="button"
              onClick={onHistoryClick}
              disabled={disabled || isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
              title="Prompt History"
            >
              <History className="h-3.5 w-3.5" />
            </button>
          )}

          {onNewChatClick && (
            <button
              type="button"
              onClick={onNewChatClick}
              disabled={disabled || isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
              title="New Chat"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
