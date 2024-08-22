import { createContext, useContext } from 'react'
import { AppResponse } from '@/lib/api/model.ts'

export const AppContext = createContext<AppData>({} as AppData)
export type AppData = AppResponse & {
  token: string
  logOut: () => void
}

export const useAppContext = (): AppData => useContext(AppContext)
