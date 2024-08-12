import { useTheme } from '@/hooks/useTheme.ts'

export const Logo = () => {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/logo_dark.png' : '/logo_light.png'
  return <img className="w-24" src={src} alt="PayBasz" />
}
