import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { journeyStore } from './journeyStore'
import { audioEngine } from '../../utils/audio'

interface RoadsideCharactersProps {
  bikePosition: [number, number, number]
}

interface CharacterDefinition {
  id: string
  name: string
  role: string
  dialogue: string
  position: [number, number, number]
  accentColor: string
  clothingColor: string
  icon: string
  accessoryType: 'tablet' | 'laptop' | 'trophy' | 'scroll'
}

const CHARACTERS: CharacterDefinition[] = [
  {
    id: 'char-edu',
    name: 'Prof. Miller',
    role: 'University Academic Guide',
    dialogue: 'Welcome to VIT Bhopal! Saanya maintains an exceptional 9.19 / 10.0 CGPA in Computer Science Engineering, with deep focus on Data Structures, Cloud & AI Systems.',
    position: [-5.8, 0, -750],
    accentColor: '#38bdf8',
    clothingColor: '#1e3a8a',
    icon: '🎓',
    accessoryType: 'scroll',
  },
  {
    id: 'char-work',
    name: 'Devon Vance',
    role: 'Lead Systems Architect',
    dialogue: 'Impressive engineering across 3 internships! At AmasQIS.ai she built high-performance banking microservices, and at AICTE UptoSkills she optimized web speed by 35%.',
    position: [5.8, 0, -1250],
    accentColor: '#818cf8',
    clothingColor: '#312e81',
    icon: '💻',
    accessoryType: 'laptop',
  },
  {
    id: 'char-proj',
    name: 'Maya Lin',
    role: 'Social Tech Innovator',
    dialogue: 'Explore SaathiCircle and LaadliBachao! Saanya combines AI voice assistance and emergency SOS alerting to solve critical healthcare and social safety challenges.',
    position: [-5.8, 0, -1750],
    accentColor: '#c084fc',
    clothingColor: '#581c87',
    icon: '🚀',
    accessoryType: 'tablet',
  },
  {
    id: 'char-award',
    name: 'Coach Marcus',
    role: 'Hackathon Host',
    dialogue: 'What a triumph! Saanya secured 3rd Place among 300+ teams in the MP Police Cyber Safety Hackathon and placed in the elite top 0.5% in Samsung Solve for Tomorrow!',
    position: [5.8, 0, -2250],
    accentColor: '#fbbf24',
    clothingColor: '#78350f',
    icon: '🏆',
    accessoryType: 'trophy',
  },
]

export default function RoadsideCharacters3D({ bikePosition }: RoadsideCharactersProps) {
  const [bx, , bz] = bikePosition
  const armRefs = useRef<{ [key: string]: THREE.Group | null }>({})
  const lastSpokenChar = useRef<string | null>(null)

  const sharedMats = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({ color: '#f3c59a', roughness: 0.6 }),
      hair: new THREE.MeshStandardMaterial({ color: '#1e1b18', roughness: 0.8 }),
      pants: new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.7 }),
      gold: new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#d97706', emissiveIntensity: 2 }),
      glowCyan: new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0284c7', emissiveIntensity: 1.8 }),
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Check proximity to characters to trigger dialogue automatically once
    for (const char of CHARACTERS) {
      const dist = Math.hypot(bx - char.position[0], bz - char.position[2])
      const arm = armRefs.current[char.id]

      // Waving arm animation
      if (arm) {
        arm.rotation.z = Math.sin(time * 5) * 0.35 + 0.5
      }

      // Proximity detection (within 8 meters)
      if (dist < 8.5 && Math.abs(bz - char.position[2]) < 5.0) {
        if (lastSpokenChar.current !== char.id) {
          lastSpokenChar.current = char.id
          audioEngine.playCharacterMeet()
          journeyStore.triggerDialogue({
            id: char.id,
            speaker: char.name,
            role: char.role,
            text: char.dialogue,
            icon: char.icon,
          })
        }
      }
    }

    // Reset when far away
    if (lastSpokenChar.current) {
      const cur = CHARACTERS.find((c) => c.id === lastSpokenChar.current)
      if (cur && Math.abs(bz - cur.position[2]) > 20) {
        lastSpokenChar.current = null
      }
    }
  })

  const handleCharacterClick = (char: CharacterDefinition) => {
    audioEngine.playCharacterMeet()
    journeyStore.triggerDialogue({
      id: char.id,
      speaker: char.name,
      role: char.role,
      text: char.dialogue,
      icon: char.icon,
    })
  }

  return (
    <group>
      {CHARACTERS.map((char) => {
        const isLeft = char.position[0] < 0
        return (
          <group
            key={char.id}
            position={char.position}
            rotation={[0, isLeft ? Math.PI / 4 : -Math.PI / 4, 0]}
            onClick={(e) => {
              e.stopPropagation()
              handleCharacterClick(char)
            }}
          >
            {/* Pedestal / Ground Stage */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[1.2, 1.4, 0.2, 24]} />
              <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.21, 0]}>
              <ringGeometry args={[0.9, 1.15, 24]} />
              <meshStandardMaterial
                color={char.accentColor}
                emissive={char.accentColor}
                emissiveIntensity={1.8}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Character Torso */}
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[0.65, 0.85, 0.35]} />
              <meshStandardMaterial color={char.clothingColor} roughness={0.5} />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.16, 0.55, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.7, 12]} />
              <primitive object={sharedMats.pants} attach="material" />
            </mesh>
            <mesh position={[0.16, 0.55, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.7, 12]} />
              <primitive object={sharedMats.pants} attach="material" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.95, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <primitive object={sharedMats.skin} attach="material" />
            </mesh>

            {/* Hair */}
            <mesh position={[0, 2.05, -0.04]}>
              <sphereGeometry args={[0.23, 14, 14]} />
              <primitive object={sharedMats.hair} attach="material" />
            </mesh>

            {/* Left Arm (idle) */}
            <mesh position={[-0.42, 1.25, 0]} rotation={[0, 0, 0.15]}>
              <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
              <meshStandardMaterial color={char.clothingColor} />
            </mesh>

            {/* Right Arm (Waving to rider) */}
            <group
              ref={(el) => {
                armRefs.current[char.id] = el
              }}
              position={[0.42, 1.5, 0]}
            >
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.5, 8]} />
                <meshStandardMaterial color={char.clothingColor} />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <primitive object={sharedMats.skin} attach="material" />
              </mesh>
            </group>

            {/* Floating Accessory */}
            {char.accessoryType === 'trophy' && (
              <mesh position={[0, 2.5, 0]}>
                <octahedronGeometry args={[0.25]} />
                <primitive object={sharedMats.gold} attach="material" />
              </mesh>
            )}

            {/* Floating Character Label */}
            <group position={[0, 2.7, 0]}>
              <Text fontSize={0.32} color={char.accentColor} anchorX="center">
                {char.name}
              </Text>
              <Text position={[0, -0.3, 0]} fontSize={0.2} color="#ffffff" anchorX="center">
                {char.role}
              </Text>
            </group>
          </group>
        )
      })}
    </group>
  )
}
