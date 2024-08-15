import { useState } from 'react'
import { ScanCardStep } from '@/page/common/ScanCardStep.tsx'
import { TransferAmountEnterStep } from '@/page/transfer/TransferAmountEnterStep.tsx'
import { TransferStep } from '@/page/transfer/TransferStep.tsx'

const TransferPage = () => {
  const [sender, setSender] = useState<string>()
  const [recipient, setRecipient] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [message, setMessage] = useState<string>()

  const reset = () => {
    setAmount(undefined)
    setSender(undefined)
    setMessage(undefined)
    setRecipient(undefined)
  }
  let currentStep
  if (!sender) {
    currentStep = <ScanCardStep setCard={setSender} message="Scanneld le a küldő kártyáját!" onAbort={reset} />
  } else if (!amount || !message) {
    currentStep = <TransferAmountEnterStep sender={sender} setAmount={setAmount} setMessage={setMessage} onAbort={reset} />
  } else if (!recipient) {
    currentStep = (
      <ScanCardStep
        setCard={setRecipient}
        message="Scanneld le a szerencsés fogadó kártyáját!"
        amount={amount}
        onAbort={() => {
          setAmount(undefined)
          setMessage(undefined)
        }}
      />
    )
  } else {
    currentStep = <TransferStep amount={amount} message={message} recipient={recipient} sender={sender} onReset={reset} />
  }

  return <div className="flex items-center flex-col gap-4">{currentStep}</div>
}

export default TransferPage
