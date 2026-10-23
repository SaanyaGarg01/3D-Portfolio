import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Compass, FileText } from 'lucide-react'
import type { JourneyPhase } from '../game/types'
import { audioEngine } from '../../utils/audio'
import { RESUME_DATA } from '../game/resumeData'

interface OpeningHeroOverlayProps {
  phase: JourneyPhase
  onStartJourney: () => void
}

export default function OpeningHeroOverlay({ phase, onStartJourney }: OpeningHeroOverlayProps) {
  if (phase !== 'opening') return null

  const handleStart = () => {
    audioEngine.playHoverBlip()
    audioEngine.playIgnitionSound()
    audioEngine.playAmbient()
    onStartJourney()
  }

  return (
    <AnimatePresence>
      <motion.div
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
          justifyContent: 'flex-start',
          padding: 'clamp(16px, 4vw, 48px)',
        }}
      >
        {/* Left-Aligned Premium Glassmorphic Card (Never occludes rider or road) */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'min(450px, 92vw)',
            background: 'rgba(15, 12, 22, 0.68)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 16,
            padding: 'clamp(24px, 3.5vw, 36px)',
            color: '#ffffff',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(14, 165, 233, 0.12)',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Subtle Journey Pill Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.35)',
                color: '#38bdf8',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              <Compass size={13} />
              Interactive 3D Journey
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.55)',
                letterSpacing: '0.08em',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Parisian Sunset
            </span>
          </div>

          {/* Title & Professional Subtitle */}
          <div>
            <h1
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 'clamp(28px, 3.2vw, 38px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
                color: '#ffffff',
                lineHeight: 1.15,
              }}
            >
              {RESUME_DATA.name}
            </h1>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#38bdf8',
                letterSpacing: '0.05em',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Full Stack Developer · Computer Science Engineer
            </div>
          </div>

          {/* 3 Concise Paragraphs */}
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: '"Space Grotesk", sans-serif',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <p style={{ margin: 0 }}>
              Computer Science student at <strong>VIT Bhopal</strong> (CGPA 9.19) with 3 full-stack internships architecting scalable web applications, REST microservices, and automated CI/CD pipelines.
            </p>
            <p style={{ margin: 0 }}>
              3rd Place Winner at the <strong>MP Police Cyber Safety Hackathon</strong> (300+ teams) and dual <strong>AWS Certified</strong> (Solutions Architect, AI Practitioner).
            </p>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
              Take the handlebars or scroll forward to journey through my education, internships, AI projects, and hackathon milestones.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <motion.button
              whileHover={{ scale: 1.04, background: '#0284c7' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 22px',
                background: '#0ea5e9',
                border: 'none',
                borderRadius: 8,
                color: '#ffffff',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)',
                transition: 'background 0.2s ease',
              }}
            >
              <span>Start Journey</span>
              <ArrowRight size={15} />
            </motion.button>

            {/* Quick Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                download="Saanya_Garg_Resume.pdf"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '11px 16px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontFamily: '"Space Grotesk", sans-serif',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <FileText size={15} color="#38bdf8" />
                <span>Resume (PDF)</span>
              </a>

              <a
                href={RESUME_DATA.contact.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>

              <a
                href={RESUME_DATA.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Controls Hint Footnote */}
          <div
            style={{
              paddingTop: 10,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            <span>Scroll down or press <strong>W</strong> to cruise</span>
            <span><strong>A / D</strong> to steer</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
