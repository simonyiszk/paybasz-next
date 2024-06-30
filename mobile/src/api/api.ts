import type { BalanceRequest, CardData, GetUserRequest, PaymentRequest, ReadingRequest, ValidateRequest } from '@/model/model.ts'
import { post } from '@/lib/utils.ts'

const getUrl = (gateway: string, endpoint: string) => `${import.meta.env.VITE_BACKEND_URL}/api/v2/${endpoint}/${gateway}`

export const setCard = (data: CardData) => post({ url: getUrl(data.gateway, 'set-card'), data })

/// Checks if gateway is valid
export const validate = (data: ValidateRequest): Promise<boolean> =>
  post<ValidateRequest, string>({
    url: getUrl(data.gateway, 'validate'),
    data
  })
    .then((res) => res === 'OK')
    .catch(() => false)

export const freeBeer = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'free-beer'), data })

export const balance = (data: BalanceRequest) => post({ url: getUrl(data.gateway, 'balance'), data })

export const getUser = (data: GetUserRequest) => post({ url: getUrl(data.gateway, 'get-user'), data })

export const pay = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'pay'), data })

export const reading = (data: ReadingRequest) => post({ url: getUrl(data.gateway, 'reading'), data })

export const upload = (data: PaymentRequest) => post({ url: getUrl(data.gateway, 'upload'), data })

/// Checks if the user can upload funds
export const validateUploader = (data: ValidateRequest): Promise<boolean> =>
  post<ValidateRequest, string>({
    url: getUrl(data.gateway, 'validate-uploader'),
    data
  })
    .then((res) => res === 'OK')
    .catch(() => false)
