import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { app } from '@/lib/api.ts'
import { NoPermissionBanner } from '@/components/NoPermissionBanner.tsx'
import { Item } from '@/lib/model.ts'
import { useQuery } from 'react-query'

const AppContext = createContext<AppData>({} as AppData)

export type AppData = {
  uploader: boolean
  gatewayName: string
  gatewayCode: string
  items: Item[]
}

export const useAppContext = (): AppData => useContext(AppContext)
export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [, gatewayName, gatewayCode] = window.location.pathname.split('/')
  const appQuery = useQuery(['app', gatewayName, gatewayCode], () => app({ gatewayName, gatewayCode }), {
    enabled: !!gatewayName && !!gatewayCode,
    select: (data) => {
      if (!data) return
      return {
        gatewayCode,
        gatewayName,
        ...data
      }
    }
  })
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
