import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { journeyStore } from './journeyStore'

interface ByteRobotProps {
  bikePosition: [number, number, number]
  mood?: 'idle' | 'wave' | 'celebrate' | 'talking'
}

export default function ByteRobot3D({ bikePosition, mood = 'idle' }: ByteRobotProps) {
  const [bx, by, bz] = bikePosition
  const robotGroupRef = useRef<THREE.Group>(null)
  const leftHandRef = useRef<THREE.Group>(null)
  const rightHandRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const thrusterRef = useRef<THREE.PointLight>(null)

  // Materials
  const materials = useMemo(() => {
    return {
      bodyWhite: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        metalness: 0.3,
        roughness: 0.2,
      }),
      darkVisor: new THREE.MeshStandardMaterial({
        color: '#090d16',
        metalness: 0.9,
        roughness: 0.1,
      }),
      cyanGlow: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 3.5,
      }),
      goldGlow: new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#d97706',
        emissiveIntensity: 3.0,
      }),
      earAntenna: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        metalness: 0.6,
        roughness: 0.2,
      }),
    }
  }, [])

  useFrame((state) => {
    if (!robotGroupRef.current) return
    const time = state.clock.elapsedTime

    // Smooth floating position beside and slightly ahead of the motorcycle
    const targetX = bx + 1.65 + Math.sin(time * 1.5) * 0.12
    const targetY = by + 1.45 + Math.sin(time * 2.8) * 0.10 // gentle hovering bob
    const targetZ = bz - 1.1 + Math.cos(time * 1.8) * 0.08

    robotGroupRef.current.position.set(targetX, targetY, targetZ)

    // Gentle floating tilt facing slightly towards the rider & camera
    robotGroupRef.current.rotation.y = -0.4 + Math.sin(time * 1.2) * 0.08
    robotGroupRef.current.rotation.z = Math.cos(time * 2.0) * 0.05

    // Hand animations based on mood
    if (rightHandRef.current && leftHandRef.current) {
      if (mood === 'wave') {
        rightHandRef.current.position.y = 0.25 + Math.sin(time * 8) * 0.08
        rightHandRef.current.rotation.z = 0.5 + Math.sin(time * 8) * 0.3
        leftHandRef.current.position.y = -0.15
      } else if (mood === 'celebrate') {
        rightHandRef.current.position.y = 0.35 + Math.sin(time * 6) * 0.1
        leftHandRef.current.position.y = 0.35 + Math.cos(time * 6) * 0.1
        rightHandRef.current.rotation.z = 0.6
        leftHandRef.current.rotation.z = -0.6
      } else {
        // Idle floating hands
        rightHandRef.current.position.y = -0.12 + Math.sin(time * 2.5 + 0.5) * 0.04
        leftHandRef.current.position.y = -0.12 + Math.cos(time * 2.5) * 0.04
        rightHandRef.current.rotation.z = 0.1
        leftHandRef.current.rotation.z = -0.1
      }
    }

    // Head tilting
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(time * 1.6) * 0.06
    }

    // Pulsing ion thruster
    if (thrusterRef.current) {
      thrusterRef.current.intensity = 2.0 + Math.sin(time * 10) * 0.8
    }
  })

  const handleClickByte = (e: any) => {
    e.stopPropagation()
    const hints = [
      "Beep! ⚡ Collect all 8 innovation sparks along the road to complete your journal!",
      "Tip: Cross the Achievement Bridge ahead to see Saanya's state hackathon victory!",
      "Did you know? Saanya holds a 9.19 CGPA at VIT Bhopal in Computer Science!",
      "Look up at World 6 to see the glowing Skills Constellations!",
    ]
    const randomHint = hints[Math.floor(Math.random() * hints.length)]
    journeyStore.triggerDialogue({
      id: 'byte-hint',
      speaker: 'Byte',
      role: 'AI Floating Companion',
      text: randomHint,
      icon: '🤖',
    })
  }

  return (
    <group ref={robotGroupRef} onClick={handleClickByte}>
      {/* Head & Body Group */}
      <group ref={headRef}>
        {/* Main Cute Capsule Body */}
        <mesh material={materials.bodyWhite} castShadow>
          <sphereGeometry args={[0.32, 24, 24]} />
        </mesh>

        {/* Visor Screen */}
        <mesh position={[0, 0.04, 0.22]} material={materials.darkVisor}>
          <boxGeometry args={[0.42, 0.22, 0.15]} />
        </mesh>

        {/* Glowing Visor Eyes (Cyan LED) */}
        <mesh position={[-0.1, 0.06, 0.3]} material={mood === 'celebrate' ? materials.goldGlow : materials.cyanGlow}>
          <planeGeometry args={[0.07, 0.04]} />
        </mesh>
        <mesh position={[0.1, 0.06, 0.3]} material={mood === 'celebrate' ? materials.goldGlow : materials.cyanGlow}>
          <planeGeometry args={[0.07, 0.04]} />
        </mesh>

        {/* Floating Ear Antennas */}
        <mesh position={[-0.34, 0.12, 0]} material={materials.earAntenna}>
          <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
        </mesh>
        <mesh position={[0.34, 0.12, 0]} material={materials.earAntenna}>
          <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
        </mesh>

        {/* Top Antenna Ring */}
        <mesh position={[0, 0.38, 0]} material={materials.cyanGlow}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
        </mesh>
      </group>

      {/* Floating Left Hand */}
      <group ref={leftHandRef} position={[-0.38, -0.12, 0.08]}>
        <mesh material={materials.bodyWhite}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
      </group>

      {/* Floating Right Hand */}
      <group ref={rightHandRef} position={[0.38, -0.12, 0.08]}>
        <mesh material={materials.bodyWhite}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
      </group>

      {/* Ion Thruster Ring & Light beneath body */}
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.cyanGlow}>
        <torusGeometry args={[0.12, 0.025, 8, 20]} />
      </mesh>
      <pointLight ref={thrusterRef} position={[0, -0.4, 0]} color="#38bdf8" intensity={2.2} distance={3} />
    </group>
  )
}
