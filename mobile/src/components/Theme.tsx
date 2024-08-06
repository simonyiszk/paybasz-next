import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { Theme, ThemeContext } from '@/hooks/useTheme.ts'

const ThemeKey = 'theme'

const getTheme = () => (localStorage.getItem(ThemeKey) == 'dark' ? 'dark' : 'light')
const saveTheme = (value: Theme) => localStorage.setItem(ThemeKey, value)

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getTheme())

  useEffect(() => {
    const oldTheme = theme == 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove(oldTheme)
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme) => {
          saveTheme(theme)
          setTheme(theme)
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
