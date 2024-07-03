import { TerminalType } from '@/lib/model.ts'
import TerminalTypeSelector from '@/components/TerminalTypeSelector.tsx'
import { Logo } from '@/components/Logo.tsx'

export type TerminalSelectorPageProps = {
  setTerminalType: (type: TerminalType) => void
  terminalType?: TerminalType
}

export const TerminalSelectorPage = ({ setTerminalType, terminalType }: TerminalSelectorPageProps) => (
  <div className="flex p-4 flex-col gap-6 items-center">
    <Logo />
    <TerminalTypeSelector setTerminalType={setTerminalType} terminalType={terminalType} />
  </div>
)
