import { useAppContext } from '@/hooks/useAppContext'
import { useEffect, useState } from 'react'
import { PaymentStatus } from '@/lib/model.ts'
import { payCart } from '@/lib/api.ts'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { BalanceCheck } from '@/page/common/BalanceCheck.tsx'
import { sha256 } from '@/lib/utils.ts'
import CheckAnimation from '@/components/CheckAnimation'
import { useQueryClient } from 'react-query'
import { Cart } from '@/page/items/cart.ts'

export const CartPayStep = ({
  onReset,
  onBackToCart,
  card,
  cart
}: {
  onReset: () => void
  onBackToCart: () => void
  card: string
  cart: Cart
}) => {
  const { gatewayCode, gatewayName } = useAppContext()
  const [retries, setRetries] = useState(0)
  const [status, setStatus] = useState<PaymentStatus>()
  const [error, setError] = useState<string>()
  const [balanceCheckLoading, setBalanceCheckLoading] = useState(false)
  const queryClient = useQueryClient()
  useEffect(() => {
    sha256(card)
      .then((cardHash) =>
        payCart({
          gatewayName,
          card: cardHash,
          gatewayCode,
          cart: {
            customItems: cart.customEntries,
            items: cart.items.map((item) => ({ id: item.item.id, quantity: item.quantity }))
          }
        })
      )
      .then((data) => {
        setStatus(data)
        queryClient.invalidateQueries('app')
      })
      .catch(() => setError('A fizetés sikertelen!'))
  }, [card, gatewayCode, gatewayName, cart, queryClient, retries])

  if (error)
    return (
      <>
        <h1 className="font-bold text-2xl pb-2 text-center">{error}</h1>
        <Button variant="secondary" className="w-full mt-2" onClick={onReset}>
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
        <h1 className="font-bold text-2xl pb-2 text-center">Tranzakció folyamatban...</h1>
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      </>
    )

  const confirmation = (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">{getMessageFromStatus(status)}</h1>
      <BalanceCheck card={card} loading={balanceCheckLoading} setLoading={setBalanceCheckLoading} />
      <Button className="w-full mt-2" onClick={onBackToCart}>
        Még egy ilyet
      </Button>
      <Button variant="secondary" className="w-full mt-2" onClick={onReset}>
        Új tranzakció
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
      return 'Nincs elég egyenleg a tranzakcióhoz!'
    case 'VALIDATION_ERROR':
      return 'Validációs hiba!'
    case 'CARD_REJECTED':
      return 'Kártya elutasítva!'
    case 'ACCEPTED':
      return 'Sikeres tranzakció!'
    case 'INTERNAL_ERROR':
      return 'Váratlan hiba.'
    default:
      return 'Nincs jogosultságod tranzakciók végrehajtásához!'
  }
}
