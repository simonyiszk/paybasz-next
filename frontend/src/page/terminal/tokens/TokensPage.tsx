import { useState } from 'react'
import { ScanCardStep } from '@/page/terminal/common/ScanCardStep.tsx'
import { ItemSearchStep } from '@/page/terminal/tokens/ItemSearchStep.tsx'
import { ClaimTokenStep } from '@/page/terminal/tokens/ClaimTokenStep.tsx'
import { Item } from '@/lib/api/model.ts'

const TokensPage = () => {
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
    currentStep = <ScanCardStep setCard={setCard} message={`${item.name} token beváltása`} onAbort={() => setItem(undefined)} />
  } else {
    currentStep = <ClaimTokenStep item={item} card={card} onReset={reset} onBackToScan={() => setCard(undefined)} />
  }

  return <div className="flex-1 h-full relative">{currentStep}</div>
}

export default TokensPage
