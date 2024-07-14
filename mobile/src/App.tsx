import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Logo } from '@/components/Logo.tsx'
import { BalanceCheckPage } from '@/page/BalanceCheckPage.tsx'
import { SetCardPage } from '@/page/set-card/SetCardPage.tsx'
import { UploadPage } from '@/page/upload/UploadPage.tsx'
import { useAppContext } from '@/components/AppContext.tsx'
import { PayPage } from '@/page/pay/PayPage.tsx'
import { ItemsPage } from './page/items/ItemsPage'
import { ArrowUpFromLine, CircleDollarSign, CircleHelp, Link, ShoppingBasket } from 'lucide-react'

const TabKey = 'selectedTab'

export const App = () => {
  const { uploader, items } = useAppContext()
  return (
    <Tabs
      onValueChange={(tab) => localStorage.setItem(TabKey, tab)}
      defaultValue={localStorage.getItem(TabKey) || 'balance'}
      className="p-4 max-w-2xl m-auto h-[100dvh] flex flex-col items-center relative"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4 sm:gap-8 m-auto sm:m-0">
        <Logo />
      </div>
      <main className="flex-1 w-full overflow-y-auto overflow-x-visible relative scrollbar-thin">
        <TabsContent value="balance">
          <BalanceCheckPage />
        </TabsContent>
        <TabsContent value="assign">
          <SetCardPage />
        </TabsContent>
        <TabsContent value="pay">
          <PayPage />
        </TabsContent>
        <TabsContent value="items">
          <ItemsPage />
        </TabsContent>
        {uploader && (
          <TabsContent value="upload">
            <UploadPage />
          </TabsContent>
        )}
      </main>
      <div className="w-full">
        <TabsList className="flex justify-between p-0 ">
          <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="balance">
            <CircleHelp />
          </TabsTrigger>
          <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="assign">
            <Link />
          </TabsTrigger>
          <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="pay">
            <CircleDollarSign />
          </TabsTrigger>
          {uploader && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="upload">
              <ArrowUpFromLine />
            </TabsTrigger>
          )}
          {items.length > 0 && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="items">
              <ShoppingBasket />
            </TabsTrigger>
          )}
        </TabsList>
      </div>
    </Tabs>
  )
}
