import React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/ui/dropdown-menu'

export interface AiToolOption {
  id: string
  name: string
  icon?: string | React.ReactNode
  description?: string
}

export const DEFAULT_AI_TOOLS: AiToolOption[] = [
  { id: 'chat', name: 'AI Chat', icon: '' },
  { id: 'web-search', name: 'Web Search', icon: '🌐' },
  { id: 'ui-render', name: 'UI Render', icon: '🎨' },
]

export interface AiToolSelectorProps {
  tool?: string
  tools?: AiToolOption[]
  onToolChange?: (toolId: string) => void
  disabled?: boolean
  className?: string
}

export function AiToolSelector({
  tool = 'chat',
  tools = DEFAULT_AI_TOOLS,
  onToolChange,
  disabled = false,
  className,
}: AiToolSelectorProps) {
  const currentTool = tools.find((t) => t.id === tool) || tools[0]

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
          <span className="text-muted-foreground">Tool:</span>
          <span className="flex items-center gap-1 font-semibold">
            {currentTool.icon && <span>{currentTool.icon}</span>}
            <span>{currentTool?.name || 'Select Tool'}</span>
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-48 rounded-2xl p-1 shadow-2xl border border-border/80 bg-background text-foreground space-y-0.5"
      >
        {tools.map((t) => {
          const isSelected = t.id === tool
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => onToolChange?.(t.id)}
              className={cn(
                'flex items-center justify-between py-2 px-3 text-xs font-semibold rounded-xl cursor-pointer transition-colors',
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-900 dark:text-white focus:bg-slate-900 focus:text-white'
                  : 'text-foreground hover:bg-muted/70 focus:bg-muted/70'
              )}
            >
              <div className="flex items-center gap-2">
                {t.icon && <span className="text-sm shrink-0">{t.icon}</span>}
                <span className="truncate">{t.name}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-white" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
