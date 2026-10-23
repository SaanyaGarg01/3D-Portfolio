import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { createParisMaterials } from './parisMaterials'
import { ROAD_TOTAL_LENGTH } from './types'

interface ParisCityProps {
  currentZ: number
}

// Parisian Classic Street Lantern (Cast-iron base, tapered glass lantern)
function ParisStreetLamp({ position }: { position: [number, number, number] }) {
  const materials = useMemo(() => createParisMaterials(), [])
  return (
    <group position={position}>
      {/* Stone Pedestal */}
      <mesh position={[0, 0.4, 0]} material={materials.bridgeStone}>
        <boxGeometry args={[0.5, 0.8, 0.5]} />
      </mesh>
      {/* Cast Iron Column */}
      <mesh position={[0, 1.8, 0]} material={materials.lampPost}>
        <cylinderGeometry args={[0.07, 0.12, 2.0, 8]} />
      </mesh>
      {/* Crossbar & Scrollwork */}
      <mesh position={[0, 2.6, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.lampPost}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
      </mesh>
      {/* Lantern Head with Emissive Warm Glow */}
      <mesh position={[0, 3.0, 0]} material={materials.lampGlow}>
        <boxGeometry args={[0.38, 0.48, 0.38]} />
      </mesh>
      <mesh position={[0, 3.32, 0]} material={materials.lampPost}>
        <coneGeometry args={[0.32, 0.28, 4]} />
      </mesh>
    </group>
  )
}

// Boulevard Tree with low-poly foliage
function ParisBoulevardTree({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const materials = useMemo(() => createParisMaterials(), [])
  const foliageMat = variant % 2 === 0 ? materials.treeFoliage : materials.treeFoliageAutumn
  return (
    <group position={position}>
      {/* Cast-iron tree planter ring */}
      <mesh position={[0, 0.08, 0]} material={materials.lampPost}>
        <cylinderGeometry args={[0.75, 0.75, 0.16, 10]} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 1.3, 0]} material={materials.treeTrunk}>
        <cylinderGeometry args={[0.11, 0.16, 2.6, 8]} />
      </mesh>
      {/* Spherical low-poly foliage cluster 1 */}
      <mesh position={[0, 3.2, 0]} material={foliageMat}>
        <dodecahedronGeometry args={[1.5, 1]} />
      </mesh>
      {/* Foliage cluster 2 */}
      <mesh position={[0.4, 3.8, 0.2]} material={foliageMat}>
        <dodecahedronGeometry args={[1.1, 1]} />
      </mesh>
    </group>
  )
}

