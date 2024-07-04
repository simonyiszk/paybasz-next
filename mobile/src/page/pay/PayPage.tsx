import { useState } from 'react'
import { EnterAmountAndMessageStep } from '@/page/common/EnterAmountAndMessageStep.tsx'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { PayStep } from '@/page/pay/PayStep.tsx'

export const PayPage = () => {
  const [amount, setAmount] = useState<number>()
  const [message, setMessage] = useState<string>()
  const [card, setCard] = useState<string>()
  const reset = () => {
    setAmount(undefined)
    setMessage(undefined)
    setCard(undefined)
  }
  let currentStep
  if (!amount || !message) {
    currentStep = (
      <EnterAmountAndMessageStep
        title="Add meg a fizetendő összeget"
        messagePlaceholder="Mit vásárol?"
        messageKey="payMessage"
        setAmount={setAmount}
        setMessage={setMessage}
      />
    )
  } else if (!card) {
    currentStep = <ScanCardStep setCard={setCard} amount={amount} message={message} onAbort={reset} />
  } else {
    currentStep = <PayStep amount={amount} message={message} card={card} onReset={reset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}
