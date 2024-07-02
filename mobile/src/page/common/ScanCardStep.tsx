import { useNFCScanner } from '@/lib/utils.ts'

export const ScanCardStep = ({ setCard }: { setCard: (card: string) => void }) => {
  useNFCScanner((event) => {
    setCard(event.serialNumber)
  }, [])

  return <h1 className="font-bold text-2xl pb-2 text-center">Érints kártyát az eszközhöz...</h1>
}
