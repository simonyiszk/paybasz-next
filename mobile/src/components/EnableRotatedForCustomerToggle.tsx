import { Button } from '@/components/ui/button.tsx'
import { FlipVertical, Square } from 'lucide-react'
import { useEnableRotatedForCustomer } from '@/hooks/useEnableRotatedForCustomer.ts'

export const EnableRotatedForCustomerToggle = () => {
  const { rotateEnabled, setRotateEnabled } = useEnableRotatedForCustomer()
  return (
    <Button className="absolute left-0 top-0" variant="ghost" size="icon" onClick={() => setRotateEnabled(!rotateEnabled)}>
      {rotateEnabled ? <Square /> : <FlipVertical />}
    </Button>
  )
}
