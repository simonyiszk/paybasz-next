import { useAppContext } from '@/hooks/useAppContext.ts'
import { useQuery, UseQueryResult } from 'react-query'
import { exportOrderLines, findAllOrderLines } from '@/lib/api/admin.api.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { OrderLine, ValidatedApiCall } from '@/lib/api/model.ts'
import { exportToCsv } from '@/lib/utils.ts'
import { Card } from '@/components/ui/card.tsx'
import { BackAndForwardPagination } from '@/components/ui/pagination.tsx'
import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { AppQueryKeys } from '@/lib/api/common.api.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { ItemView } from '@/page/admin/common/ItemView.tsx'

const OrderLineList = ({
  orderLines,
  page,
  setPage
}: {
  page: number
  setPage: (page: number) => void
  orderLines: UseQueryResult<ValidatedApiCall<OrderLine[]>>
}) => {
  const { currencySymbol } = useAppContext().config
  if (!orderLines.data) return null
  if (orderLines.data.result !== 'Ok') return <span className="text-destructive text-center">Sikertelen betöltés</span>

  if (page === 0 && !orderLines.data.data.length)
    return <h1 className="font-bold text-lg pb-4 text-center">Még nincs egyetlen rendeléssor sem!</h1>

  return (
    <div className="flex flex-col gap-2">
      {<BackAndForwardPagination page={page} setPage={setPage} reachedEnd={orderLines.data.data.length <= 0} />}
      {orderLines.data.data.length <= 0 && <span className="font-bold text-lg pt-6 pb-4 text-center">Nincs több rendeléssor</span>}
      {orderLines.data.data.map((orderLine) => (
        <Card key={orderLine.id} className="p-4 flex flex-row gap-4 items-center flex-wrap">
          <Badge variant="secondary">Rendelés #{orderLine.orderId}</Badge>
          {!!orderLine.paidAmount && (
            <Badge variant="secondary">
              fizetve {orderLine.paidAmount} {currencySymbol}
            </Badge>
          )}
          <span>
            '
            <ItemView
              ItemView={({ item }) => <span>{item.name}</span>}
              itemId={orderLine.itemId}
              loadingPlaceholder={<span>...</span>}
              errorPlaceholder={<span>{orderLine.message}</span>}
            />
            ' termékből {orderLine.itemCount} darab vásárolva {orderLine.usedVoucher && ' utalvány segítségével'}
          </span>
        </Card>
      ))}
      {orderLines.data.data.length > 0 && (
        <BackAndForwardPagination page={page} setPage={setPage} reachedEnd={orderLines.data.data.length <= 0} />
      )}
    </div>
  )
}

export const OrderLinesPage = () => {
  const [page, setPage] = useState(0)
  const { toast } = useToast()
  const { token } = useAppContext()
  const orderLines = useQuery({
    queryKey: [AppQueryKeys.OrderLines, token, page],
    queryFn: () => findAllOrderLines(token, page, 25)
  })

  return (
    <div className="flex-1 h-full relative">
      <div className="flex items-baseline justify-center py-6 gap-4">
        <h1 className="font-bold text-2xl pb-4 text-center">Rendeléssorokk</h1>
        <Button
          variant="secondary"
          onClick={() =>
            exportToCsv('order-lines.csv', () =>
              exportOrderLines(token).then((data) => {
                if (data.result === 'Ok') return data.data
                throw Error()
              })
            )
              .then(() => toast({ description: 'Rendeléssorok exportálva' }))
              .catch(() => toast({ description: 'Hiba az rendeléssorok exportálása közben' }))
          }
        >
          Exportálás
        </Button>
      </div>
      {orderLines.isLoading && (
        <div className="p-4">
          <LoadingIndicator />
        </div>
      )}
      <OrderLineList page={page} setPage={setPage} orderLines={orderLines} />
    </div>
  )
}
