import { TerminalData } from "../types";
import { sha256 } from "./utils";

type CardData = {
  cardSerial: string;
  terminalData: TerminalData;
  userId: number;
};
export const setCard = async (cardData: CardData) => {
  return fetch(
    import.meta.env.VITE_BACKEND_URL +
      "/set-card/" +
      cardData.terminalData.terminalName,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        card: await sha256(cardData.cardSerial),
        userId: cardData.userId,
        gatewayCode: cardData.terminalData.terminalToken,
      }),
    }
  );
};
type BalanceData = {
  terminalData: TerminalData;
  cardSerial: string;
};
export const getBalanceData = async (balanceData: BalanceData) => {
  return fetch(
    import.meta.env.VITE_BACKEND_URL +
      "/balance/" +
      balanceData.terminalData.terminalName,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        card: await sha256(balanceData.cardSerial),
        gatewayCode: balanceData.terminalData.terminalToken,
      }),
    }
  );
};
type UploadData = {
  terminalData: TerminalData;
  cardSerial: string;
  amount: number;
};
export const uploadBalance = async (uploadData: UploadData) => {
  return fetch(
    import.meta.env.VITE_BACKEND_URL +
      "/upload/" +
      uploadData.terminalData.terminalName,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        card: await sha256(uploadData.cardSerial),
        amount: uploadData.amount,
        gatewayCode: uploadData.terminalData.terminalToken,
      }),
    }
  );
};
