'use client'

import React, { useState, useRef } from 'react'
import { useEmailSettingsStore } from '../store'
import { AuthProviderConfig } from '../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Lock,
  KeyRound,
  User,
  Globe,
  Upload,
  Eye,
  EyeOff,
  ImageIcon,
} from 'lucide-react'

const PRESET_PROVIDERS = [
  { name: 'Google', url: 'https://accounts.google.com' },
  { name: 'GitHub', url: 'https://github.com/login/oauth/authorize' },
  { name: 'Discord', url: 'https://discord.com/api/oauth2/authorize' },
  { name: 'Auth0', url: 'https://your-tenant.auth0.com' },
  { name: 'Apple', url: 'https://appleid.apple.com/auth/authorize' },
  { name: 'Microsoft Entra ID', url: 'https://login.microsoftonline.com/common' },
  { name: 'GitLab', url: 'https://gitlab.com/oauth/authorize' },
  { name: 'Twitter / X', url: 'https://twitter.com/i/oauth2/authorize' },
  { name: 'Slack', url: 'https://slack.com/oauth/v2/authorize' },
  { name: 'Credentials', url: '/api/auth/callback/credentials' },
  { name: 'Custom OAuth', url: '' },
]

export function AuthTab() {
  const { config, addAuthProvider, updateAuthProvider, removeAuthProvider } = useEmailSettingsStore()
  const authProviders = config.authProviders || []

  const [editingProviderId, setEditingProviderId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const openAddModal = () => {
    setShowSecret(false)
    setShowPassword(false)
    setEditingProviderId('new')
    setEditFormData({
      name: 'Google',
      type: 'oauth',
      iconUrl: '',
      providerUrl: 'https://accounts.google.com',
      clientId: '',
      clientSecret: '',
      username: '',
      password: '',
      isEnabled: true,
    })
  }

  const openEditModal = (provider: AuthProviderConfig) => {
    setShowSecret(false)
    setShowPassword(false)
    setEditingProviderId(provider.id)
    setEditFormData({ ...provider })
  }

  const closeEditModal = () => {
    setEditingProviderId(null)
    setEditFormData(null)
  }

  const handlePresetSelect = (presetName: string) => {
    const preset = PRESET_PROVIDERS.find((p) => p.name === presetName)
    setEditFormData((prev: any) => ({
      ...prev,
      name: presetName,
      providerUrl: preset?.url || prev?.providerUrl || '',
      type: presetName.toLowerCase() === 'credentials' ? 'credentials' : 'oauth',
    }))
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller icon.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditFormData((prev: any) => ({
            ...prev,
            iconUrl: reader.result as string,
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeIcon = () => {
    setEditFormData((prev: any) => ({
      ...prev,
      iconUrl: '',
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const saveEdit = () => {
    if (editingProviderId && editFormData) {
      const sanitizedData = {
        ...editFormData,
        name: editFormData.name?.trim() || 'Custom Provider',
        providerUrl: editFormData.providerUrl?.trim() || '',
        clientId: editFormData.clientId?.trim() || '',
        clientSecret: editFormData.clientSecret?.trim() || '',
        username: editFormData.username?.trim() || '',
        password: editFormData.password?.trim() || '',
        isEnabled: editFormData.isEnabled ?? true,
      }
      if (editingProviderId === 'new') {
        addAuthProvider(sanitizedData)
      } else {
        updateAuthProvider(editingProviderId, sanitizedData)
      }
      closeEditModal()
    }
  }

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const maskSecret = (secret: string) => {
    if (!secret) return 'No Secret'
    if (secret.length <= 8) return '••••••••'
    return `${secret.slice(0, 4)}••••${secret.slice(-3)}`
  }

  return (
    <Card className="border-muted bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-500" />
            Auth Provider Manager
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Configure NextAuth authentication providers (Google, GitHub, Custom OAuth, Credentials) with active/inactive toggles
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-4">
        {authProviders.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/10">
            <p className="text-muted-foreground mb-4 text-sm">No Auth providers added yet.</p>
            <Button
              onClick={openAddModal}
              variant="outline"
              className="gap-1 border-sky-500/30 text-sky-400 hover:bg-sky-500/10 text-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add your first Auth provider
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {authProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`border rounded-xl bg-background/50 overflow-hidden transition-all duration-200 shadow-sm ${
                    provider.isEnabled ? 'border-muted' : 'border-muted-foreground/20 opacity-60'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between p-3 gap-2 bg-muted/10">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 flex items-center justify-center shrink-0 rounded-lg bg-sky-500/10 border border-sky-500/20 overflow-hidden">
                        {provider.iconUrl ? (
                          <img
                            src={provider.iconUrl}
                            alt={provider.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <ShieldCheck className="h-5 w-5 text-sky-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{provider.name}</p>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider ${
                              provider.isEnabled
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {provider.isEnabled ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[340px]">
                          {provider.providerUrl || 'Default URL'} &nbsp;•&nbsp; Keys •{' '}
                          {provider.clientId ? `${provider.clientId.slice(0, 10)}...` : 'Not set'} &nbsp;•&nbsp; Secret •{' '}
                          {maskSecret(provider.clientSecret || '')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Enable/Disable Toggle */}
                      <Switch
                        checked={provider.isEnabled}
                        onCheckedChange={(checked) =>
                          updateAuthProvider(provider.id, { isEnabled: checked })
                        }
                        title={provider.isEnabled ? 'Deactivate Provider' : 'Activate Provider'}
                        className="scale-90"
                      />

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 shrink-0 cursor-pointer"
                        onClick={() => openEditModal(provider)}
                        title="Edit Provider"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0 cursor-pointer"
                        onClick={() => removeAuthProvider(provider.id)}
                        title="Delete Provider"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Auth Provider button */}
            <div className="pt-1">
              <Button
                onClick={openAddModal}
                size="sm"
                className="w-full gap-1 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Auth Provider
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {/* Edit/Add Modal/Dialog */}
      <Dialog open={!!editingProviderId} onOpenChange={(open) => !open && closeEditModal()}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-500" />
              {editingProviderId === 'new' ? 'Add Auth Provider' : 'Edit Auth Provider'}
            </DialogTitle>
            <DialogDescription>
              Configure any NextAuth-supported provider (Google, GitHub, Discord, Auth0, Credentials) with custom keys and icon.
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <div className="space-y-5 py-2">
              {/* Provider Selection & Name */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Preset Provider</Label>
                    <Select
                      value={
                        PRESET_PROVIDERS.some((p) => p.name === editFormData.name)
                          ? editFormData.name
                          : 'Custom OAuth'
                      }
                      onValueChange={handlePresetSelect}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select provider preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRESET_PROVIDERS.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Provider Name *</Label>
                    <Input
                      placeholder="e.g. Google, Corporate SSO"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditFieldChange('name', e.target.value)}
                      className="bg-background/80 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Icon Upload Field */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Provider Icon (File Upload to show on Signup & Login)
                  </Label>
                  <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/10">
                    <div className="h-12 w-12 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center bg-background shrink-0 overflow-hidden">
                      {editFormData.iconUrl ? (
                        <img
                          src={editFormData.iconUrl}
                          alt="Provider icon"
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={handleIconUpload}
                        className="hidden"
                        id="provider-icon-upload"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs gap-1 h-8 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Choose Icon File
                        </Button>
                        {editFormData.iconUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeIcon}
                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 cursor-pointer"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        PNG, SVG, or JPG (max 2MB). Shown on login & signup buttons.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Provider URL */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    Provider URL / Issuer / Auth Endpoint
                  </Label>
                  <Input
                    placeholder="https://accounts.google.com or https://your-domain.auth0.com"
                    value={editFormData.providerUrl || ''}
                    onChange={(e) => handleEditFieldChange('providerUrl', e.target.value)}
                    className="bg-background/80 h-9 text-sm font-mono text-xs"
                  />
                </div>

                {/* Keys & Secret */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keys / Client ID */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                      Keys (Client ID / Key)
                    </Label>
                    <Input
                      placeholder="e.g. 419125420251-8jd9315...apps.googleusercontent.com"
                      value={editFormData.clientId || ''}
                      onChange={(e) => handleEditFieldChange('clientId', e.target.value)}
                      className="bg-background/80 h-9 text-sm font-mono text-xs"
                    />
                  </div>

                  {/* Secret / Client Secret */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Secret (Client Secret)
                    </Label>
                    <div className="relative">
                      <Input
                        type={showSecret ? 'text' : 'password'}
                        placeholder="GOCSPX--8WJDZo86RlPyLAwMI..."
                        value={editFormData.clientSecret || ''}
                        onChange={(e) => handleEditFieldChange('clientSecret', e.target.value)}
                        className="bg-background/80 h-9 text-sm font-mono text-xs pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Credentials Provider Fields (Username & Password) */}
                <div className="p-3 border rounded-lg bg-muted/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      Credentials Provider / Service Auth (Optional)
                    </p>
                    <span className="text-[10px] text-muted-foreground">For custom user/password auth</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold">User Name</Label>
                      <Input
                        placeholder="admin or test@example.com"
                        value={editFormData.username || ''}
                        onChange={(e) => handleEditFieldChange('username', e.target.value)}
                        className="bg-background h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={editFormData.password || ''}
                          onChange={(e) => handleEditFieldChange('password', e.target.value)}
                          className="bg-background h-8 text-xs pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">Status (Active / Inactive)</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Enable to show this provider on login and sign-up pages.
                    </p>
                  </div>
                  <Switch
                    checked={editFormData.isEnabled ?? true}
                    onCheckedChange={(checked) => handleEditFieldChange('isEnabled', checked)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={closeEditModal}
                  className="gap-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  disabled={!editFormData.name?.trim()}
                  className="gap-1 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {editingProviderId === 'new' ? 'Add Provider' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
