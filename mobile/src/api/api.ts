import type { CardData } from '@/model/CardData.ts'
import type { ValidateRequest } from '@/model/ValidateRequest.ts'
import type { PaymentRequest } from '@/model/PaymentRequest.ts'
import type { BalanceRequest } from '@/model/BalanceRequest.ts'
import type { GetUserRequest } from '@/model/GetUserRequest.ts'
import type { ReadingRequest } from '@/model/ReadingRequest.ts'
import { post } from '@/lib/utils.ts'

const getUrl = (gateway: string, endpoint: string) => `${import.meta.env.VITE_BACKEND_URL}/api/v2/${endpoint}/${gateway}`

export const setCard = (data: CardData) => post({ url: getUrl(data.gateway, 'set-card'), data })

export const validate = (data: ValidateRequest) => post({ url: getUrl(data.gateway, 'validate'), data })

export const freeBeer = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'free-beer'), data })

export const balance = (data: BalanceRequest) => post({ url: getUrl(data.gateway, 'balance'), data })

export const getUser = (data: GetUserRequest) => post({ url: getUrl(data.gateway, 'get-user'), data })

export const pay = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'pay'), data })

export const reading = (data: ReadingRequest) => post({ url: getUrl(data.gateway, 'reading'), data })

export const upload = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'upload'), data })

export const validateUploader = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'validate-uploader'), data })
