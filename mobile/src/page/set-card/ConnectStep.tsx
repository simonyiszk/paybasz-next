import { UserData } from '@/lib/model.ts'
import { useAppContext } from '@/components/AppContext.tsx'
import { useEffect, useState } from 'react'
import { setCard } from '@/lib/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { sha256 } from '@/lib/utils.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const ConnectStep = ({ onReset, card, userId }: { onReset: () => void; card: string; userId: number }) => {
  const { gatewayCode, gatewayName } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState<UserData>()

  useEffect(() => {
    sha256(card)
      .then((cardHash) => setCard({ gatewayName, card: cardHash, gatewayCode, userId }))
      .then(async (data) => {
        if (data.status === 200) setUser(await data.json())
        else setError(getMessageFromStatus(data.status))
      })
      .catch((error) => console.error(error.status))
  }, [card, userId, retries, gatewayName, gatewayCode])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-2 text-center">{error}</h1>
        <Button
          onClick={() => {
            setError(undefined)
            setUser(undefined)
            setRetries(retries + 1)
          }}
        >
          Újra
        </Button>
      </>
    )

  if (!user)
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
      <Alert className="w-[auto]">
        <AlertTitle className="text-center text-primary text-xl">{user.name}</AlertTitle>
        <AlertDescription className="font-bold text-lg flex flex-col gap-2 mt-4">
          <span>Azonosító: {user.id}</span>
          <span>Email: {user.email}</span>
          <span>Megjegyzés: {user.comment}</span>
          {user.maxLoan > 0 && <span>Hitelkeret: {user?.maxLoan} JMF</span>}
        </AlertDescription>
      </Alert>
      <Button onClick={onReset}>Új hozzárendelés</Button>
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
