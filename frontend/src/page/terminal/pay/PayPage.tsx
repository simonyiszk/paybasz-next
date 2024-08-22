import { useState } from 'react'
import { EnterAmountStep } from '@/page/terminal/common/EnterAmountStep.tsx'
import { ScanCardStep } from '@/page/terminal/common/ScanCardStep.tsx'
import { PayStep } from '@/page/terminal/pay/PayStep.tsx'

const PayPage = () => {
  const [amount, setAmount] = useState<number>()
  const [card, setCard] = useState<string>()

  const reset = () => {
    setAmount(undefined)
    setCard(undefined)
  }
  let currentStep
  if (!amount) {
    currentStep = <EnterAmountStep title="Add meg a fizetendő összeget" setAmount={setAmount} />
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} amount={amount} onAbort={reset} />
  } else {
    currentStep = <PayStep amount={amount} card={card} onReset={reset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}

export default PayPage
