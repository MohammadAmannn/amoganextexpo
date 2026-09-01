import { formatHex, formatHex8, parse } from 'culori'
import type { ColorThemeDefinition, ColorThemeTokens } from './color-themes'

const fallback = '#000000'

function toHex(value: string): string {
  if (value.startsWith('var(')) return value
  const parsed = parse(value)
  if (!parsed) return value.startsWith('#') ? value : fallback
  const alpha = 'alpha' in parsed && typeof parsed.alpha === 'number' && parsed.alpha < 1
  return (alpha ? formatHex8(parsed) : formatHex(parsed)) ?? fallback
}

function resolveVars(tokens: Record<string, string>) {
  const out: Record<string, string> = { ...tokens }
  for (let pass = 0; pass < 4; pass++) {
    for (const [key, value] of Object.entries(out)) {
      const match = value.match(/^var\((--[^)]+)\)$/)
      if (match && out[match[1]]) out[key] = out[match[1]]
    }
  }
  return out
}

export function nativeThemeVariables(theme: ColorThemeDefinition, mode: 'light' | 'dark') {
  const resolved = resolveVars(theme.tokens[mode])
  return Object.fromEntries(Object.entries(resolved).map(([key, value]) => [key, toHex(value)]))
}

export function findTheme(themes: ColorThemeDefinition[], name: string) {
  return themes.find((theme) => theme.name === name) ?? themes[0]
}
