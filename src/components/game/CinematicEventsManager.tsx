import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { journeyStore, INNOVATION_SPARKS } from './journeyStore'
import { audioEngine } from '../../utils/audio'

interface CinematicEventsManagerProps {
  bikePosition: [number, number, number]
  speed?: number
}

export default function CinematicEventsManager({ bikePosition }: CinematicEventsManagerProps) {
  const [bx, by, bz] = bikePosition

  // Spark burst particles
  const [burstSpark, setBurstSpark] = useState<{ x: number; y: number; z: number; color: string } | null>(null)
  const burstParticlesRef = useRef<THREE.Points>(null)
  const burstProgress = useRef(0)

  // Last collected spark tracking to prevent double audio
  const lastTriggeredSpark = useRef<string | null>(null)

  // Headlight beam ref
  const headlightBeamRef = useRef<THREE.SpotLight>(null)

  // Rain particles ref
  const rainGeoRef = useRef<THREE.BufferGeometry>(null)

  // Shared reusable materials
  const mats = useMemo(() => {
    return {
      neonCyan: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 2.5,
      }),
      neonGold: new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#d97706',
        emissiveIntensity: 2.8,
      }),
      neonPurple: new THREE.MeshStandardMaterial({
        color: '#c084fc',
        emissive: '#7e22ce',
        emissiveIntensity: 2.4,
      }),
      neonEmerald: new THREE.MeshStandardMaterial({
        color: '#34d399',
        emissive: '#059669',
        emissiveIntensity: 2.2,
      }),
      neonRose: new THREE.MeshStandardMaterial({
        color: '#f43f5e',
        emissive: '#be123c',
        emissiveIntensity: 2.2,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.4,
        metalness: 0.8,
      }),
      cloudMist: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.15,
        wireframe: false,
      }),
      wireframeAccent: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      }),
    }
  }, [])

  // Raindrop positions (1500 raindrops)
  const rainPositions = useMemo(() => {
    const count = 1200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return positions
  }, [])

  // Check spark intersections & animate 60fps elements
  useFrame((_state, delta) => {
    // 1. Check Collectible Sparks collision
    for (const spark of INNOVATION_SPARKS) {
      const dist = Math.hypot(bx - 0, bz - spark.zPos)
      if (dist < 2.6 && Math.abs(by - 0.7) < 2.0) {
        if (lastTriggeredSpark.current !== spark.id) {
          lastTriggeredSpark.current = spark.id
          journeyStore.triggerSparkNotification(spark.name, spark.category)
          audioEngine.playSparkCollect()
          setBurstSpark({ x: 0, y: 1.2, z: spark.zPos, color: spark.color })
          burstProgress.current = 0
        }
      }
    }

    // Reset lastTriggeredSpark when far away
    if (lastTriggeredSpark.current) {
      const curSpark = INNOVATION_SPARKS.find((s) => s.id === lastTriggeredSpark.current)
      if (curSpark && Math.abs(bz - curSpark.zPos) > 6) {
        lastTriggeredSpark.current = null
      }
    }

    // 2. Animate burst particles
    if (burstSpark && burstParticlesRef.current) {
      burstProgress.current += delta * 2.5
      burstParticlesRef.current.scale.setScalar(1 + burstProgress.current * 2)
      if (burstProgress.current > 1.2) {
        setBurstSpark(null)
      }
    }

    // 3. Animate rain falling when in rain zone (-2400 to -2750)
    if (rainGeoRef.current && bz <= -2350 && bz >= -2800) {
      const posAttr = rainGeoRef.current.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] -= delta * 28 // falling fast
        if (arr[i + 1] < 0) {
          arr[i + 1] = 20
        }
      }
      posAttr.needsUpdate = true
    }

    // 4. Update motorcycle headlight beam target
    if (headlightBeamRef.current) {
      headlightBeamRef.current.position.set(bx, by + 0.65, bz - 0.4)
      headlightBeamRef.current.target.position.set(bx, by + 0.1, bz - 16)
      headlightBeamRef.current.target.updateMatrixWorld()
    }
  })

  // Detect which bridge segments are illuminated based on bike Z (-1580 to -1740)
  const bridgeZ = -1660

  return (
    <group>
      {/* ========================================================
          EVENT 1: GLOWING PORTAL TUNNEL (-1060 to -1180)
          Between Education and Internships
      ======================================================== */}
      <group position={[0, 0, -1120]}>
        {/* Entrance Gate Archway */}
        <mesh position={[0, 4.5, 60]} material={mats.darkMetal}>
          <torusGeometry args={[5.2, 0.4, 8, 24, Math.PI]} />
        </mesh>
        <mesh position={[0, 4.5, 60]} material={mats.neonCyan}>
          <torusGeometry args={[5.2, 0.1, 8, 24, Math.PI]} />
        </mesh>

        {/* Illuminated Hexagonal Tunnel Ribs (10 ribs) */}
        {Array.from({ length: 11 }).map((_, i) => {
          const zOffset = 50 - i * 10
          const distToBike = Math.abs(bz - (-1120 + zOffset))
          const isNear = distToBike < 18
          return (
            <group key={i} position={[0, 0, zOffset]}>
              {/* Arch structure */}
              <mesh position={[-4.8, 2.5, 0]} material={mats.darkMetal}>
                <boxGeometry args={[0.3, 5, 0.3]} />
              </mesh>
              <mesh position={[4.8, 2.5, 0]} material={mats.darkMetal}>
                <boxGeometry args={[0.3, 5, 0.3]} />
              </mesh>
              <mesh position={[0, 5, 0]} material={mats.darkMetal}>
                <boxGeometry args={[9.9, 0.3, 0.3]} />
              </mesh>

              {/* Glowing Edge Lights that activate as motorcycle passes */}
              <mesh position={[0, 5.08, 0]}>
                <boxGeometry args={[9.6, 0.08, 0.08]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={isNear ? 4.5 : 1.2}
                />
              </mesh>
              <mesh position={[-4.72, 2.5, 0]}>
                <boxGeometry args={[0.08, 4.8, 0.08]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={isNear ? 4.5 : 1.2}
                />
              </mesh>
              <mesh position={[4.72, 2.5, 0]}>
                <boxGeometry args={[0.08, 4.8, 0.08]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={isNear ? 4.5 : 1.2}
                />
              </mesh>
            </group>
          )
        })}

        {/* Floating 3D Code Symbols inside Tunnel */}
        <group position={[-2.8, 3.2, 35]}>
          <Text fontSize={0.55} color="#38bdf8" anchorX="center" anchorY="middle">
            {'{ TypeScript }'}
          </Text>
        </group>
        <group position={[2.8, 3.2, 15]}>
          <Text fontSize={0.55} color="#60a5fa" anchorX="center" anchorY="middle">
            {'<React.js />'}
          </Text>
        </group>
        <group position={[-2.8, 3.2, -15]}>
          <Text fontSize={0.55} color="#22c55e" anchorX="center" anchorY="middle">
            {'Node.js & Express'}
          </Text>
        </group>
        <group position={[2.8, 3.2, -35]}>
          <Text fontSize={0.55} color="#f59e0b" anchorX="center" anchorY="middle">
            {'Docker & CI/CD'}
          </Text>
        </group>

        {/* Exit Banner: Transition to Professional District */}
        <mesh position={[0, 5.6, -55]} material={mats.darkMetal}>
          <boxGeometry args={[11, 0.8, 0.3]} />
        </mesh>
        <Text position={[0, 5.6, -55.2]} rotation={[0, Math.PI, 0]} fontSize={0.34} color="#ffffff" anchorX="center">
          ENTERING PROFESSIONAL DISTRICT · AMASQIS · AICTE · CODVEDA
        </Text>
      </group>

      {/* ========================================================
          EVENT 2: COLLECTIBLE INNOVATION SPARKS (8 ORBS)
      ======================================================== */}
      {INNOVATION_SPARKS.map((spark) => {
        const isCollected = bz <= spark.zPos
        return (
          <group key={spark.id} position={[0, 1.2, spark.zPos]}>
            {/* Glowing Orb */}
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial
                color={spark.color}
                emissive={spark.color}
                emissiveIntensity={isCollected ? 0.8 : 3.0}
                roughness={0.1}
                metalness={0.2}
              />
            </mesh>

            {/* Orbiting Halo Ring */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[0.55, 0.04, 8, 24]} />
              <meshBasicMaterial color={spark.color} transparent opacity={isCollected ? 0.3 : 0.9} />
            </mesh>

            {/* Floating Tech Label */}
            <Text
              position={[0, 0.75, 0]}
              fontSize={0.28}
              color={isCollected ? 'rgba(255,255,255,0.45)' : '#ffffff'}
              anchorX="center"
              anchorY="middle"
            >
              {spark.name}
            </Text>

            {/* Light aura */}
            <pointLight color={spark.color} intensity={isCollected ? 0.5 : 2.5} distance={7} />
          </group>
        )
      })}

      {/* Burst Particle effect upon collection */}
      {burstSpark && (
        <points ref={burstParticlesRef} position={[burstSpark.x, burstSpark.y, burstSpark.z]}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <pointsMaterial size={0.15} color={burstSpark.color} transparent opacity={0.8} />
        </points>
      )}

      {/* ========================================================
          EVENT 3: ACHIEVEMENT BRIDGE (-1580 to -1740)
          Suspension Bridge over Mist with Illumination
      ======================================================== */}
      <group position={[0, 0, bridgeZ]}>
        {/* Bridge Suspension Towers (North & South) */}
        {[-70, 70].map((towerZ, tidx) => (
          <group key={tidx} position={[0, 0, towerZ]}>
            {/* Left Tower */}
            <mesh position={[-5.5, 9, 0]} material={mats.darkMetal}>
              <boxGeometry args={[0.8, 18, 0.8]} />
            </mesh>
            <mesh position={[-5.5, 9, 0]} material={mats.neonGold}>
              <boxGeometry args={[0.85, 0.2, 0.85]} />
            </mesh>
            {/* Right Tower */}
            <mesh position={[5.5, 9, 0]} material={mats.darkMetal}>
              <boxGeometry args={[0.8, 18, 0.8]} />
            </mesh>
            <mesh position={[5.5, 9, 0]} material={mats.neonGold}>
              <boxGeometry args={[0.85, 0.2, 0.85]} />
            </mesh>
            {/* Crossbeam */}
            <mesh position={[0, 16, 0]} material={mats.darkMetal}>
              <boxGeometry args={[11.8, 0.8, 0.8]} />
            </mesh>
            <mesh position={[0, 16.5, 0]} material={mats.neonGold}>
              <boxGeometry args={[11.8, 0.1, 0.1]} />
            </mesh>
          </group>
        ))}

        {/* 14 Bridge Deck Segments (Illuminate dynamically as bike crosses) */}
        {Array.from({ length: 14 }).map((_, idx) => {
          const segZ = 65 - idx * 10
          const segAbsoluteZ = bridgeZ + segZ
          const hasCrossed = bz <= segAbsoluteZ
          return (
            <group key={idx} position={[0, 0, segZ]}>
              {/* Road segment edge curb */}
              <mesh position={[-4.5, 0.15, 0]}>
                <boxGeometry args={[0.4, 0.3, 9.6]} />
                <meshStandardMaterial
                  color="#1f2937"
                  emissive={hasCrossed ? '#f59e0b' : '#374151'}
                  emissiveIntensity={hasCrossed ? 2.5 : 0.3}
                />
              </mesh>
              <mesh position={[4.5, 0.15, 0]}>
                <boxGeometry args={[0.4, 0.3, 9.6]} />
                <meshStandardMaterial
                  color="#1f2937"
                  emissive={hasCrossed ? '#f59e0b' : '#374151'}
                  emissiveIntensity={hasCrossed ? 2.5 : 0.3}
                />
              </mesh>

              {/* Suspension Cables */}
              <mesh position={[-5.2, 5, 0]} material={mats.wireframeAccent}>
                <cylinderGeometry args={[0.02, 0.02, 10]} />
              </mesh>
              <mesh position={[5.2, 5, 0]} material={mats.wireframeAccent}>
                <cylinderGeometry args={[0.02, 0.02, 10]} />
              </mesh>
            </group>
          )
        })}

        {/* Holographic Hackathon Displays along the bridge */}
        <group position={[-5.8, 3.5, 40]}>
          <mesh material={mats.neonGold}>
            <octahedronGeometry args={[0.5]} />
          </mesh>
          <Text position={[0, 1.0, 0]} fontSize={0.34} color="#f59e0b" anchorX="center">
            🏆 MP POLICE HACKATHON
          </Text>
          <Text position={[0, 0.65, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            3rd Place Winner · 300+ Teams
          </Text>
        </group>

        <group position={[5.8, 3.5, 0]}>
          <mesh material={mats.neonCyan}>
            <octahedronGeometry args={[0.5]} />
          </mesh>
          <Text position={[0, 1.0, 0]} fontSize={0.34} color="#38bdf8" anchorX="center">
            🌟 SAMSUNG SOLVE FOR TOMORROW
          </Text>
          <Text position={[0, 0.65, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            Top 0.5% Nationwide · 20,000+ Teams
          </Text>
        </group>

        <group position={[-5.8, 3.5, -40]}>
          <mesh material={mats.neonPurple}>
            <octahedronGeometry args={[0.5]} />
          </mesh>
          <Text position={[0, 1.0, 0]} fontSize={0.34} color="#c084fc" anchorX="center">
            🚀 EPSILON TEXPEDITION 2026
          </Text>
          <Text position={[0, 0.65, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            Top 10 Finalist Nationwide
          </Text>
        </group>

        {/* Swirling Mist Cloud beneath bridge */}
        <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 160]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* ========================================================
          EVENT 4: PROJECT PORTALS (World 4 · -1760 to -2120)
      ======================================================== */}
      {/* 1. SaathiCircle Portal (-1780) */}
      <group position={[0, 0, -1780]}>
        <mesh position={[-6.2, 3.5, 0]} material={mats.neonRose}>
          <torusGeometry args={[2.5, 0.15, 8, 24]} />
        </mesh>
        <Text position={[-6.2, 4.2, 0]} fontSize={0.4} color="#f43f5e" anchorX="center">
          SAATHICIRCLE
        </Text>
        <Text position={[-6.2, 3.7, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
          AI Senior Care & SOS
        </Text>
        <Text position={[-6.2, 3.2, 0]} fontSize={0.18} color="rgba(255,255,255,0.7)" anchorX="center">
          React · Node.js · Firebase
        </Text>
        <pointLight position={[-6.2, 3.5, 0]} color="#f43f5e" intensity={2} distance={8} />
      </group>

      {/* 2. LaadliBachao Portal (-1940) */}
      <group position={[0, 0, -1940]}>
        <mesh position={[6.2, 3.5, 0]} material={mats.neonEmerald}>
          <torusGeometry args={[2.5, 0.15, 8, 24]} />
        </mesh>
        <Text position={[6.2, 4.2, 0]} fontSize={0.4} color="#34d399" anchorX="center">
          LAADLIBACHAO
        </Text>
        <Text position={[6.2, 3.7, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
          Social Safety & Incident Reporting
        </Text>
        <Text position={[6.2, 3.2, 0]} fontSize={0.18} color="rgba(255,255,255,0.7)" anchorX="center">
          -45% Emergency Response Latency
        </Text>
        <pointLight position={[6.2, 3.5, 0]} color="#34d399" intensity={2} distance={8} />
      </group>

      {/* 3. Garg Associates Portal (-2100) */}
      <group position={[0, 0, -2100]}>
        <mesh position={[-6.2, 3.5, 0]} material={mats.neonCyan}>
          <torusGeometry args={[2.5, 0.15, 8, 24]} />
        </mesh>
        <Text position={[-6.2, 4.2, 0]} fontSize={0.4} color="#38bdf8" anchorX="center">
          GARG ASSOCIATES
        </Text>
        <Text position={[-6.2, 3.7, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
          Legal Services Client Portal
        </Text>
        <Text position={[-6.2, 3.2, 0]} fontSize={0.18} color="rgba(255,255,255,0.7)" anchorX="center">
          +40% Lawyer-Client Matching
        </Text>
        <pointLight position={[-6.2, 3.5, 0]} color="#38bdf8" intensity={2} distance={8} />
      </group>

      {/* ========================================================
          EVENT 5: DYNAMIC WEATHER & MOTORCYCLE HEADLIGHT BEAM
          Rain (-2400 to -2750) + Mist
      ======================================================== */}
      {/* Dynamic Headlight beam cone */}
      <spotLight
        ref={headlightBeamRef}
        color="#bae6fd"
        intensity={bz <= -2100 ? 5.0 : 2.0}
        angle={0.42}
        penumbra={0.6}
        distance={28}
        castShadow={false}
      />

      {/* Rain Streaks in rain zone */}
      {bz <= -2350 && bz >= -2800 && (
        <group position={[bx, 0, bz]}>
          <points>
            <bufferGeometry ref={rainGeoRef}>
              <bufferAttribute
                attach="attributes-position"
                args={[rainPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial color="#93c5fd" size={0.12} transparent opacity={0.65} />
          </points>
        </group>
      )}

      {/* ========================================================
          EVENT 6: SKILLS CONSTELLATION (-2600 to -2850)
          Interactive 3D Night Sky Constellations
      ======================================================== */}
      <group position={[0, 0, -2700]}>
        {/* Constellation 1: Languages (Left overhead) */}
        <group position={[-9, 12, 40]}>
          <Text fontSize={0.65} color="#38bdf8" anchorX="center">
            ★ LANGUAGES CONSTELLATION
          </Text>
          <Text position={[0, -0.6, 0]} fontSize={0.35} color="#ffffff" anchorX="center">
            Java · Python · JavaScript · C++
          </Text>
        </group>

        {/* Constellation 2: Frontend (Right overhead) */}
        <group position={[9, 14, 15]}>
          <Text fontSize={0.65} color="#60a5fa" anchorX="center">
            ★ FRONTEND CONSTELLATION
          </Text>
          <Text position={[0, -0.6, 0]} fontSize={0.35} color="#ffffff" anchorX="center">
            React.js · Next.js · Tailwind CSS · Framer Motion
          </Text>
        </group>

        {/* Constellation 3: Backend & DB (Left overhead) */}
        <group position={[-9, 13, -15]}>
          <Text fontSize={0.65} color="#34d399" anchorX="center">
            ★ BACKEND & DATA CONSTELLATION
          </Text>
          <Text position={[0, -0.6, 0]} fontSize={0.35} color="#ffffff" anchorX="center">
            Node.js · Express · REST APIs · MongoDB · MySQL
          </Text>
        </group>

        {/* Constellation 4: Cloud & DevOps (Right overhead) */}
        <group position={[9, 15, -45]}>
          <Text fontSize={0.65} color="#f59e0b" anchorX="center">
            ★ CLOUD & DEVOPS CONSTELLATION
          </Text>
          <Text position={[0, -0.6, 0]} fontSize={0.35} color="#ffffff" anchorX="center">
            AWS EC2/S3/Lambda · Docker · CI/CD · GitHub Actions
          </Text>
        </group>
      </group>

      {/* ========================================================
          EVENT 8 & 9: OPTIONAL JUNCTION & EASTER EGGS
      ======================================================== */}
      {/* Route Junction Signs (-1550) */}
      <group position={[0, 4.2, -1550]}>
        <mesh material={mats.darkMetal}>
          <boxGeometry args={[10, 1.2, 0.2]} />
        </mesh>
        <Text position={[-2.4, 0.1, -0.15]} fontSize={0.28} color="#f59e0b" anchorX="center">
          ← FAST TRACK: ACHIEVEMENTS PASS
        </Text>
        <Text position={[2.4, 0.1, -0.15]} fontSize={0.28} color="#38bdf8" anchorX="center">
          PROJECT UNIVERSE: SCENIC ROUTE →
        </Text>
      </group>

      {/* Easter Egg 1: Retro Computer (-640, right side) */}
      <group position={[6.5, 1.2, -640]}>
        <mesh material={mats.neonEmerald}>
          <boxGeometry args={[0.6, 0.5, 0.4]} />
        </mesh>
        <Text position={[0, 0.6, 0]} fontSize={0.22} color="#34d399" anchorX="center">
          💾 EASTER EGG #1
        </Text>
        <Text position={[0, 0.35, 0]} fontSize={0.16} color="#ffffff" anchorX="center">
          "Hello World! Built with Three.js & Passion"
        </Text>
      </group>

      {/* Easter Egg 2: Floating Chai (-1450, left side) */}
      <group position={[-6.5, 1.2, -1450]}>
        <mesh material={mats.neonGold}>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 16]} />
        </mesh>
        <Text position={[0, 0.6, 0]} fontSize={0.22} color="#f59e0b" anchorX="center">
          ☕ EASTER EGG #2
        </Text>
        <Text position={[0, 0.35, 0]} fontSize={0.16} color="#ffffff" anchorX="center">
          "500+ cups of chai fueled these internships"
        </Text>
      </group>

      {/* Easter Egg 3: Holographic Satellite (-2350, overhead) */}
      <group position={[0, 9.5, -2350]}>
        <mesh material={mats.neonCyan}>
          <dodecahedronGeometry args={[0.6]} />
        </mesh>
        <Text position={[0, 0.9, 0]} fontSize={0.28} color="#38bdf8" anchorX="center">
          🛰️ EASTER EGG #3 · ORBITAL DATA
        </Text>
        <Text position={[0, 0.55, 0]} fontSize={0.2} color="#ffffff" anchorX="center">
          "VIT Bhopal · Computer Science · CGPA 9.19"
        </Text>
      </group>
    </group>
  )
}
