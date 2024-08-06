import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { CircleDollarSign, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { sha256 } from '@/lib/utils.ts'
import * as api from '@/lib/api.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { useAppContext } from '@/hooks/useAppContext'
import { BalanceResponse } from '@/lib/model.ts'
import { RotatedForCustomer } from '@/components/RotatedForCustomer.tsx'

export const BalanceCheck = ({
  card,
  loading,
  setLoading
}: {
  card?: string
  loading: boolean
  setLoading: (loading: boolean) => void
}) => {
  const { gatewayName, gatewayCode } = useAppContext()
  const [balance, setBalance] = useState<BalanceResponse | null>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    setError(undefined)
    if (!card) return

    setLoading(true)
    sha256(card)
      .then((cardHash) => api.balance({ gatewayName, gatewayCode, card: cardHash }))
      .then((balance) => {
        setBalance(balance)
        setLoading(false)
      })
      .catch(() => {
        setError('Sikertelen leolvasás')
        setLoading(false)
      })
  }, [card, gatewayCode, gatewayName, setLoading])

  if (!card) return null

  if (loading)
    return (
      <div className="mt-4">
        <LoadingIndicator />
      </div>
    )

  return <BalanceReadResult card={card} balance={balance} error={error} />
}

const BalanceReadResult = ({ card, balance, error }: { card: string; balance?: BalanceResponse | null; error?: string }) => {
  const message = error || (!balance && `A ${card} azonosítójú kártya egyenlegét nem lehet leolvasni!`)
  if (message)
    return (
      <Alert className="w-[auto]">
        <CircleX className="px-1" />
        <AlertTitle>Hiba!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )

  return (
    <RotatedForCustomer className="w-full">
      <Alert>
        <CircleDollarSign className="px-1" />
        <AlertTitle>{balance?.username}</AlertTitle>
        <AlertDescription className="font-bold text-lg flex flex-col">
          <span className="font-normal text-sm pb-2">{balance?.email}</span>
          <span>Kártya: {card.substring(0, 10)}...</span>
          <span>
            Egyenleg: <span className={balance!.balance > 0 ? 'text-primary' : 'text-destructive'}>{balance!.balance} JMF</span>
          </span>
          {balance!.maxLoan > 0 && <span>Hitelkeret: {balance?.maxLoan} JMF</span>}
        </AlertDescription>
      </Alert>
    </RotatedForCustomer>
  )
}
