import React, { useState } from 'react'
import { Users, Search, Plus, MessageSquare, Pencil, Trash2, X } from 'lucide-react'
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

export interface ContactItem {
  id: string
  name: string
  email: string
  avatarUrl?: string
  initials?: string
  isEnabled?: boolean
  mobile?: string
}

export interface ContactManagerProps {
  contacts?: ContactItem[]
  title?: string
  description?: string
  searchPlaceholder?: string
  onChatClick?: (contact: ContactItem) => void
  onToggleStatus?: (contact: ContactItem, enabled: boolean) => void
  onEditClick?: (contact: ContactItem) => void
  onDeleteClick?: (contact: ContactItem) => void
  onAddContact?: (newContact: { name: string; email: string }) => void
  className?: string
}

export function ContactManager({
  contacts = [],
  title = 'Contact Manager',
  description = 'Manage your saved contacts and start direct chat conversations.',
  searchPlaceholder = 'Search contacts by name or email...',
  onChatClick,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  onAddContact,
  className,
}: ContactManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return
    onAddContact?.({
      name: newName.trim() || newEmail.split('@')[0],
      email: newEmail.trim(),
    })
    setNewName('')
    setNewEmail('')
    setIsAddOpen(false)
  }

  const getInitials = (contact: ContactItem) => {
    if (contact.initials) return contact.initials
    return contact.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
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

      {/* Search Input */}
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

      {/* Contact Cards List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredContacts.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No contacts found matching your search.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 p-3 hover:border-border transition-all duration-150 shadow-2xs"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/50 dark:border-blue-900/40">
                  {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={contact.name} />}
                  <AvatarFallback className="bg-transparent text-xs">
                    {getInitials(contact)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground tracking-tight">
                    {contact.name}
                  </h4>
                  <p className="truncate text-xs text-muted-foreground">{contact.email}</p>
                </div>
              </div>

              {/* Right Action Icons & Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Chat Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onChatClick?.(contact)}
                  className="h-8 w-8 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg"
                  title="Open Chat"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>

                {/* Status Toggle */}
                <Switch
                  checked={contact.isEnabled !== false}
                  onCheckedChange={(checked) => onToggleStatus?.(contact, checked)}
                  className="data-[state=checked]:bg-slate-800 dark:data-[state=checked]:bg-slate-200"
                />

                {/* Edit Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditClick?.(contact)}
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                  title="Edit Contact"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>

                {/* Delete Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick?.(contact)}
                  className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="Delete Contact"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Contact Button */}
      <Button
        onClick={() => setIsAddOpen(true)}
        className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-transform active:scale-[0.99] gap-1.5"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Contact</span>
      </Button>

      {/* Add Contact Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter contact details to start messaging directly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Name (Optional)</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Aman"
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email Address *</label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. aman@example.com"
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
                Save Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
