import { useState } from "react";
import { Button } from "@/components/ui/button";
import NoNFCBanner from "./components/NoNFCBanner";
import TerminalTypeSelector from "./TerminalTypeSelector";
import WaitingForCardLoader from "./components/WaitingForCardLoader";
import { scanNFC } from "./lib/utils";

type CardData = {
  cardSerial: string
  terminalName: string
  terminalToken: string
  userId: number
}
const setCard = async (cardData: CardData) => {
  return fetch(import.meta.env.VITE_BACKEND_URL + "/set-card/" + cardData.terminalName, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify({
      card: cardData.cardSerial,
      userId: cardData.userId,
      gatewayCode: cardData.terminalToken
    })
  });
};

/**
 * /api/v2/set-card/<terminal name>
 *  {
 "card": <hashed card id>,
 "userId": 2,
 "gatewayCode":<terminal token>
 }
 */

function App() {
  const [cardSerial, setCardSerial] = useState("");
  const [terminalType, setTerminalType] = useState("select");
  const [waitingForCard, setWaitingForCard] = useState(false);
  if (!("NDEFReader" in window)) {
    return <NoNFCBanner />;
  }
  if (terminalType === "select") {
    return <TerminalTypeSelector setTerminalType={setTerminalType} terminalType={terminalType} />;
  }

  return (
    <>
      <p>{cardSerial}</p>
      <div className="flex flex-row flex-wrap gap-2 justify-center px-4 w-full relative">
        {waitingForCard && <WaitingForCardLoader />}
        <Button
          onClick={async () => {
            setWaitingForCard(true);
            const res = await scanNFC();
            setWaitingForCard(false);
            setCardSerial(res.serialNumber);
          }}
        >
          Kártya beolvasása
        </Button>
        <Button onClick={() => setWaitingForCard(true)}>Egyenleg</Button>
        <Button onClick={() => scanNFC().then((result) => setCardSerial(result.serialNumber))}>Fizetés</Button>
        <Button
          onClick={async () => {
            setWaitingForCard(true);
            const res = await scanNFC();
            setWaitingForCard(false);
            setCardSerial(res.serialNumber);
            const pathName = window.location.pathname.split("/");
            console.log(pathName);
            setCard({
              cardSerial: res.serialNumber,
              terminalName: pathName[1],
              terminalToken: pathName[2],
              userId: 2
            });
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
          setCardSerial("");
          setTerminalType("select");
        }}
      >Reset</Button>
    </>
  );
}

export default App;
