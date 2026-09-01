'use client'

import React, { useState, useEffect } from 'react'
import { useEmailSettingsStore } from '../store'
import { AuthProviderConfig } from '../types'
import { Mail, LogIn, UserPlus, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
import { colorThemes } from '@/context/color-theme-provider'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/design-system/components/business/password-input'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord, FaApple, FaSlack, FaTwitter } from 'react-icons/fa'

interface PhonePreviewProps {
  compact?: boolean
  activeSettingsTab?: string
}

export function PhonePreview({ compact = false, activeSettingsTab }: PhonePreviewProps) {
  const { config } = useEmailSettingsStore()
  const { profile, accounts, theme, authProviders = [] } = config
  const { resolvedTheme } = useTheme()

  const isAuthTab = activeSettingsTab === 'auth'
  const [viewMode, setViewMode] = useState<'login' | 'signup' | 'profile'>(
    isAuthTab ? 'login' : 'profile'
  )

  // Automatically switch view mode when active tab in settings changes
  useEffect(() => {
    if (activeSettingsTab === 'auth') {
      setViewMode('login')
    } else if (activeSettingsTab === 'profile' || activeSettingsTab === 'links') {
      setViewMode('profile')
    }
  }, [activeSettingsTab])

  // Determine whether preview should be dark or light
  let isDark = resolvedTheme === 'dark'
  if (theme.appTheme === 'dark') isDark = true
  if (theme.appTheme === 'light') isDark = false

  // Load custom color theme CSS variables to override locally inside the mockup
  const colorThemeName = theme.appColorTheme || 'zinc'
  const colorThemeObj = colorThemes.find((t) => t.name === colorThemeName) || colorThemes[0]
  const tokens = isDark ? colorThemeObj.tokens.dark : colorThemeObj.tokens.light

  const styleObj: React.CSSProperties = {}
  for (const [prop, value] of Object.entries(tokens)) {
    ;(styleObj as any)[prop] = value
  }

  // Active auth providers configured in Auth tab
  const activeProviders = authProviders.filter((p) => p.isEnabled)

  // Get initials for profile picture fallback
  const getInitials = (fullName: string) => {
    return (
      fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?'
    )
  }

  const enabledAccounts = accounts.filter((acc) => acc.isEnabled)

  const shellWidth = compact ? 'w-[270px]' : 'w-[300px]'
  const shellHeight = compact ? 'h-[540px]' : 'h-[600px]'

  const renderProviderIcon = (provider: AuthProviderConfig) => {
    if (provider.iconUrl) {
      return (
        <img
          src={provider.iconUrl}
          alt={provider.name}
          className="h-4 w-4 object-contain shrink-0 rounded-xs"
        />
      )
    }
    const lower = provider.name.toLowerCase()
    if (lower.includes('google')) return <FcGoogle className="h-4 w-4 shrink-0" />
    if (lower.includes('github')) return <FaGithub className="h-4 w-4 shrink-0" />
    if (lower.includes('discord')) return <FaDiscord className="h-4 w-4 shrink-0 text-[#5865F2]" />
    if (lower.includes('apple')) return <FaApple className="h-4 w-4 shrink-0" />
    if (lower.includes('slack')) return <FaSlack className="h-4 w-4 shrink-0" />
    if (lower.includes('twitter') || lower.includes('x'))
      return <FaTwitter className="h-4 w-4 shrink-0 text-[#1DA1F2]" />
    return <ShieldCheck className="h-4 w-4 shrink-0 text-sky-500" />
  }

  return (
    <div className={`flex flex-col items-center w-full shrink-0 ${compact ? 'py-1' : 'py-2'}`}>
      {/* View Mode Switcher: Strictly Sign In and Sign Up for Auth App Settings */}
      {isAuthTab && (
        <div className="flex items-center p-1 mb-2.5 bg-muted/60 backdrop-blur-md rounded-xl border border-border/70 text-xs gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('login')}
            className={cn(
              'px-4 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer',
              viewMode === 'login'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setViewMode('signup')}
            className={cn(
              'px-4 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer',
              viewMode === 'signup'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Sign Up
          </button>
        </div>
      )}


      {/* iPhone Shell */}
      <div
        className={`relative ${shellWidth} ${shellHeight} rounded-[40px] border-[8px] border-slate-900 bg-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col shrink-0 ring-1 ring-slate-800`}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 mr-8" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
        </div>

        {/* Live Preview Content Canvas */}
        <div
          style={styleObj}
          className={cn(
            'flex-grow w-full h-full overflow-y-auto no-scrollbar flex flex-col p-4 pt-12 pb-5 select-none relative bg-background text-foreground transition-colors duration-300',
            isDark ? 'dark' : ''
          )}
        >
          {/* VIEW: LOGIN FORM */}
          {viewMode === 'login' && (
            <div className="w-full flex flex-col justify-center space-y-3 py-1">
              <div className="space-y-1 text-center">
                <h3 className="text-base font-bold tracking-tight text-foreground">Sign in</h3>
                <p className="text-[11px] text-muted-foreground">
                  Enter your credentials below to log into your account.
                </p>
              </div>

              <div className="space-y-2.5 text-left pt-1">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Email</Label>
                  <Input
                    placeholder="name@example.com"
                    defaultValue="user@gmail.com"
                    className="h-8 text-xs bg-background/80"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold">Password</Label>
                    <span className="text-[10px] text-muted-foreground hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <PasswordInput
                    placeholder="••••••••"
                    defaultValue="secret123"
                    className="h-8 text-xs bg-background/80"
                  />
                </div>

                <Button className="w-full h-8 text-xs font-semibold gap-1.5 mt-1 cursor-pointer">
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in
                </Button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Dynamic Auth Providers configured in Settings */}
                <div className="space-y-1.5">
                  {activeProviders.length > 0 ? (
                    activeProviders.map((provider) => (
                      <Button
                        key={provider.id}
                        variant="outline"
                        type="button"
                        className="w-full h-8 text-xs justify-center gap-2 border-border/80 shadow-none hover:bg-muted/40 font-medium cursor-pointer"
                      >
                        {renderProviderIcon(provider)}
                        <span className="truncate">Continue with {provider.name}</span>
                      </Button>
                    ))
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full h-8 text-xs justify-center gap-2 border-border/80 shadow-none hover:bg-muted/40 font-medium cursor-pointer"
                    >
                      <FcGoogle className="h-4 w-4 shrink-0" />
                      <span>Continue with Google</span>
                    </Button>
                  )}
                </div>

                {/* Switch to Sign Up */}
                <p className="text-center text-[11px] text-muted-foreground pt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setViewMode('signup')}
                    className="font-semibold text-foreground underline hover:text-primary cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW: SIGN UP FORM */}
          {viewMode === 'signup' && (
            <div className="w-full flex flex-col justify-center space-y-2.5 py-1">
              <div className="space-y-0.5 text-center">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Create an account
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>

              <div className="space-y-2 text-left pt-1">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Email</Label>
                  <Input
                    placeholder="name@example.com"
                    defaultValue="user@gmail.com"
                    className="h-7.5 text-xs bg-background/80"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Password</Label>
                  <PasswordInput
                    placeholder="••••••••"
                    defaultValue="secret123"
                    className="h-7.5 text-xs bg-background/80"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Confirm Password</Label>
                  <PasswordInput
                    placeholder="••••••••"
                    defaultValue="secret123"
                    className="h-7.5 text-xs bg-background/80"
                  />
                </div>

                <Button className="w-full h-8 text-xs font-semibold gap-1.5 mt-1 cursor-pointer">
                  <UserPlus className="h-3.5 w-3.5" />
                  Create Account
                </Button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Dynamic Auth Providers */}
                <div className="space-y-1.5">
                  {activeProviders.length > 0 ? (
                    activeProviders.map((provider) => (
                      <Button
                        key={provider.id}
                        variant="outline"
                        type="button"
                        className="w-full h-8 text-xs justify-center gap-2 border-border/80 shadow-none hover:bg-muted/40 font-medium cursor-pointer"
                      >
                        {renderProviderIcon(provider)}
                        <span className="truncate">Continue with {provider.name}</span>
                      </Button>
                    ))
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full h-8 text-xs justify-center gap-2 border-border/80 shadow-none hover:bg-muted/40 font-medium cursor-pointer"
                    >
                      <FcGoogle className="h-4 w-4 shrink-0" />
                      <span>Continue with Google</span>
                    </Button>
                  )}
                </div>

                {/* Switch to Sign In */}
                <p className="text-center text-[11px] text-muted-foreground pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="font-semibold text-foreground underline hover:text-primary cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>

                <p className="text-[10px] text-center text-muted-foreground leading-tight pt-1">
                  By clicking continue, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {viewMode === 'profile' && (
            <div className="w-full flex flex-col items-center pt-3">
              {/* Avatar Picture */}
              <div className="w-18 h-18 rounded-full border-2 border-white/20 shadow-md overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white font-black text-xl mb-3">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span>{getInitials(profile.name)}</span>
                )}
              </div>

              {/* User Profile Title & Bio */}
              <h3 className="text-base font-bold text-center w-full mb-1 shrink-0 truncate text-foreground">
                {profile.name || 'Your Name'}
              </h3>

              <p className="text-xs text-center w-full max-h-16 overflow-y-auto no-scrollbar shrink-0 mb-6 leading-relaxed px-1 text-muted-foreground">
                {profile.bio || 'Add a bio to tell users who you are.'}
              </p>

              {/* Connected Email Accounts list rendering */}
              <div className="w-full flex-grow flex flex-col gap-3 mb-4 overflow-y-auto no-scrollbar">
                {enabledAccounts.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-xl bg-card text-xs text-muted-foreground">
                    No active email accounts
                  </div>
                ) : (
                  enabledAccounts.map((account) => {
                    return (
                      <div
                        key={account.id}
                        className="w-full py-3 px-4 flex items-center justify-center relative text-xs font-bold text-center select-none bg-primary text-primary-foreground shadow-sm rounded-xl"
                      >
                        <Mail className="h-4 w-4 absolute left-4 shrink-0" />
                        <span className="truncate max-w-[80%]">{account.email}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <p className="text-[10px] text-muted-foreground mt-3 text-center max-w-[240px]">
          Interactive Live Simulation frame. Real-time changes from Auth & Profile tabs reflect dynamically.
        </p>
      )}
    </div>
  )
}
