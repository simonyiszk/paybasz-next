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
  cardSerial: string
  gateway: string
  terminalToken: string
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
