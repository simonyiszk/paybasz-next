export type ValidateRequest = {
  gatewayCode: string
  gateway: string
}

export type ReadingRequest = {
  card: string
  gatewayCode: string
  gateway: string
}

export type PaymentRequest = {
  card: string
  amount: number
  gatewayCode: string
  details: string
  gateway: string
}

export type GetUserRequest = {
  userId: number
  gatewayCode: string
  gateway: string
}

export type CardData = {
  card: string
  gateway: string
  gatewayCode: string
  userId: number
}

export type BalanceRequest = {
  card: string
  gatewayCode: string
  gateway: string
}

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
