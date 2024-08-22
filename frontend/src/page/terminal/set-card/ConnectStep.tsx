import { useAppContext } from '@/hooks/useAppContext.ts'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { assignCard } from '@/lib/api/terminal.api.ts'
import { Account } from '@/lib/api/model.ts'

export const ConnectStep = ({ onReset, card, account }: { onReset: () => void; card: string; account: Account }) => {
  const { token } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [error, setError] = useState<string>()
  const [pairingResult, setPairingResult] = useState<Account>()

  useEffect(() => {
    assignCard(token, account.id!, { card })
      .then((data) => {
        if (data.result === 'Ok') {
          setPairingResult(data.data)
        } else {
          setError(data.error)
        }
      })
      .catch(() => setError('Az összekapcsolás sikertelen!'))
  }, [card, account.id, retries, token])

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
        </AlertDescription>
      </Alert>
      <Button variant="secondary" className="w-full" onClick={onReset}>
        Új hozzárendelés
      </Button>
    </>
  )
}
