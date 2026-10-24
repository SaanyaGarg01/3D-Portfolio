import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, ExternalLink, X, Volume2, Sparkles, Disc3 } from 'lucide-react'
import { journeyStore, type JourneyState } from '../game/journeyStore'

const SUNO_SHARE_URL = 'https://suno.com/s/UHS9UyWBGrEZIpQv'
const SUNO_EMBED_URL = 'https://suno.com/embed/cee87005-e216-477b-a1a9-47aabb087f07'
const SUNO_COVER_IMG = 'https://cdn2.suno.ai/image_large_cee87005-e216-477b-a1a9-47aabb087f07.jpeg'

export default function SunoMusicPlayer() {
  const [jState, setJState] = useState<JourneyState>(() => journeyStore.getState())
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    return journeyStore.subscribe((s) => {
      setJState(s)
      if (s.sunoPlayerOpen) {
        setIsExpanded(true)
      }
    })
  }, [])

  // Render player across the journey

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 500,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Compact Floating Music Pill
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsExpanded(true)
              journeyStore.toggleSunoPlayer(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.85))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 16px rgba(56, 189, 248, 0.15)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {/* Spinning Vinyl Disk / Disc */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Disc3 size={18} color="#38bdf8" />
            </motion.div>

            {/* Song Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
                  Saanya
                </span>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                  }}
                >
                  SUNO
                </span>
              </div>
              <span style={{ fontSize: 9.5, color: '#94a3b8' }}>
                by @saathicircle_team
              </span>
            </div>

            {/* Pulsing Audio Waves */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 14, marginLeft: 4 }}>
              {[0.4, 0.9, 0.6, 1.0, 0.5].map((scale, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', `${scale * 100}%`, '20%'] }}
                  transition={{
                    duration: 0.8 + i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: 2.5,
                    background: '#38bdf8',
                    borderRadius: 1.5,
                  }}
                />
              ))}
            </div>
          </motion.button>
        ) : (
          // Expanded Glassmorphic Music Player Card
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{
              width: 320,
              maxWidth: 'calc(100vw - 32px)',
              background: 'linear-gradient(135deg, rgba(11, 19, 38, 0.92), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 18,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px 8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Music size={15} color="#38bdf8" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Portfolio Soundtrack
                </span>
              </div>
              <button
                onClick={() => {
                  setIsExpanded(false)
                  journeyStore.toggleSunoPlayer(false)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Minimize player"
              >
                <X size={16} />
              </button>
            </div>

            {/* Song Meta Preview */}
            <div style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'center' }}>
              <img
                src={SUNO_COVER_IMG}
                alt="Saanya Suno Song Cover"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  objectFit: 'cover',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Saanya
                  </h4>
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 700,
                      padding: '1.5px 5px',
                      borderRadius: 4,
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                    }}
                  >
                    ORIGINAL
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>
                  By saathicircle_team
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <Sparkles size={11} color="#f59e0b" />
                  <span style={{ fontSize: 9.5, color: '#cbd5e1' }}>Generated via Suno AI</span>
                </div>
              </div>
            </div>

            {/* Embedded Official Suno Interactive Player */}
            <div style={{ padding: '0 12px 12px' }}>
              <iframe
                title="Suno Track - Saanya"
                src={SUNO_EMBED_URL}
                width="100%"
                height="108"
                style={{
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#090d16',
                }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                loading="lazy"
              />
            </div>

            {/* Footer with External Link to Suno */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px 10px',
                background: 'rgba(0, 0, 0, 0.35)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: 10.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                <Volume2 size={12} color="#38bdf8" />
                <span>Plays alongside 3D ride</span>
              </div>
              <a
                href={SUNO_SHARE_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 10.5,
                  padding: '2px 6px',
                  borderRadius: 6,
                  transition: 'background 0.2s ease',
                }}
              >
                <span>Open in Suno</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
