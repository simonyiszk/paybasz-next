import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { CircleDollarSign, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn, sha256 } from '@/lib/utils.ts'
import * as api from '@/lib/api.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { useAppContext } from '@/components/AppContext.tsx'

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
  const [balance, setBalance] = useState<number>(NaN)
  const [error, setError] = useState<string>()

  useEffect(() => {
    setError(undefined)
    if (!card) return

    setLoading(true)
    sha256(card)
      .then((cardHash) => api.balance({ gateway: gatewayName, gatewayCode, card: cardHash }))
      .then((balance) => {
        setBalance(balance)
        setLoading(false)
      })
      .catch(() => {
        setError('Sikertelen leolvasás')
        setLoading(false)
      })
  }, [card])

  if (!card) return null

  if (loading)
    return (
      <div className="mt-4">
        <LoadingIndicator />
      </div>
    )

  return <BalanceReadResult card={card} balance={balance} error={error} />
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
      <AlertDescription className={cn(balance > 0 ? 'text-primary' : 'text-destructive', 'text-lg font-bold')}>
        {balance} JMF
      </AlertDescription>
    </Alert>
  )
}
