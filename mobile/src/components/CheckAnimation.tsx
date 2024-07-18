import Lottie from 'lottie-react'
import checkAnimation from '@/assets/checkAnimation.json'
import { useState } from 'react'

export default function CheckAnimation({ children }: { children?: React.ReactNode }) {
  const [showAnimation, setShowAnimation] = useState<boolean>(true)
  if (!showAnimation) return <>{children}</>
  return (
    <div className="w-full flex items-center justify-center">
      <Lottie
        animationData={checkAnimation}
        loop={false}
        onComplete={() => setShowAnimation(false)}
        style={{ width: '80%', maxHeight: '100%' }}
      />
    </div>
  )
}
