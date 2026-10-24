import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, FileText, Compass } from 'lucide-react'
import type { JourneyPhase } from '../game/types'
import { audioEngine } from '../../utils/audio'
import { RESUME_DATA } from '../game/resumeData'
import VideoElaboratedPresenter from './VideoElaboratedPresenter'

interface OpeningHeroOverlayProps {
  phase: JourneyPhase
  onStartJourney: () => void
  onOpenEditorialPortfolio?: () => void
}

const SPEAKING_LINES = [
  { emoji: '👋', text: "Hi, I'm Saanya Garg!" },
  { emoji: '💻', text: 'Full Stack Developer & Computer Science Engineer' },
  { emoji: '🎓', text: 'VIT Bhopal · CGPA 9.19 / 10.0' },
  { emoji: '🏢', text: '3 Industry Internships — FinTech, AICTE & Enterprise' },
  { emoji: '🏆', text: '3rd Place · MP Police Hackathon among 300+ teams' },
  { emoji: '☁️', text: 'Dual AWS Certified · AI Practitioner & Solutions Architect' },
  { emoji: '🚀', text: 'React · Node.js · MongoDB · Docker · CI/CD pipelines' },
  { emoji: '🌟', text: 'Top 0.5% of 20,000+ teams · Samsung Solve for Tomorrow' },
  { emoji: '🤝', text: "Let's build something extraordinary together!" },
]

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
        setTimeout(onDone, 2000)
      }
    }, 38)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            background: '#38bdf8',
            marginLeft: 2,
            animation: 'cursor-blink 0.7s step-end infinite',
            verticalAlign: 'middle',
          }}
        />
      )}
    </span>
  )
}

export default function OpeningHeroOverlay({
  phase,
  onStartJourney,
  onOpenEditorialPortfolio,
}: OpeningHeroOverlayProps) {
  const [lineIndex, setLineIndex] = useState(0)

  if (phase !== 'opening') return null

  const handleStart = () => {
    audioEngine.enable()
    audioEngine.playIgnitionSound()
    onStartJourney()
  }

  const nextLine = () => {
    setLineIndex((i) => (i + 1) % SPEAKING_LINES.length)
  }

  const currentLine = SPEAKING_LINES[lineIndex]

  return (
    <>
      <style>{`
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes hero-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hero-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 768px) {
          .opening-hero-container {
            padding: 68px 12px 60px !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          className="opening-hero-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 2vw, 36px)',
            gap: 'clamp(14px, 2.5vw, 32px)',
            flexWrap: 'wrap',
            overflowY: 'auto',
          }}
        >
          {/* LEFT: Video & Avatar Presenter with Real-time Resume Elaboration */}
          <motion.div
            initial={{ opacity: 0, x: -35, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              width: 'min(500px, 92vw)',
              flexShrink: 0,
              pointerEvents: 'auto',
            }}
          >
            <VideoElaboratedPresenter onExploreFullPortfolio={onOpenEditorialPortfolio} />
          </motion.div>

          {/* RIGHT: High-Impact Profile & Action Hub */}
          <motion.div
            initial={{ opacity: 0, x: 35, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              width: 'min(440px, 92vw)',
              background: 'rgba(10, 8, 18, 0.82)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 20,
              padding: 'clamp(18px, 2.4vw, 28px)',
              color: '#ffffff',
              boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 50px rgba(14, 165, 233, 0.08)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Top Badges */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(14, 165, 233, 0.12)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  color: '#38bdf8',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#38bdf8',
                    boxShadow: '0 0 6px #38bdf8',
                    display: 'inline-block',
                    animation: 'cursor-blink 1.6s ease-in-out infinite',
                  }}
                />
                Official Portfolio
              </span>

              <span
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                VIT BHOPAL · 2023–2027
              </span>
            </div>

            {/* Name & Title */}
            <div>
              <h1
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 'clamp(22px, 2.5vw, 34px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  margin: '0 0 4px',
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 55%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {RESUME_DATA.name}
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: '#38bdf8',
                  letterSpacing: '0.04em',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                }}
              >
                Full Stack Developer · CGPA 9.19 / 10.0
              </div>
            </div>

            {/* Speech bubble - typewriter cycling */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                borderRadius: 12,
                padding: '12px 14px',
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, display: 'block', animation: 'hero-float 2.2s ease-in-out infinite' }}>
                {currentLine.emoji}
              </span>
              <div
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 'clamp(11.5px, 1.25vw, 13px)',
                  fontWeight: 500,
                  color: '#e2e8f0',
                  lineHeight: 1.45,
                }}
              >
                <TypewriterText key={lineIndex} text={currentLine.text} onDone={nextLine} />
              </div>
            </div>

            {/* Verified Metrics from resume.pdf */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { value: '9.19', label: 'CGPA' },
                { value: '3', label: 'Internships' },
                { value: '2x', label: 'AWS Certs' },
                { value: '300+', label: 'Teams Beat' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '8px 2px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13.5, fontWeight: 800, color: '#38bdf8' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 8.5, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Arsenal */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['React.js', 'Node.js', 'Express', 'MongoDB', 'AWS EC2/S3', 'Docker', 'Python', 'CI/CD'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '3px 8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    fontSize: 9.5,
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Main Primary Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* 3D Journey Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px 18px',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(14, 165, 233, 0.38)',
                  }}
                >
                  <Compass size={14} /> Start 3D Journey <ArrowRight size={14} />
                </motion.button>

                {/* Editorial Portfolio Button */}
                {onOpenEditorialPortfolio && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onOpenEditorialPortfolio}
                    style={{
                      flex: 1,
                      minWidth: 150,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      borderRadius: 10,
                      color: '#fff',
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <FileText size={13} /> Full Portfolio
                  </motion.button>
                )}
              </div>

              {/* Secondary links: Resume PDF, GitHub, LinkedIn */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  download="Saanya_Garg_Resume.pdf"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    fontFamily: '"Space Grotesk", sans-serif',
                    textDecoration: 'none',
                  }}
                >
                  📄 Download Resume PDF
                </a>

                <a
                  href={RESUME_DATA.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>

                <a
                  href={RESUME_DATA.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn Profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    background: 'rgba(14, 165, 233, 0.12)',
                    border: '1px solid rgba(14, 165, 233, 0.28)',
                    borderRadius: 8,
                    color: '#38bdf8',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Ride Controls Guide */}
            <div
              style={{
                paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.38)',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              <span>🖱️ Scroll or <strong style={{ color: 'rgba(255,255,255,0.6)' }}>W</strong> to ride</span>
              <span><strong style={{ color: 'rgba(255,255,255,0.6)' }}>A / D</strong> to steer</span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
