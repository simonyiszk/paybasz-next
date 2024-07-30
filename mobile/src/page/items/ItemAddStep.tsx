import { useAppContext } from '@/hooks/useAppContext'
import { ItemCard } from '@/page/items/ItemCard.tsx'
import { Cart, CustomCartEntry, CustomItem, getCustomItemQuantity, getItemQuantity } from '@/page/items/cart.ts'
import { Item } from '@/lib/model.ts'
import { CustomItemDialog } from '@/page/items/CustomItemDialog.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { fuzzySearch } from '@/lib/utils.ts'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

const itemNameSchema = z.object({ name: z.string().optional() })

export const ItemAddStep = ({
  cart,
  onFinished,
  onItemAdded,
  onItemRemoved,
  onCustomItemAdded,
  onCustomItemRemoved
}: {
  cart: Cart
  onFinished: () => void
  onItemAdded: (item: Item) => void
  onItemRemoved: (item: Item) => void
  onCustomItemAdded: (item: CustomItem) => void
  onCustomItemRemoved: (item: CustomItem) => void
}) => {
  const { items } = useAppContext()
  const form = useForm<z.infer<typeof itemNameSchema>>({
    resolver: zodResolver(itemNameSchema),
    defaultValues: { name: '' }
  })
  const [needle, setNeedle] = useState<string>()
  const [itemSuggestions, setItemSuggestions] = useState<Item[]>()
  const [customItemSuggestions, setCustomItemSuggestions] = useState<CustomCartEntry[]>()

  useEffect(() => {
    if (!needle) {
      setItemSuggestions(items)
      setCustomItemSuggestions(cart.customEntries)
      return
    }

    const newItems = fuzzySearch({ needle, haystack: items, getText: (item) => item.name + ' ' + item.abbreviation })
    const newCustomItems = fuzzySearch({ needle, haystack: cart.customEntries, getText: (item) => item.name })
    setItemSuggestions(newItems)
    setCustomItemSuggestions(newCustomItems)
  }, [cart, items, needle]) // the assumption here is that the cart is immutable, so if there is a difference, the cart reference must not be the same

  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">Rendelés összeállítása</h1>
      <Form {...form}>
        <form
          onChange={form.handleSubmit((data) => {
            setNeedle(data.name ?? '')
          })}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="pb-2">
                <FormLabel>Kereső</FormLabel>
                <FormControl>
                  <Input placeholder="Jägermeister" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
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
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))] gap-2 justify-center pb-2">
        <CustomItemDialog onSave={onCustomItemAdded} />

        {customItemSuggestions?.map((item) => (
          <ItemCard
            key={`custom-${item.name}_${item.price}`}
            name={item.name}
            price={item.price}
            isDeletedAfterRemovingAll={true}
            inStock={Infinity} // there is no stock on custom items
            addItem={() => onCustomItemAdded(item)}
            removeItem={() => onCustomItemRemoved(item)}
            quantityInCart={getCustomItemQuantity(cart, item)}
          />
        ))}

        {itemSuggestions?.map((item) => (
          <ItemCard
            key={item.id}
            name={item.name}
            price={item.price}
            isDeletedAfterRemovingAll={false}
            inStock={item.quantity}
            addItem={() => onItemAdded(item)}
            removeItem={() => onItemRemoved(item)}
            quantityInCart={getItemQuantity(cart, item)}
          />
        ))}
      </div>
    </>
  )
}
