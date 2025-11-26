import { useEffect, useState } from 'react'

export default function useScrollDirection(options = {}) {
  const { threshold = 10, initialDirection = 'up' } = options
  const [direction, setDirection] = useState(initialDirection)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return
      }

      setDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setLastScrollY(currentScrollY > 0 ? currentScrollY : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, threshold])

  return direction
}