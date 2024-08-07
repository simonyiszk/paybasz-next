import { cardCheck } from '@/lib/api.ts'
import { useAppContext } from '@/hooks/useAppContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { sha256Hex } from '@/lib/utils.ts'

export const CardCheckStep = ({ onReset, onProceed, card }: { onReset: () => void; onProceed: () => void; card: string }) => {
  const { gatewayCode, gatewayName, canReassignCards } = useAppContext()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    sha256Hex(card)
      .then((cardHash) => cardCheck({ gatewayName, card: cardHash, gatewayCode }))
      .then((cardAssigned) => {
        if (!cardAssigned) {
          onProceed()
        } else {
          setShowPrompt(true)
        }
      })
  }, [card, gatewayName, gatewayCode])

  if (!showPrompt)
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
      <h1 className="font-bold text-2xl pb-4 text-center">A kártya már hozzá van rendelve valakihez</h1>
      <Button variant="secondary" className="w-full mb-2" onClick={onReset}>
        Vissza
      </Button>
      {canReassignCards && (
        <Button className="w-full" onClick={onProceed}>
          Tovább
        </Button>
      )}
    </>
  )
}
