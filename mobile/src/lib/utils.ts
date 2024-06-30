import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { statusEnum } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const scanNFC = (
  setWaitingStatus: React.Dispatch<React.SetStateAction<statusEnum>>
) =>
  new Promise<NDEFReadingEvent>((resolve, reject) => {
    const ndef = new NDEFReader();
    setWaitingStatus(statusEnum.WAITING_FOR_CARD);
    ndef.scan().then(() => {
      ndef.addEventListener(
        "reading",
        (e) => {
          resolve(e as NDEFReadingEvent);
          setWaitingStatus(statusEnum.OK);
        },
        {
          once: true,
        }
      );
      ndef.addEventListener("readingerror", reject, { once: true });
    });
  });

export async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  console.log(hashHex.toUpperCase());
  return hashHex.toUpperCase();
}
