import { TerminalType } from '@/lib/model.ts'
import { createContext, useContext } from 'react'

export type TerminalTypeState = [TerminalType, (state?: TerminalType) => void]

export const TerminalTypeContext = createContext<TerminalTypeState>(['Other', () => {}])

export const useTerminalType = () => useContext(TerminalTypeContext)
