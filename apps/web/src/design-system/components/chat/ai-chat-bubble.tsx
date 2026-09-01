import React, { useState } from 'react'
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/ui/avatar'
import { Button } from '@/design-system/components/ui/button'

export interface AiCitation {
  title: string
  url: string
  snippet?: string
}

export interface AiChatBubbleProps {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  modelName?: string
  avatarUrl?: string
  citations?: AiCitation[]
  isLoading?: boolean
  onCopy?: () => void
  onThumbsUp?: () => void
  onThumbsDown?: () => void
  onRegenerate?: () => void
  className?: string
  children?: React.ReactNode
}

export function AiChatBubble({
  id,
  role,
  content,
  modelName,
  avatarUrl,
  citations = [],
  isLoading = false,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onRegenerate,
  className,
  children,
}: AiChatBubbleProps) {
  const isAssistant = role === 'assistant'
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      id={id ? `ai-bubble-${id}` : undefined}
      className={cn(
        'group flex w-full gap-3 py-3 px-4 transition-colors',
        isAssistant ? 'bg-muted/30' : 'bg-transparent',
        className
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border/40 shadow-xs">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={role} />
        ) : isAssistant ? (
          <AvatarFallback className="bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-muted text-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header (Role & Model) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {isAssistant ? (modelName || 'Amoga AI Assistant') : 'You'}
          </span>
          {isAssistant && (
            <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-medium text-primary">
              AI
            </span>
          )}
        </div>

        {/* Content / Children */}
        <div className="text-sm leading-relaxed text-foreground break-words space-y-2">
          {isLoading && !content ? (
            <div className="flex items-center gap-1.5 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Thinking...</span>
            </div>
          ) : children ? (
            children
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
        </div>

        {/* Citations List */}
        {citations.length > 0 && (
          <div className="mt-3 space-y-1 pt-2 border-t border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground">Sources & Citations:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {citations.map((cite, i) => (
                <a
                  key={i}
                  href={cite.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  <span className="font-semibold text-primary">{i + 1}.</span>
                  <span className="truncate max-w-[160px]">{cite.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Assistant Action Bar */}
        {isAssistant && content && !isLoading && (
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRegenerate}
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLiked(true)
                onThumbsUp?.()
              }}
              className={cn(
                'h-7 w-7 text-muted-foreground hover:text-foreground rounded-md',
                liked === true && 'text-emerald-500 bg-emerald-500/10'
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLiked(false)
                onThumbsDown?.()
              }}
              className={cn(
                'h-7 w-7 text-muted-foreground hover:text-foreground rounded-md',
                liked === false && 'text-red-500 bg-red-500/10'
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
