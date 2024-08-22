import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'

export const NoPermissionBanner = ({ goToLogin }: { goToLogin: () => void }) => (
  <div className="flex items-center justify-center w-full h-full min-h-[100vh] p-4">
    <Card>
      <CardHeader>
        <CardTitle>Nincs jogosultságod a használathoz </CardTitle>
      </CardHeader>
      <CardContent>:(</CardContent>
      <CardFooter>
        {' '}
        <Button onClick={goToLogin}>Belépés másik felhasználóval</Button>
      </CardFooter>
    </Card>
  </div>
)
