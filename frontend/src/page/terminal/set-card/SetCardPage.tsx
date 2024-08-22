import { useState } from 'react'
import { SelectAccountStep } from '@/page/terminal/set-card/SelectAccountStep.tsx'
import { ScanCardStep } from '@/page/terminal/common/ScanCardStep.tsx'
import { ConnectStep } from '@/page/terminal/set-card/ConnectStep.tsx'
import { CardCheckStep } from '@/page/terminal/set-card/CardCheckStep.tsx'
import { Account } from '@/lib/api/model.ts'

const SetCardPage = () => {
  const [account, setAccount] = useState<Account>()
  const [cardChecked, setCardChecked] = useState(false)
  const [card, setCard] = useState<string>()
  const reset = () => {
    setAccount(undefined)
    setCardChecked(false)
    setCard(undefined)
  }
  let currentStep
  if (!account) {
    currentStep = <SelectAccountStep setAccount={setAccount} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} message={`Kártya ${account.name} részére`} onAbort={reset} />
  } else if (!cardChecked) {
    currentStep = <CardCheckStep card={card} onProceed={() => setCardChecked(true)} onReset={reset} />
  } else {
    currentStep = <ConnectStep card={card} account={account} onReset={reset} />
  }

  return <div className="flex-1 h-full relative">{currentStep}</div>
}

export default SetCardPage
