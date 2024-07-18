import { FC, PropsWithChildren, useEffect } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { app } from '@/lib/api.ts'
import { NoPermissionBanner } from '@/components/NoPermissionBanner.tsx'
import { useQuery, useQueryClient } from 'react-query'
import { AppContext } from '@/hooks/useAppContext'

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [, gatewayName, gatewayCode] = window.location.pathname.split('/')
  const appQuery = useQuery(['app', gatewayName, gatewayCode], () => app({ gatewayName, gatewayCode }), {
    enabled: !!gatewayName && !!gatewayCode,
    select: (data) => {
      if (!data) return
      const items = data.items

      // first sort by names
      items.sort((a, b) => a.name.localeCompare(b.name))

      // then put out of stock items at the bottom (Array.prototype.sort is stable)
      items.sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0))
      return {
        gatewayCode,
        gatewayName,
        items,
        uploader: data.uploader
      }
    }
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    const interval = setInterval(() => queryClient.invalidateQueries('app'), 10000)
    return () => clearInterval(interval)
  }, [queryClient])

  if (appQuery.isLoading) {
    return (
      <div className="flex w-full h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!appQuery.data) {
    return <NoPermissionBanner />
  }

  return <AppContext.Provider value={appQuery.data}>{children}</AppContext.Provider>
}
