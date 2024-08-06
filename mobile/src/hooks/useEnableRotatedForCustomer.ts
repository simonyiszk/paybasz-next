import { createContext, useContext } from 'react'

export const RotateEnabledContext = createContext<RotateEnabledData>({
  rotateEnabled: true,
  setRotateEnabled: () => {}
})

export type RotateEnabledData = {
  rotateEnabled: boolean
  setRotateEnabled: (rotateEnabled: boolean) => void
}

export const useEnableRotatedForCustomer = () => useContext(RotateEnabledContext)
