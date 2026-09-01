import React from 'react'
import { Palette, Search, Code, FormInput, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AiPromptSuggestionItem {
  title: string
  description: string
  prompt: string
  tool?: string
  icon?: React.ReactNode
}

export const DEFAULT_AI_PROMPTS: AiPromptSuggestionItem[] = [
  {
    title: 'Explain React 19 features',
    description: 'Deep dive into server actions, useActionState, and use() hook.',
    prompt: 'Explain the new features of React 19 with examples of Server Actions and the use() hook.',
    tool: 'chat',
    icon: <Code className="h-4 w-4 text-sky-500" />,
  },
  {
    title: 'Design user profile card',
    description: 'Generates a rich, interactive UI card showing stats, avatar, and badges.',
    prompt: 'Design a beautiful user profile card with follower count, location, badges and actions.',
    tool: 'ui-render',
    icon: <Palette className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: 'Search latest Tech news',
    description: 'Searches the web for recent announcements in AI and technology.',
    prompt: 'What are the key announcements from the latest tech conferences and AI releases this month?',
    tool: 'web-search',
    icon: <Search className="h-4 w-4 text-emerald-500" />,
  },
  {
    title: 'Create feedback form',
    description: 'Renders a beautiful form with textareas, ratings, and submittable actions.',
    prompt: 'Build a premium user feedback form with input fields for name, email, rating select, and submit button.',
    tool: 'ui-render',
    icon: <FormInput className="h-4 w-4 text-amber-500" />,
  },
]

export interface AiPromptSuggestionsProps {
  suggestions?: AiPromptSuggestionItem[]
  onSelectPrompt?: (prompt: string, tool?: string) => void
  title?: string
  subtitle?: string
  className?: string
}

export function AiPromptSuggestions({
  suggestions = DEFAULT_AI_PROMPTS,
  onSelectPrompt,
  title = 'How can I help you today?',
  subtitle = 'Choose a prompt below or start typing your question.',
  className,
}: AiPromptSuggestionsProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6', className)}>
      <div className="space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt?.(item.prompt, item.tool)}
            className="p-3.5 rounded-2xl border border-border/80 bg-background hover:bg-muted/40 hover:border-indigo-500/50 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted/60 shrink-0">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
