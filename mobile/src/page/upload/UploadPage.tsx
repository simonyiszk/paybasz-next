import { useState } from 'react'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { EnterAmountAndMessageStep } from '@/page/common/EnterAmountAndMessageStep.tsx'
import { UploadStep } from '@/page/upload/UploadStep.tsx'

const UploadPage = () => {
  const [amount, setAmount] = useState<number>()
  const [message, setMessage] = useState<string>()
  const [card, setCard] = useState<string>()

  const onReset = () => {
    setAmount(undefined)
    setMessage(undefined)
    setCard(undefined)
  }

  let currentStep
  if (!amount || !message) {
    currentStep = (
      <EnterAmountAndMessageStep
        title="Add meg a feltöltés mennyiségét!"
        messagePlaceholder="Mé kap pészt?"
        messageKey="uploadMessage"
        setAmount={setAmount}
        setMessage={setMessage}
      />
    )
  } else if (!card) {
    currentStep = <ScanCardStep message="Feltöltés" amount={amount} setCard={setCard} onAbort={onReset} />
  } else {
    currentStep = <UploadStep amount={amount} message={message} card={card} onReset={onReset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}

export default UploadPage
