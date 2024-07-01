import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { TerminalType, terminalTypes } from '@/model/model.ts'
import { TerminalTypeKey } from '@/lib/constants.ts'
import { TerminalSelectorPage } from '@/page/TerminalSelectorPage.tsx'
import { setPersistentState } from '@/lib/utils.ts'

export type TerminalTypeState = [TerminalType, (state?: TerminalType) => void]
export const TerminalTypeContext = createContext<TerminalTypeState>(['Other', () => {}])
export const useTerminalType = () => useContext(TerminalTypeContext)

const getPersistentTerminalType = () => {
  const storedTerminalType = localStorage.getItem(TerminalTypeKey) as TerminalType
  return terminalTypes.includes(storedTerminalType) ? storedTerminalType : undefined
}

export const TerminalTypeInput: FC<PropsWithChildren> = ({ children }) => {
  const [terminalType, setTerminalType] = useState<TerminalType | undefined>(getPersistentTerminalType())

  const setPersistentTerminalType = useMemo(() => setPersistentState(TerminalTypeKey, setTerminalType), [setTerminalType])
  const contextValue = useMemo<TerminalTypeState>(
    () => [terminalType!, setPersistentTerminalType], // undefined case is handled inside this component
    [terminalType, setPersistentTerminalType]
  )

  if (!terminalType) {
    return <TerminalSelectorPage setTerminalType={setPersistentTerminalType} terminalType={terminalType} />
  }

  return <TerminalTypeContext.Provider value={contextValue}>{children}</TerminalTypeContext.Provider>
}
