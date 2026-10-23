import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface EnvironmentProps {
  progress: number
  bikePosition: [number, number, number]
}

// Glowing Dust Motes / Fireflies floating in the air along the boulevard
function AtmosphereDust({ bikeZ }: { bikeZ: number }) {
  const count = 180
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 24 // X around boulevard
      pos[i * 3 + 1] = 0.8 + Math.random() * 6.5   // Y above ground
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80  // Z relative to bike
      ph[i] = Math.random() * Math.PI * 2
    }
    return [pos, ph]
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    pointsRef.current.position.z = bikeZ

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const array = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      // Gentle floating bob
      array[i * 3 + 1] += Math.sin(time * 1.5 + phases[i]) * 0.003
      // Drift sideways
      array[i * 3 + 0] += Math.cos(time * 0.8 + phases[i]) * 0.002
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#fde047"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Dynamic Sunset -> Blue-Hour -> Night Sky Dome
function SkyDome({ bikeZ, progress }: { bikeZ: number; progress: number }) {
  const skyMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const horizonMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const sunGroupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)

  // Pre-generate stars for night phase
  const starPositions = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.8 + 0.2) // upper dome only
      const r = 900
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  useFrame(() => {
    // 0.0 to 0.35: Warm Sunset
    // 0.35 to 0.70: Twilight / Blue-Hour
    // 0.70 to 1.0: Magical Starlit Night
    const sunsetColor = new THREE.Color('#d47b6a')
    const twilightColor = new THREE.Color('#38284e')
    const nightColor = new THREE.Color('#0a0f1d')

    const horizonSunset = new THREE.Color('#f59e0b')
    const horizonTwilight = new THREE.Color('#db2777')
    const horizonNight = new THREE.Color('#1e1b4b')

    const currentSky = new THREE.Color()
    const currentHorizon = new THREE.Color()

    if (progress < 0.4) {
      const t = progress / 0.4
      currentSky.lerpColors(sunsetColor, twilightColor, t)
      currentHorizon.lerpColors(horizonSunset, horizonTwilight, t)
    } else {
      const t = (progress - 0.4) / 0.6
      currentSky.lerpColors(twilightColor, nightColor, t)
      currentHorizon.lerpColors(horizonTwilight, horizonNight, t)
    }

    if (skyMatRef.current) {
      skyMatRef.current.color.copy(currentSky)
    }
    if (horizonMatRef.current) {
      horizonMatRef.current.color.copy(currentHorizon)
    }

    // Sun sets below horizon as progress increases
    if (sunGroupRef.current) {
      const sunY = 32 - progress * 80
      sunGroupRef.current.position.y = sunY
      sunGroupRef.current.visible = sunY > -15
    }

    // Stars become visible during blue-hour and night
    if (starsRef.current) {
      const starOpacity = THREE.MathUtils.clamp((progress - 0.35) * 2.2, 0, 0.95)
      ;(starsRef.current.material as THREE.PointsMaterial).opacity = starOpacity
    }
  })

  return (
    <group>
      {/* Main Sky Dome */}
      <mesh position={[0, -50, bikeZ]}>
        <sphereGeometry args={[1100, 32, 16]} />
        <meshBasicMaterial ref={skyMatRef} color="#d47b6a" side={THREE.BackSide} depthWrite={false} fog={false} />
      </mesh>

      {/* Horizon Warmth Glow Band */}
      <mesh position={[0, -40, bikeZ]}>
        <cylinderGeometry args={[1050, 1050, 140, 32, 1, true]} />
        <meshBasicMaterial ref={horizonMatRef} color="#f59e0b" side={THREE.BackSide} depthWrite={false} fog={false} transparent opacity={0.65} />
      </mesh>

      {/* Setting Golden Sun */}
      <group ref={sunGroupRef} position={[-120, 32, bikeZ - 260]}>
        <mesh>
          <sphereGeometry args={[14, 20, 20]} />
          <meshBasicMaterial color="#fffbeb" depthWrite={false} fog={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[22, 16, 16]} />
          <meshBasicMaterial color="#fcd34d" depthWrite={false} fog={false} transparent opacity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[38, 12, 12]} />
          <meshBasicMaterial color="#f97316" depthWrite={false} fog={false} transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Night Sky Stars */}
      <points ref={starsRef} position={[0, 0, bikeZ]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.8}
          color="#f8fafc"
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* Clouds */}
      {[
        { pos: [-220, 65, -140] as [number, number, number], r: 24, o: 0.28 },
        { pos: [-80, 72, -180] as [number, number, number], r: 18, o: 0.24 },
        { pos: [110, 58, -160] as [number, number, number], r: 26, o: 0.22 },
        { pos: [240, 68, -280] as [number, number, number], r: 20, o: 0.26 },
      ].map((cloud, i) => (
        <mesh key={i} position={[cloud.pos[0], cloud.pos[1], bikeZ + cloud.pos[2]]} scale={[2.4, 0.7, 1.0]}>
          <sphereGeometry args={[cloud.r, 10, 6]} />
          <meshBasicMaterial color="#b47466" depthWrite={false} fog={false} transparent opacity={cloud.o} />
        </mesh>
      ))}
    </group>
  )
}

