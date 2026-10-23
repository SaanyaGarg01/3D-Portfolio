import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface WorldLandmarksProps {
  currentZ: number
}

export default function WorldLandmarks(_props?: WorldLandmarksProps) {
  const trophyRef = useRef<THREE.Group>(null)
  const skillsRef = useRef<THREE.Group>(null)
  const certsRef = useRef<THREE.Group>(null)

  const materials = useMemo(() => {
    return {
      concrete: new THREE.MeshStandardMaterial({
        color: '#1e2430',
        roughness: 0.7,
        metalness: 0.3,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#1d4ed8',
        transmission: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
      }),
      cyanGlow: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 2.0,
      }),
      blueGlow: new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        emissive: '#2563eb',
        emissiveIntensity: 2.2,
      }),
      goldGlow: new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#d97706',
        emissiveIntensity: 2.5,
        metalness: 0.8,
        roughness: 0.2,
      }),
      purpleGlow: new THREE.MeshStandardMaterial({
        color: '#c084fc',
        emissive: '#7e22ce',
        emissiveIntensity: 2.2,
      }),
      emeraldGlow: new THREE.MeshStandardMaterial({
        color: '#34d399',
        emissive: '#059669',
        emissiveIntensity: 2.0,
      }),
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (trophyRef.current) {
      trophyRef.current.rotation.y = time * 0.5
    }
    if (skillsRef.current) {
      skillsRef.current.rotation.y = time * 0.3
    }
    if (certsRef.current) {
      certsRef.current.rotation.y = time * 0.4
    }
  })

  return (
    <group>
      {/* ========================================================
          WORLD 0 · THE BEGINNING (Z = 0)
      ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Roadside Welcome Sign */}
        <mesh position={[-6.5, 2.2, -8]} material={materials.concrete}>
          <boxGeometry args={[0.3, 4.4, 0.3]} />
        </mesh>
        <mesh position={[-6.5, 3.8, -8]} material={materials.blueGlow}>
          <boxGeometry args={[0.2, 1.4, 4.2]} />
        </mesh>
        <Text
          position={[-6.38, 3.8, -8]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.34}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          SAANYA GARG · 0.0 KM
        </Text>
      </group>

      {/* ========================================================
          WORLD 1 · IDENTITY & INTRODUCTION (Z = -350)
      ======================================================== */}
      <group position={[0, 0, -350]}>
        {/* Overhead Futuristic Portal Arch */}
        <mesh position={[-5.8, 5, 0]} material={materials.concrete}>
          <boxGeometry args={[1.2, 10, 1.2]} />
        </mesh>
        <mesh position={[5.8, 5, 0]} material={materials.concrete}>
          <boxGeometry args={[1.2, 10, 1.2]} />
        </mesh>
        {/* Overhead Crossbeam */}
        <mesh position={[0, 9.5, 0]} material={materials.concrete}>
          <boxGeometry args={[13, 1.4, 1.2]} />
        </mesh>
        {/* Glowing Banner */}
        <mesh position={[0, 9.5, 0.65]} material={materials.cyanGlow}>
          <boxGeometry args={[11, 0.9, 0.08]} />
        </mesh>
        <pointLight position={[0, 9, 2]} color="#38bdf8" intensity={3} distance={20} />
      </group>

      {/* ========================================================
          WORLD 2 · EDUCATION · VIT BHOPAL (Z = -750)
      ======================================================== */}
      <group position={[0, 0, -750]}>
        {/* Grand Academic Campus Gate */}
        <mesh position={[-6.5, 5.5, 0]} material={materials.concrete} castShadow>
          <boxGeometry args={[1.6, 11, 1.6]} />
        </mesh>
        <mesh position={[6.5, 5.5, 0]} material={materials.concrete} castShadow>
          <boxGeometry args={[1.6, 11, 1.6]} />
        </mesh>
        <mesh position={[0, 10.5, 0]} material={materials.concrete}>
          <boxGeometry args={[15, 1.8, 1.8]} />
        </mesh>
        {/* University Name Plate */}
        <mesh position={[0, 10.5, 0.95]} material={materials.blueGlow}>
          <boxGeometry args={[13.5, 1.2, 0.08]} />
        </mesh>

        {/* Flanking Academic Pavilions */}
        <mesh position={[-16, 8, -10]} material={materials.glass}>
          <boxGeometry args={[10, 16, 12]} />
        </mesh>
        <mesh position={[16, 8, -10]} material={materials.glass}>
          <boxGeometry args={[10, 16, 12]} />
        </mesh>
      </group>

      {/* ========================================================
          WORLD 3 · INTERNSHIP DISTRICT (Z = -1250)
      ======================================================== */}
      <group position={[0, 0, -1250]}>
        {/* Left: AmasQIS.ai Banking Glass Tower */}
        <group position={[-18, 0, -30]}>
          <mesh position={[0, 18, 0]} material={materials.glass}>
            <boxGeometry args={[12, 36, 12]} />
          </mesh>
          <mesh position={[0, 36.5, 0]} material={materials.cyanGlow}>
            <boxGeometry args={[12.2, 0.8, 12.2]} />
          </mesh>
          <pointLight position={[0, 20, 8]} color="#38bdf8" intensity={3} distance={25} />
        </group>

        {/* Right: UPTOSKILLS (AICTE) Tech Center */}
        <group position={[18, 0, -15]}>
          <mesh position={[0, 12, 0]} material={materials.glass}>
            <boxGeometry args={[10, 24, 14]} />
          </mesh>
          <mesh position={[0, 24.5, 0]} material={materials.blueGlow}>
            <boxGeometry args={[10.2, 0.6, 14.2]} />
          </mesh>
        </group>

        {/* Right Ahead: Codveda Technologies Studio */}
        <group position={[20, 0, 40]}>
          <mesh position={[0, 10, 0]} material={materials.concrete}>
            <boxGeometry args={[12, 20, 10]} />
          </mesh>
          <mesh position={[0, 10, 5.1]} material={materials.purpleGlow}>
            <boxGeometry args={[10, 1.2, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          WORLD 4 · PROJECT UNIVERSE (Z = -1750)
      ======================================================== */}
      <group position={[0, 0, -1750]}>
        {/* Project A: SaathiCircle Sanctuary Monument (Left) */}
        <group position={[-16, 0, -40]}>
          <mesh position={[0, 7, 0]} material={materials.concrete}>
            <cylinderGeometry args={[5, 6, 14, 16]} />
          </mesh>
          <mesh position={[0, 15, 0]} material={materials.purpleGlow}>
            <torusGeometry args={[4, 0.4, 16, 32]} />
          </mesh>
          <pointLight position={[0, 15, 0]} color="#c084fc" intensity={3} distance={25} />
        </group>

        {/* Project B: LaadliBachao Awareness Beacon (Right) */}
        <group position={[16, 0, -10]}>
          <mesh position={[0, 10, 0]} material={materials.concrete}>
            <cylinderGeometry args={[2.5, 4.5, 20, 8]} />
          </mesh>
          <mesh position={[0, 21, 0]} material={materials.cyanGlow}>
            <octahedronGeometry args={[2.5]} />
          </mesh>
          <pointLight position={[0, 21, 0]} color="#38bdf8" intensity={3} distance={25} />
        </group>

        {/* Project C: Garg Associates Legal Platform Court (Left Ahead) */}
        <group position={[-16, 0, 30]}>
          <mesh position={[0, 8, 0]} material={materials.concrete}>
            <boxGeometry args={[12, 16, 10]} />
          </mesh>
          <mesh position={[0, 15, 0]} material={materials.goldGlow}>
            <boxGeometry args={[13, 0.6, 11]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          WORLD 5 · ACHIEVEMENTS SKY BRIDGE (Z = -2250)
      ======================================================== */}
      <group position={[0, 0, -2250]}>
        {/* Grand Sky Bridge Suspension Towers */}
        <mesh position={[-6.8, 12, 0]} material={materials.concrete}>
          <boxGeometry args={[1.5, 24, 1.5]} />
        </mesh>
        <mesh position={[6.8, 12, 0]} material={materials.concrete}>
          <boxGeometry args={[1.5, 24, 1.5]} />
        </mesh>
        {/* Overhead Bridge Cable Truss */}
        <mesh position={[0, 22, 0]} material={materials.goldGlow}>
          <boxGeometry args={[15, 1, 1]} />
        </mesh>

        {/* Central Rotating Golden Milestone Trophy */}
        <group ref={trophyRef} position={[0, 15, 0]}>
          <mesh material={materials.goldGlow}>
            <octahedronGeometry args={[2.2]} />
          </mesh>
          <mesh material={materials.cyanGlow}>
            <torusGeometry args={[3.2, 0.15, 16, 32]} />
          </mesh>
          <pointLight color="#fbbf24" intensity={4} distance={30} />
        </group>
      </group>

      {/* ========================================================
          WORLD 6 · SKILLS CYBER MATRIX (Z = -2650)
      ======================================================== */}
      <group position={[0, 0, -2650]}>
        {/* Flanking Hexagonal Holographic Data Pillars */}
        {[-30, -10, 10, 30].map((dz, i) => (
          <group key={i}>
            <mesh position={[-6.5, 4, dz]} material={materials.emeraldGlow}>
              <cylinderGeometry args={[0.3, 0.3, 8, 6]} />
            </mesh>
            <mesh position={[6.5, 4, dz]} material={materials.emeraldGlow}>
              <cylinderGeometry args={[0.3, 0.3, 8, 6]} />
            </mesh>
          </group>
        ))}

        {/* Central Rotating Skills Orb */}
        <group ref={skillsRef} position={[0, 10, 0]}>
          <mesh material={materials.emeraldGlow}>
            <icosahedronGeometry args={[2]} />
          </mesh>
          <pointLight color="#34d399" intensity={3} distance={25} />
        </group>
      </group>

      {/* ========================================================
          WORLD 7 · CERTIFICATIONS OBSERVATORY (Z = -2950)
      ======================================================== */}
      <group position={[0, 0, -2950]}>
        {/* Futuristic Observatory Dome Arch */}
        <mesh position={[0, 12, 0]} material={materials.glass}>
          <sphereGeometry args={[10, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>

        {/* Orbiting Credentials Rings */}
        <group ref={certsRef} position={[0, 9, 0]}>
          <mesh material={materials.purpleGlow}>
            <torusGeometry args={[5, 0.18, 16, 48]} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]} material={materials.cyanGlow}>
            <torusGeometry args={[4.2, 0.14, 16, 48]} />
          </mesh>
          <pointLight color="#c084fc" intensity={3.5} distance={25} />
        </group>
      </group>

      {/* ========================================================
          WORLD 8 · FINAL HORIZON DESTINATION (Z = -3200)
      ======================================================== */}
      <group position={[0, 0, -3200]}>
        {/* Majestic Terminal End Gate */}
        <mesh position={[-7, 7, 0]} material={materials.concrete}>
          <boxGeometry args={[2, 14, 2]} />
        </mesh>
        <mesh position={[7, 7, 0]} material={materials.concrete}>
          <boxGeometry args={[2, 14, 2]} />
        </mesh>
        <mesh position={[0, 13, 0]} material={materials.goldGlow}>
          <boxGeometry args={[16, 1.8, 2]} />
        </mesh>

        {/* Sunrise Beacon Light */}
        <pointLight position={[0, 8, -15]} color="#f97316" intensity={6} distance={60} />
      </group>
    </group>
  )
}
