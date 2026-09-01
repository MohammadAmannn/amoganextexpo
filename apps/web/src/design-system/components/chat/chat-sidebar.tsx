import React from 'react'
import { Search, MessageSquare, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/design-system/components/ui/input'
import { Button } from '@/design-system/components/ui/button'

export interface ChatSidebarTab {
  id: string
  label: string
  count?: number
}

export interface ChatSidebarProps {
  title?: string
  searchValue?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  tabs?: ChatSidebarTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  sectionLabel?: string
  sectionCount?: number
  actions?: React.ReactNode
  onNewChat?: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function ChatSidebar({
  title = 'Chats',
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  tabs = [
    { id: 'chats', label: 'Chats' },
    { id: 'contact', label: 'Contact' },
    { id: 'groups', label: 'Groups' },
    { id: 'folder', label: 'Folder' },
  ],
  activeTab = 'chats',
  onTabChange,
  sectionLabel = 'CHATS',
  sectionCount = 2,
  actions,
  onNewChat,
  children,
  footer,
  className,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full w-full md:w-80 lg:w-[340px] border-r border-border/70 bg-background/95 select-none',
        className
      )}
    >
      {/* 1. Top Subtabs (Chats, Contact, Groups, Folder) with Active Underline */}
      <div className="flex items-center gap-4 px-4 pt-3 pb-1 border-b border-border/40 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'relative pb-2 text-sm font-medium transition-all shrink-0 cursor-pointer',
                isSelected
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{tab.label}</span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* 2. Rounded Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 h-9 text-xs rounded-xl bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* 3. Category Section Divider (💬 CHATS ─────────── 2) */}
      <div className="flex items-center px-4 py-1.5 gap-2">
        <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          {sectionLabel}
        </span>
        <div className="flex-1 h-[1px] bg-border/60 mx-1" />
        {typeof sectionCount === 'number' && (
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {sectionCount}
          </span>
        )}
      </div>

      {/* 4. Scrollable Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {children}
      </div>

      {/* Optional Footer */}
      {footer && <div className="p-3 border-t border-border/60 bg-muted/20">{footer}</div>}
    </aside>
  )
}
