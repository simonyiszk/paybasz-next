import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Logo } from '@/components/Logo.tsx'
import { useAppContext } from '@/hooks/useAppContext'
import { ArrowUpFromLine, CircleDollarSign, CircleHelp, Gem, Link, ShoppingBasket } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher.tsx'
import { lazy, ReactNode, Suspense } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { EnableRotatedForCustomerToggle } from '@/components/EnableRotatedForCustomerToggle.tsx'

const SetCardPage = lazy(() => import('@/page/set-card/SetCardPage.tsx'))
const UploadPage = lazy(() => import('@/page/upload/UploadPage.tsx'))
const PayPage = lazy(() => import('@/page/pay/PayPage.tsx'))
const ItemsPage = lazy(() => import('@/page/items/ItemsPage.tsx'))
const BalanceCheckPage = lazy(() => import('@/page/BalanceCheckPage.tsx'))
const TokensPage = lazy(() => import('@/page/tokens/TokensPage.tsx'))

const TabKey = 'selectedTab'

const AppTab = ({ child, tab }: { child: ReactNode; tab: string }) => (
  <TabsContent value={tab}>
    <Suspense fallback={<LoadingIndicator />}>{child}</Suspense>
  </TabsContent>
)

const AppTabTrigger = ({ child, tab }: { child: ReactNode; tab: string }) => (
  <TabsTrigger className="py-4 px-2 text-[.6rem] sm:text-base flex-1" value={tab}>
    {child}
  </TabsTrigger>
)

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
        <div className="flex flex-col w-full items-center mb-8 gap-4 sm:gap-8 m-auto relative">
          <Logo />
          <ThemeSwitcher />
          <EnableRotatedForCustomerToggle />
        </div>
        {showBalanceTab && <AppTab tab="balance" child={<BalanceCheckPage />} />}
        {showSetCardTab && <AppTab tab="assign" child={<SetCardPage />} />}
        {showPayTab && <AppTab tab="pay" child={<PayPage />} />}
        {showUploadTab && uploader && <AppTab tab="upload" child={<UploadPage />} />}
        {showCartTab && items.length > 0 && <AppTab tab="items" child={<ItemsPage />} />}
        {showTokenTab && items.length > 0 && <AppTab tab="tokens" child={<TokensPage />} />}
      </main>
      <div className="w-full px-4 pb-4 pt-2">
        <TabsList className="flex justify-between p-0 ">
          {showBalanceTab && <AppTabTrigger tab="balance" child={<CircleHelp />} />}
          {showSetCardTab && <AppTabTrigger tab="assign" child={<Link />} />}
          {showPayTab && <AppTabTrigger tab="pay" child={<CircleDollarSign />} />}
          {showUploadTab && uploader && <AppTabTrigger tab="upload" child={<ArrowUpFromLine />} />}
          {showCartTab && items.length > 0 && <AppTabTrigger tab="items" child={<ShoppingBasket />} />}
          {showTokenTab && items.length > 0 && <AppTabTrigger tab="tokens" child={<Gem />} />}
        </TabsList>
      </div>
    </Tabs>
  )
}
