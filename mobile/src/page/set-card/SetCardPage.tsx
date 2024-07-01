import { useState } from 'react'
import { EnterUserIdStep } from '@/page/set-card/EnterUserIdStep.tsx'
import { ScanCardStep } from '@/page/set-card/ScanCardStep.tsx'
import { ConnectStep } from '@/page/set-card/ConnectStep.tsx'

export const SetCardPage = () => {
  const [userId, setUserId] = useState<number>()
  const [card, setCard] = useState<string>()

  let currentStep
  if (!userId) {
    currentStep = <EnterUserIdStep setUserId={setUserId} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} />
  } else {
    currentStep = (
      <ConnectStep
        card={card}
        userId={userId}
        onReset={() => {
          setCard(undefined)
          setUserId(undefined)
        }}
      />
    )
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}
