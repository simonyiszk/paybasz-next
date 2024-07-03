import { useState } from 'react'
import { useNFCScanner } from '@/lib/utils.ts'
import { BalanceCheck } from '@/page/common/BalanceCheck.tsx'

export const BalanceCheckPage = () => {
  const [card, setCard] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useNFCScanner(
    async (event) => {
      if (loading) return
      setCard(event.serialNumber)
    },
    [loading]
  )

  return (
    <div className="flex items-center flex-col gap-4">
      <h1 className="font-bold text-2xl pb-2 text-center">Érints kártyát az eszközhöz...</h1>

      <BalanceCheck card={card} loading={loading} setLoading={setLoading} />
    </div>
  )
}
