import { statusEnum } from '@/lib/model.ts'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DependencyList, useCallback, useEffect } from 'react'
import { filter } from 'fuzzy'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setPersistentState =
  <T>(key: string, stateSetter: (state: T) => void) =>
  (value: T) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    stateSetter(value)
  }

export const post = async <T, R>({
  url,
  data,
  asJson,
  deserialize
}: {
  url: string
  data: T
  asJson?: boolean
  deserialize?: (res: Response) => Promise<R>
}): Promise<R> =>
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => {
    if (deserialize) {
      return deserialize(res)
    }
    return (asJson ? res.json() : res.text()) as Promise<R>
  })

export const scanNFC = (setStatus: React.Dispatch<React.SetStateAction<statusEnum>>) =>
  new Promise<NDEFReadingEvent>((resolve, reject) => {
    setStatus(statusEnum.WAITING_FOR_CARD)
    const ndef = new NDEFReader()
    ndef.scan().then(() => {
      ndef.addEventListener('reading', (e) => resolve(e as NDEFReadingEvent), { once: true })
      ndef.addEventListener('readingerror', reject, { once: true })
    })
  })

export const useNFCScanner = (onScan: (event: NDEFReadingEvent) => void, deps: DependencyList) => {
  const callback = useCallback(onScan, deps) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const ndef = new NDEFReader()
    ndef.scan().then(() => ndef.addEventListener('reading', callback as EventListenerOrEventListenerObject))
    return ndef.removeEventListener('reading', callback as EventListenerOrEventListenerObject)
  }, [...deps, callback]) // eslint-disable-line react-hooks/exhaustive-deps
}

export async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex.toUpperCase()
}

const replaceSpecialChars = (text: string) => text.normalize('NFKD').replace(/\W/g, '')

export const fuzzySearch = <T>({ needle, haystack, getText }: { needle: string; haystack: T[]; getText: (data: T) => string }): T[] => {
  const sanitizedNeedle = replaceSpecialChars(needle.toLowerCase())
  const result = filter(sanitizedNeedle, haystack, { extract: (data) => replaceSpecialChars(getText(data).toLowerCase()) })
  return result.map((res) => res.original)
}

export const formatNumber = Intl.NumberFormat(navigator.language).format
export const compactFormat = Intl.NumberFormat(navigator.language, { notation: 'compact' }).format
