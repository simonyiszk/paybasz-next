export default function TerminalTypeSelector({
  setTerminalType,
  terminalType,
}: {
  setTerminalType: React.Dispatch<React.SetStateAction<string>>;
  terminalType: string;
}) {
  return (
    <select
      onChange={(e) => setTerminalType(e.target.value)}
      value={terminalType}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-64 aspect-square text-center"
    >
      <option value="select">Válassz terminált</option>
      <option value="Bar">Pult</option>
      <option value="Food">Kaja</option>
      <option value="Check-in">Becsek</option>
      <option value="Merch">Merch</option>
      <option value="Charity">Adomány</option>
      <option value="Withdraw">Pénz kivétel</option>
      <option value="Other">Egyéb</option>
    </select>
  );
}
