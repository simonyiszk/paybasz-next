import { useState } from 'react'
import { ScanCardStep } from '@/page/terminal/common/ScanCardStep.tsx'
import { EnterAmountStep } from '@/page/terminal/common/EnterAmountStep.tsx'
import { UploadStep } from '@/page/terminal/upload/UploadStep.tsx'

const UploadPage = () => {
  const [amount, setAmount] = useState<number>()
  const [card, setCard] = useState<string>()

  const onReset = () => {
    setAmount(undefined)
    setCard(undefined)
  }

  let currentStep
  if (!amount) {
    currentStep = <EnterAmountStep title="Add meg a feltöltés mennyiségét!" setAmount={setAmount} />
  } else if (!card) {
    currentStep = <ScanCardStep message="Feltöltés" amount={amount} setCard={setCard} onAbort={onReset} />
  } else {
    currentStep = <UploadStep amount={amount} card={card} onReset={onReset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}

export default UploadPage
