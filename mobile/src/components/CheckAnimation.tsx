import Lottie from 'lottie-react'
import checkAnimation from '@/assets/checkAnimation.json'
import { useEffect, useRef, useState } from 'react'

export default function CheckAnimation({ children }: { children?: React.ReactNode }) {
  const [showAnimation, setShowAnimation] = useState<boolean>(true)
  const animRef = useRef(null)
  useEffect(() => {
    if (animRef.current) {
      //@ts-expect-error nem adja be
      animRef.current.setSpeed(0.8)
    }
  }, [animRef.current])
  if (!showAnimation) return <>{children}</>
  return (
    <Lottie
      className="absolute"
      animationData={checkAnimation}
      loop={false}
      onComplete={() => setTimeout(() => setShowAnimation(false), 500)}
      style={{ width: '80%', maxHeight: '100%' }}
      lottieRef={animRef}
    />
  )
}
