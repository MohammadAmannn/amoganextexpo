import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Platform, useColorScheme, View } from 'react-native'
import {
  colorThemes,
  findTheme,
  type ColorThemeDefinition,
} from '@amoga/theme'
import { universalStorage } from '@/lib/storage'

export type AppearanceMode = 'system' | 'light' | 'dark'

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

const THEME_NAME_KEY = 'amoga_color_theme'
const THEME_MODE_KEY = 'amoga_theme_mode'
export const DEFAULT_COLOR_THEME = 'zinc'
export const DEFAULT_APPEARANCE_MODE: AppearanceMode = 'light'

// Safe self-contained helper to extract theme colors
export function getResolvedThemeColors(
  theme: ColorThemeDefinition | undefined,
  mode: 'light' | 'dark'
): ThemeColors {
  const isDark = mode === 'dark'
  const currentTheme = theme || colorThemes[0]
  
  // Clean valid hex primary color
  let primaryHex = currentTheme?.preview || (isDark ? '#a855f7' : '#7c3aed')
  if (!primaryHex.startsWith('#')) {
    primaryHex = currentTheme?.colors?.[0] || (isDark ? '#a855f7' : '#18181b')
  }

  // Zinc theme primary in light mode is dark slate #18181b, in dark mode #fafafa
  if (currentTheme?.name === 'zinc') {
    primaryHex = isDark ? '#fafafa' : '#18181b'
  }

  const bg = isDark ? '#09090b' : '#ffffff'
  const fg = isDark ? '#fafafa' : '#09090b'
  const card = isDark ? '#18181b' : '#ffffff'
  const cardFg = fg
  const primary = primaryHex
  // Contrast foreground for primary elements (e.g. badges, logo box)
  const primaryFg = (primaryHex === '#fafafa' || primaryHex === '#ffffff') ? '#09090b' : '#ffffff'
  const secondary = isDark ? '#27272a' : '#f4f4f5'
  const secondaryFg = fg
  const muted = isDark ? '#27272a' : '#f4f4f5'
  const mutedFg = isDark ? '#a1a1aa' : '#71717a'
  const accent = isDark ? '#27272a' : '#f4f4f5'
  const accentFg = fg
  const destructive = '#ef4444'
  const destructiveFg = '#ffffff'
  const border = isDark ? '#27272a' : '#e4e4e7'
  const input = border
  const ring = primary

  return {
    background: bg,
    foreground: fg,
    card,
    cardForeground: cardFg,
    popover: card,
    popoverForeground: cardFg,
    primary,
    primaryForeground: primaryFg,
    secondary,
    secondaryForeground: secondaryFg,
    muted,
    mutedForeground: mutedFg,
    accent,
    accentForeground: accentFg,
    destructive,
    destructiveForeground: destructiveFg,
    border,
    input,
    ring,
    sidebar: isDark ? '#09090b' : '#ffffff',
    sidebarForeground: fg,
    sidebarPrimary: primary,
    sidebarPrimaryForeground: primaryFg,
    sidebarAccent: secondary,
    sidebarAccentForeground: fg,
    sidebarBorder: border,
    sidebarRing: ring,
    chart1: currentTheme?.colors?.[0] || '#4f46e5',
    chart2: currentTheme?.colors?.[1] || '#06b6d4',
    chart3: currentTheme?.colors?.[2] || '#10b981',
    chart4: currentTheme?.colors?.[3] || '#f59e0b',
    chart5: currentTheme?.colors?.[4] || '#ef4444',
  }
}

interface ThemeContextType {
  themeName: string
  appearanceMode: AppearanceMode
  resolvedMode: 'light' | 'dark'
  currentTheme: ColorThemeDefinition
  colors: ThemeColors
  setThemeName: (name: string) => void
  setAppearanceMode: (mode: AppearanceMode) => void
  resetTheme: () => void
  isThemeDrawerOpen: boolean
  openThemeDrawer: () => void
  closeThemeDrawer: () => void
  allThemes: ColorThemeDefinition[]
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [themeName, setThemeNameState] = useState<string>(DEFAULT_COLOR_THEME)
  const [appearanceMode, setAppearanceModeState] =
    useState<AppearanceMode>(DEFAULT_APPEARANCE_MODE)
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    universalStorage.getItem(THEME_NAME_KEY).then((savedTheme) => {
      if (savedTheme) setThemeNameState(savedTheme)
    })
    universalStorage.getItem(THEME_MODE_KEY).then((savedMode) => {
      if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
        setAppearanceModeState(savedMode as AppearanceMode)
      }
    })
  }, [])

  const setThemeName = useCallback((name: string) => {
    setThemeNameState(name)
    universalStorage.setItem(THEME_NAME_KEY, name)
  }, [])

  const setAppearanceMode = useCallback((mode: AppearanceMode) => {
    setAppearanceModeState(mode)
    universalStorage.setItem(THEME_MODE_KEY, mode)
  }, [])

  const resetTheme = useCallback(() => {
    setThemeNameState(DEFAULT_COLOR_THEME)
    setAppearanceModeState(DEFAULT_APPEARANCE_MODE)
    universalStorage.removeItem(THEME_NAME_KEY)
    universalStorage.removeItem(THEME_MODE_KEY)
  }, [])

  const openThemeDrawer = useCallback(() => setIsThemeDrawerOpen(true), [])
  const closeThemeDrawer = useCallback(() => setIsThemeDrawerOpen(false), [])

  // Determine actual resolved mode ('light' | 'dark')
  const resolvedMode: 'light' | 'dark' = useMemo(() => {
    if (appearanceMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light'
    }
    return appearanceMode
  }, [appearanceMode, systemColorScheme])

  const currentTheme = useMemo(
    () => findTheme(colorThemes, themeName),
    [themeName]
  )

  const colors = useMemo(
    () => getResolvedThemeColors(currentTheme, resolvedMode),
    [currentTheme, resolvedMode]
  )

  // Web CSS variables & class injection
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement
      if (resolvedMode === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      if (currentTheme?.tokens) {
        const rawTokens =
          resolvedMode === 'dark'
            ? currentTheme.tokens.dark
            : currentTheme.tokens.light

        for (const [prop, val] of Object.entries(rawTokens)) {
          root.style.setProperty(prop, val)
        }
      }
    }
  }, [currentTheme, resolvedMode])

  const contextValue = useMemo(
    () => ({
      themeName,
      appearanceMode,
      resolvedMode,
      currentTheme,
      colors,
      setThemeName,
      setAppearanceMode,
      resetTheme,
      isThemeDrawerOpen,
      openThemeDrawer,
      closeThemeDrawer,
      allThemes: colorThemes,
    }),
    [
      themeName,
      appearanceMode,
      resolvedMode,
      currentTheme,
      colors,
      setThemeName,
      setAppearanceMode,
      resetTheme,
      isThemeDrawerOpen,
      openThemeDrawer,
      closeThemeDrawer,
    ]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <View
        style={{ flex: 1, backgroundColor: colors.background }}
        className={resolvedMode === 'dark' ? 'dark flex-1' : 'flex-1'}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const useAmogaTheme = useTheme
