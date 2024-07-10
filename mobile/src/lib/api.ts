import {
  AppRequest,
  AppResponse,
  BalanceRequest,
  BalanceResponse,
  CardData,
  GetUserRequest,
  ItemPurchaseRequest,
  PaymentRequest,
  PaymentStatus,
  ReadingRequest
} from '@/lib/model.ts'
import { post } from '@/lib/utils.ts'

const getUrl = (gateway: string, endpoint: string) => `${import.meta.env.VITE_BACKEND_URL}/api/${endpoint}/${gateway}`

const parseValidationStatus = (result: Promise<string>): Promise<boolean> => result.then((res) => res === 'OK').catch(() => false)

export const app = (data: AppRequest): Promise<AppResponse | null> =>
  post({
    url: getUrl(data.gateway, 'app'),
    deserialize: async (res) => {
      if (res.status !== 200) return null
      return res.json()
    },
    data
  })

export const setCard = (data: CardData): Promise<Response> =>
  post({
    url: getUrl(data.gateway, 'set-card'),
    deserialize: async (res) => res,
    data
  })

export const freeBeer = (data: PaymentRequest): Promise<PaymentStatus> =>
  post({
    url: getUrl(data.gateway, 'free-beer'),
    data
  })

export const balance = (data: BalanceRequest): Promise<BalanceResponse | null> =>
  post({
    url: getUrl(data.gateway, 'balance'),
    deserialize: async (res) => {
      if (res.status !== 200) return null
      return res.json()
    },
    data
  })

export const getUser = (data: GetUserRequest): Promise<string> => post({ url: getUrl(data.gateway, 'get-user'), data })

export const pay = (data: PaymentRequest): Promise<PaymentStatus> => post({ url: getUrl(data.gateway, 'pay'), data })
export const payItem = (data: ItemPurchaseRequest): Promise<PaymentStatus> => post({ url: getUrl(data.gateway, 'buy-item'), data })

export const reading = (data: ReadingRequest) =>
  parseValidationStatus(
    post({
      url: getUrl(data.gateway, 'reading'),
      data
    })
  )

export const upload = (data: PaymentRequest): Promise<PaymentStatus> =>
  post({
    url: getUrl(data.gateway, 'upload'),
    data
  })
