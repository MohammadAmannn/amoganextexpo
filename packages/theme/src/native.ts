import { formatHex, formatHex8, parse } from 'culori'
import type { ColorThemeDefinition } from './color-themes'

const fallback = '#000000'

export function toHex(value: string): string {
  if (!value) return fallback
  if (value.startsWith('#')) return value
  if (value.startsWith('var(')) return value
  try {
    const parsed = parse(value)
    if (!parsed) return value.startsWith('#') ? value : fallback
    const alpha =
      'alpha' in parsed && typeof parsed.alpha === 'number' && parsed.alpha < 1
    return (alpha ? formatHex8(parsed) : formatHex(parsed)) ?? fallback
  } catch {
    return fallback
  }
}

export function resolveVars(tokens: Record<string, string>) {
  const out: Record<string, string> = { ...tokens }
  for (let pass = 0; pass < 4; pass++) {
    for (const [key, value] of Object.entries(out)) {
      const match = value.match(/^var\((--[^)]+)\)$/)
      if (match && out[match[1]]) out[key] = out[match[1]]
    }
  }
  return out
}

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

export function nativeThemeVariables(
  theme: ColorThemeDefinition,
  mode: 'light' | 'dark'
): Record<string, string> {
  const resolved = resolveVars(theme.tokens[mode])
  return Object.fromEntries(
    Object.entries(resolved).map(([key, value]) => [key, toHex(value)])
  )
}

export function getResolvedThemeColors(
  theme: ColorThemeDefinition,
  mode: 'light' | 'dark'
): ThemeColors {
  const vars = nativeThemeVariables(theme, mode)
  const isDark = mode === 'dark'

  const bg = vars['--background'] || (isDark ? '#09090b' : '#ffffff')
  const fg = vars['--foreground'] || (isDark ? '#fafafa' : '#09090b')
  const card = vars['--card'] || (isDark ? '#18181b' : '#ffffff')
  const cardFg = vars['--card-foreground'] || fg
  const primary = vars['--primary'] || (isDark ? '#a855f7' : '#7c3aed')
  const primaryFg = vars['--primary-foreground'] || (isDark ? '#09090b' : '#ffffff')
  const secondary = vars['--secondary'] || (isDark ? '#27272a' : '#f4f4f5')
  const secondaryFg = vars['--secondary-foreground'] || fg
  const muted = vars['--muted'] || (isDark ? '#27272a' : '#f4f4f5')
  const mutedFg = vars['--muted-foreground'] || (isDark ? '#a1a1aa' : '#71717a')
  const accent = vars['--accent'] || (isDark ? '#27272a' : '#f4f4f5')
  const accentFg = vars['--accent-foreground'] || fg
  const destructive = vars['--destructive'] || '#ef4444'
  const destructiveFg = vars['--destructive-foreground'] || '#ffffff'
  const border = vars['--border'] || (isDark ? '#27272a' : '#e4e4e7')
  const input = vars['--input'] || border
  const ring = vars['--ring'] || primary

  return {
    background: bg,
    foreground: fg,
    card,
    cardForeground: cardFg,
    popover: vars['--popover'] || card,
    popoverForeground: vars['--popover-foreground'] || cardFg,
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
    sidebar: vars['--sidebar'] || bg,
    sidebarForeground: vars['--sidebar-foreground'] || fg,
    sidebarPrimary: vars['--sidebar-primary'] || primary,
    sidebarPrimaryForeground: vars['--sidebar-primary-foreground'] || primaryFg,
    sidebarAccent: vars['--sidebar-accent'] || accent,
    sidebarAccentForeground: vars['--sidebar-accent-foreground'] || accentFg,
    sidebarBorder: vars['--sidebar-border'] || border,
    sidebarRing: vars['--sidebar-ring'] || ring,
    chart1: vars['--chart-1'] || '#4f46e5',
    chart2: vars['--chart-2'] || '#06b6d4',
    chart3: vars['--chart-3'] || '#10b981',
    chart4: vars['--chart-4'] || '#f59e0b',
    chart5: vars['--chart-5'] || '#ef4444',
  }
}

export function findTheme(
  themes: ColorThemeDefinition[],
  name: string
): ColorThemeDefinition {
  return themes.find((theme) => theme.name === name) ?? themes[0]
}
