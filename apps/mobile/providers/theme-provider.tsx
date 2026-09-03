import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Platform, useColorScheme, View } from 'react-native'
import { vars } from 'nativewind'
import {
  colorThemes,
  findTheme,
  getResolvedThemeColors,
  nativeThemeVariables,
  type ColorThemeDefinition,
  type ThemeColors,
} from '@amoga/theme'
import { universalStorage } from '@/lib/storage'

export type AppearanceMode = 'system' | 'light' | 'dark'

const THEME_NAME_KEY = 'amoga_color_theme'
const THEME_MODE_KEY = 'amoga_theme_mode'
export const DEFAULT_COLOR_THEME = 'zinc'
export const DEFAULT_APPEARANCE_MODE: AppearanceMode = 'light'

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

      const rawTokens =
        resolvedMode === 'dark'
          ? currentTheme.tokens.dark
          : currentTheme.tokens.light

      for (const [prop, val] of Object.entries(rawTokens)) {
        root.style.setProperty(prop, val)
      }
    }
  }, [currentTheme, resolvedMode])

  const nativeVarsStyle = useMemo(
    () => vars(nativeThemeVariables(currentTheme, resolvedMode) as any),
    [currentTheme, resolvedMode]
  )

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
        style={[{ flex: 1, backgroundColor: colors.background }, nativeVarsStyle]}
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
