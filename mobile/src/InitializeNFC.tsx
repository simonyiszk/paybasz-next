import Button from "./components/ui/Button";

const scan = async (
  setNfcInitialized: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentCardSerial: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("Scan started.");
  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    console.log("Scan started successfully.");
    ndef.onreadingerror = () => {
      console.log("Cannot read data from the NFC tag. Try another one?");
    };

    ndef.onreading = (event: NDEFReadingEvent) => {
      console.log("NDEF message read.");
      setCurrentCardSerial(event.serialNumber);
    };
  } catch (error) {
    console.log(`Error! Scan failed to start asd : ${error}.`);
  }
  setNfcInitialized(true);
};

export default function InitializeNFC({
  setNfcInitialized,
  setCardSerial,
}: {
  setNfcInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSerial: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <Button
        onClick={() => {
          setCardSerial("");
          scan(setNfcInitialized, setCardSerial);
        }}
        full
      >
        Initialize NFC
      </Button>
    </div>
  );
}
