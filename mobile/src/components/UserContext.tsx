import { UserType } from '@/model/model.ts'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { validate, validateUploader } from '@/api/api.ts'

const UserContext = createContext<UserData>({} as UserData)

export type UserData = {
  type: UserType
  gatewayName: string
  gatewayCode: string
}

export const useUserContext = (): UserData => useContext(UserContext)

export const UserStateValidator: FC<PropsWithChildren> = ({ children }) => {
  const [, gatewayName, gatewayCode] = window.location.pathname.split('/')
  const [userData, setUserData] = useState<UserData>()

  useEffect(() => {
    checkUserType(gatewayName, gatewayCode).then((type) =>
      setUserData({
        gatewayCode,
        gatewayName,
        type
      })
    )
  }, [gatewayName, gatewayCode])

  if (!userData) {
    return <LoadingIndicator />
  }

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>
}

const checkUserType = async (gatewayName: string, gatewayCode: string) => {
  if (!gatewayName || !gatewayCode) {
    return 'Basic'
  }

  const isUploader = await validateUploader({ gatewayCode, gateway: gatewayName })
  if (isUploader) {
    return 'Uploader'
  }

  const isMerchant = await validate({ gatewayCode, gateway: gatewayName })
  if (isMerchant) {
    return 'Merchant'
  }

  return 'Basic'
}
