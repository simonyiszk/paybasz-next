import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/ui/Button";
import NoNFCBanner from "./components/NoNFCBanner";
import InitializeNFC from "./InitializeNFC";
import TerminalTypeSelector from "./TerminalTypeSelector";
import ResetButton from "./components/ui/ResetButton";

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

function App() {
  const [nfcInitialized, setNfcInitialized] = useState(false);
  const [cardSerial, setCardSerial] = useState("");
  const [terminalType, setTerminalType] = useState("select");
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
  if (!nfcInitialized) {
    return (
      <InitializeNFC
        setNfcInitialized={setNfcInitialized}
        setCardSerial={setCardSerial}
      />
    );
  }

  return (
    <>
      <p>{cardSerial}</p>
      <div className="flex flex-row flex-wrap gap-2 justify-center px-4 w-full">
        <Button onClick={() => scan(setCardSerial)}>Kártya beolvasása</Button>
        <Button onClick={() => {}}>Egyenleg</Button>
        <Button onClick={() => scan(setCardSerial)}>Fizetés</Button>
        <Button onClick={() => scan(setCardSerial)}>
          Kártya hozzárendelése
        </Button>
        <Button onClick={() => scan(setCardSerial)}>Feltöltés</Button>
        <Button onClick={() => scan(setCardSerial)}>Tételek</Button>
      </div>
      <ResetButton
        onClick={() => {
          setNfcInitialized(false);
          setCardSerial("");
          setTerminalType("select");
        }}
      />
    </>
  );
}

export default App;
