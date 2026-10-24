import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { journeyStore, type JourneyState } from './journeyStore'
import { ROAD_TOTAL_LENGTH, WORLDS } from './types'
import Character3D from './Character3D'
import Motorcycle3D from './Motorcycle3D'
import ParisCity3D from './ParisCity3D'
import Environment3D from './Environment3D'
import CameraController from './CameraController'
import CinematicEventsManager from './CinematicEventsManager'
import ByteRobot3D from './ByteRobot3D'
import RoadsideCharacters3D from './RoadsideCharacters3D'
import { audioEngine } from '../../utils/audio'

export default function CinematicWorld() {
  const [jState, setJState] = useState<JourneyState>(() => journeyStore.getState())

  // Direct 3D transform reference to avoid React re-renders during 60 FPS animation
  const bikeGroupRef = useRef<THREE.Group>(null)

  // Physical simulation variables (all in refs for silky smooth 60fps loop)
  const zPosRef = useRef(-jState.progress * ROAD_TOTAL_LENGTH)
  const progressRef = useRef(jState.progress)
  const lateralRef = useRef(jState.lateralOffset)
  const velocityRef = useRef(0) // meters per second forward along -Z (North)
  const steerRef = useRef(0)
  const leanRef = useRef(0)
  const distanceRef = useRef(jState.distance)
  const phaseRef = useRef(jState.phase)
  const mountingRef = useRef(jState.mountingProgress)

  // Throttled store update timer (10 Hz for React HUD, leaving WebGL at 60+ FPS)
  const lastStoreUpdate = useRef(0)

  // Keys currently held down
  const keysDown = useRef<{ [key: string]: boolean }>({})

  // Subscribe to store updates (e.g. jumps, menu resets)
  useEffect(() => {
    return journeyStore.subscribe((state) => {
      setJState(state)
      phaseRef.current = state.phase
      mountingRef.current = state.mountingProgress
      // If store progress jumped significantly from menu jump
      if (Math.abs(state.progress - progressRef.current) > 0.05) {
        progressRef.current = state.progress
        zPosRef.current = -state.progress * ROAD_TOTAL_LENGTH
        distanceRef.current = state.distance
      }
    })
  }, [])

  // Input Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      const key = e.key.toLowerCase()

      if (e.key === 'Escape') {
        journeyStore.toggleMenu()
        return
      }

      keysDown.current[key] = true

      // Space initiates brake
      if (e.code === 'Space') {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysDown.current[key] = false
    }

    // Smooth Mouse Wheel / Trackpad with momentum
    const handleWheel = (e: WheelEvent) => {
      if (phaseRef.current === 'opening') {
        journeyStore.startMounting()
        return
      }
      if (phaseRef.current === 'mounting') {
        return // Let mounting animation finish smoothly
      }

      // Scrolling DOWN (e.deltaY > 0) accelerates forward towards North (-Z)
      // Scrolling UP (e.deltaY < 0) decelerates
      const scrollImpulse = (e.deltaY / 100) * 1.8
      velocityRef.current = THREE.MathUtils.clamp(
        velocityRef.current + scrollImpulse,
        -5, // allow subtle reverse
        24  // max speed ~86 km/h
      )
    }

    // Touch events for mobile dragging
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY
        const diff = touchStartY - touchCurrentY
        touchStartY = touchCurrentY

        if (phaseRef.current === 'opening') {
          journeyStore.startMounting()
          return
        }
        if (phaseRef.current === 'mounting') return

        const touchImpulse = (diff / 20) * 1.5
        velocityRef.current = THREE.MathUtils.clamp(velocityRef.current + touchImpulse, -5, 24)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Continuous 60 FPS Physics & Animation Loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // 1. Handle Mounting Sequence Phase
    if (phaseRef.current === 'mounting') {
      const currentMount = mountingRef.current + delta * 0.7 // ~1.4 seconds duration
      mountingRef.current = currentMount

      if (currentMount >= 1.0) {
        journeyStore.finishMounting()
      } else {
        // Throttled store update during mounting
        if (time - lastStoreUpdate.current > 0.08) {
          lastStoreUpdate.current = time
          journeyStore.setState({ mountingProgress: currentMount })
        }
      }
      return
    }

    // 2. Handle Riding Movement & Authentic Motorcycle Physics
    if (phaseRef.current === 'riding') {
      const keys = keysDown.current
      const isUp = keys['w'] || keys['arrowup']
      const isDown = keys['s'] || keys['arrowdown']
      const isLeft = keys['a'] || keys['arrowleft']
      const isRight = keys['d'] || keys['arrowright']
      const isBraking = keys[' '] || isDown

      // Forward acceleration from 'W' key
      if (isUp) {
        const targetV = 18.0 // ~65 km/h
        velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, targetV, delta * 3.5)
      }

      // Braking
      if (isBraking) {
        velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0, delta * 8.0)
      } else if (!isUp) {
        // Natural rolling resistance and aerodynamic drag (smooth glide)
        velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0, delta * 1.8)
      }

      // Cut off near zero to rest
      if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0
      }

      // Advance distance traveled and Z position (moving North along -Z)
      const distanceStep = velocityRef.current * delta
      distanceRef.current += Math.abs(distanceStep)
      zPosRef.current = THREE.MathUtils.clamp(
        zPosRef.current - distanceStep,
        -ROAD_TOTAL_LENGTH,
        0
      )
      progressRef.current = -zPosRef.current / ROAD_TOTAL_LENGTH

      // Steering angle
      let targetSteer = 0
      if (isLeft) targetSteer = 0.32  // Steer left
      if (isRight) targetSteer = -0.32 // Steer right
      steerRef.current = THREE.MathUtils.lerp(steerRef.current, targetSteer, delta * 6.5)

      // Lateral position on boulevard (-3.6m to +3.6m)
      lateralRef.current = THREE.MathUtils.clamp(
        lateralRef.current - steerRef.current * delta * 7.0,
        -3.6,
        3.6
      )

      // Lean (banking) into turns (counter-steering roll)
      const targetLean = steerRef.current * 0.9
      leanRef.current = THREE.MathUtils.lerp(leanRef.current, targetLean, delta * 6.0)

      // Apply coordinates directly to 3D bike group (zero React re-render overhead!)
      if (bikeGroupRef.current) {
        bikeGroupRef.current.position.set(lateralRef.current, 0, zPosRef.current)
      }

      // Calculate speed in km/h
      const speedKmH = Math.round(velocityRef.current * 3.6)

      // Synchronize engine audio
      audioEngine.setEngineSpeed(speedKmH, isUp || velocityRef.current > 2)

      // Check for arrival at the end of the journey
      if (progressRef.current >= 0.995) {
        journeyStore.setState({ phase: 'arrived' })
      }

      // Throttled UI store update (10 FPS) for HUD speedometer & progress bar
      if (time - lastStoreUpdate.current > 0.09) {
        lastStoreUpdate.current = time

        // Calculate which world is active
        let activeWorld = 0
        for (let i = WORLDS.length - 1; i >= 0; i--) {
          if (progressRef.current >= WORLDS[i].startProgress) {
            activeWorld = i
            break
          }
        }

        // Determine audio zone from Z position for consistent atmospheric audio
        const currentZ = zPosRef.current
        let audioZone: 'clear' | 'mist' | 'rain' | 'sunrise' | 'tunnel' | 'bridge' = 'clear'
        if (currentZ <= -1060 && currentZ >= -1180) {
          audioZone = 'tunnel'
        } else if (currentZ <= -1580 && currentZ >= -1740) {
          audioZone = 'bridge'
        } else if (currentZ < -2400 && currentZ >= -2750) {
          audioZone = 'rain'
        } else if (currentZ < -2100 && currentZ >= -2400) {
          audioZone = 'mist'
        } else if (currentZ < -2750) {
          audioZone = 'clear' // sunrise zone, calm
        }
        audioEngine.setZone(audioZone)

        journeyStore.setState({
          progress: progressRef.current,
          distance: Math.round(distanceRef.current),
          speed: speedKmH,
          lateralOffset: lateralRef.current,
          steerAngle: steerRef.current,
          leanAngle: leanRef.current,
          activeWorldIndex: activeWorld,
          isBraking,
          isAccelerating: isUp || velocityRef.current > 5,
        })
      }
    }
  })

  const currentSpeed = THREE.MathUtils.clamp(Math.round(velocityRef.current * 3.6), 0, 100)
  const currentBikePos: [number, number, number] = [
    lateralRef.current,
    0,
    zPosRef.current,
  ]

  return (
    <group>
      {/* Cinematic Chase Camera Controller */}
      <CameraController
        phase={jState.phase}
        mountingProgress={mountingRef.current}
        bikePosition={currentBikePos}
        steerAngle={steerRef.current}
        leanAngle={leanRef.current}
        speed={currentSpeed}
        cinematicMode={jState.cinematicCameraMode}
      />

      {/* Parisian Sunset Atmosphere, Lighting & Fog */}
      <Environment3D progress={progressRef.current} bikePosition={currentBikePos} />

      {/* Parisian 3D Architecture with Distance Culling */}
      <ParisCity3D currentZ={zPosRef.current} />

      {/* Cinematic Events & Transitions Between Milestones */}
      <CinematicEventsManager bikePosition={currentBikePos} speed={currentSpeed} />

      {/* Roadside 3D Character Cast */}
      <RoadsideCharacters3D bikePosition={currentBikePos} />

      {/* Floating Robot Companion Byte */}
      {jState.phase !== 'opening' && (
        <ByteRobot3D bikePosition={currentBikePos} mood={jState.byteMood} />
      )}

      {/* Character & Vintage Scooter (Driven smoothly by bikeGroupRef) */}
      <group ref={bikeGroupRef} position={currentBikePos}>
        {/* Vintage Riviera Blue Vespa Scooter (Facing North, -Z) */}
        <Motorcycle3D
          speed={currentSpeed}
          steerAngle={steerRef.current}
          leanAngle={leanRef.current}
          isBraking={jState.isBraking}
          isAccelerating={jState.isAccelerating}
          headlightOn={jState.phase !== 'opening'}
          distanceTraveled={distanceRef.current}
        />

        {/* Rider Character (Facing North, -Z, holding handlebars) */}
        <Character3D
          phase={jState.phase}
          mountingProgress={mountingRef.current}
          steerAngle={steerRef.current}
          leanAngle={leanRef.current}
          speed={currentSpeed}
        />
      </group>
    </group>
  )
}
