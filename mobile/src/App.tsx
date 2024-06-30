import { useState } from 'react'
import NoNFCBanner from './components/NoNFCBanner'
import TerminalTypeSelector from './components/TerminalTypeSelector.tsx'

import { scanNFC, sha256 } from './lib/utils'
import { setCard, validate, validateUploader, balance } from '@/api/api.ts'
import { statusEnum } from './types.ts'
import { TerminalType } from './model/model.ts'
import LoadingModal from './components/LoadingModal.tsx'
import SuccessModal from './components/SuccessModal.tsx'
import InfoModal from './components/InfoModal.tsx'
import InputModal from './components/InputModal.tsx'
import { Button } from './components/ui/Button.tsx'
import { getBalanceData } from './lib/network.ts'

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
  const [info, setInfo] = useState("");
  const [terminalType, setTerminalType] = useState<TerminalType>();
  const [status, setStatus] = useState<statusEnum>(statusEnum.OK);
  const [, gatewayName, gatewayCode] = window.location.pathname.split('/')
  if (!("NDEFReader" in window)) {
    return <NoNFCBanner />;
  }
  if (!terminalType) {
    return (
      <TerminalTypeSelector
        setTerminalType={setTerminalType}
        terminalType={terminalType}
      />
    );
  }
  const assignCard = async () => {
    const res = await scanNFC(setStatus);
    const networkData = await setCard({
      cardSerial: res.serialNumber,
      gateway: gatewayName,
      terminalToken: gatewayCode,
      userId: 1,
    });
    if (networkData.ok) {
      setStatus(statusEnum.SUCCESS);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        setStatus(statusEnum.OK)
      );
    }
  };
  const getBalance = async () => {
    const res = await scanNFC(setStatus);
    const balanceData = await balance({
      card: await sha256(res.serialNumber),
      gateway: gatewayName,
      gatewayCode: gatewayCode,
    });
    setInfo((await balance.text()) + " JMF");
    setStatus(statusEnum.SHOWING_BALANCE);
  };
  const readCard = async () => {
    const res = await scanNFC(setStatus);
    setInfo(await sha256(res.serialNumber));
    setStatus(statusEnum.SHOWING_CARD_ID);
  };

  const payment = async () => {};
  const getAmount = async () => {
    setStatus(statusEnum.WAITING_FOR_AMOUNT);
  };
  const uploadAmount = async () => {
    setStatus(statusEnum.LOADING);
  };

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 justify-center px-4 w-full relative">
        {status == statusEnum.WAITING_FOR_CARD && (
          <LoadingModal>
            <h1 className="text-black">Várakozás a kártyára...</h1>
          </LoadingModal>
        )}
        {status == statusEnum.SHOWING_CARD_ID && (
          <InfoModal onClose={() => setStatus(statusEnum.OK)} message={info} />
        )}
        {status == statusEnum.SHOWING_BALANCE && (
          <InfoModal onClose={() => setStatus(statusEnum.OK)} message={info} />
        )}
        {status == statusEnum.SUCCESS && <SuccessModal />}
        {status == statusEnum.LOADING && <SuccessModal />}
        {status == statusEnum.WAITING_FOR_USERID && (
          <InputModal
            onFinish={(e) => console.log(e)}
            message="Enter User Id"
            isNumberOnly
          />
        )}
        {status == statusEnum.WAITING_FOR_AMOUNT && (
          <InputModal
            onFinish={(e) => console.log(e)}
            message="Enter upload amount"
            isNumberOnly
          />
        )}
        <Button onClick={readCard}>Kártya beolvasása</Button>
        <Button onClick={getBalance}>Egyenleg</Button>
        <Button onClick={() => {}}>Fizetés</Button>
        <Button onClick={assignCard}>Kártya hozzárendelése</Button>
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

export default App
