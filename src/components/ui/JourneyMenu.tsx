import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, RotateCcw, Volume2, VolumeX, Compass } from 'lucide-react'
import { journeyStore, type JourneyState } from '../game/journeyStore'
import { WORLDS } from '../game/types'
import { audioEngine } from '../../utils/audio'

export default function JourneyMenu() {
  const [jState, setJState] = useState<JourneyState>(() => journeyStore.getState())

  useEffect(() => {
    return journeyStore.subscribe(setJState)
  }, [])

  if (!jState.isMenuOpen) return null

  const handleToggleSound = () => {
    if (jState.soundEnabled) {
      audioEngine.disable()
      journeyStore.setState({ soundEnabled: false })
    } else {
      audioEngine.enable()
      journeyStore.setState({ soundEnabled: true })
    }
  }

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(5, 7, 12, 0.82)',
          backdropFilter: 'blur(20px)',
          padding: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'min(580px, 94vw)',
            background: 'rgba(13, 16, 24, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Journey Navigation
              </h2>
              <div className="font-mono" style={{ fontSize: 11, color: 'rgba(240, 236, 228, 0.6)', marginTop: 4 }}>
                Saanya Garg · 3D Motorcycle Journey
              </div>
            </div>
            <button
              onClick={() => journeyStore.toggleMenu()}
              style={{
                width: 36,
                height: 36,
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: 8,
                color: '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => journeyStore.toggleMenu()}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                border: 'none',
                borderRadius: 8,
                color: '#ffffff',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Play size={15} /> Resume
            </button>

            <button
              onClick={() => journeyStore.restartJourney()}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                color: '#f8fafc',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <RotateCcw size={15} /> Restart
            </button>

            <button
              onClick={handleToggleSound}
              style={{
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                color: jState.soundEnabled ? 'var(--color-blue-glow)' : 'rgba(240, 236, 228, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {jState.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>

          {/* Jump to World Destinations */}
          <div style={{ marginBottom: 12 }}>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(240, 236, 228, 0.5)', textTransform: 'uppercase', marginBottom: 10 }}>
              Jump to Landmark
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: '38vh', overflowY: 'auto' }}>
              {WORLDS.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => journeyStore.jumpToWorld(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: jState.activeWorldIndex === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: jState.activeWorldIndex === idx ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Compass size={14} color={w.color} />
                  <div>
                    <div className="font-display" style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                      {w.title}
                    </div>
                    <div className="font-mono" style={{ fontSize: 9, color: 'rgba(240, 236, 228, 0.5)' }}>
                      {w.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
