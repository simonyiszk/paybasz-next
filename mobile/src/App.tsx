import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/ui/Button";
import NoNFCBanner from "./components/NoNFCBanner";
import InitializeNFC from "./InitializeNFC";
import TerminalTypeSelector from "./TerminalTypeSelector";
import ResetButton from "./components/ui/ResetButton";
import WaitingForCardLoader from "./components/WaitingForCardLoader";
import { scanNFC } from "./lib/utils";

// function initNFC() {
//   //TODO automatikusan történjen meg
//   try {
//     const ndef = new NDEFReader();
//     ndef.scan();
//     console.log();

//     ndef.addEventListener("readingerror", () => {
//       console.log("Hiba történt");
//     });

//     ndef.addEventListener("reading", (ndefEvent: NDEFReadingEvent) => {
//       const id = ndefEvent.serialNumber.toUpperCase().replace(/:/g, "-");
//       //const hashed = await sha256(id);

//       //displayText(id, hashed, baseUrl + '/reading/' + gatewayName, JSON.stringify({ card: hashed, gatewayCode: token }));

//       await nfcListener(hashed);
//       nfcListener = async function (card) {};
//     });
//   } catch (error) {
//     displayText("Hiba: " + error);
//   }
// }
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex.toUpperCase();
}

async function httpFetchData(method = "POST", url = "", data = {}) {
  const response = await fetch(url, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  });
  return response.text();
}
const scan = async (
  setCardSerial: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("Scan started.");
  try {
    //@ts-ignore
    const ndef = new NDEFReader();
    await ndef.scan();

    console.log("Scan started successfully.");
    ndef.onreadingerror = () => {
      console.log("Cannot read data from the NFC tag. Try another one?");
    };

    ndef.onreading = (event: NDEFReadingEvent) => {
      console.log("NDEF message read.");
      onReading(event);
      setCardSerial(event.serialNumber);
    };
  } catch (error) {
    console.log(`Error! Scan failed to start asd : ${error}.`);
  }
};
const onReading = ({ message, serialNumber }: NDEFReadingEvent) => {
  console.log(serialNumber);
  for (const record of message.records) {
    switch (record.recordType) {
      case "text":
        const textDecoder = new TextDecoder(record.encoding);
        console.log("Message: ", textDecoder.decode(record.data));
        break;
      case "url":
        // TODO: Read URL record with record data.
        break;
      default:
      // TODO: Handle other records with record data.
    }
  }
};
type CardData = {
  cardSerial: string;
  terminalName: string;
  terminalToken: string;
  userId: number;
};
const setCard = async (cardData: CardData) => {
  return fetch(
    import.meta.env.VITE_BACKEND_URL + "/set-card/" + cardData.terminalName,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        card: cardData.cardSerial,
        userId: cardData.userId,
        gatewayCode: cardData.terminalToken,
      }),
    }
  );
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
    return (
      <TerminalTypeSelector
        setTerminalType={setTerminalType}
        terminalType={terminalType}
      />
    );
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
        <Button onClick={() => scan(setCardSerial)}>Fizetés</Button>
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
              userId: 2,
            });
          }}
        >
          Kártya hozzárendelése
        </Button>
        <Button onClick={() => scan(setCardSerial)}>Feltöltés</Button>
        <Button onClick={() => scan(setCardSerial)}>Tételek</Button>
      </div>
      <ResetButton
        onClick={() => {
          setCardSerial("");
          setTerminalType("select");
        }}
      />
    </>
  );
}

export default App;
