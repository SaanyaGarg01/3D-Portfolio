import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let trailX = 0, trailY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`
        cursorRef.current.style.top = `${mouseY}px`
      }
    }

    const animate = () => {
      trailX += (mouseX - trailX) * 0.12
      trailY += (mouseY - trailY) * 0.12
      if (trailRef.current) {
        trailRef.current.style.left = `${trailX}px`
        trailRef.current.style.top = `${trailY}px`
      }
      rafId = requestAnimationFrame(animate)
    }

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('button') || el.closest('a')) {
        setIsHovering(true)
      }
    }

    const onMouseOut = () => setIsHovering(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor ${isHovering ? 'hover' : ''}`}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, transform: 'translate(-50%,-50%)' }}
      />
      <div
        ref={trailRef}
        className="cursor-trail"
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%,-50%)' }}
      />
    </>
  )
}
