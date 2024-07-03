import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { app } from '@/lib/api.ts'
import { NoPermissionBanner } from '@/components/NoPermissionBanner.tsx'
import { Item } from '@/lib/model.ts'

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
  const [appData, setAppData] = useState<AppData>()
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    app({ gateway: gatewayName, gatewayCode: gatewayCode }).then((appResponse) => {
      if (!appResponse) {
        setHasPermission(false)
      } else {
        setAppData({
          gatewayCode,
          gatewayName,
          ...appResponse
        })
      }
    })
  }, [gatewayName, gatewayCode])

  if (!hasPermission) {
    return <NoPermissionBanner />
  }

  if (!appData) {
    return (
      <div className="flex w-full h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return <AppContext.Provider value={appData}>{children}</AppContext.Provider>
}
