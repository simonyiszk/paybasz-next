import { useState } from 'react'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { EnterAmountAndMessageStep } from '@/page/common/EnterAmountAndMessageStep.tsx'
import { UploadStep } from '@/page/upload/UploadStep.tsx'

export const UploadPage = () => {
  const [amount, setAmount] = useState<number>()
  const [message, setMessage] = useState<string>()
  const [card, setCard] = useState<string>()

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
    currentStep = <ScanCardStep setCard={setCard} />
  } else {
    currentStep = (
      <UploadStep
        amount={amount}
        message={message}
        card={card}
        onReset={() => {
          setAmount(undefined)
          setMessage(undefined)
          setCard(undefined)
        }}
      />
    )
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}
