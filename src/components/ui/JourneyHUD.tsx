import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Compass, Zap, CloudRain, Sun, Cloud, ArrowRight, Music } from 'lucide-react'
import { journeyStore, type JourneyState } from '../game/journeyStore'
import { audioEngine } from '../../utils/audio'

export default function JourneyHUD() {
  const [state, setState] = useState<JourneyState>(() => journeyStore.getState())

  useEffect(() => {
    return journeyStore.subscribe(setState)
  }, [])

  // Auto-dismiss spark notification after 3.2s
  useEffect(() => {
    if (state.activeSparkNotification) {
      const timer = setTimeout(() => {
        journeyStore.clearSparkNotification()
      }, 3200)
      return () => clearTimeout(timer)
    }
  }, [state.activeSparkNotification])

  // Auto-dismiss dialogue after 6.5s so it never stays stuck on mobile
  useEffect(() => {
    if (state.activeDialogue) {
      const timer = setTimeout(() => {
        journeyStore.dismissDialogue()
      }, 6500)
      return () => clearTimeout(timer)
    }
  }, [state.activeDialogue])

  if (state.phase === 'opening') return null

  const handleToggleSound = () => {
    if (state.soundEnabled) {
      audioEngine.disable()
      journeyStore.setState({ soundEnabled: false })
    } else {
      audioEngine.enable()
      journeyStore.setState({ soundEnabled: true })
    }
  }

  // Check if at junction (Z around -1550, progress 0.46 to 0.52)
  const isAtJunction = state.progress >= 0.46 && state.progress <= 0.52

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
        padding: 'clamp(16px, 2.5vw, 32px)',
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Left: Sparks Counter & Weather Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}>
          {/* Sparks Counter & Journal Button */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(10, 15, 29, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <Zap size={14} color="#f59e0b" fill="#f59e0b" />
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                SPARKS: {state.collectedSparks.length} / 8
              </span>
              <div
                style={{
                  width: 48,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.15)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(state.collectedSparks.length / 8) * 100}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #38bdf8)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </motion.div>

            {/* Discovery Journal Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => journeyStore.toggleJournal()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(14, 165, 233, 0.18)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                color: '#38bdf8',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              📖 Journal
            </motion.button>
          </div>

          {/* Dynamic Weather & Speed Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '4px 12px',
              borderRadius: 16,
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.8)',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {state.weatherState === 'rain' ? (
                <>
                  <CloudRain size={12} color="#60a5fa" />
                  <span>Rain & Mist</span>
                </>
              ) : state.weatherState === 'mist' ? (
                <>
                  <Cloud size={12} color="#94a3b8" />
                  <span>Atmospheric Mist</span>
                </>
              ) : state.weatherState === 'sunrise' ? (
                <>
                  <Sun size={12} color="#fbbf24" />
                  <span>Golden Sunrise</span>
                </>
              ) : (
                <>
                  <Compass size={12} color="#38bdf8" />
                  <span>Clear Skies</span>
                </>
              )}
            </div>

            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>

            <span>
              {Math.round(state.speed)} km/h · {((state.distance / 1000)).toFixed(2)} km
            </span>
          </div>
        </div>

        {/* Right Controls: Menu & Sound */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            pointerEvents: 'auto',
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
            <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
            <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
            <div style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1 }} />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, letterSpacing: '0.15em', marginTop: 3 }}>
              menu
            </span>
          </button>

          {/* Sound Equalizer Bars */}
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

          {/* Suno Soundtrack Quick Trigger */}
          <button
            onClick={() => journeyStore.toggleSunoPlayer()}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              color: state.sunoPlayerOpen ? '#38bdf8' : '#ffffff',
              padding: 4,
            }}
            title="Open Suno AI Music Soundtrack"
          >
            <div style={{ height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={16} color={state.sunoPlayerOpen ? '#38bdf8' : '#ffffff'} />
            </div>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, letterSpacing: '0.15em', marginTop: 3 }}>
              suno
            </span>
          </button>
        </div>
      </div>

      {/* Center Toast: Spark Pickup Notification */}
      <AnimatePresence>
        {state.activeSparkNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            style={{
              alignSelf: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9), rgba(99, 102, 241, 0.9))',
              border: '1.5px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.45)',
              backdropFilter: 'blur(16px)',
              pointerEvents: 'auto',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
            <div style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#fff' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                ⚡ Discovered: {state.activeSparkNotification.name}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>
                {state.activeSparkNotification.category}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional Route Choice Junction Pill */}
      <AnimatePresence>
        {isAtJunction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              alignSelf: 'center',
              display: 'flex',
              gap: 12,
              padding: '8px 14px',
              borderRadius: 24,
              background: 'rgba(10, 15, 29, 0.88)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              backdropFilter: 'blur(20px)',
              pointerEvents: 'auto',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            }}
          >
            <button
              onClick={() => journeyStore.jumpToWorld(5)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⚡ Fast-Track: Achievements <ArrowRight size={12} />
            </button>

            <button
              onClick={() => journeyStore.jumpToWorld(4)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#ffffff',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🏍️ Continue Scenic Route
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Character / Byte Dialogue Bubble */}
      <AnimatePresence>
        {state.activeDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              alignSelf: 'center',
              width: 'min(500px, 92vw)',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 16,
              padding: '14px 18px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 45px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.12)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{state.activeDialogue.icon}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
                    {state.activeDialogue.speaker}
                  </div>
                  <div style={{ fontSize: 10, color: '#38bdf8', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 }}>
                    {state.activeDialogue.role}
                  </div>
                </div>
              </div>

              <button
                onClick={() => journeyStore.dismissDialogue()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ✕ Dismiss
              </button>
            </div>

            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: '#e2e8f0', fontFamily: '"Space Grotesk", sans-serif' }}>
              {state.activeDialogue.text}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <button
                onClick={() => journeyStore.dismissDialogue()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Row: Controls Guide & Mobile Drive Controller */}
      <style>{`
        @media (min-width: 769px) {
          .hud-mobile-controls, .hud-mobile-drive-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .hud-desktop-controls, .hud-desktop-scroll-pill {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Desktop Controls Text */}
        <div
          className="hud-desktop-controls"
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          <span>Use <strong>Scroll</strong> or <strong>W/S</strong> to ride · <strong>A/D</strong> to steer</span>
        </div>

        {/* Mobile Controls Text */}
        <div
          className="hud-mobile-controls"
          style={{
            fontSize: 10.5,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: '"Space Grotesk", sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>Swipe or tap <strong>DRIVE</strong></span>
        </div>

        {/* Action Button Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'auto' }}>
          {/* Mobile Interactive Drive Button */}
          <motion.button
            className="hud-mobile-drive-btn"
            whileTap={{ scale: 0.93 }}
            onTouchStart={(e) => {
              e.stopPropagation()
              journeyStore.setAccelerating(true)
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              journeyStore.setAccelerating(false)
            }}
            onMouseDown={() => journeyStore.setAccelerating(true)}
            onMouseUp={() => journeyStore.setAccelerating(false)}
            onMouseLeave={() => journeyStore.setAccelerating(false)}
            onClick={() => journeyStore.nudgeForward(0.04)}
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#ffffff',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(14, 165, 233, 0.45)',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            <span>HOLD TO DRIVE</span>
            <span>🏍️</span>
          </motion.button>

          {/* Desktop Scroll Indicator */}
          <div
            className="hud-desktop-scroll-pill"
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
    </div>
  )
}
