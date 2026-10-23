import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RoadProps {
  currentZ: number // motorcycle's current Z position (negative)
}

export default function Road3D({ currentZ }: RoadProps) {
  const roadWidth = 9
  const segmentLength = 80 // length of repeating road tile
  const visibleSegments = 16 // ahead and behind

  // Materials
  const materials = useMemo(() => {
    return {
      asphalt: new THREE.MeshStandardMaterial({
        color: '#0d0f14',
        roughness: 0.75,
        metalness: 0.25,
      }),
      centerLine: new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        emissive: '#3b82f6',
        emissiveIntensity: 1.2,
      }),
      sideLine: new THREE.MeshStandardMaterial({
        color: '#3b82f6',
        emissive: '#1d4ed8',
        emissiveIntensity: 0.8,
      }),
      guardrail: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.5,
        metalness: 0.8,
      }),
      lampPost: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.7,
      }),
      lampLight: new THREE.MeshStandardMaterial({
        color: '#93c5fd',
        emissive: '#60a5fa',
        emissiveIntensity: 2.5,
      }),
      terrain: new THREE.MeshStandardMaterial({
        color: '#07080b',
        roughness: 0.95,
        metalness: 0.05,
      }),
    }
  }, [])


  const segments = useMemo(() => {
    const list: number[] = []
    for (let i = -3; i < visibleSegments; i++) {
      list.push(i)
    }
    return list
  }, [visibleSegments])

  const roadGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (roadGroupRef.current) {
      // Keep procedural road pool centered around the rider's position
      const baseZ = Math.floor(currentZ / segmentLength) * segmentLength
      roadGroupRef.current.position.z = baseZ
    }
  })

  return (
    <group ref={roadGroupRef}>
      {/* Repeating Road Segments */}
      {segments.map((offset) => {
        const segZ = -offset * segmentLength
        return (
          <group key={offset} position={[0, 0, segZ]}>
            {/* Asphalt Surface */}
            <mesh
              position={[0, -0.02, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={materials.asphalt}
              receiveShadow
            >
              <planeGeometry args={[roadWidth, segmentLength]} />
            </mesh>

            {/* Glowing Left & Right Solid Lane Edges */}
            <mesh position={[-roadWidth * 0.48, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.sideLine}>
              <planeGeometry args={[0.08, segmentLength]} />
            </mesh>
            <mesh position={[roadWidth * 0.48, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.sideLine}>
              <planeGeometry args={[0.08, segmentLength]} />
            </mesh>

            {/* Dashed Center Markings */}
            {[-30, -18, -6, 6, 18, 30].map((dz, idx) => (
              <mesh
                key={idx}
                position={[0, 0.002, dz]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={materials.centerLine}
              >
                <planeGeometry args={[0.15, 6]} />
              </mesh>
            ))}

            {/* Left & Right Guardrails */}
            <mesh position={[-roadWidth * 0.52, 0.35, 0]} material={materials.guardrail}>
              <boxGeometry args={[0.06, 0.4, segmentLength]} />
            </mesh>
            <mesh position={[roadWidth * 0.52, 0.35, 0]} material={materials.guardrail}>
              <boxGeometry args={[0.06, 0.4, segmentLength]} />
            </mesh>

            {/* Streetlight Lamppost (one every segment on alternating sides) */}
            {offset % 2 === 0 ? (
              <group position={[-roadWidth * 0.56, 0, 0]}>
                {/* Vertical Pole */}
                <mesh position={[0, 2.5, 0]} material={materials.lampPost}>
                  <cylinderGeometry args={[0.06, 0.09, 5, 8]} />
                </mesh>
                {/* Horizontal Arm */}
                <mesh position={[0.75, 5, 0]} rotation={[0, 0, -0.3]} material={materials.lampPost}>
                  <boxGeometry args={[1.6, 0.06, 0.06]} />
                </mesh>
                {/* Glowing Luminaire */}
                <mesh position={[1.4, 4.8, 0]} material={materials.lampLight}>
                  <boxGeometry args={[0.3, 0.08, 0.16]} />
                </mesh>
                <pointLight position={[1.4, 4.5, 0]} color="#93c5fd" intensity={0.8} distance={18} />
              </group>
            ) : (
              <group position={[roadWidth * 0.56, 0, 0]}>
                <mesh position={[0, 2.5, 0]} material={materials.lampPost}>
                  <cylinderGeometry args={[0.06, 0.09, 5, 8]} />
                </mesh>
                <mesh position={[-0.75, 5, 0]} rotation={[0, 0, 0.3]} material={materials.lampPost}>
                  <boxGeometry args={[1.6, 0.06, 0.06]} />
                </mesh>
                <mesh position={[-1.4, 4.8, 0]} material={materials.lampLight}>
                  <boxGeometry args={[0.3, 0.08, 0.16]} />
                </mesh>
                <pointLight position={[-1.4, 4.5, 0]} color="#93c5fd" intensity={0.8} distance={18} />
              </group>
            )}
          </group>
        )
      })}

      {/* Flanking Side Terrain Terrain Plane */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.terrain}
        receiveShadow
      >
        <planeGeometry args={[260, segmentLength * (visibleSegments + 4)]} />
      </mesh>
    </group>
  )
}
