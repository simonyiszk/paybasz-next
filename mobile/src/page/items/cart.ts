import { Item } from '@/lib/model'

export type CustomItem = {
  name: string
  price: number
}

export type CustomCartEntry = CustomItem & {
  quantity: number
}

export type CartEntry = {
  item: Item
  quantity: number
}

export type Cart = {
  items: CartEntry[]
  customEntries: CustomCartEntry[]
}

export const EmptyCart: Cart = {
  customEntries: [],
  items: []
}

export const findEntry = (cart: Cart, item: Item) => cart.items.find((existing) => existing.item.id === item.id)

export const addItem = (cart: Cart, item: Item): Cart => {
  const itemsCopy = [...cart.items]
  const existingItem = findEntry(cart, item)
  if (existingItem !== undefined) {
    existingItem.quantity++
  } else {
    itemsCopy.push({ item, quantity: 1 })
    itemsCopy.sort((a, b) => a.item.name.localeCompare(b.item.name))
  }
  return { customEntries: cart.customEntries, items: itemsCopy }
}

export const removeItem = (cart: Cart, item: Item): Cart => {
  let itemsCopy = [...cart.items]
  const existingItem = findEntry(cart, item)
  if (existingItem !== undefined) {
    existingItem.quantity--
    if (existingItem.quantity <= 0) {
      itemsCopy = itemsCopy.filter((existing) => existing.item.id !== item.id)
    }
  } else {
    return cart
  }
  return { customEntries: cart.customEntries, items: itemsCopy }
}

export const getItemQuantity = (cart: Cart, item: Item) => findEntry(cart, item)?.quantity ?? 0

export const findCustomEntry = (cart: Cart, item: CustomItem) =>
  cart.customEntries.find((entry) => entry.name === item.name && entry.price === item.price)

export const addCustomItem = (cart: Cart, item: CustomItem): Cart => {
  const itemsCopy = [...cart.customEntries]
  const existingItem = findCustomEntry(cart, item)
  if (existingItem !== undefined) {
    existingItem.quantity++
  } else {
    itemsCopy.push({ ...item, quantity: 1 })
    itemsCopy.sort((a, b) => a.name.localeCompare(b.name))
  }
  return { customEntries: itemsCopy, items: cart.items }
}

export const removeCustomItem = (cart: Cart, item: CustomItem): Cart => {
  let itemsCopy = [...cart.customEntries]
  const existingItem = findCustomEntry(cart, item)
  if (existingItem !== undefined) {
    existingItem.quantity--
    if (existingItem.quantity <= 0) {
      itemsCopy = itemsCopy.filter((existing) => existing.name !== item.name || existing.price !== item.price)
    }
  } else {
    return cart
  }
  return { customEntries: itemsCopy, items: cart.items }
}

export const getCustomItemQuantity = (cart: Cart, item: CustomItem) => findCustomEntry(cart, item)?.quantity ?? 0

export const getCartTotal = (cart: Cart): number =>
  cart.items.reduce((sum, item) => sum + item.quantity * item.item.price, 0) +
  cart.customEntries.reduce((sum, item) => sum + item.quantity * item.price, 0)

export const getCartTotalCount = (cart: Cart): number =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0) + cart.customEntries.reduce((sum, item) => sum + item.quantity, 0)
