import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Scene from './components/Scene'
import OpeningHeroOverlay from './components/ui/OpeningHeroOverlay'
import JourneyHUD from './components/ui/JourneyHUD'
import WorldOverlay from './components/ui/WorldOverlay'
import JourneyMenu from './components/ui/JourneyMenu'
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
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07090e' }}>
      <CustomCursor />

      {/* Sébastien Lempens inspired interactive Preloader & Start experience */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Persistent Interactive 3D World Canvas */}
          <Scene />

          {/* Phase 1: Girl Standing Beside Motorcycle Opening Overlay */}
          <OpeningHeroOverlay
            phase={jState.phase}
            onStartJourney={handleStartJourney}
          />

          {/* Phase 2 & 3: Gameplay HUD (Speedometer, Progress Bar, Mini Controls) */}
          <JourneyHUD />

          {/* Contextual Landmark Information Layer (Education, Internships, Projects, Achievements, Skills, Certs, Contact) */}
          <WorldOverlay />

          {/* Escape Journey Menu (Resume, Restart, Jump to Worlds, Sound) */}
          <JourneyMenu />
        </>
      )}
    </div>
  )
}
