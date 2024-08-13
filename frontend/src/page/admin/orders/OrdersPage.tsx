import { useAppContext } from '@/hooks/useAppContext.ts'
import { useQuery, UseQueryResult } from 'react-query'
import { exportOrders, findAllOrders } from '@/lib/api/admin.api.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { Order, ValidatedApiCall } from '@/lib/api/model.ts'
import { exportToCsv, formatTimestamp } from '@/lib/utils.ts'
import { Card } from '@/components/ui/card.tsx'
import { BackAndForwardPagination } from '@/components/ui/pagination.tsx'
import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { AppQueryKeys } from '@/lib/api/common.api.ts'
import { AccountNameView } from '@/page/admin/common/AccountView.tsx'

const OrderList = ({
  orders,
  page,
  setPage
}: {
  page: number
  setPage: (page: number) => void
  orders: UseQueryResult<ValidatedApiCall<Order[]>>
}) => {
  if (!orders.data) return null
  if (orders.data.result !== 'Ok') return <span className="text-destructive text-center">Sikertelen betöltés</span>

  if (page === 0 && !orders.data.data.length)
    return <h1 className="font-bold text-lg pb-4 text-center">Még nincs egyetlen rendelés sem!</h1>

  return (
    <div className="flex flex-col gap-2">
      {<BackAndForwardPagination page={page} setPage={setPage} reachedEnd={orders.data.data.length <= 0} />}
      {orders.data.data.length <= 0 && <span className="font-bold text-lg pt-6 pb-4 text-center">Nincs több rendelés</span>}
      {orders.data.data.map((order) => (
        <Card key={order.id} className="p-4 flex flex-row gap-4 items-center flex-wrap">
          <span className="text-xs font-mono">{formatTimestamp(order.timestamp)}</span>{' '}
          <span>
            #{order.id} azonosítójú rendelés végrehajtva{' '}
            <strong>
              <AccountNameView accountId={order.accountId} />
            </strong>{' '}
            számlájának terhére
          </span>
        </Card>
      ))}
      {orders.data.data.length > 0 && <BackAndForwardPagination page={page} setPage={setPage} reachedEnd={orders.data.data.length <= 0} />}
    </div>
  )
}

export const OrdersPage = () => {
  const [page, setPage] = useState(0)
  const { toast } = useToast()
  const { token } = useAppContext()
  const orders = useQuery({
    queryKey: [AppQueryKeys.Orders, token, page],
    queryFn: () => findAllOrders(token, page, 25)
  })

  return (
    <div className="flex-1 h-full relative">
      <div className="flex items-baseline justify-center py-6 gap-4">
        <h1 className="font-bold text-2xl pb-4 text-center">Rendelések</h1>
        <Button
          variant="secondary"
          onClick={() =>
            exportToCsv('orders.csv', () =>
              exportOrders(token).then((data) => {
                if (data.result === 'Ok') return data.data
                throw Error()
              })
            )
              .then(() => toast({ description: 'Rendelések exportálva' }))
              .catch(() => toast({ description: 'Hiba az rendelések exportálása közben' }))
          }
        >
          Exportálás
        </Button>
      </div>
      {orders.isLoading && (
        <div className="p-4">
          <LoadingIndicator />
        </div>
      )}
      <OrderList page={page} setPage={setPage} orders={orders} />
    </div>
  )
}
