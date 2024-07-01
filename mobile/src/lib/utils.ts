import { statusEnum } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setPersistentState =
  <T>(key: string, stateSetter: (state: T) => void) =>
  (value: T) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    stateSetter(value)
  }

export const post = async <T, R>({ url, data, asJson }: { url: string; data: T; asJson?: boolean }): Promise<R> =>
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => (asJson ? res.json() : res.text()) as Promise<R>)

export const scanNFC = (setStatus: React.Dispatch<React.SetStateAction<statusEnum>>) =>
  new Promise<NDEFReadingEvent>((resolve, reject) => {
    setStatus(statusEnum.WAITING_FOR_CARD)
    const ndef = new NDEFReader()
    ndef.scan().then(() => {
      ndef.addEventListener('reading', (e) => resolve(e as NDEFReadingEvent), { once: true })
      ndef.addEventListener('readingerror', reject, { once: true })
    })
  })

export async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  console.log(hashHex.toUpperCase())
  return hashHex.toUpperCase()
}
