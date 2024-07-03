import {
  AddCardStatus,
  AppRequest,
  AppResponse,
  BalanceRequest,
  CardData,
  GetUserRequest,
  PaymentRequest,
  PaymentStatus,
  ReadingRequest
} from '@/lib/model.ts'
import { post } from '@/lib/utils.ts'

const getUrl = (gateway: string, endpoint: string) => `${import.meta.env.VITE_BACKEND_URL}/mapi/${endpoint}/${gateway}`

const parseValidationStatus = (result: Promise<string>): Promise<boolean> => result.then((res) => res === 'OK').catch(() => false)

export const app = (data: AppRequest): Promise<AppResponse | undefined> =>
  post({
    url: getUrl(data.gateway, 'app'),
    asJson: true,
    data
  })

export const setCard = (data: CardData): Promise<AddCardStatus> => post({ url: getUrl(data.gateway, 'set-card'), data })

export const freeBeer = (data: PaymentRequest): Promise<PaymentStatus> =>
  post({
    url: getUrl(data.gateway, 'free-beer'),
    data
  })

export const balance = (data: BalanceRequest): Promise<number> =>
  post({
    url: getUrl(data.gateway, 'balance'),
    data
  }).then((res) => Number(res))

export const getUser = (data: GetUserRequest): Promise<string> => post({ url: getUrl(data.gateway, 'get-user'), data })

export const pay = (data: PaymentRequest): Promise<PaymentStatus> => post({ url: getUrl(data.gateway, 'pay'), data })

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
