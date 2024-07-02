import { useUserContext } from '@/components/UserContext.tsx'
import { useEffect, useState } from 'react'
import { PaymentStatus } from '@/model/model.ts'
import { upload } from '@/api/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { BalanceCheck } from '@/page/common/BalanceCheck.tsx'
import { sha256 } from '@/lib/utils.ts'

export const UploadStep = ({ onReset, card, amount, message }: { onReset: () => void; card: string; amount: number; message: string }) => {
  const { gatewayCode, gatewayName } = useUserContext()
  const [retries, setRetries] = useState(0)
  const [status, setStatus] = useState<PaymentStatus>()
  const [error, setError] = useState<string>()
  const [balanceCheckLoading, setBalanceCheckLoading] = useState(false)

  useEffect(() => {
    sha256(card)
      .then((cardHash) => upload({ gateway: gatewayName, details: message, card: cardHash, gatewayCode, amount }))
      .then(setStatus)
      .catch(() => setError('A feltöltés sikertelen!'))
  }, [card, amount, message, retries])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-2 text-center">{error}</h1>
        <Button
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
        <h1 className="font-bold text-2xl pb-2 text-center">Összeg feltöltése...</h1>
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      </>
    )

  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">{getMessageFromStatus(status)}</h1>
      <BalanceCheck card={card} loading={balanceCheckLoading} setLoading={setBalanceCheckLoading} />

      <Button onClick={onReset}>Új feltöltés</Button>
    </>
  )
}

const getMessageFromStatus = (status: PaymentStatus) => {
  switch (status) {
    case 'NOT_ENOUGH_CASH':
      return 'Nincs elég egyenleg a feltöltéshez!'
    case 'VALIDATION_ERROR':
      return 'Validációs hiba!'
    case 'CARD_REJECTED':
      return 'Kártya elutasítva!'
    case 'ACCEPTED':
      return 'A feltöltés sikeres sikeres!'
    case 'INTERNAL_ERROR':
      return 'Váratlan hiba.'
    default:
      return 'Nincs jogosultságod feltöltéshez!'
  }
}
