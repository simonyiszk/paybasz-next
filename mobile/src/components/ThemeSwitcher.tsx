import { useTheme } from '@/hooks/useTheme.ts'
import { Button } from '@/components/ui/button.tsx'
import { Moon, Sun } from 'lucide-react'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Button className="absolute right-0 top-0" variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
