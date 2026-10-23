import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) setProgress(window.scrollY / total)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: 2,
      background: 'rgba(255,255,255,0.04)',
      zIndex: 600,
    }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: 'linear-gradient(90deg, var(--color-blue-dim), var(--color-blue-glow))',
        transition: 'width 0.1s ease',
        boxShadow: '0 0 8px rgba(96,165,250,0.5)',
      }} />
    </div>
  )
}