// Parisian Park Bench
function StreetBench({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const materials = useMemo(() => createParisMaterials(), [])
  return (
    <group position={position} rotation={rotation}>
      {/* Dark green cast-iron legs */}
      <mesh position={[-0.7, 0.3, 0]} material={materials.lampPost}>
        <boxGeometry args={[0.08, 0.6, 0.45]} />
      </mesh>
      <mesh position={[0.7, 0.3, 0]} material={materials.lampPost}>
        <boxGeometry args={[0.08, 0.6, 0.45]} />
      </mesh>
      {/* Wooden slats (seat & back) */}
      <mesh position={[0, 0.42, 0]} material={materials.treeTrunk}>
        <boxGeometry args={[1.6, 0.06, 0.42]} />
      </mesh>
      <mesh position={[0, 0.70, -0.18]} rotation={[0.2, 0, 0]} material={materials.treeTrunk}>
        <boxGeometry args={[1.6, 0.32, 0.05]} />
      </mesh>
    </group>
  )
}

// Classical Parisian Haussmann Building Block with Glowing Windows
function HaussmannBlock({
  position,
  width = 28,
  height = 20,
  depth = 14,
  stoneVariant = 0,
}: {
  position: [number, number, number]
  width?: number
  height?: number
  depth?: number
  stoneVariant?: number
}) {
  const materials = useMemo(() => createParisMaterials(), [])
  const facadeMat = stoneVariant % 2 === 0 ? materials.facadeMid : materials.facadeLight

  return (
    <group position={position}>
      {/* Main Classical Stone Facade */}
      <mesh position={[0, height * 0.42, 0]} material={facadeMat} receiveShadow>
        <boxGeometry args={[width, height * 0.84, depth]} />
      </mesh>

      {/* Rusticated Ground Floor Trim */}
      <mesh position={[0, 2.0, depth * 0.5 + 0.1]} material={materials.facadeDark}>
        <boxGeometry args={[width * 0.98, 4.0, 0.25]} />
      </mesh>

      {/* Floor Cornices & Balconies with glowing windows */}
      {[6.0, 10.0, 14.0].map((fy, idx) => (
        <group key={idx} position={[0, fy, depth * 0.5 + 0.15]}>
          {/* Stone Cornice Molding */}
          <mesh material={materials.facadeLight}>
            <boxGeometry args={[width * 0.96, 0.30, 0.35]} />
          </mesh>

          {/* Glowing Windows along the floor */}
          {[-width * 0.36, -width * 0.18, 0, width * 0.18, width * 0.36].map((wx, wIdx) => {
            // Alternate warm amber glowing windows with cool glass
            const isLit = (wIdx + idx + stoneVariant) % 2 === 0
            return (
              <mesh
                key={wIdx}
                position={[wx, 1.2, 0.02]}
                material={isLit ? materials.windowGlowWarm : materials.windowGlass}
              >
                <planeGeometry args={[1.4, 2.0]} />
              </mesh>
            )
          })}

          {/* French Wrought-Iron Balcony on 2nd and 4th floors */}
          {idx !== 1 && (
            <mesh position={[0, 0.45, 0.20]} material={materials.lampPost}>
              <boxGeometry args={[width * 0.92, 0.55, 0.22]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Slate Zinc Mansard Roof */}
      <mesh position={[0, height * 0.88 + 2.0, 0]} material={materials.mansardRoof}>
        <boxGeometry args={[width * 0.96, 4.0, depth * 0.94]} />
      </mesh>

      {/* Mansard Dormer Windows */}
      {[-width * 0.34, -width * 0.12, width * 0.12, width * 0.34].map((dormerX, c) => (
        <mesh key={c} position={[dormerX, height * 0.88 + 2.0, depth * 0.48]} material={materials.facadeLight}>
          <boxGeometry args={[1.3, 1.6, 0.7]} />
        </mesh>
      ))}

      {/* Rooftop Terracotta Chimneys */}
      {[-width * 0.35, -width * 0.12, width * 0.15, width * 0.38].map((cx, i) => (
        <group key={i} position={[cx, height + 1.6, depth * 0.15]}>
          <mesh material={materials.facadeDark}>
            <boxGeometry args={[0.9, 1.6, 0.6]} />
          </mesh>
          <mesh position={[-0.2, 0.9, 0]} material={materials.curbStone}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
          </mesh>
          <mesh position={[0.2, 0.9, 0]} material={materials.curbStone}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// The Grand Eiffel Tower with Sweeping Beacon Light
function EiffelTower3D({ position }: { position: [number, number, number] }) {
  const materials = useMemo(() => createParisMaterials(), [])
  const beaconRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.elapsedTime * 0.6
    }
  })

  return (
    <group position={position}>
      {/* 4 Diagonal Base Legs */}
      <mesh position={[-11, 8, -11]} rotation={[0.26, 0, -0.26]} material={materials.eiffelMetal}>
        <boxGeometry args={[3.2, 18, 3.2]} />
      </mesh>
      <mesh position={[11, 8, -11]} rotation={[0.26, 0, 0.26]} material={materials.eiffelMetal}>
        <boxGeometry args={[3.2, 18, 3.2]} />
      </mesh>
      <mesh position={[-11, 8, 11]} rotation={[-0.26, 0, -0.26]} material={materials.eiffelMetal}>
        <boxGeometry args={[3.2, 18, 3.2]} />
      </mesh>
      <mesh position={[11, 8, 11]} rotation={[-0.26, 0, 0.26]} material={materials.eiffelMetal}>
        <boxGeometry args={[3.2, 18, 3.2]} />
      </mesh>

      {/* Grand Arch Under Base */}
      <mesh position={[0, 9, 0]} material={materials.eiffelMetal}>
        <torusGeometry args={[11, 1.2, 8, 24, Math.PI]} />
      </mesh>

      {/* Platform 1 */}
      <mesh position={[0, 16.5, 0]} material={materials.eiffelMetal}>
        <boxGeometry args={[22, 1.8, 22]} />
      </mesh>

      {/* Mid Section */}
      <mesh position={[0, 31, 0]} material={materials.eiffelMetal}>
        <cylinderGeometry args={[6.5, 9.5, 27, 4]} />
      </mesh>

      {/* Platform 2 */}
      <mesh position={[0, 45, 0]} material={materials.eiffelMetal}>
        <boxGeometry args={[13, 1.5, 13]} />
      </mesh>

      {/* Upper Spire */}
      <mesh position={[0, 72, 0]} material={materials.eiffelMetal}>
        <cylinderGeometry args={[1.5, 5.5, 52, 4]} />
      </mesh>

      {/* Third Platform & Lantern Dome */}
      <mesh position={[0, 99, 0]} material={materials.eiffelGlow}>
        <cylinderGeometry args={[2.0, 1.5, 3.5, 8]} />
      </mesh>

      {/* Sweeping Eiffel Tower Beacon Light */}
      <group ref={beaconRef} position={[0, 103, 0]}>
        <spotLight
          position={[0, 0, 0]}
          target-position={[150, -50, 0]}
          color="#fef08a"
          intensity={8.0}
          distance={350}
          angle={0.25}
          penumbra={0.3}
        />
      </group>
    </group>
  )
}

// Rotating Ferris Wheel (Roue de Paris)
function FerrisWheel3D({ position }: { position: [number, number, number] }) {
  const materials = useMemo(() => createParisMaterials(), [])
  const wheelGroupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })

  const gondolaCount = 12
  const wheelRadius = 14

  return (
    <group position={position}>
      {/* Support A-Frame */}
      <mesh position={[-3.5, 8, 0]} rotation={[0, 0, -0.22]} material={materials.eiffelMetal}>
        <cylinderGeometry args={[0.3, 0.6, 17, 8]} />
      </mesh>
      <mesh position={[3.5, 8, 0]} rotation={[0, 0, 0.22]} material={materials.eiffelMetal}>
        <cylinderGeometry args={[0.3, 0.6, 17, 8]} />
      </mesh>

      {/* Central Axle */}
      <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.eiffelMetal}>
        <cylinderGeometry args={[1.2, 1.2, 3.5, 12]} />
      </mesh>

      {/* Rotating Wheel Assembly */}
      <group ref={wheelGroupRef} position={[0, 15, 0]}>
        <mesh material={materials.windowGlowCyan}>
          <torusGeometry args={[wheelRadius, 0.25, 8, 36]} />
        </mesh>
        <mesh material={materials.eiffelMetal}>
          <torusGeometry args={[wheelRadius * 0.75, 0.18, 6, 28]} />
        </mesh>

        {Array.from({ length: gondolaCount }).map((_, i) => {
          const angle = (i * Math.PI * 2) / gondolaCount
          const gx = Math.cos(angle) * wheelRadius
          const gy = Math.sin(angle) * wheelRadius
          return (
            <group key={i}>
              <mesh rotation={[0, 0, angle]}>
                <cylinderGeometry args={[0.08, 0.08, wheelRadius * 2, 4]} />
              </mesh>
              <mesh position={[gx, gy, 0]} material={materials.windowGlowWarm}>
                <boxGeometry args={[1.4, 1.2, 1.6]} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

// Seine Stone Bridge
function SeineStoneBridge({ position, length = 85 }: { position: [number, number, number]; length?: number }) {
  const materials = useMemo(() => createParisMaterials(), [])
  const arches = 5

  return (
    <group position={position}>
      {/* Upper Road Deck */}
      <mesh position={[0, 4.4, 0]} material={materials.bridgeStone} receiveShadow>
        <boxGeometry args={[length, 1.2, 14]} />
      </mesh>

      {/* Stone Balustrade Walls */}
      <mesh position={[0, 5.4, -6.8]} material={materials.bridgeStone}>
        <boxGeometry args={[length, 0.9, 0.4]} />
      </mesh>
      <mesh position={[0, 5.4, 6.8]} material={materials.bridgeStone}>
        <boxGeometry args={[length, 0.9, 0.4]} />
      </mesh>

      {/* Classical Street Lamps on Bridge */}
      {[-length * 0.32, length * 0.32].map((bx, i) => (
        <group key={i}>
          <ParisStreetLamp position={[bx, 5.4, -6.8]} />
          <ParisStreetLamp position={[bx, 5.4, 6.8]} />
        </group>
      ))}

      {/* Arches */}
      {Array.from({ length: arches }).map((_, a) => {
        const archX = (a - (arches - 1) * 0.5) * (length / arches)
        return (
          <group key={a} position={[archX, 2.0, 0]}>
            <mesh position={[-5, 0, 0]} material={materials.bridgeStone}>
              <boxGeometry args={[1.8, 4.2, 14.2]} />
            </mesh>
            <mesh position={[5, 0, 0]} material={materials.bridgeStone}>
              <boxGeometry args={[1.8, 4.2, 14.2]} />
            </mesh>
            <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bridgeStone}>
              <torusGeometry args={[4.5, 0.6, 6, 12, Math.PI]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Grand Overhead Boulevard Triumphal Arch & Highway Gantry
// Spans safely over the 12m road at Y = 6.2 - 7.8m so the rider drives smoothly underneath
// High-contrast dark signboard guarantees crystal-clear legibility with zero text overlap
function StoryLandmark({
  title,
  subtitle,
  tag,
  position,
  color = '#38bdf8',
}: {
  title: string
  subtitle: string
  tag: string
  position: [number, number, number]
  color?: string
}) {
  const materials = useMemo(() => createParisMaterials(), [])
  return (
    <group position={position}>
      {/* Left Grand Stone Pillar on Sidewalk */}
      <mesh position={[-7.2, 3.8, 0]} material={materials.bridgeStone}>
        <boxGeometry args={[1.2, 7.6, 1.2]} />
      </mesh>
      {/* Left Pillar Molding Trim */}
      <mesh position={[-7.2, 7.5, 0]} material={materials.curbStone}>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
      </mesh>
      {/* Left Pillar Glowing Lantern */}
      <mesh position={[-7.2, 8.0, 0]} material={materials.windowGlowWarm}>
        <sphereGeometry args={[0.38, 14, 14]} />
      </mesh>

      {/* Right Grand Stone Pillar on Sidewalk */}
      <mesh position={[7.2, 3.8, 0]} material={materials.bridgeStone}>
        <boxGeometry args={[1.2, 7.6, 1.2]} />
      </mesh>
      {/* Right Pillar Molding Trim */}
      <mesh position={[7.2, 7.5, 0]} material={materials.curbStone}>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
      </mesh>
      {/* Right Pillar Glowing Lantern */}
      <mesh position={[7.2, 8.0, 0]} material={materials.windowGlowWarm}>
        <sphereGeometry args={[0.38, 14, 14]} />
      </mesh>

      {/* Overhead Bridge Crossbeam spanning across the boulevard */}
      <mesh position={[0, 7.2, 0]} material={materials.bridgeStone}>
        <boxGeometry args={[15.6, 1.6, 1.3]} />
      </mesh>

      {/* High-Contrast Dark Architectural Signage Backboard */}
      <mesh position={[0, 7.2, 0.68]}>
        <boxGeometry args={[13.2, 1.9, 0.08]} />
        <meshBasicMaterial color="#0b0f19" />
      </mesh>
      {/* Signboard Border Trim */}
      <mesh position={[0, 7.2, 0.70]} material={materials.scooterChrome}>
        <boxGeometry args={[13.3, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, 8.12, 0.70]} material={materials.scooterChrome}>
        <boxGeometry args={[13.3, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, 6.28, 0.70]} material={materials.scooterChrome}>
        <boxGeometry args={[13.3, 0.04, 0.04]} />
      </mesh>

      {/* Line 1: Top Category Tag Badge (Elevated Y = 7.72) */}
      <Text
        position={[0, 7.72, 0.75]}
        fontSize={0.28}
        letterSpacing={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {tag.toUpperCase()}
      </Text>

      {/* Line 2: Main Milestone Heading (Elevated Y = 7.18, Crisp Large Bold) */}
      <Text
        position={[0, 7.18, 0.75]}
        fontSize={0.88}
        letterSpacing={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#020617"
      >
        {title.toUpperCase()}
      </Text>

      {/* Line 3: Subtitle / Key Highlight (Elevated Y = 6.64) */}
      <Text
        position={[0, 6.64, 0.75]}
        fontSize={0.42}
        letterSpacing={0.05}
        color="#fef08a"
        anchorX="center"
        anchorY="middle"
      >
        {subtitle}
      </Text>
    </group>
  )
}

export default function ParisCity3D({ currentZ }: ParisCityProps) {
  const materials = useMemo(() => createParisMaterials(), [])
  const boulevardWidth = 12
  const cullDist = 280

  // Pre-generate city block layouts
  const rightBlocks = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      z: -i * 72 - 10,
    }))
  }, [])

  const farLeftBlocks = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      z: -i * 105 - 45,
    }))
  }, [])

  return (
    <group>
      {/* ========================================================
          0. WARM STONE GROUND TERRAIN
      ======================================================== */}
      <mesh position={[0, -0.02, -ROAD_TOTAL_LENGTH * 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, ROAD_TOTAL_LENGTH + 600]} />
        <meshStandardMaterial color="#c48a7b" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* ========================================================
          1. THE SEINE RIVER (Deep reflecting waters)
      ======================================================== */}
      <mesh
        position={[-58, 0.35, -ROAD_TOTAL_LENGTH * 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.water}
      >
        <planeGeometry args={[65, ROAD_TOTAL_LENGTH + 600, 16, 32]} />
      </mesh>

      {/* Stone Quayside Embankment Wall */}
      <mesh position={[-boulevardWidth * 0.5 - 2.2, 1.5, -ROAD_TOTAL_LENGTH * 0.5]} material={materials.bridgeStone}>
        <boxGeometry args={[3.0, 3.0, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>
      {/* Quayside Balustrade Top Wall */}
      <mesh position={[-boulevardWidth * 0.5 - 1.8, 3.2, -ROAD_TOTAL_LENGTH * 0.5]} material={materials.bridgeStone}>
        <boxGeometry args={[0.6, 1.0, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* ========================================================
          2. DETAILED BOULEVARD ROADWAY & CURBS
      ======================================================== */}
      {/* Sleek Dark Asphalt Road Surface */}
      <mesh
        position={[0, 0.04, -ROAD_TOTAL_LENGTH * 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.roadAsphalt}
        receiveShadow
      >
        <planeGeometry args={[boulevardWidth, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* Left Stone Curb */}
      <mesh position={[-boulevardWidth * 0.5, 0.12, -ROAD_TOTAL_LENGTH * 0.5]} material={materials.curbStone}>
        <boxGeometry args={[0.35, 0.22, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* Right Stone Curb */}
      <mesh position={[boulevardWidth * 0.5, 0.12, -ROAD_TOTAL_LENGTH * 0.5]} material={materials.curbStone}>
        <boxGeometry args={[0.35, 0.22, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* Glowing Dashed White Center Line */}
      <mesh position={[0, 0.052, -ROAD_TOTAL_LENGTH * 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roadLine}>
        <planeGeometry args={[0.24, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* Glowing Yellow Edge Safety Lines */}
      <mesh position={[-boulevardWidth * 0.46, 0.048, -ROAD_TOTAL_LENGTH * 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roadLine}>
        <planeGeometry args={[0.12, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>
      <mesh position={[boulevardWidth * 0.46, 0.048, -ROAD_TOTAL_LENGTH * 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roadLine}>
        <planeGeometry args={[0.12, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* Paved Pedestrian Sidewalk (Right Side) */}
      <mesh position={[boulevardWidth * 0.5 + 5, 0.16, -ROAD_TOTAL_LENGTH * 0.5]} material={materials.pavement} receiveShadow>
        <boxGeometry args={[10, 0.32, ROAD_TOTAL_LENGTH + 600]} />
      </mesh>

      {/* ========================================================
          3. ICONIC MONUMENTS
      ======================================================== */}
      {/* The Grand Eiffel Tower */}
      <EiffelTower3D position={[-55, 0, -90]} />

      {/* Roue de Paris (Ferris Wheel) */}
      <FerrisWheel3D position={[-50, 0, -210]} />

      {/* Opening Pont Neuf Bridge */}
      <SeineStoneBridge position={[-45, 0, -40]} length={75} />
      <SeineStoneBridge position={[-45, 0, -1500]} length={75} />

      {/* ========================================================
          4. 3D STORYTELLING MILESTONE LANDMARKS (Matching Resume)
      ======================================================== */}
      {/* Milestone 0: Welcome Avenue */}
      <StoryLandmark
        title="Saanya Garg"
        subtitle="Full Stack Developer · Computer Science Engineer"
        tag="PORTFOLIO JOURNEY BEGINS"
        position={[0, 0, -55]}
        color="#f43f5e"
      />

      {/* Milestone 1: Education */}
      <StoryLandmark
        title="VIT Bhopal University"
        subtitle="B.Tech Computer Science Engineering · CGPA 9.19"
        tag="ACADEMIC FOUNDATION · 2023–2027"
        position={[0, 0, -700]}
        color="#38bdf8"
      />

      {/* Milestone 2: Internships */}
      <StoryLandmark
        title="Professional Experience"
        subtitle="AmasQIS.ai · UptoSkills (AICTE) · Codveda Technologies"
        tag="3 FULL-STACK INTERNSHIPS"
        position={[0, 0, -1200]}
        color="#818cf8"
      />

      {/* Milestone 3: Featured Projects */}
      <StoryLandmark
        title="Featured Projects"
        subtitle="SaathiCircle (AI Senior Care) · LaadliBachao · Garg Associates"
        tag="AI, SOCIAL IMPACT & ENTERPRISE"
        position={[0, 0, -1700]}
        color="#c084fc"
      />

      {/* Milestone 4: Hackathon Achievements */}
      <StoryLandmark
        title="Hackathon Victories"
        subtitle="3rd / 300+ MP Police Cyber Safety · Top 10 Epsilon · Flipkart GRiD 8.0"
        tag="COMPETITIVE CODING & INNOVATION"
        position={[0, 0, -2200]}
        color="#fbbf24"
      />

      {/* Milestone 5: Technical Skills */}
      <StoryLandmark
        title="Technical Arsenal"
        subtitle="Java · Python · C++ · React.js · Node.js · AWS · Docker"
        tag="FULL-STACK & CLOUD DEVOPS"
        position={[0, 0, -2600]}
        color="#34d399"
      />

      {/* Milestone 6: Certifications */}
      <StoryLandmark
        title="Certifications"
        subtitle="AWS AI Practitioner · AWS Solutions Architect · Stanford ML"
        tag="INDUSTRY-RECOGNIZED CREDENTIALS"
        position={[0, 0, -2900]}
        color="#f472b6"
      />

      {/* Milestone 7: Final Horizon & Contact */}
      <StoryLandmark
        title="Get in Touch"
        subtitle="+91 7983789937 · saanyagarg400@gmail.com · LinkedIn · GitHub"
        tag="LET'S BUILD SOMETHING EXTRAORDINARY"
        position={[0, 0, -3200]}
        color="#38bdf8"
      />

      {/* ========================================================
          5. HAUSSMANN BUILDINGS, TREES, LAMPS & BENCHES
      ======================================================== */}
      {/* Right Side Boulevard Buildings */}
      {rightBlocks.map((b) => {
        if (Math.abs(b.z - currentZ) > cullDist) return null
        return (
          <group key={b.id}>
            <HaussmannBlock
              position={[boulevardWidth * 0.5 + 20, 0, b.z]}
              width={30}
              height={22}
              depth={18}
              stoneVariant={b.id}
            />
            {/* Lush Boulevard Trees */}
            <ParisBoulevardTree position={[boulevardWidth * 0.5 + 2.4, 0.35, b.z - 22]} variant={b.id} />
            <ParisBoulevardTree position={[boulevardWidth * 0.5 + 2.4, 0.35, b.z + 22]} variant={b.id + 1} />

            {/* Glowing Cast-Iron Street Lamps */}
            <ParisStreetLamp position={[boulevardWidth * 0.5 + 2.4, 0.35, b.z]} />
            <ParisStreetLamp position={[-boulevardWidth * 0.5 - 1.4, 3.2, b.z]} />

            {/* Street Benches along the sidewalk */}
            <StreetBench position={[boulevardWidth * 0.5 + 3.8, 0.35, b.z - 11]} rotation={[0, -Math.PI / 2, 0]} />
          </group>
        )
      })}

      {/* Left Side Far Buildings across the River */}
      {farLeftBlocks.map((b) => {
        if (Math.abs(b.z - currentZ) > cullDist + 70) return null
        return (
          <HaussmannBlock
            key={`far-${b.id}`}
            position={[-98, 0, b.z]}
            width={36}
            height={24}
            depth={22}
            stoneVariant={b.id + 1}
          />
        )
      })}
    </group>
  )
}
