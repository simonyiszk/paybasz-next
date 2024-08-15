import { useState } from 'react'
import { SelectUserStep } from '@/page/set-card/SelectUserStep.tsx'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { ConnectStep } from '@/page/set-card/ConnectStep.tsx'
import { UserListItem } from '@/lib/model.ts'
import { CardCheckStep } from '@/page/set-card/CardCheckStep.tsx'

const SetCardPage = () => {
  const [user, setUser] = useState<UserListItem>()
  const [cardChecked, setCardChecked] = useState(false)
  const [card, setCard] = useState<string>()
  const reset = () => {
    setUser(undefined)
    setCardChecked(false)
    setCard(undefined)
  }
  let currentStep
  if (!user) {
    currentStep = <SelectUserStep setUser={setUser} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} message={`Kártya ${user.name} részére`} onAbort={reset} />
  } else if (!cardChecked) {
    currentStep = <CardCheckStep card={card} onProceed={() => setCardChecked(true)} onReset={reset} />
  } else {
    currentStep = <ConnectStep card={card} user={user} onReset={reset} />
  }

  return <div className="flex-1 h-full relative">{currentStep}</div>
}

export default SetCardPage
