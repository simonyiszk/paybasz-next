import { createContext, useContext } from 'react'
import { Item, MobileConfig } from '@/lib/model.ts'

export const AppContext = createContext<AppData>({} as AppData)
export type AppData = {
  uploader: boolean
  gatewayName: string
  gatewayCode: string
  items: Item[]
  config: MobileConfig
}

export const useAppContext = (): AppData => useContext(AppContext)
