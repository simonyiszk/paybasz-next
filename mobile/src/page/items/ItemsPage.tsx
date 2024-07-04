import { useAppContext } from '@/components/AppContext'
import { ItemCard } from './ItemCard'
import { Item } from '@/lib/model'
import { useState } from 'react'
import { PayStep } from '../pay/PayStep'
import { ScanCardStep } from '../common/ScanCardStep'

export const ItemsPage = () => {
  const { items } = useAppContext()
  const [selectedItem, setSelectedItem] = useState<Item | undefined>()
  const [card, setCard] = useState<string>()
  const reset = () => {
    setSelectedItem(undefined)
    setCard(undefined)
  }
  let currentStep
  if (!selectedItem) {
    currentStep = (
      <div className="grid grid-cols-[repeat(auto-fit,_40%)] gap-6 justify-items-center items-center w-full justify-center">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>
    )
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} amount={selectedItem.price} message={selectedItem.code} onAbort={reset} />
  } else {
    currentStep = <PayStep amount={selectedItem.price} message={selectedItem.name} card={card} onReset={reset} />
  }
  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}
