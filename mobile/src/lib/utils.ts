import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const post = async <T, R>({ url, data, asJson = true }: { url: string; data: T; asJson?: boolean }): Promise<R> =>
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => (asJson ? res.json() : res.text()) as Promise<R>)

export const scanNFC = () =>
  new Promise<NDEFReadingEvent>((resolve, reject) => {
    const ndef = new NDEFReader()
    ndef.scan().then(() => {
      ndef.addEventListener('reading', (e) => resolve(e as NDEFReadingEvent), {
        once: true
      })
      ndef.addEventListener('readingerror', reject, { once: true })
    })
  })
