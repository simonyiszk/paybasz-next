import { FC, PropsWithChildren } from 'react'
import { useEnableRotatedForCustomer } from '@/hooks/useEnableRotatedForCustomer.ts'
import { cn } from '@/lib/utils.ts'

export const RotatedForCustomer: FC<PropsWithChildren & { className?: string }> = ({ children, className }) => {
  const { rotateEnabled } = useEnableRotatedForCustomer()
  return (
    <>
      {rotateEnabled && (
        <div aria-hidden={true} className={cn('rotate-180', className)}>
          {children}
        </div>
      )}
      {children}
    </>
  )
}
