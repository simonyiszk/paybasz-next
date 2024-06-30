import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import NoNFCBanner from './components/NoNFCBanner'
import TerminalTypeSelector from './components/TerminalTypeSelector.tsx'
import WaitingForCardLoader from './components/WaitingForCardLoader'
import { scanNFC } from './lib/utils'
import { setCard, validate, validateUploader } from '@/api/api.ts'
import { TerminalType, UserType } from '@/model/model.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'

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

function App() {
  const [cardSerial, setCardSerial] = useState<string>()
  const [terminalType, setTerminalType] = useState<TerminalType>()
  const [waitingForCard, setWaitingForCard] = useState(false)
  const [userType, setUserType] = useState<UserType>()
  const [, gatewayName, gatewayCode] = window.location.pathname.split('/')

  useEffect(() => {
    checkUserType(gatewayName, gatewayCode).then(setUserType)
  }, [gatewayName, gatewayCode])

  if (!('NDEFReader' in window)) {
    return <NoNFCBanner />
  }

  if (!userType) {
    return <LoadingIndicator />
  }

  if (!terminalType) {
    return <TerminalTypeSelector setTerminalType={setTerminalType} terminalType={terminalType} />
  }

  return (
    <>
      <p>{cardSerial}</p>
      <div className="flex flex-row flex-wrap gap-2 justify-center px-4 w-full relative">
        {waitingForCard && <WaitingForCardLoader />}
        <Button
          onClick={async () => {
            setWaitingForCard(true)
            const res = await scanNFC()
            setWaitingForCard(false)
            setCardSerial(res.serialNumber)
          }}
        >
          Kártya beolvasása
        </Button>
        <Button onClick={() => setWaitingForCard(true)}>Egyenleg</Button>
        <Button onClick={() => scanNFC().then((result) => setCardSerial(result.serialNumber))}>Fizetés</Button>
        <Button
          onClick={async () => {
            setWaitingForCard(true)
            const res = await scanNFC()
            setWaitingForCard(false)
            setCardSerial(res.serialNumber)
            const pathName = window.location.pathname.split('/')
            console.log(pathName)
            setCard({
              cardSerial: res.serialNumber,
              gateway: pathName[1],
              terminalToken: pathName[2],
              userId: 2
            })
          }}
        >
          Kártya hozzárendelése
        </Button>
        <Button onClick={() => scanNFC().then((result) => setCardSerial(result.serialNumber))}>Feltöltés</Button>
        <Button onClick={() => scanNFC().then((result) => setCardSerial(result.serialNumber))}>Tételek</Button>
      </div>
      <Button
        variant="destructive"
        onClick={() => {
          setCardSerial(undefined)
          setTerminalType(undefined)
        }}
      >
        Reset
      </Button>
    </>
  )
}

export default App
