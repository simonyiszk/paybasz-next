import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { terminalNames, TerminalType, terminalTypes } from '@/lib/model.ts'

export type TerminalTypeSelectorProps = {
  setTerminalType: (type: TerminalType) => void
  terminalType?: TerminalType
}

export default function TerminalTypeSelector({ setTerminalType, terminalType }: TerminalTypeSelectorProps) {
  return (
    <Select value={terminalType} onValueChange={setTerminalType}>
      <h1 className="font-bold text-2xl pb-4">Add meg, milyen terminállal dolgozol!</h1>
      <SelectTrigger>
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