export default function Environment3D({ progress, bikePosition }: EnvironmentProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null)
  const ambLightRef = useRef<THREE.AmbientLight>(null)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color('#d47b6a')
    scene.fog = new THREE.Fog('#d47b6a', 60, 320)
    return () => {
      scene.fog = null
    }
  }, [scene])

  useFrame(() => {
    // Dynamically update fog and ambient light color based on sunset -> night progress
    const sunsetFog = new THREE.Color('#d47b6a')
    const twilightFog = new THREE.Color('#38284e')
    const nightFog = new THREE.Color('#0a0f1d')

    const currentFog = new THREE.Color()
    if (progress < 0.4) {
      currentFog.lerpColors(sunsetFog, twilightFog, progress / 0.4)
    } else {
      currentFog.lerpColors(twilightFog, nightFog, (progress - 0.4) / 0.6)
    }

    if (scene.fog) {
      scene.fog.color.copy(currentFog)
    }
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(currentFog)
    }

    // Directional light position tracking bike
    if (dirLightRef.current) {
      dirLightRef.current.position.set(bikePosition[0] - 45, 45, bikePosition[2] + 70)
      dirLightRef.current.target.position.set(bikePosition[0], 0, bikePosition[2])
      dirLightRef.current.target.updateMatrixWorld()

      // Dim sunlight as twilight descends
      const sunIntensity = THREE.MathUtils.lerp(3.2, 0.6, THREE.MathUtils.clamp(progress * 1.5, 0, 1))
      dirLightRef.current.intensity = sunIntensity
    }

    // Ambient light transition
    if (ambLightRef.current) {
      const sunsetAmb = new THREE.Color('#f6d5ce')
      const nightAmb = new THREE.Color('#1e293b')
      const currentAmb = new THREE.Color().lerpColors(sunsetAmb, nightAmb, progress)
      ambLightRef.current.color.copy(currentAmb)
      ambLightRef.current.intensity = THREE.MathUtils.lerp(1.6, 0.9, progress)
    }
  })

  const bikeZ = bikePosition[2]

  return (
    <group>
      {/* Dynamic Sky with Sun, Stars & Horizon Band */}
      <SkyDome bikeZ={bikeZ} progress={progress} />

      {/* Floating Sunset Dust Motes / Fireflies */}
      <AtmosphereDust bikeZ={bikeZ} />

      {/* Dynamic Ambient Light */}
      <ambientLight ref={ambLightRef} intensity={1.6} color="#f6d5ce" />

      {/* Sunset Key Directional Light */}
      <directionalLight
        ref={dirLightRef}
        intensity={3.2}
        color="#ffe4cc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0004}
      />

      {/* Hemisphere sky fill */}
      <hemisphereLight
        color="#ffc4a8"
        groundColor="#332420"
        intensity={0.7}
      />
    </group>
  )
}
