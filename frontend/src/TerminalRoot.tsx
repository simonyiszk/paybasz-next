import { useAppContext } from '@/hooks/useAppContext'
import { ArrowLeftRight, ArrowUpFromLine, CircleDollarSign, CircleHelp, Link, ShoppingBasket, TicketCheck } from 'lucide-react'
import { lazy, ReactNode } from 'react'
import { AppLayout, AppTab, AppTabTrigger } from '@/components/AppLayout.tsx'

const SetCardPage = lazy(() => import('@/page/terminal/set-card/SetCardPage.tsx'))
const UploadPage = lazy(() => import('@/page/terminal/upload/UploadPage.tsx'))
const PayPage = lazy(() => import('@/page/terminal/pay/PayPage.tsx'))
const TransferPage = lazy(() => import('@/page/terminal/transfer/TransferPage.tsx'))
const ItemsPage = lazy(() => import('@/page/terminal/items/ItemsPage.tsx'))
const BalanceCheckPage = lazy(() => import('@/page/terminal/BalanceCheckPage.tsx'))
const TokensPage = lazy(() => import('@/page/terminal/tokens/TokensPage.tsx'))

const TabKey = 'selectedTab'

const TabIcons: { [key: string]: ReactNode } = {
  balance: <CircleHelp />,
  assign: <Link />,
  pay: <CircleDollarSign />,
  upload: <ArrowUpFromLine />,
  items: <ShoppingBasket />,
  tokens: <TicketCheck />,
  transfer: <ArrowLeftRight />
}

export const TerminalRoot = () => {
  const { config, principal } = useAppContext()
  const { showBalanceTab, showCartTab, showPayTab, showSetCardTab, showTokenTab, showUploadTab, showTransferTab } = config

  const { canAssignCards, canRedeemVouchers, canSellItems, canTransfer, canUpload } = principal

  return (
    <AppLayout
      tabKey={TabKey}
      defaultTab="balance"
      tabIcons={TabIcons}
      tabTriggers={() => (
        <>
          {showBalanceTab && <AppTabTrigger key="balance" tab="balance" child={TabIcons['balance']} />}
          {showSetCardTab && canAssignCards && <AppTabTrigger key="assign" tab="assign" child={TabIcons['assign']} />}
          {showPayTab && canSellItems && <AppTabTrigger key="pay" tab="pay" child={TabIcons['pay']} />}
          {showTransferTab && canTransfer && <AppTabTrigger key="transfer" tab="transfer" child={TabIcons['transfer']} />}
          {showUploadTab && canUpload && <AppTabTrigger key="upload" tab="upload" child={TabIcons['upload']} />}
          {showCartTab && canSellItems && <AppTabTrigger key="items" tab="items" child={TabIcons['items']} />}
          {showTokenTab && canRedeemVouchers && <AppTabTrigger key="tokens" tab="tokens" child={TabIcons['tokens']} />}
        </>
      )}
      tabs={() => (
        <>
          {showBalanceTab && <AppTab key="balance" tab="balance" child={<BalanceCheckPage />} />}
          {showSetCardTab && canAssignCards && <AppTab key="assign" tab="assign" child={<SetCardPage />} />}
          {showPayTab && canSellItems && <AppTab key="pay" tab="pay" child={<PayPage />} />}
          {showTransferTab && canTransfer && <AppTab key="transfer" tab="transfer" child={<TransferPage />} />}
          {showUploadTab && canUpload && <AppTab key="upload" tab="upload" child={<UploadPage />} />}
          {showCartTab && canSellItems && <AppTab key="items" tab="items" child={<ItemsPage />} />}
          {showTokenTab && canRedeemVouchers && <AppTab key="tokens" tab="tokens" child={<TokensPage />} />}
        </>
      )}
    />
  )
}
