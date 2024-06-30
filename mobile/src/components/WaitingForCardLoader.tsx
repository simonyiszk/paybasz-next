import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'

export default function WaitingForCardLoader() {
  return (
    <div className="h-full absolute z-30 w-full">
      <div className="flex items-center justify-center w-full h-full flex-row">
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
          <LoadingIndicator />
          <div className="mt-4 text-gray-400">Kártya beolvasása...</div>
        </div>
      </div>
    </div>
  )
}
