import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { journeyStore, type JourneyState } from '../game/journeyStore'
import { audioEngine } from '../../utils/audio'

export default function JourneyHUD() {
  const [state, setState] = useState<JourneyState>(() => journeyStore.getState())

  useEffect(() => {
    return journeyStore.subscribe(setState)
  }, [])

  if (state.phase === 'opening') return null

  const handleToggleSound = () => {
    if (state.soundEnabled) {
      audioEngine.stopAmbient()
      audioEngine.stopEngine()
      journeyStore.setState({ soundEnabled: false })
    } else {
      audioEngine.playAmbient()
      audioEngine.startEngine()
      journeyStore.setState({ soundEnabled: true })
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 35,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 36px',
      }}
    >
      {/* Top Right Controls (Image 1, 2, 4, 5 reference: minimalist 'menu' & 'sound' equalizer) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 28,
          pointerEvents: 'auto',
          width: '100%',
        }}
      >
        {/* Menu Toggle */}
        <button
          onClick={() => journeyStore.toggleMenu()}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: '#ffffff',
            padding: 4,
          }}
        >
          {/* 3 Thin Hamburger Bars */}
          <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
          <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
          <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, letterSpacing: '0.15em', marginTop: 3 }}>
            menu
          </span>
        </button>

        {/* Sound Equalizer Bars (Image 1, 2, 4, 5 reference) */}
        <button
          onClick={handleToggleSound}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: '#ffffff',
            padding: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16 }}>
            <motion.div
              animate={{ height: state.soundEnabled ? [6, 16, 8, 14] : 4 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              style={{ width: 2.5, background: '#ffffff', borderRadius: 1 }}
            />
            <motion.div
              animate={{ height: state.soundEnabled ? [14, 8, 16, 10] : 8 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              style={{ width: 2.5, background: '#ffffff', borderRadius: 1 }}
            />
            <motion.div
              animate={{ height: state.soundEnabled ? [10, 15, 6, 16] : 5 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
              style={{ width: 2.5, background: '#ffffff', borderRadius: 1 }}
            />
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, letterSpacing: '0.15em', marginTop: 3 }}>
            sound
          </span>
        </button>
      </div>

      {/* Bottom Right SCROLL Indicator (Image 4 reference) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: '6px 14px',
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: '"Zen Dots", sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: '#ffffff',
            }}
          >
            SCR●LL
          </span>
        </div>
      </div>
    </div>
  )
}
