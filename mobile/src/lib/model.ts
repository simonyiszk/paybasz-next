export type ApiRequest = {
  gatewayCode: string
  gatewayName: string
}

export type ReadingRequest = ApiRequest & {
  card: string
}

export type PaymentRequest = ApiRequest & {
  card: string
  amount: number
  details: string
}

export type ItemPurchaseRequest = ApiRequest & {
  id: number
  card: string
}

export type CartItem = {
  id: number
  quantity: number
}

export type CustomCartItem = {
  name: string
  price: number
  quantity: number
}

export type CartData = {
  items: CartItem[]
  customItems: CustomCartItem[]
}

export type CartCheckoutRequest = ApiRequest & {
  cart: CartData
  card: string
}

export type UserData = {
  id: number
  name: string
  card: string
  phone: string
  email: string
  balance: number
  minimumBalance: number
  allowed: boolean
  processed: boolean
  comment: string
  maxLoan: number
  formattedCard: string
}

export type GetUserRequest = ApiRequest & {
  userId: number
}

export type CardData = ApiRequest & {
  card: string
  userId: number
}

export type BalanceRequest = ApiRequest & {
  card: string
}

export type ClaimTokenRequest = ApiRequest & {
  card: string
  itemId: number
}

export type BalanceResponse = {
  userId: string
  username: string
  email: string
  balance: number
  maxLoan: number
  color: string
}

export type Item = {
  id: number
  name: string
  quantity: number
  code: string
  abbreviation: string
  price: number
  color: string
}

export type AppRequest = ApiRequest

export type AppResponse = {
  uploader: boolean
  items: Item[]
  mobileConfig: MobileConfig
}

export type MobileConfig = {
  showUploadTab: boolean
  showPayTab: boolean
  showBalanceTab: boolean
  showSetCardTab: boolean
  showCartTab: boolean
  showTokenTab: boolean
}

export type UserListItem = {
  id: number
  name: string
  email: string
  hasCardAssigned: boolean
  color: string
}

export enum statusEnum {
  OK,
  WAITING_FOR_CARD,
  WAITING_FOR_USERID,
  WAITING_FOR_AMOUNT,
  SHOWING_BALANCE,
  SHOWING_CARD_ID,
  SUCCESS,
  LOADING
}

export type UserList = UserListItem[]

export const terminalTypes = ['Bar', 'Food', 'Check-in', 'Merch', 'Charity', 'Withdraw', 'Other'] as const
export type TerminalType = (typeof terminalTypes)[number]

export const terminalNames: { [key in TerminalType]: string } = {
  Bar: 'Pult',
  Food: 'Kaja',
  'Check-in': 'Becsek',
  Merch: 'Merch',
  Charity: 'Adomány',
  Withdraw: 'Pénz kivétel',
  Other: 'Egyéb'
}

export const userTypes = ['Uploader', 'Merchant', 'Basic'] as const
export type UserType = (typeof userTypes)[number]

export const addCardStatuses = [
  'ACCEPTED',
  'INTERNAL_ERROR',
  'USER_NOT_FOUND',
  'ALREADY_ADDED',
  'USER_HAS_CARD',
  'UNAUTHORIZED_TERMINAL'
] as const
export type AddCardStatus = (typeof addCardStatuses)[number]

export const paymentStatuses = [
  'ACCEPTED',
  'INTERNAL_ERROR',
  'NOT_ENOUGH_CASH',
  'VALIDATION_ERROR',
  'CARD_REJECTED',
  'UNAUTHORIZED_TERMINAL'
] as const
export type PaymentStatus = (typeof paymentStatuses)[number]
