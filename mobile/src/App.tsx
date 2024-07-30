import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Logo } from '@/components/Logo.tsx'
import { BalanceCheckPage } from '@/page/BalanceCheckPage.tsx'
import { SetCardPage } from '@/page/set-card/SetCardPage.tsx'
import { UploadPage } from '@/page/upload/UploadPage.tsx'
import { useAppContext } from '@/hooks/useAppContext'
import { PayPage } from '@/page/pay/PayPage.tsx'
import { ItemsPage } from './page/items/ItemsPage'
import { ArrowUpFromLine, CircleDollarSign, CircleHelp, Gem, Link, ShoppingBasket } from 'lucide-react'
import { TokensPage } from '@/page/tokens/TokensPage.tsx'

const TabKey = 'selectedTab'

export const App = () => {
  const { uploader, items, config } = useAppContext()
  const { showBalanceTab, showCartTab, showPayTab, showSetCardTab, showTokenTab, showUploadTab } = config
  return (
    <Tabs
      onValueChange={(tab) => localStorage.setItem(TabKey, tab)}
      defaultValue={localStorage.getItem(TabKey) || 'balance'}
      className="max-w-2xl m-auto h-[100dvh] flex flex-col items-center relative"
    >
      <main className="flex-1 w-full overflow-y-auto overflow-x-visible relative scrollbar-thin pt-4 px-4">
        <div className="flex flex-col w-full items-center mb-2 gap-4 sm:gap-8 m-auto">
          <Logo />
        </div>
        {showBalanceTab && (
          <TabsContent value="balance">
            <BalanceCheckPage />
          </TabsContent>
        )}
        {showSetCardTab && (
          <TabsContent value="assign">
            <SetCardPage />
          </TabsContent>
        )}
        {showPayTab && (
          <TabsContent value="pay">
            <PayPage />
          </TabsContent>
        )}
        {showCartTab && items.length > 0 && (
          <TabsContent value="items">
            <ItemsPage />
          </TabsContent>
        )}
        {showUploadTab && uploader && (
          <TabsContent value="upload">
            <UploadPage />
          </TabsContent>
        )}
        {showTokenTab && items.length > 0 && (
          <TabsContent value="tokens">
            <TokensPage />
          </TabsContent>
        )}
      </main>
      <div className="w-full px-4 pb-4 pt-2">
        <TabsList className="flex justify-between p-0 ">
          {showBalanceTab && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="balance">
              <CircleHelp />
            </TabsTrigger>
          )}
          {showSetCardTab && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="assign">
              <Link />
            </TabsTrigger>
          )}
          {showPayTab && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="pay">
              <CircleDollarSign />
            </TabsTrigger>
          )}
          {showUploadTab && uploader && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="upload">
              <ArrowUpFromLine />
            </TabsTrigger>
          )}
          {showCartTab && items.length > 0 && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="items">
              <ShoppingBasket />
            </TabsTrigger>
          )}
          {showTokenTab && items.length > 0 && (
            <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value="tokens">
              <Gem />
            </TabsTrigger>
          )}
        </TabsList>
      </div>
    </Tabs>
  )
}
