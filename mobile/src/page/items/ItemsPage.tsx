import { useState } from 'react'
import { ScanCardStep } from '../common/ScanCardStep'
import { CartPayStep } from './CartPayStep.tsx'
import { ItemAddStep } from '@/page/items/ItemAddStep.tsx'
import {
  addCustomItem,
  addItem,
  CustomItem,
  EmptyCart,
  getCartTotal,
  getCartTotalCount,
  removeCustomItem,
  removeItem
} from '@/page/items/cart.ts'
import { Item } from '@/lib/model.ts'
import { CartEditStep } from '@/page/items/CartEditStep.tsx'

export const ItemsPage = () => {
  const [cart, setCart] = useState(EmptyCart)
  const [itemSelectionFinished, setItemSelectionFinished] = useState(false)
  const [cartEditFinished, setCartEditFinished] = useState(false)
  const [card, setCard] = useState<string>()

  const reset = () => {
    setCart(EmptyCart)
    setItemSelectionFinished(false)
    setCartEditFinished(false)
    setCard(undefined)
  }

  const onItemAdded = (item: Item) => {
    setCart(addItem(cart, item))
  }

  const onItemRemoved = (item: Item) => {
    setCart(removeItem(cart, item))
  }

  const onCustomItemAdded = (item: CustomItem) => {
    setCart(addCustomItem(cart, item))
  }

  const onCustomItemRemoved = (item: CustomItem) => {
    setCart(removeCustomItem(cart, item))
  }

  let currentStep
  if (!itemSelectionFinished) {
    currentStep = (
      <ItemAddStep
        cart={cart}
        onFinished={() => setItemSelectionFinished(true)}
        onItemAdded={onItemAdded}
        onItemRemoved={onItemRemoved}
        onCustomItemAdded={onCustomItemAdded}
        onCustomItemRemoved={onCustomItemRemoved}
      />
    )
  } else if (!cartEditFinished) {
    currentStep = (
      <CartEditStep
        cart={cart}
        onFinished={() => setCartEditFinished(true)}
        onBack={() => setItemSelectionFinished(false)}
        clearCart={reset}
        onItemAdded={onItemAdded}
        onItemRemoved={onItemRemoved}
        onCustomItemAdded={onCustomItemAdded}
        onCustomItemRemoved={onCustomItemRemoved}
      />
    )
  } else if (!card) {
    currentStep = (
      <ScanCardStep setCard={setCard} amount={getCartTotal(cart)} message={`${getCartTotalCount(cart)} tétel vásárlása`} onAbort={reset} />
    )
  } else {
    currentStep = <CartPayStep cart={cart} card={card} onReset={reset} />
  }

  return <div className="flex-1 h-full relative">{currentStep}</div>
}
