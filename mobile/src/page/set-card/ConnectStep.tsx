import { UserData, UserListItem } from '@/lib/model.ts'
import { useAppContext } from '@/hooks/useAppContext'
import { useEffect, useState } from 'react'
import { setCard } from '@/lib/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { sha256Hex } from '@/lib/utils.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const ConnectStep = ({ onReset, card, user }: { onReset: () => void; card: string; user: UserListItem }) => {
  const { gatewayCode, gatewayName } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [error, setError] = useState<string>()
  const [pairingResult, setPairingResult] = useState<UserData>()

  useEffect(() => {
    sha256Hex(card)
      .then((cardHash) => setCard({ gatewayName, card: cardHash, gatewayCode, userId: user.id }))
      .then(async (data) => {
        if (data.status === 200) setPairingResult(await data.json())
        else setError(getMessageFromStatus(data.status))
      })
      .catch((error) => console.error(error.status))
  }, [card, user.id, retries, gatewayName, gatewayCode])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-4 text-center text-destructive">{error}</h1>

        <Button variant="secondary" className="w-full mb-2" onClick={onReset}>
          Új hozzárendelés
        </Button>
        <Button
          className="w-full mt-2"
          onClick={() => {
            setError(undefined)
            setPairingResult(undefined)
            setRetries(retries + 1)
          }}
        >
          Újra
        </Button>
      </>
    )

  if (!pairingResult)
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
      <h1 className="font-bold text-2xl pb-4 text-center">Sikeres hozzárendelés!</h1>
      <Alert className="mb-4">
        <AlertTitle className="text-primary text-xl">{pairingResult.name}</AlertTitle>
        <AlertDescription className="font-bold text-lg flex flex-col gap-2 mt-4">
          <span>Azonosító: {pairingResult.id}</span>
          <span>Email: {pairingResult.email}</span>
          {!!pairingResult.comment && <span>Megjegyzés: {pairingResult.comment}</span>}
          {pairingResult.maxLoan > 0 && <span>Hitelkeret: {pairingResult?.maxLoan} JMF</span>}
        </AlertDescription>
      </Alert>
      <Button variant="secondary" className="w-full" onClick={onReset}>
        Új hozzárendelés
      </Button>
    </>
  )
}

const getMessageFromStatus = (status: number) => {
  switch (status) {
    case 404:
      return 'A felhasználó nem létezik.'
    case 409:
      return 'A kártyát már hozzárendelték valakihez!'
    case 400:
      return 'A felhasználónak már van egy másik kártyája.'
    case 403:
      return 'Nincs jogosultságod hozzárendelésekhez!'
    default:
      return 'Váratlan hiba.'
  }
}
