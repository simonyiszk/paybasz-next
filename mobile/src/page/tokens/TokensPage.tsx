import { useState } from 'react'
import { ScanCardStep } from '../common/ScanCardStep'
import { Item } from '@/lib/model.ts'
import { ItemSearchStep } from '@/page/tokens/ItemSearchStep.tsx'
import { ClaimTokenStep } from '@/page/tokens/ClaimTokenStep.tsx'

export const TokensPage = () => {
  const [item, setItem] = useState<Item>()
  const [card, setCard] = useState<string>()

  const reset = () => {
    setItem(undefined)
    setCard(undefined)
  }

  let currentStep
  if (!item) {
    currentStep = <ItemSearchStep setItem={setItem} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} message={`${item.name} termék token beváltása`} onAbort={() => setItem(undefined)} />
  } else {
    currentStep = <ClaimTokenStep item={item} card={card} onReset={reset} />
  }

  return <div className="flex-1 h-full relative">{currentStep}</div>
}
