import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { cn, compactFormat, formatNumber } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { ColorMarker } from '@/components/ColorMarker.tsx'
import { useAppContext } from '@/hooks/useAppContext.ts'

export const ItemCard = ({
  name,
  price,
  color,
  inStock,
  isDeletedAfterRemovingAll,
  addItem,
  removeItem,
  quantityInCart = 0
}: {
  name: string
  price: number
  color?: string
  inStock: number
  isDeletedAfterRemovingAll: boolean
  addItem: () => void
  removeItem: () => void
  quantityInCart?: number
}) => {
  const { currencySymbol } = useAppContext().config
  const noStock = inStock <= 0
  const remainingQuantity = inStock - quantityInCart
  return (
    <div className="relative overflow-hidden h-full">
      <Card className={cn('h-full flex flex-col relative overflow-clip', noStock && 'opacity-35')}>
        <ColorMarker color={color} />
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {remainingQuantity < 50 && <>{compactFormat(remainingQuantity)} raktáron | </>}
            {formatNumber(price)} {currencySymbol}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="tabular-nums">
            <ShoppingCart className="inline" /> Kosárban: {quantityInCart} db
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 items-center justify-stretch">
          <Button variant="outline" onClick={removeItem} disabled={quantityInCart <= 0} className="flex-1">
            {isDeletedAfterRemovingAll && quantityInCart <= 1 ? <Trash2 /> : <Minus />}
          </Button>
          <Button variant="secondary" onClick={addItem} disabled={inStock - quantityInCart <= 0} className="flex-1">
            <Plus />
          </Button>
        </CardFooter>
      </Card>
      {noStock && (
        <span className="flex items-center justify-center text-red-500 font-bold absolute -rotate-45 top-0 left-0 right-0 m-auto bottom-0 text-center text-2xl">
          Elfogyott
        </span>
      )}
    </div>
  )
}
