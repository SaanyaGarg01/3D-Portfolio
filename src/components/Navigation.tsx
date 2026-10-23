import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const CHAPTERS = [
  { id: 0, label: '00', name: 'Home' },
  { id: 1, label: '01', name: 'About' },
  { id: 2, label: '02', name: 'Journey' },
  { id: 3, label: '03', name: 'Projects' },
  { id: 4, label: '04', name: 'Skills' },
  { id: 5, label: '05', name: 'Achievements' },
  { id: 6, label: '06', name: 'Certifications' },
  { id: 7, label: '07', name: 'Connect' },
]

const SECTION_IDS = ['chapter-hero', 'chapter-about', 'chapter-journey', 'chapter-projects',
  'chapter-skills', 'chapter-achievements', 'chapter-certs', 'chapter-connect']

interface Props {
  currentChapter: number
  onChapterSelect: (ch: number) => void
}

export default function Navigation({ currentChapter, onChapterSelect }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (index: number) => {
    const el = document.getElementById(SECTION_IDS[index])
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    onChapterSelect(index)
    setMenuOpen(false)
  }

  return (
    <>
      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 500,
          background: scrolled ? 'rgba(13,13,15,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo(0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'none',
            border: 'none',
            cursor: 'none',
            padding: 0,
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            border: '1px solid rgba(96,165,250,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span className="font-display" style={{
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--color-blue-glow)',
            }}>SG</span>
          </div>
          <span className="font-mono" style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--color-ivory-muted)',
            textTransform: 'uppercase',
          }}>Saanya Garg</span>
        </button>

        {/* Chapter indicator */}
        <div className="font-mono" style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          color: 'var(--color-ivory-muted)',
          display: window.innerWidth > 768 ? 'block' : 'none',
        }}>
          {String(currentChapter).padStart(2, '0')} / {String(CHAPTERS.length - 1).padStart(2, '0')}
        </div>

        {/* Menu toggle */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 16px',
            cursor: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--color-ivory)',
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.15em' }}>
            {menuOpen ? 'CLOSE' : 'MENU'}
          </span>
        </button>
      </motion.header>

      {/* Vertical chapter dots (right side) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'fixed',
          right: 32,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 400,
        }}
      >
        {CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => scrollTo(ch.id)}
            title={ch.name}
            style={{
              width: currentChapter === ch.id ? 24 : 6,
              height: 6,
              border: 'none',
              background: currentChapter === ch.id
                ? 'var(--color-blue-glow)'
                : 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              cursor: 'none',
              padding: 0,
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))}
      </motion.div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(13,13,15,0.97)',
              backdropFilter: 'blur(40px)',
              zIndex: 450,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {CHAPTERS.map((ch, i) => (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => scrollTo(ch.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  width: 'min(480px, 80vw)',
                  borderBottom: i < CHAPTERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  color: currentChapter === ch.id ? 'var(--color-blue-glow)' : 'var(--color-ivory)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-blue-glow)' }}
                onMouseLeave={e => { e.currentTarget.style.color = currentChapter === ch.id ? 'var(--color-blue-glow)' : 'var(--color-ivory)' }}
              >
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-blue)', letterSpacing: '0.2em' }}>
                  {ch.label}
                </span>
                <span className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {ch.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
