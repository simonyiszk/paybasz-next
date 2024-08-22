import { Button } from '@/components/ui/button.tsx'
import { exportToCsv } from '@/lib/utils.ts'
import { exportOrderLines, exportOrders, exportOrdersWithOrderLines } from '@/lib/api/admin.api.ts'
import { useAppContext } from '@/hooks/useAppContext.ts'
import { toast } from '@/components/ui/use-toast.ts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'

export const OrderExportDropdown = () => {
  const { token } = useAppContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Műveletek</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            exportToCsv('orders-with-order-lines.csv', () =>
              exportOrdersWithOrderLines(token).then((data) => {
                if (data.result === 'Ok') return data.data
                throw Error()
              })
            )
              .then(() => toast({ description: 'Rendelések exportálva' }))
              .catch(() => toast({ description: 'Hiba az rendelések exportálása közben' }))
          }
        >
          Rendelések exportálása rendeléssorokkal (Ezt látod a táblázatban)
        </DropdownMenuItem>
        <DropdownMenuItem
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
          Rendelések exportálása
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            exportToCsv('order-lines.csv', () =>
              exportOrderLines(token).then((data) => {
                if (data.result === 'Ok') return data.data
                throw Error()
              })
            )
              .then(() => toast({ description: 'rendelésok exportálva' }))
              .catch(() => toast({ description: 'Hiba az rendelésok exportálása közben' }))
          }
        >
          Rendeléssorok exportálása
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
