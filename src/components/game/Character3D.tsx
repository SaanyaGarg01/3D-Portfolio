import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { JourneyPhase } from './types'
import { createParisMaterials } from './parisMaterials'

interface CharacterProps {
  phase: JourneyPhase
  mountingProgress: number // 0 to 1
  steerAngle: number // -0.4 to 0.4
  leanAngle: number // radians
  speed: number // km/h
}

export default function Character3D({
  phase,
  mountingProgress,
  steerAngle,
  leanAngle,
  speed,
}: CharacterProps) {
  const rootGroupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const hairFlowRef = useRef<THREE.Group>(null)
  const materials = useMemo(() => createParisMaterials(), [])

  useFrame((state) => {
    if (!rootGroupRef.current) return
    const time = state.clock.elapsedTime

    let mountFactor = 0
    if (phase === 'opening') {
      mountFactor = 0
    } else if (phase === 'mounting') {
      mountFactor = THREE.MathUtils.clamp(mountingProgress, 0, 1)
    } else {
      mountFactor = 1
    }

    // Standing: beside scooter on left side, facing slightly towards viewer/boulevard
    // Riding: seated comfortably on scooter saddle (Z = +0.15, Y = 0.58)
    const standPos = new THREE.Vector3(-0.65, 0, 0.12)
    const ridePos = new THREE.Vector3(0, 0.58, 0.15)
    const mountArc = Math.sin(mountFactor * Math.PI) * 0.22
    const currentPos = new THREE.Vector3().lerpVectors(standPos, ridePos, mountFactor)
    currentPos.y += mountArc

    rootGroupRef.current.position.copy(currentPos)

    if (phase === 'opening') {
      // Standing idle breathing and soft head movement
      rootGroupRef.current.position.y += Math.sin(time * 1.6) * 0.005
      rootGroupRef.current.rotation.y = 0.35 // angled welcomingly toward camera
      rootGroupRef.current.rotation.z = 0

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.12
        headRef.current.rotation.x = Math.sin(time * 0.8) * 0.03
      }
    } else {
      // Riding orientation: facing North (-Z) down the boulevard
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(0.35, 0, mountFactor)
      // Rider leans naturally with the motorcycle banking into turns
      rootGroupRef.current.rotation.z = leanAngle * 0.8
      // Slight forward lean when accelerating
      const forwardLean = (speed / 100) * 0.08
      rootGroupRef.current.rotation.x = forwardLean

      if (headRef.current) {
        // Head turns smoothly towards the turn
        headRef.current.rotation.y = steerAngle * 0.45
        headRef.current.rotation.x = -0.04
      }

      // Wind blowing long hair backward based on speed
      if (hairFlowRef.current) {
        const windSway = Math.sin(time * 12 + speed * 0.1) * (0.05 + (speed / 100) * 0.12)
        hairFlowRef.current.rotation.x = -0.22 - (speed / 100) * 0.35 + windSway
      }
    }
  })

  return (
    <group ref={rootGroupRef}>
      {/* ========================================================
          1. LEGS & FEET (Natural Riding Stance on Scooter)
      ======================================================== */}
      {/* Dark Riding Leggings (under skirt for authentic chic riding look) */}
      {/* Left Thigh extending forward toward floorboard */}
      <group position={[-0.11, 0.05, -0.08]} rotation={[1.05, 0.08, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.30, 10]} />
          <primitive object={materials.blackTop} />
        </mesh>
        {/* Left Shin reaching down to floorboard */}
        <mesh position={[0, -0.20, 0.06]} rotation={[-1.15, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.30, 10]} />
          <primitive object={materials.blackTop} />
        </mesh>
        {/* Left White Streetwear Sneaker */}
        <group position={[0, -0.32, 0.18]} rotation={[-1.05, 0, 0]}>
          {/* Main White Shoe Body */}
          <mesh material={materials.whiteShoes}>
            <boxGeometry args={[0.085, 0.065, 0.18]} />
          </mesh>
          {/* Grey Sole */}
          <mesh position={[0, -0.035, 0]} material={materials.scooterChrome}>
            <boxGeometry args={[0.09, 0.015, 0.19]} />
          </mesh>
          {/* Pink Heel Tab */}
          <mesh position={[0, 0.015, -0.085]} material={materials.pinkSkirt}>
            <boxGeometry args={[0.05, 0.03, 0.015]} />
          </mesh>
        </group>
      </group>

      {/* Right Thigh */}
      <group position={[0.11, 0.05, -0.08]} rotation={[1.05, -0.08, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.30, 10]} />
          <primitive object={materials.blackTop} />
        </mesh>
        {/* Right Shin */}
        <mesh position={[0, -0.20, 0.06]} rotation={[-1.15, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.30, 10]} />
          <primitive object={materials.blackTop} />
        </mesh>
        {/* Right White Streetwear Sneaker */}
        <group position={[0, -0.32, 0.18]} rotation={[-1.05, 0, 0]}>
          <mesh material={materials.whiteShoes}>
            <boxGeometry args={[0.085, 0.065, 0.18]} />
          </mesh>
          <mesh position={[0, -0.035, 0]} material={materials.scooterChrome}>
            <boxGeometry args={[0.09, 0.015, 0.19]} />
          </mesh>
          <mesh position={[0, 0.015, -0.085]} material={materials.pinkSkirt}>
            <boxGeometry args={[0.05, 0.03, 0.015]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          2. PINK PLEATED SKIRT (Avatar Reference)
      ======================================================== */}
      {/* Pelvic base */}
      <mesh position={[0, 0.12, 0]} material={materials.pinkSkirt}>
        <boxGeometry args={[0.26, 0.14, 0.22]} />
      </mesh>

      {/* Tier 1: Rose-Pink Pleated Skirt Waist / Upper Body */}
      <mesh position={[0, 0.16, -0.02]} rotation={[0.05, 0, 0]} material={materials.pinkSkirt}>
        <cylinderGeometry args={[0.16, 0.22, 0.16, 16]} />
      </mesh>

      {/* Tier 2: Flared Rose-Pink Pleats Draped Over Saddle */}
      <mesh position={[0, 0.06, -0.02]} rotation={[0.08, 0, 0]} material={materials.pinkSkirtLight}>
        <cylinderGeometry args={[0.22, 0.28, 0.14, 18]} />
      </mesh>

      {/* ========================================================
          3. TORSO: FITTED BLACK GRAPHIC TEE
      ======================================================== */}
      {/* Main black tee body */}
      <mesh position={[0, 0.36, -0.04]} rotation={[0.08, 0, 0]} material={materials.blackTop}>
        <cylinderGeometry args={[0.145, 0.135, 0.36, 14]} />
      </mesh>

      {/* White Crew Neck Collar Trim */}
      <mesh position={[0, 0.54, -0.06]} rotation={[0.08, 0, 0]} material={materials.whiteShoes}>
        <torusGeometry args={[0.09, 0.012, 8, 16]} />
      </mesh>

      {/* Graphic Print on Front of Tee (Pink Heart & Cyan Code Bracket) */}
      <group position={[0, 0.38, -0.185]} rotation={[-0.08, 0, 0]}>
        <mesh position={[-0.02, 0, 0]} material={materials.pinkSkirt}>
          <sphereGeometry args={[0.032, 8, 8]} />
        </mesh>
        <mesh position={[0.02, 0, 0]} material={materials.windowGlowCyan}>
          <sphereGeometry args={[0.026, 8, 8]} />
        </mesh>
      </group>

      {/* ========================================================
          4. BACKPACK (Facing +Z Chase Camera)
      ======================================================== */}
      <group position={[0, 0.38, 0.12]} rotation={[-0.08, 0, 0]}>
        {/* Main Matte Black Tech Backpack */}
        <mesh material={materials.backpack}>
          <boxGeometry args={[0.24, 0.28, 0.11]} />
        </mesh>
        {/* Front Utility Pocket */}
        <mesh position={[0, -0.04, 0.06]} material={materials.backpack}>
          <boxGeometry args={[0.18, 0.12, 0.04]} />
        </mesh>
        {/* Chrome Zipper Accents */}
        <mesh position={[0, 0.02, 0.06]} material={materials.scooterChrome}>
          <boxGeometry args={[0.16, 0.01, 0.01]} />
        </mesh>
        {/* Backpack Shoulder Straps */}
        <mesh position={[-0.08, 0.06, -0.07]} rotation={[0.15, 0, 0]} material={materials.backpack}>
          <boxGeometry args={[0.03, 0.18, 0.02]} />
        </mesh>
        <mesh position={[0.08, 0.06, -0.07]} rotation={[0.15, 0, 0]} material={materials.backpack}>
          <boxGeometry args={[0.03, 0.18, 0.02]} />
        </mesh>
      </group>

      {/* ========================================================
          5. ARMS & HANDS (Reaching Naturally to Handlebars)
      ======================================================== */}
      {/* Left Shoulder & Upper Arm */}
      <mesh position={[-0.18, 0.44, -0.12]} rotation={[-0.65, -0.15, 0.22]} material={materials.blackTop}>
        <cylinderGeometry args={[0.048, 0.040, 0.26, 8]} />
      </mesh>
      {/* Left Forearm (Skin tone) */}
      <mesh position={[-0.23, 0.34, -0.28]} rotation={[-0.38, -0.10, 0.18]} material={materials.skin}>
        <cylinderGeometry args={[0.040, 0.035, 0.24, 8]} />
      </mesh>
      {/* Rose Gold Friendship Bracelet on Left Wrist */}
      <mesh position={[-0.25, 0.28, -0.38]} rotation={[-0.38, 0, 0]} material={materials.pinkSkirtLight}>
        <torusGeometry args={[0.038, 0.008, 6, 12]} />
      </mesh>
      {/* Left Hand gripping handlebar */}
      <mesh position={[-0.27, 0.26, -0.42]} material={materials.skin}>
        <sphereGeometry args={[0.042, 8, 8]} />
      </mesh>

      {/* Right Shoulder & Upper Arm */}
      <mesh position={[0.18, 0.44, -0.12]} rotation={[-0.65, 0.15, -0.22]} material={materials.blackTop}>
        <cylinderGeometry args={[0.048, 0.040, 0.26, 8]} />
      </mesh>
      {/* Right Forearm (Skin tone) */}
      <mesh position={[0.23, 0.34, -0.28]} rotation={[-0.38, 0.10, -0.18]} material={materials.skin}>
        <cylinderGeometry args={[0.040, 0.035, 0.24, 8]} />
      </mesh>
      {/* Right Hand gripping handlebar */}
      <mesh position={[0.27, 0.26, -0.42]} material={materials.skin}>
        <sphereGeometry args={[0.042, 8, 8]} />
      </mesh>

      {/* ========================================================
          6. NECK & HEAD (Cute South Asian Facial Features)
      ======================================================== */}
      {/* Slender neck */}
      <mesh position={[0, 0.56, -0.06]} material={materials.skin}>
        <cylinderGeometry args={[0.052, 0.058, 0.10, 8]} />
      </mesh>

      <group ref={headRef} position={[0, 0.70, -0.08]}>
        {/* Head/Face with warm South Asian complexion */}
        <mesh material={materials.skin}>
          <sphereGeometry args={[0.145, 16, 16]} />
        </mesh>

        {/* Soft Blushing Cheeks */}
        <mesh position={[-0.07, -0.015, -0.12]} material={materials.skinBlush}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
        <mesh position={[0.07, -0.015, -0.12]} material={materials.skinBlush}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>

        {/* Cute Gentle Smile */}
        <mesh position={[0, -0.045, -0.138]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.024, 0.005, 4, 10, Math.PI * 0.6]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>

        {/* Almond Eyes (Facing North, -Z) */}
        {/* Left Eye */}
        <mesh position={[-0.048, 0.018, -0.136]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.2} />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.048, 0.018, -0.136]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.2} />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.048, 0.048, -0.138]} rotation={[0, 0, 0.12]} material={materials.hair}>
          <boxGeometry args={[0.036, 0.006, 0.006]} />
        </mesh>
        <mesh position={[0.048, 0.048, -0.138]} rotation={[0, 0, -0.12]} material={materials.hair}>
          <boxGeometry args={[0.036, 0.006, 0.006]} />
        </mesh>

        {/* ========================================================
            7. MODERN ROUND WIREFRAME GLASSES
        ======================================================== */}
        {/* Left Round Wire Rim */}
        <mesh position={[-0.048, 0.016, -0.148]} material={materials.glasses}>
          <torusGeometry args={[0.030, 0.005, 6, 16]} />
        </mesh>
        {/* Right Round Wire Rim */}
        <mesh position={[0.048, 0.016, -0.148]} material={materials.glasses}>
          <torusGeometry args={[0.030, 0.005, 6, 16]} />
        </mesh>
        {/* Nose Bridge connecting frames */}
        <mesh position={[0, 0.018, -0.152]} material={materials.glasses}>
          <boxGeometry args={[0.038, 0.005, 0.005]} />
        </mesh>
        {/* Left Temple (side arm) */}
        <mesh position={[-0.082, 0.016, -0.07]} rotation={[0, 0.7, 0]} material={materials.glasses}>
          <boxGeometry args={[0.005, 0.005, 0.14]} />
        </mesh>
        {/* Right Temple (side arm) */}
        <mesh position={[0.082, 0.016, -0.07]} rotation={[0, -0.7, 0]} material={materials.glasses}>
          <boxGeometry args={[0.005, 0.005, 0.14]} />
        </mesh>

        {/* ========================================================
            8. LONG VOLUMINOUS DARK WAVY HAIR
        ======================================================== */}
        {/* Top/Crown Hair Volume with center-part */}
        <mesh position={[0, 0.065, 0.02]} material={materials.hair}>
          <sphereGeometry args={[0.162, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        </mesh>

        {/* Left Side Framing Wave */}
        <mesh position={[-0.14, -0.06, -0.02]} rotation={[-0.1, 0.15, 0.12]} material={materials.hair}>
          <cylinderGeometry args={[0.055, 0.038, 0.32, 8]} />
        </mesh>

        {/* Right Side Framing Wave */}
        <mesh position={[0.14, -0.06, -0.02]} rotation={[-0.1, -0.15, -0.12]} material={materials.hair}>
          <cylinderGeometry args={[0.055, 0.038, 0.32, 8]} />
        </mesh>

        {/* Long Back Hair Cascading Down and Fluttering in Wind */}
        <group ref={hairFlowRef} position={[0, -0.04, 0.10]}>
          <mesh position={[0, -0.18, 0.04]} rotation={[-0.15, 0, 0]} material={materials.hair}>
            <cylinderGeometry args={[0.11, 0.07, 0.42, 8]} />
          </mesh>
          {/* Hair Tips Feathering */}
          <mesh position={[-0.05, -0.38, 0.08]} rotation={[-0.2, 0.1, 0]} material={materials.hair}>
            <cylinderGeometry args={[0.04, 0.015, 0.22, 6]} />
          </mesh>
          <mesh position={[0.05, -0.38, 0.08]} rotation={[-0.2, -0.1, 0]} material={materials.hair}>
            <cylinderGeometry args={[0.04, 0.015, 0.22, 6]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
