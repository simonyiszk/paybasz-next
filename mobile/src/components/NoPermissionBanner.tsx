import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { ShieldBan } from 'lucide-react'

export const NoPermissionBanner = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[100vh] p-4">
    <Alert className="w-[auto]">
      <ShieldBan className="px-1" />
      <AlertTitle>Nincs jogosultságod a használathoz</AlertTitle>
      <AlertDescription>Rossz QR kódot scanneltél?</AlertDescription>
    </Alert>
  </div>
)
