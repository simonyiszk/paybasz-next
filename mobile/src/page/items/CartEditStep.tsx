import { Cart, CustomItem } from '@/page/items/cart.ts'
import { Item } from '@/lib/model.ts'
import { ItemCard } from '@/page/items/ItemCard.tsx'
import { Button } from '@/components/ui/button.tsx'

export const CartEditStep = ({
  cart,
  onBack,
  onFinished,
  clearCart,
  onItemAdded,
  onItemRemoved,
  onCustomItemAdded,
  onCustomItemRemoved
}: {
  cart: Cart
  onBack: () => void
  onFinished: () => void
  clearCart: () => void
  onItemAdded: (item: Item) => void
  onItemRemoved: (item: Item) => void
  onCustomItemAdded: (item: CustomItem) => void
  onCustomItemRemoved: (item: CustomItem) => void
}) => (
  <>
    <h1 className="font-bold text-2xl pb-4 text-center">Kosár áttekintése</h1>
    <Button
      className="w-full mb-2"
      disabled={!cart.customEntries.length && !cart.items.length}
      onClick={(e) => {
        e.preventDefault()
        onFinished()
      }}
    >
      Tovább
    </Button>
    <Button
      className="w-full mb-2"
      variant="secondary"
      onClick={(e) => {
        e.preventDefault()
        onBack()
      }}
    >
      Vissza
    </Button>
    {!!cart.customEntries.length && (
      <>
        <h2 className="font-bold text-lg pb-2 text-center">Egyedi tételek</h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))] gap-2 justify-center pb-2">
          {cart.customEntries.map((item) => (
            <ItemCard
              key={`custom-${item.name}_${item.price}`}
              name={item.name}
              price={item.price}
              isDeletedAfterRemovingAll={true}
              inStock={Infinity} // there is no stock on custom items
              addItem={() => onCustomItemAdded(item)}
              removeItem={() => onCustomItemRemoved(item)}
              quantityInCart={item.quantity}
            />
          ))}
        </div>
      </>
    )}

    {!!cart.items.length && (
      <>
        <h2 className="font-bold text-lg pt-4 pb-2 text-center">Egyszerű tételek</h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))] gap-2 justify-center pb-2">
          {cart.items.map((item) => (
            <ItemCard
              key={item.item.id}
              name={item.item.name}
              price={item.item.price}
              isDeletedAfterRemovingAll={true}
              inStock={item.item.quantity}
              addItem={() => onItemAdded(item.item)}
              removeItem={() => onItemRemoved(item.item)}
              quantityInCart={item.quantity}
            />
          ))}
        </div>
      </>
    )}
    <Button
      className="w-full mb-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault()
        clearCart()
      }}
    >
      Kosár törlése
    </Button>
  </>
)
