import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { SmartphoneNfc } from 'lucide-react'

export default function NoNFCBanner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100vh]">
      <Alert className="w-[auto]">
        <SmartphoneNfc className="h-4 w-4" />
        <AlertTitle>Nem támogatott böngésző.</AlertTitle>
        <AlertDescription>Az alkalmazásnak szüksége van olyan böngészőre, amely támogatja a Web NFC-t.</AlertDescription>
      </Alert>
    </div>
  )
}
