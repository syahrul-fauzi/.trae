import React, { createContext, useContext } from 'react'
import { colors as baseColors, radius as baseRadius, spacing as baseSpacing } from './tokens'

export type Tokens = {
  colors: typeof baseColors
  radius: typeof baseRadius
  spacing: typeof baseSpacing
}

const defaultTokens: Tokens = {
  colors: baseColors,
  radius: baseRadius,
  spacing: baseSpacing,
}

const ThemeContext = createContext<Tokens>(defaultTokens)

export function ThemeProvider({ tokens = defaultTokens, children }: { tokens?: Tokens; children: React.ReactNode }) {
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
}

export function useThemeTokens() {
  return useContext(ThemeContext)
}
