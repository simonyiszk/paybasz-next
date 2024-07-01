import { useState } from 'react'

import { scanNFC, sha256 } from './lib/utils'
import { balance } from '@/api/api.ts'
import { statusEnum } from './types.ts'
import LoadingModal from './components/LoadingModal.tsx'
import SuccessModal from './components/SuccessModal.tsx'
import InfoModal from './components/InfoModal.tsx'
import InputModal from './components/InputModal.tsx'
import { Button } from './components/ui/button.tsx'
import { useUserContext } from '@/components/UserContext.tsx'
import { useTerminalType } from '@/components/TerminalTypeContext.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Logo } from '@/components/Logo.tsx'
import { BalanceCheckPage } from '@/page/BalanceCheckPage.tsx'
import { SetCardPage } from '@/page/set-card/SetCardPage.tsx'

export const App = () => {
  const { gatewayName, gatewayCode } = useUserContext()
  const [, setTerminalType] = useTerminalType()
  const [info, setInfo] = useState('')
  const [status, setStatus] = useState<statusEnum>(statusEnum.OK)

  const getBalance = async () => {
    const res = await scanNFC(setStatus)
    const balanceData = await balance({
      card: await sha256(res.serialNumber),
      gateway: gatewayName,
      gatewayCode: gatewayCode
    })
    setInfo(balanceData + ' JMF')
    setStatus(statusEnum.SHOWING_BALANCE)
  }
  const readCard = async () => {
    const res = await scanNFC(setStatus)
    setInfo(await sha256(res.serialNumber))
    setStatus(statusEnum.SHOWING_CARD_ID)
  }

  const getAmount = async () => {
    setStatus(statusEnum.WAITING_FOR_AMOUNT)
  }

  return (
    <Tabs defaultValue="balance" className="p-4 max-w-2xl m-auto min-h-[100dvh] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4 sm:gap-8">
        <div className="m-auto sm:m-0">
          <Logo />
        </div>
        <TabsList className="py-8 hidden sm:flex">
          <TabsTrigger className="py-4" value="balance">
            Egyenleg
          </TabsTrigger>
          <TabsTrigger className="py-4" value="assign">
            Hozzáre<span className="sm:hidden">...</span>
            <span className="hidden sm:inline">ndelés</span>
          </TabsTrigger>
          <TabsTrigger className="py-4" value="pay">
            Fizetés
          </TabsTrigger>
          <TabsTrigger className="py-4" value="upload">
            Feltöltés
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex-1">
        <TabsContent value="balance">
          <BalanceCheckPage />
        </TabsContent>
        <TabsContent value="assign">
          <SetCardPage />
        </TabsContent>
        <TabsContent value="pay">Fizetés</TabsContent>
        <TabsContent value="upload">Feltöltés</TabsContent>
      </div>
      <TabsList className="py-8 flex sm:hidden">
        <TabsTrigger className="py-4" value="balance">
          Egyenleg
        </TabsTrigger>
        <TabsTrigger className="py-4" value="assign">
          Hozzáre<span className="sm:hidden">...</span>
          <span className="hidden sm:inline">ndelés</span>
        </TabsTrigger>
        <TabsTrigger className="py-4" value="pay">
          Fizetés
        </TabsTrigger>
        <TabsTrigger className="py-4" value="upload">
          Feltöltés
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 justify-center px-4 w-full relative">
        {status == statusEnum.WAITING_FOR_CARD && (
          <LoadingModal>
            <h1 className="text-black">Várakozás a kártyára...</h1>
          </LoadingModal>
        )}
        {status == statusEnum.SHOWING_CARD_ID && <InfoModal onClose={() => setStatus(statusEnum.OK)} message={info} />}
        {status == statusEnum.SHOWING_BALANCE && <InfoModal onClose={() => setStatus(statusEnum.OK)} message={info} />}
        {status == statusEnum.SUCCESS && <SuccessModal />}
        {status == statusEnum.LOADING && <SuccessModal />}
        {status == statusEnum.WAITING_FOR_USERID && <InputModal onFinish={(e) => console.log(e)} message="Enter User Id" isNumberOnly />}
        {status == statusEnum.WAITING_FOR_AMOUNT && (
          <InputModal onFinish={(e) => console.log(e)} message="Enter upload amount" isNumberOnly />
        )}
        <Button onClick={readCard}>Kártya beolvasása</Button>
        <Button onClick={getBalance}>Egyenleg</Button>
        <Button onClick={() => {}}>Fizetés</Button>
        <Button onClick={getAmount}>Feltöltés</Button>
        <Button onClick={() => {}}>Tételek</Button>
      </div>
      <Button
        variant="destructive"
        onClick={() => {
          setTerminalType(undefined)
        }}
      >
        Reset
      </Button>
    </>
  )
}
