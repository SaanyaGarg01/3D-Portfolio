import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, FileText } from 'lucide-react'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Scene from './components/Scene'
import OpeningHeroOverlay from './components/ui/OpeningHeroOverlay'
import JourneyHUD from './components/ui/JourneyHUD'
import WorldOverlay from './components/ui/WorldOverlay'
import JourneyMenu from './components/ui/JourneyMenu'
import EditorialPortfolio from './components/EditorialPortfolio'
import DiscoveryJournalModal from './components/ui/DiscoveryJournalModal'
import NoWebGL from './components/NoWebGL'
import { journeyStore, type JourneyState } from './components/game/journeyStore'
import { audioEngine } from './utils/audio'

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [jState, setJState] = useState<JourneyState>(() => journeyStore.getState())
  const [webglSupported] = useState(checkWebGL)
  const [viewMode, setViewMode] = useState<'3d' | 'editorial'>('3d')

  useEffect(() => {
    return journeyStore.subscribe(setJState)
  }, [])

  const handlePreloaderComplete = (soundChoice = true) => {
    setIsLoading(false)
    if (soundChoice) {
      audioEngine.playAmbient()
      journeyStore.setState({ soundEnabled: true })
    }
  }

  const handleStartJourney = () => {
    journeyStore.startMounting()
  }

  if (!webglSupported) {
    return <NoWebGL />
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        height: viewMode === '3d' ? '100vh' : 'auto',
        overflow: viewMode === '3d' ? 'hidden' : 'visible',
        background: '#07090e',
      }}
    >
      <CustomCursor />

      {/* Sébastien Lempens inspired interactive Preloader & Start experience */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Top Floating View Mode Switcher Pill */}
          <div
            style={{
              position: 'fixed',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 700,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(10, 15, 29, 0.82)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 30,
              padding: '4px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={() => setViewMode('3d')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                background: viewMode === '3d' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
                color: viewMode === '3d' ? '#ffffff' : 'rgba(255,255,255,0.65)',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Compass size={13} /> 3D Journey
            </button>

            <button
              onClick={() => setViewMode('editorial')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                background: viewMode === 'editorial' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
                color: viewMode === 'editorial' ? '#ffffff' : 'rgba(255,255,255,0.65)',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <FileText size={13} /> Full Portfolio
            </button>
          </div>

          {/* VIEW MODE 1: 3D Interactive World */}
          {viewMode === '3d' && (
            <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
              {/* Persistent Interactive 3D World Canvas */}
              <Scene />

              {/* Phase 1: Girl Standing Beside Motorcycle Opening Overlay */}
              <OpeningHeroOverlay
                phase={jState.phase}
                onStartJourney={handleStartJourney}
                onOpenEditorialPortfolio={() => setViewMode('editorial')}
              />

              {/* Phase 2 & 3: Gameplay HUD (Speedometer, Progress Bar, Mini Controls) */}
              <JourneyHUD />

              {/* Contextual Landmark Information Layer */}
              <WorldOverlay />

              {/* Escape Journey Menu (Resume, Restart, Jump to Worlds, Sound) */}
              <JourneyMenu />

              {/* Discovery Journal Modal */}
              <DiscoveryJournalModal />
            </div>
          )}

          {/* VIEW MODE 2: Editorial Quiet Luxury Portfolio */}
          {viewMode === 'editorial' && (
            <EditorialPortfolio onSwitchTo3D={() => setViewMode('3d')} />
          )}
        </>
      )}
    </div>
  )
}
