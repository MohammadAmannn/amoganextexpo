import React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export interface AiModelOption {
  id: string
  name: string
  provider?: string
  badge?: string
}

export const DEFAULT_AI_MODELS: AiModelOption[] = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
]

export interface AiModelSelectorProps {
  model?: string
  models?: AiModelOption[]
  onModelChange?: (modelId: string) => void
  disabled?: boolean
  className?: string
}

export function AiModelSelector({
  model = 'google/gemini-2.5-flash',
  models = DEFAULT_AI_MODELS,
  onModelChange,
  disabled = false,
  className,
}: AiModelSelectorProps) {
  const currentModel = models.find((m) => m.id === model) || models[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-background hover:bg-muted text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs focus:outline-none select-none',
            className
          )}
        >
          <span className="truncate max-w-[130px] font-semibold">{currentModel?.name || 'Select Model'}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-48 rounded-2xl p-1 shadow-2xl border border-border/80 bg-background text-foreground space-y-0.5"
      >
        {models.map((m) => {
          const isSelected = m.id === model
          return (
            <DropdownMenuItem
              key={m.id}
              onClick={() => onModelChange?.(m.id)}
              className={cn(
                'flex items-center justify-between py-2 px-3 text-xs font-semibold rounded-xl cursor-pointer transition-colors',
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-900 dark:text-white focus:bg-slate-900 focus:text-white'
                  : 'text-foreground hover:bg-muted/70 focus:bg-muted/70'
              )}
            >
              <span className="truncate">{m.name}</span>
              {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-white" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
