import { createContext, useContext } from 'react'

export const ThemeContext = createContext<ThemeData>({
  theme: 'dark',
  setTheme: () => {}
})

export type Theme = 'light' | 'dark'
export type ThemeData = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = () => useContext(ThemeContext)
