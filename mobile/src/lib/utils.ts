import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const scanNFC = () =>
  new Promise<NDEFReadingEvent>((resolve, reject) => {
    const ndef = new NDEFReader();
    ndef.scan().then(() => {
      ndef.addEventListener("reading", (e) => resolve(e as NDEFReadingEvent), {
        once: true,
      });
      ndef.addEventListener("readingerror", reject, { once: true });
    });
  });
