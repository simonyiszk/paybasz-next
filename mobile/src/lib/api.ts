import {
  ApiRequest,
  AppRequest,
  AppResponse,
  BalanceRequest,
  BalanceResponse,
  CardData,
  CartCheckoutRequest,
  ClaimTokenRequest,
  ItemPurchaseRequest,
  PaymentRequest,
  PaymentStatus,
  ReadingRequest,
  UserList
} from '@/lib/model.ts'
import { addHashedColor, post, sha256Hex } from '@/lib/utils.ts'

const getUrl = (endpoint: string) => `${import.meta.env.VITE_BACKEND_URL}/api/${endpoint}`

const parseValidationStatus = (result: Promise<string>): Promise<boolean> => result.then((res) => res === 'OK').catch(() => false)

export const app = (data: AppRequest): Promise<AppResponse | null> =>
  post({
    url: getUrl('app'),
    deserialize: async (res) => {
      if (res.status !== 200) return null
      const data = (await res.json()) as AppResponse
      data.items = await addHashedColor(data.items, (item) => item.name)
      return data
    },
    data
  })

export const claimToken = (data: ClaimTokenRequest): Promise<PaymentStatus> =>
  post({
    url: getUrl('claim-token'),
    data
  })

export const setCard = (data: CardData): Promise<Response> =>
  post({
    url: getUrl('set-card'),
    deserialize: async (res) => res,
    data
  })

export const balance = (data: BalanceRequest): Promise<BalanceResponse | null> =>
  post({
    url: getUrl('balance'),
    deserialize: async (res) => {
      if (res.status !== 200) return null
      const data = (await res.json()) as BalanceResponse
      data.color = '#' + (await sha256Hex(data.username + data.email)).substring(0, 6)
      return data
    },
    data
  })

export const userList = (data: ApiRequest): Promise<UserList> =>
  post<ApiRequest, UserList>({
    url: getUrl('users'),
    data,
    asJson: true
  }).then((users) => addHashedColor(users, (user) => user.name + user.email))

export const pay = (data: PaymentRequest): Promise<PaymentStatus> => post({ url: getUrl('pay'), data })

export const payItem = (data: ItemPurchaseRequest): Promise<PaymentStatus> => post({ url: getUrl('buy-item'), data })

export const payCart = (data: CartCheckoutRequest): Promise<PaymentStatus> => post({ url: getUrl('checkout'), data })

export const reading = (data: ReadingRequest) => parseValidationStatus(post({ url: getUrl('reading'), data }))

export const upload = (data: PaymentRequest): Promise<PaymentStatus> => post({ url: getUrl('upload'), data })
