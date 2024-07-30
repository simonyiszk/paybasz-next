import { Item, PaymentStatus } from '@/lib/model.ts'
import { useAppContext } from '@/hooks/useAppContext.ts'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { cn, sha256 } from '@/lib/utils.ts'
import { claimToken } from '@/lib/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import CheckAnimation from '@/components/CheckAnimation.tsx'

export const ClaimTokenStep = ({ item, card, onReset }: { item: Item; card: string; onReset: () => void }) => {
  const { gatewayCode, gatewayName } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [status, setStatus] = useState<PaymentStatus>()
  const [error, setError] = useState<string>()
  const queryClient = useQueryClient()

  useEffect(() => {
    sha256(card)
      .then((cardHash) => claimToken({ gatewayName, gatewayCode, card: cardHash, itemId: item.id }))
      .then((data) => {
        setStatus(data)
        queryClient.invalidateQueries('app')
      })
      .catch(() => setError('A fizetés sikertelen!'))
  }, [card, item, gatewayCode, gatewayName, queryClient, retries])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-4 text-center text-destructive">{error}</h1>
        <Button variant="secondary" className="w-full mb-2" onClick={onReset}>
          Új beolvasás
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
        <h1 className="font-bold text-2xl pb-2 text-center">Beolvasás folyamatban...</h1>
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      </>
    )

  const confirmation = (
    <>
      <h1 className={cn('font-bold text-2xl pb-2 text-center', status !== 'ACCEPTED' && 'text-destructive')}>
        {getMessageFromStatus(status)}
      </h1>
      <Button variant="secondary" className="w-full mt-2" onClick={onReset}>
        Új beolvasás
      </Button>
    </>
  )
  if (status == 'ACCEPTED') {
    return <CheckAnimation>{confirmation}</CheckAnimation>
  }

  return confirmation
}

const getMessageFromStatus = (status: PaymentStatus) => {
  switch (status) {
    case 'NOT_ENOUGH_CASH':
      return 'A felhasználó nem rendelkezik ilyen tokennel!'
    case 'VALIDATION_ERROR':
      return 'Validációs hiba!'
    case 'CARD_REJECTED':
      return 'Kártya elutasítva!'
    case 'ACCEPTED':
      return 'Sikeres beolvasás!'
    case 'INTERNAL_ERROR':
      return 'Váratlan hiba.'
    default:
      return 'Nincs jogosultságod beolvasások végrehajtásához!'
  }
}
