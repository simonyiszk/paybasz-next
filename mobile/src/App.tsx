import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Logo } from '@/components/Logo.tsx'
import { BalanceCheckPage } from '@/page/BalanceCheckPage.tsx'
import { SetCardPage } from '@/page/set-card/SetCardPage.tsx'
import { UploadPage } from '@/page/upload/UploadPage.tsx'
import { useUserContext } from '@/components/UserContext.tsx'
import { PayPage } from '@/page/pay/PayPage.tsx'

const TabKey = 'selectedTab'

export const App = () => {
  const { type: userType } = useUserContext()
  return (
    <Tabs
      onValueChange={(tab) => localStorage.setItem(TabKey, tab)}
      defaultValue={localStorage.getItem(TabKey) || 'balance'}
      className="p-4 max-w-2xl m-auto min-h-[100dvh] flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4 sm:gap-8">
        <div className="m-auto sm:m-0">
          <Logo />
        </div>
        <TabsList className="py-8 hidden sm:flex">
          <TabsTrigger className="py-4" value="balance">
            Egyenleg
          </TabsTrigger>
          <TabsTrigger className="py-4" value="assign">
            Hozzáre<span className="sm:hidden">...</span>
            <span className="hidden sm:inline">ndelés</span>
          </TabsTrigger>
          <TabsTrigger className="py-4" value="pay">
            Fizetés
          </TabsTrigger>
          <TabsTrigger className="py-4" value="upload">
            Feltöltés
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex-1">
        <TabsContent value="balance">
          <BalanceCheckPage />
        </TabsContent>
        <TabsContent value="assign">
          <SetCardPage />
        </TabsContent>
        <TabsContent value="pay">
          <PayPage />
        </TabsContent>
        {userType == 'Uploader' && (
          <TabsContent value="upload">
            <UploadPage />
          </TabsContent>
        )}
      </div>
      <TabsList className="py-8 flex sm:hidden">
        <TabsTrigger className="py-4" value="balance">
          Egyenleg
        </TabsTrigger>
        <TabsTrigger className="py-4" value="assign">
          {userType == 'Uploader' ? (
            <>
              Hozzáre<span className="sm:hidden">...</span>
              <span className="hidden sm:inline">ndelés</span>
            </>
          ) : (
            <>Hozzárendelés</>
          )}
        </TabsTrigger>
        <TabsTrigger className="py-4" value="pay">
          Fizetés
        </TabsTrigger>
        {userType == 'Uploader' && (
          <TabsTrigger className="py-4" value="upload">
            Feltöltés
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  )
}
