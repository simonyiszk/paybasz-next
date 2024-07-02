import { AddCardStatus } from '@/model/model.ts'
import { useUserContext } from '@/components/UserContext.tsx'
import { useEffect, useState } from 'react'
import { setCard } from '@/api/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { sha256 } from '@/lib/utils.ts'

export const ConnectStep = ({ onReset, card, userId }: { onReset: () => void; card: string; userId: number }) => {
  const { gatewayCode, gatewayName } = useUserContext()
  const [retries, setRetries] = useState(0)
  const [status, setStatus] = useState<AddCardStatus>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    sha256(card)
      .then((cardHash) => setCard({ gateway: gatewayName, card: cardHash, gatewayCode, userId }))
      .then(setStatus)
      .catch(() => setError('A hozzárendelés sikertelen!'))
  }, [card, userId, retries])

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
        <h1 className="font-bold text-2xl pb-2 text-center">Kártya és felhasználó összekapcsolása...</h1>
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      </>
    )

  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">{getMessageFromStatus(status)}</h1>
      <Button onClick={onReset}>Új hozzárendelés</Button>
    </>
  )
}

const getMessageFromStatus = (status: AddCardStatus) => {
  switch (status) {
    case 'ACCEPTED':
      return 'Hozzárendelés sikeres!'
    case 'INTERNAL_ERROR':
      return 'Váratlan hiba.'
    case 'USER_NOT_FOUND':
      return 'A felhasználó nem létezik.'
    case 'ALREADY_ADDED':
      return 'Hozzárendelés sikeres!'
    case 'USER_HAS_CARD':
      return 'A felhasználónak már van egy másik kártyája.'
    default:
      return 'Nincs jogosultságod hozzárendelésekhez!'
  }
}
