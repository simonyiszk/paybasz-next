import { useAppContext } from '@/hooks/useAppContext.ts'
import { useEffect, useState } from 'react'
import { PaymentStatus } from '@/lib/model.ts'
import { cn, sha256Hex } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { BalanceCheck } from '@/page/common/BalanceCheck.tsx'
import CheckAnimation from '@/components/CheckAnimation.tsx'
import { transfer } from '@/lib/api.ts'

export const TransferStep = ({
  amount,
  message,
  sender,
  recipient,
  onReset
}: {
  amount: number
  message: string
  sender: string
  recipient: string
  onReset: () => void
}) => {
  const { gatewayCode, gatewayName } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [status, setStatus] = useState<PaymentStatus>()
  const [error, setError] = useState<string>()
  const [senderBalanceLoading, setSenderBalanceLoading] = useState(false)
  const [recipientBalanceLoading, setRecipientBalanceLoading] = useState(false)

  useEffect(() => {
    Promise.all([sha256Hex(sender), sha256Hex(recipient)])
      .then(([sender, recipient]) =>
        transfer({
          gatewayName,
          details: message,
          sender,
          recipient,
          gatewayCode,
          amount
        })
      )
      .then(setStatus)
      .catch(() => setError('Az átruházás sikertelen!'))
  }, [sender, recipient, amount, message, retries, gatewayName, gatewayCode])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-2 text-center text-destructive">{error}</h1>
        <Button variant="secondary" className="w-full mb-2" onClick={onReset}>
          Új tranzakció
        </Button>
        <Button
          className="w-full"
          onClick={() => {
            setError(undefined)
            setStatus(undefined)
            setRetries(retries + 1)
          }}
        >
          Újra
        </Button>
      </>
    )

  if (!status)
    return (
      <>
        <h1 className="font-bold text-2xl pb-2 text-center">Átruházás folyamatban...</h1>
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      </>
    )
  const data = (
    <>
      <h1 className={cn('font-bold text-2xl pb-2 text-center', status !== 'ACCEPTED' && 'text-destructive')}>
        {getMessageFromStatus(status)}
      </h1>
      <BalanceCheck card={sender} loading={senderBalanceLoading} setLoading={setSenderBalanceLoading} />
      <BalanceCheck card={recipient} loading={recipientBalanceLoading} setLoading={setRecipientBalanceLoading} />
      <Button variant="secondary" className="w-full" onClick={onReset}>
        Új tranzakció
      </Button>
    </>
  )
  if (status == 'ACCEPTED') {
    return <CheckAnimation>{data}</CheckAnimation>
  }
  return data
}

const getMessageFromStatus = (status: PaymentStatus) => {
  switch (status) {
    case 'NOT_ENOUGH_CASH':
      return 'Nincs elég egyenleg az átruházáshoz!'
    case 'VALIDATION_ERROR':
      return 'Validációs hiba!'
    case 'CARD_REJECTED':
      return 'Kártya elutasítva!'
    case 'ACCEPTED':
      return 'Sikeres átruházás!'
    case 'INTERNAL_ERROR':
      return 'Váratlan hiba.'
    default:
      return 'Nincs jogosultságod átruházás végrehajtásához!'
  }
}
