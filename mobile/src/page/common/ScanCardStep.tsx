import { Button } from '@/components/ui/button'
import { useNFCScanner } from '@/lib/utils.ts'

export const ScanCardStep = ({
  setCard,
  amount,
  message,
  onAbort
}: {
  setCard: (card: string) => void
  amount?: number
  message?: string
  onAbort?: () => void
}) => {
  useNFCScanner((event) => {
    setCard(event.serialNumber)
  }, [])

  return (
    <>
      <div className="flex flex-col gap-4 relative flex-1">
        {message && <h1 className="font-bold text-2xl text-center">{message}</h1>}
        {amount && <h1 className="font-bold text-2xl text-center">{amount} JMF</h1>}
        <h1 className="font-bold text-2xl pb-8 text-center">Érints kártyát az eszközhöz...</h1>
        {onAbort && (
          <Button variant="destructive" onClick={onAbort}>
            Vissza
          </Button>
        )}
      </div>
    </>
  )
}
