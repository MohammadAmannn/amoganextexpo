import React, { useState } from 'react'
import { Users, Search, Plus, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/design-system/components/ui/input'
import { Button } from '@/design-system/components/ui/button'
import { Switch } from '@/design-system/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/design-system/components/ui/dialog'

export interface GroupItem {
  id: string
  name: string
  ownerEmail?: string
  membersCount?: number
  avatarUrl?: string
  isEnabled?: boolean
  description?: string
}

export interface GroupManagerProps {
  groups?: GroupItem[]
  title?: string
  description?: string
  searchPlaceholder?: string
  onChatClick?: (group: GroupItem) => void
  onToggleStatus?: (group: GroupItem, enabled: boolean) => void
  onEditClick?: (group: GroupItem) => void
  onDeleteClick?: (group: GroupItem) => void
  onAddGroup?: (newGroup: { name: string; description?: string }) => void
  className?: string
}

export function GroupManager({
  groups = [],
  title = 'Groups Manager',
  description = 'Manage your group channels and start team conversations.',
  searchPlaceholder = 'Search groups...',
  onChatClick,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  onAddGroup,
  className,
}: GroupManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDesc, setGroupDesc] = useState('')

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.ownerEmail && g.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return
    onAddGroup?.({
      name: groupName.trim(),
      description: groupDesc.trim() || undefined,
    })
    setGroupName('')
    setGroupDesc('')
    setIsAddOpen(false)
  }

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-border/80 bg-background p-6 shadow-sm space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 h-10 text-xs rounded-xl bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
        />
      </div>

      {/* Group Cards List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredGroups.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No group channels found matching your search.
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 p-3 hover:border-border transition-all duration-150 shadow-2xs"
            >
              {/* Left Group Details */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 rounded-xl bg-slate-800 text-white font-bold border border-border/60 overflow-hidden">
                  {group.avatarUrl && <AvatarImage src={group.avatarUrl} alt={group.name} className="object-cover" />}
                  <AvatarFallback className="bg-slate-800 text-xs font-semibold text-white">
                    {group.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground tracking-tight">
                    {group.name}
                  </h4>
                  <p className="truncate text-xs text-muted-foreground">
                    {group.membersCount || 1} members {group.ownerEmail ? `• ${group.ownerEmail}` : ''}
                  </p>
                </div>
              </div>

              {/* Right Action Icons & Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Chat Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onChatClick?.(group)}
                  className="h-8 w-8 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg"
                  title="Open Group Chat"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>

                {/* Status Toggle */}
                <Switch
                  checked={group.isEnabled !== false}
                  onCheckedChange={(checked) => onToggleStatus?.(group, checked)}
                  className="data-[state=checked]:bg-slate-800 dark:data-[state=checked]:bg-slate-200"
                />

                {/* Edit Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditClick?.(group)}
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                  title="Edit Group"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>

                {/* Delete Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick?.(group)}
                  className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="Delete Group"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Group Button */}
      <Button
        onClick={() => setIsAddOpen(true)}
        className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-transform active:scale-[0.99] gap-1.5"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Group</span>
      </Button>

      {/* Add Group Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a group channel to collaborate and chat with multiple members.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Group Name *</label>
              <Input
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Design Team Hub"
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Description (Optional)</label>
              <Input
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                placeholder="e.g. Core team discussions"
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
