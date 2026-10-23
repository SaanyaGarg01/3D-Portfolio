import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface Props {
  onEnter: () => void
  hasEntered: boolean
  onChapterChange: (ch: number) => void
}

export default function ChapterHero({ onEnter, onChapterChange }: Omit<Props, 'hasEntered'> & { hasEntered?: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    onChapterChange(0)
    onEnter()
  }, [])

  const scrollToNext = () => {
    const next = document.getElementById('chapter-about')
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="chapter-hero"
      ref={sectionRef}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 40px',
        textAlign: 'center',
      }}
    >
      {/* Chapter label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="chapter-number"
        style={{ marginBottom: 32 }}
      >
        00 · Introduction
      </motion.p>

      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 12 }}
      >
        <h1
          ref={titleRef}
          className="display-xl font-display"
          style={{
            color: 'var(--color-ivory)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
          }}
        >
          SAANYA
          <br />
          <span style={{
            WebkitTextStroke: '1px rgba(240,236,228,0.3)',
            color: 'transparent',
          }}>
            GARG
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        style={{ marginBottom: 40 }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            letterSpacing: '0.4em',
            color: 'var(--color-blue)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Full-Stack Developer
        </div>
        <div
          className="font-display"
          style={{
            fontSize: 'clamp(18px, 2vw, 24px)',
            color: 'var(--color-ivory-dim)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          "I build technology with purpose."
        </div>
      </motion.div>

      {/* University line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="font-mono"
        style={{
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'var(--color-ivory-muted)',
          textTransform: 'uppercase',
          marginBottom: 64,
        }}
      >
        Computer Science Engineering · VIT Bhopal · CGPA 9.19
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 80,
        }}
      >
        <button
          onClick={scrollToNext}
          style={{
            padding: '14px 36px',
            background: 'var(--color-blue)',
            border: 'none',
            color: 'white',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--color-blue-glow)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--color-blue)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Enter Experience
        </button>

        <a
          href="/resume.pdf"
          download="Saanya_Garg_Resume.pdf"
          style={{
            padding: '14px 36px',
            background: 'transparent',
            border: '1px solid rgba(240,236,228,0.2)',
            color: 'var(--color-ivory)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'none',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(96,165,250,0.6)'
            e.currentTarget.style.color = 'var(--color-blue-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(240,236,228,0.2)'
            e.currentTarget.style.color = 'var(--color-ivory)'
          }}
        >
          Download Resume
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          cursor: 'none',
        }}
        onClick={scrollToNext}
      >
        <span className="font-mono" style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'var(--color-ivory-muted)',
          textTransform: 'uppercase',
        }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} color="var(--color-ivory-muted)" />
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 40,
        width: 1,
        height: 80,
        background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.4), transparent)',
      }} />
      <div style={{
        position: 'absolute',
        top: 100,
        right: 40,
        width: 1,
        height: 80,
        background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.4), transparent)',
      }} />
    </section>
  )
}
