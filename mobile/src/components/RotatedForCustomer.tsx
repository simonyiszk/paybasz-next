import { FC, PropsWithChildren } from 'react'
import { useEnableRotatedForCustomer } from '@/hooks/useEnableRotatedForCustomer.ts'

export const RotatedForCustomer: FC<PropsWithChildren> = ({ children }) => {
  const { rotateEnabled } = useEnableRotatedForCustomer()
  return (
    <>
      {rotateEnabled && (
        <div aria-hidden={true} className="rotate-180">
          {children}
        </div>
      )}
      {children}
    </>
  )
}
