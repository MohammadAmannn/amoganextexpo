import { createContext, useContext, useMemo, useState } from 'react'
import { View } from 'react-native'
import { vars } from 'nativewind'
import { colorThemes, findTheme, nativeThemeVariables } from '@amoga/theme'

const ThemeContext = createContext({ themeName: 'zinc', mode: 'light' as 'light'|'dark', setThemeName: (_: string) => {}, toggleMode: () => {} })
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState('zinc')
  const [mode, setMode] = useState<'light'|'dark'>('light')
  const theme = findTheme(colorThemes, themeName)
  const style = useMemo(() => vars(nativeThemeVariables(theme!, mode) as any), [theme, mode])
  return (
    <ThemeContext.Provider
      value={{
        themeName,
        mode,
        setThemeName,
        toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
      }}
    >
      <View style={[{ flex: 1 }, style]} className={mode === 'dark' ? 'dark flex-1' : 'flex-1'}>
        {children}
      </View>
    </ThemeContext.Provider>
  )
}
export const useAmogaTheme = () => useContext(ThemeContext)
