import { useState } from 'react'
import { EnterUserIdStep } from '@/page/set-card/EnterUserIdStep.tsx'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { ConnectStep } from '@/page/set-card/ConnectStep.tsx'

export const SetCardPage = () => {
  const [userId, setUserId] = useState<number>()
  const [card, setCard] = useState<string>()
  const reset = () => {
    setUserId(undefined)
    setCard(undefined)
  }
  let currentStep
  if (!userId) {
    currentStep = <EnterUserIdStep setUserId={setUserId} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} message={`Felhasználó azonosítója: ${userId}`} onAbort={reset} />
  } else {
    currentStep = <ConnectStep card={card} userId={userId} onReset={reset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}
