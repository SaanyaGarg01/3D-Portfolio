import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Disc3 } from 'lucide-react'
import { audioEngine } from '../../utils/audio'

export default function SunoMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    // Check if music is playing periodically or sync with audio
    const interval = setInterval(() => {
      setIsPlaying(audioEngine.isMusicPlaying())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleToggle = () => {
    const nextState = audioEngine.toggleMusic()
    setIsPlaying(nextState)
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .portfolio-music-pill {
            bottom: 78px !important;
            left: 12px !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>

      {/* Non-intrusive Floating Music Status Pill (No dropdown popup) */}
      <div
        className="portfolio-music-pill"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 500,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          title={isPlaying ? 'Music playing · Click to pause' : 'Music paused · Click to play'}
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
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Disc3 size={18} color={isPlaying ? '#38bdf8' : '#94a3b8'} />
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
                  background: isPlaying ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  color: isPlaying ? '#38bdf8' : '#94a3b8',
                }}
              >
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>
            <span style={{ fontSize: 9.5, color: '#94a3b8' }}>
              By Saanya Garg
            </span>
          </div>

          {/* Pulsing Audio Waves */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 14, marginLeft: 4 }}>
            {[0.4, 0.9, 0.6, 1.0, 0.5].map((scale, i) => (
              <motion.div
                key={i}
                animate={
                  isPlaying
                    ? { height: ['20%', `${scale * 100}%`, '20%'] }
                    : { height: '20%' }
                }
                transition={{
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 2.5,
                  background: isPlaying ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 1.5,
                }}
              />
            ))}
          </div>
        </motion.button>
      </div>
    </>
  )
}
