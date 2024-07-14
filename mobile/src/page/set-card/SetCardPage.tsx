import { useState } from 'react'
import { SelectUserStep } from '@/page/set-card/SelectUserStep.tsx'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { ConnectStep } from '@/page/set-card/ConnectStep.tsx'
import { UserListItem } from '@/lib/model.ts'

export const SetCardPage = () => {
  const [user, setUser] = useState<UserListItem>()
  const [card, setCard] = useState<string>()
  const reset = () => {
    setUser(undefined)
    setCard(undefined)
  }
  let currentStep
  if (!user) {
    currentStep = <SelectUserStep setUser={setUser} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} message={`Kártya ${user.name} részére`} onAbort={reset} />
  } else {
    currentStep = <ConnectStep card={card} user={user} onReset={reset} />
  }

  return <div className="flex-1 h-full self-stretch relative">{currentStep}</div>
}
