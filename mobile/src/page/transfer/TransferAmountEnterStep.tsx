import { EnterAmountAndMessageStep } from '@/page/common/EnterAmountAndMessageStep.tsx'
import { Button } from '@/components/ui/button.tsx'
import { BalanceCheck } from '@/page/common/BalanceCheck.tsx'
import { useState } from 'react'

export const TransferAmountEnterStep = ({
  sender,
  setMessage,
  setAmount,
  onAbort
}: {
  sender: string
  setMessage: (card: string) => void
  setAmount: (card: number) => void
  onAbort?: () => void
}) => {
  const [loading, setLoading] = useState(true)
  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">Add meg az átruházandó mennyiséget!</h1>
      <BalanceCheck loading={loading} setLoading={setLoading} card={sender} />
      <EnterAmountAndMessageStep
        messagePlaceholder="Miért kapja ez?"
        messageKey="transferMessage"
        setAmount={setAmount}
        setMessage={setMessage}
      />
      <Button variant="secondary" className="mt-2" onClick={onAbort}>
        Vissza
      </Button>
    </>
  )
}
