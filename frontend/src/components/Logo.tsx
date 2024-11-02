import { useTheme } from '@/hooks/useTheme.ts'

export const Logo = () => {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/logo_dark.svg' : '/logo_light.svg'
  return <img className="w-24" src={src} alt="Kir-Pay" />
}
