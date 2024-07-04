import { Button } from '@/components/ui/button'
import { Item } from '@/lib/model'

export const ItemCard = ({ item, onClick }: { item: Item; onClick: () => void }) => {
  const disabled = item.quantity <= 0
  return (
    <Button disabled={disabled} onClick={onClick} className="flex flex-col gap-2 p-4 h-full w-full aspect-square relative">
      <h1 className="text-xl text-gray-900">{item.name}</h1>
      <h3>{item.price} JMF</h3>
      {disabled && <span className="text-red-500 font-bold absolute -rotate-45 text-2xl">Elfogyott</span>}
    </Button>
  )
}
