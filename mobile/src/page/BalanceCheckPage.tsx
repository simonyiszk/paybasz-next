import { useEffect, useState } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { useUserContext } from '@/components/UserContext.tsx'
import { sha256, useNFCScanner } from '@/lib/utils.ts'
import * as api from '@/api/api.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { CircleDollarSign, CircleX } from 'lucide-react'

export const BalanceCheckPage = () => {
  const { gatewayName, gatewayCode } = useUserContext()
  const [card, setCard] = useState<string>()
  const [balance, setBalance] = useState<number>(NaN)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useNFCScanner(
    async (event) => {
      if (loading) return
      setCard(event.serialNumber)
    },
    [loading]
  )

  useEffect(() => {
    setError(undefined)
    if (!card) return

    setLoading(true)
    sha256(card)
      .then((cardSha) => api.balance({ gateway: gatewayName, gatewayCode, card: cardSha }))
      .then((balance) => {
        setBalance(balance)
        setLoading(false)
      })
      .catch(() => {
        setError('Sikertelen leolvasás')
        setLoading(false)
      })
  }, [card])

  return (
    <div className="flex items-center flex-col gap-4">
      <h1 className="font-bold text-2xl pb-2">Érints kártyát az eszközhöz...</h1>

      {!!card && loading && (
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      )}

      {!!card && !loading && <BalanceReadResult card={card} balance={balance} error={error} />}
    </div>
  )
}

const BalanceReadResult = ({ card, balance, error }: { card: string; balance: number; error?: string }) => {
  const message = error || (isNaN(balance) && `A ${card} azonosítójú kártya egyenlegét nem lehet leolvasni!`)
  if (message)
    return (
      <Alert className="w-[auto]">
        <CircleX className="px-1" />
        <AlertTitle>Hiba!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )

  return (
    <Alert className="w-[auto]">
      <CircleDollarSign className="px-1" />
      <AlertTitle>{card} kártya egyenlege</AlertTitle>
      <AlertDescription className={balance > 0 ? 'text-primary' : 'text-destructive'}>{balance} JMF</AlertDescription>
    </Alert>
  )
}
