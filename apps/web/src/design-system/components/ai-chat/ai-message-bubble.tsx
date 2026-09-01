import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, User, Sparkles, Copy, Check, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/ui/avatar'

export interface AiSourceItem {
  title: string
  url: string
  snippet?: string
}

export interface AiMessageBubbleProps {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  senderName?: string
  modelName?: string
  avatarUrl?: string
  sources?: AiSourceItem[]
  images?: string[]
  isLoading?: boolean
  showPreviewBtn?: boolean
  onOpenPreview?: () => void
  onImageClick?: (url: string) => void
  className?: string
}

export function AiMessageBubble({
  id,
  role,
  content,
  senderName,
  modelName,
  avatarUrl,
  sources = [],
  images = [],
  isLoading = false,
  showPreviewBtn = false,
  onOpenPreview,
  onImageClick,
  className,
}: AiMessageBubbleProps) {
  const isUser = role === 'user'
  const authorLabel = senderName || (isUser ? 'You' : 'AI Assistant')

  return (
    <div
      id={id ? `ai-bubble-${id}` : undefined}
      className={cn('flex w-full gap-3 py-2 justify-start select-text', className)}
    >
      {/* Avatar on Left */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-2xs font-semibold text-xs">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40 shadow-2xs">
            <Bot className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main Content Column */}
      <div className="flex flex-col min-w-0 flex-1 items-start gap-1">
        {/* Author Label */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-semibold',
              isUser ? 'text-muted-foreground/90' : 'text-indigo-600 dark:text-indigo-400'
            )}
          >
            {authorLabel}
          </span>
          {!isUser && modelName && (
            <span className="text-[10px] text-muted-foreground font-normal">
              • {modelName}
            </span>
          )}
        </div>

        {/* Text / Markdown Stream */}
        <div className="text-sm sm:text-base text-foreground w-full leading-relaxed">
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse delay-75" />
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse delay-150" />
              <span className="ml-1">Thinking...</span>
            </div>
          ) : isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words prose-p:leading-relaxed prose-pre:bg-muted/80 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:font-mono prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}

          {/* Quick Generative UI Open Action Button */}
          {!isUser && showPreviewBtn && onOpenPreview && (
            <div className="mt-3 flex justify-start">
              <button
                type="button"
                onClick={onOpenPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Open Preview Panel</span>
              </button>
            </div>
          )}

          {/* Sources / Citations list */}
          {!isUser && sources.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>Sources</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs text-foreground transition-colors shadow-2xs"
                  >
                    <span className="truncate max-w-[180px]">{src.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Images Grid */}
          {!isUser && images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`AI generated ${idx}`}
                  onClick={() => onImageClick?.(img)}
                  className="h-28 w-28 rounded-xl object-cover border border-border/80 cursor-pointer hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
