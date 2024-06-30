import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { terminalNames, TerminalType, terminalTypes } from '@/model/model.ts'

export type TerminalTypeSelectorProps = {
  setTerminalType: (type: TerminalType) => void
  terminalType?: TerminalType
}

export default function TerminalTypeSelector({ setTerminalType, terminalType }: TerminalTypeSelectorProps) {
  return (
    <Select value={terminalType} onValueChange={setTerminalType}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Válassz terminál típust" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Terminál típus</SelectLabel>
          {terminalTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {terminalNames[type]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
