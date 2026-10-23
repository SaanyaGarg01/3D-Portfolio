import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createParisMaterials } from './parisMaterials'

interface MotorcycleProps {
  speed: number // km/h
  steerAngle: number // radians (-0.4 to 0.4)
  leanAngle: number // radians
  isBraking: boolean
  isAccelerating?: boolean
  headlightOn: boolean
  distanceTraveled: number
}

// Vintage 10-inch Scooter Wheel with Rubber Tire, Chrome Rim, Hubcap & Disc Brake
function ScooterWheel({ rotationAngle }: { rotationAngle: number }) {
  const wheelRef = useRef<THREE.Group>(null)
  const materials = useMemo(() => createParisMaterials(), [])

  useFrame(() => {
    if (wheelRef.current) {
      wheelRef.current.rotation.x = -rotationAngle
    }
  })

  return (
    <group ref={wheelRef}>
      {/* Outer Rubber Tire - Torus rotated PI/2 around Y so axle is along X */}
      <mesh rotation={[0, Math.PI / 2, 0]} material={materials.scooterTire} castShadow>
        <torusGeometry args={[0.27, 0.082, 16, 32]} />
      </mesh>

      {/* Chrome Wheel Rim Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.scooterChrome}>
        <cylinderGeometry args={[0.20, 0.20, 0.11, 20]} />
      </mesh>

      {/* Left Chrome Domed Hubcap with Embossed Star */}
      <mesh position={[-0.065, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.scooterChrome}>
        <sphereGeometry args={[0.13, 16, 12, 0, Math.PI]} />
      </mesh>

      {/* Right Chrome Domed Hubcap */}
      <mesh position={[0.065, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.scooterChrome}>
        <sphereGeometry args={[0.13, 16, 12, 0, Math.PI]} />
      </mesh>

      {/* Center Chrome Axle Nut */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.scooterChrome}>
        <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
      </mesh>
    </group>
  )
}

export default function Motorcycle3D({
  speed,
  steerAngle,
  leanAngle,
  isBraking,
  isAccelerating,
  headlightOn,
  distanceTraveled,
}: MotorcycleProps) {
  const chassisRef = useRef<THREE.Group>(null)
  const frontForkRef = useRef<THREE.Group>(null)
  const materials = useMemo(() => createParisMaterials(), [])

  // Wheel rotation angle based on wheel radius (r = 0.27m)
  const wheelAngle = distanceTraveled / 0.27

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (chassisRef.current) {
      // Subtle engine vibration (fine hum, zero horse hopping)
      const vibration = speed > 2 ? Math.sin(time * 50) * 0.0012 : 0
      // Pitch slightly on acceleration (rear squat) and braking (front dive)
      const pitch = isAccelerating ? -0.018 : isBraking ? 0.028 : 0

      chassisRef.current.rotation.z = THREE.MathUtils.lerp(chassisRef.current.rotation.z, leanAngle + vibration, 0.18)
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(chassisRef.current.rotation.x, pitch, 0.15)
      chassisRef.current.rotation.y = THREE.MathUtils.lerp(chassisRef.current.rotation.y, steerAngle * 0.14, 0.18)
    }

    if (frontForkRef.current) {
      // Smooth steering response on handlebars and front wheel
      frontForkRef.current.rotation.y = THREE.MathUtils.lerp(frontForkRef.current.rotation.y, steerAngle, 0.22)
    }
  })

  return (
    <group ref={chassisRef} position={[0, 0, 0]}>
      {/* ========================================================
          1. REAR SECTION (+Z side, facing camera)
      ======================================================== */}
      {/* Rear Wheel (Z = +0.55, Y = 0.27) */}
      <group position={[0, 0.27, 0.55]}>
        <ScooterWheel rotationAngle={wheelAngle} />
      </group>

      {/* Main Central Chassis Spine (Riviera Blue) */}
      <mesh position={[0, 0.38, 0.12]} material={materials.scooterBody} castShadow receiveShadow>
        <boxGeometry args={[0.30, 0.30, 0.76]} />
      </mesh>

      {/* Rear Wheel Arch / Inner Fender */}
      <mesh position={[0, 0.34, 0.55]} material={materials.scooterBody} castShadow>
        <boxGeometry args={[0.22, 0.20, 0.35]} />
      </mesh>

      {/* Left Streamlined Teardrop Cowl with Cream Accent Panel */}
      <group position={[-0.16, 0.34, 0.32]} rotation={[0, -0.06, 0]}>
        <mesh material={materials.scooterBody} castShadow>
          <boxGeometry args={[0.09, 0.24, 0.50]} />
        </mesh>
        <mesh position={[0, 0, 0.22]} material={materials.scooterBody} castShadow>
          <sphereGeometry args={[0.12, 14, 12]} />
        </mesh>
        {/* Vintage Warm Cream Inset Panel */}
        <mesh position={[-0.046, 0, 0.05]} material={materials.scooterCowlCream}>
          <boxGeometry args={[0.01, 0.18, 0.36]} />
        </mesh>
      </group>

      {/* Right Streamlined Teardrop Cowl with Cream Accent & Louvers */}
      <group position={[0.16, 0.34, 0.32]} rotation={[0, 0.06, 0]}>
        <mesh material={materials.scooterBody} castShadow>
          <boxGeometry args={[0.09, 0.24, 0.50]} />
        </mesh>
        <mesh position={[0, 0, 0.22]} material={materials.scooterBody} castShadow>
          <sphereGeometry args={[0.12, 14, 12]} />
        </mesh>
        {/* Vintage Warm Cream Inset Panel */}
        <mesh position={[0.046, 0, 0.05]} material={materials.scooterCowlCream}>
          <boxGeometry args={[0.01, 0.18, 0.36]} />
        </mesh>
        {/* Polished Chrome Engine Cooling Louvers */}
        {[-0.04, 0, 0.04].map((dy, i) => (
          <mesh key={i} position={[0.052, dy, 0.05]} material={materials.scooterChrome}>
            <boxGeometry args={[0.015, 0.014, 0.20]} />
          </mesh>
        ))}
      </group>

      {/* Vintage Polished Chrome Exhaust Muffler (Right side) */}
      <group position={[0.22, 0.14, 0.44]}>
        <mesh rotation={[-0.1, 0, 0]} material={materials.scooterChrome}>
          <cylinderGeometry args={[0.036, 0.036, 0.48, 12]} />
        </mesh>
        {/* Exhaust Tip */}
        <mesh position={[0, -0.24, 0.03]} rotation={[-0.2, 0, 0]} material={materials.scooterChrome}>
          <cylinderGeometry args={[0.022, 0.022, 0.08, 10]} />
        </mesh>
      </group>

      {/* ========================================================
          2. SADDLE SEAT, REAR RACK, TRUNK & TAILLIGHT
      ======================================================== */}
      {/* Contoured Vintage Dark Espresso Leather Saddle */}
      <group position={[0, 0.60, 0.15]}>
        <mesh rotation={[0.04, 0, 0]} material={materials.scooterSeat} castShadow>
          <boxGeometry args={[0.28, 0.10, 0.54]} />
        </mesh>
        {/* Seat Beading / Stitched Chrome Trim */}
        <mesh position={[0, 0.04, 0]} material={materials.scooterChrome}>
          <boxGeometry args={[0.29, 0.015, 0.55]} />
        </mesh>
      </group>

      {/* Polished Chrome Rear Luggage Rack */}
      <group position={[0, 0.62, 0.48]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.scooterChrome}>
          <torusGeometry args={[0.15, 0.014, 8, 16, Math.PI]} />
        </mesh>
        <mesh position={[0, -0.10, 0.06]} material={materials.scooterChrome}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        </mesh>

        {/* Vintage Leather Travel Case mounted on Rack */}
        <group position={[0, 0.10, 0.08]} rotation={[0.05, 0, 0]}>
          <mesh material={materials.scooterSeat} castShadow>
            <boxGeometry args={[0.28, 0.16, 0.18]} />
          </mesh>
          {/* Brass Buckles */}
          <mesh position={[-0.09, 0, 0.092]} material={materials.scooterChrome}>
            <boxGeometry args={[0.02, 0.03, 0.01]} />
          </mesh>
          <mesh position={[0.09, 0, 0.092]} material={materials.scooterChrome}>
            <boxGeometry args={[0.02, 0.03, 0.01]} />
          </mesh>
        </group>
      </group>

      {/* Vintage Red LED Taillight (Facing +Z Camera) */}
      <mesh position={[0, 0.50, 0.68]} material={materials.scooterTire}>
        <cylinderGeometry args={[0.048, 0.048, 0.04, 14]} />
      </mesh>
      <mesh position={[0, 0.50, 0.70]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.038, 14]} />
        <primitive object={materials.taillightRed} />
      </mesh>

      {/* License Plate on Rear Fender */}
      <group position={[0, 0.32, 0.69]} rotation={[0.18, 0, 0]}>
        <mesh material={materials.scooterChrome}>
          <boxGeometry args={[0.20, 0.12, 0.015]} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.18, 0.10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>

      {/* ========================================================
          3. FLOORBOARD & LEGSHEILD APRON
      ======================================================== */}
      {/* Flat Floorboard with central spine */}
      <mesh position={[0, 0.20, -0.12]} material={materials.scooterBody} receiveShadow>
        <boxGeometry args={[0.40, 0.05, 0.46]} />
      </mesh>
      {/* Chrome Side Trims on Floorboard */}
      <mesh position={[-0.205, 0.20, -0.12]} material={materials.scooterChrome}>
        <boxGeometry args={[0.015, 0.052, 0.46]} />
      </mesh>
      <mesh position={[0.205, 0.20, -0.12]} material={materials.scooterChrome}>
        <boxGeometry args={[0.015, 0.052, 0.46]} />
      </mesh>
      {/* Rubber Anti-Slip Grips */}
      {[-0.12, -0.05, 0.05, 0.12].map((fx, i) => (
        <mesh key={i} position={[fx, 0.23, -0.12]} material={materials.scooterTire}>
          <boxGeometry args={[0.02, 0.01, 0.38]} />
        </mesh>
      ))}

      {/* Classic Curved Front Legshield Apron (Tilted back toward rider) */}
      <mesh position={[0, 0.56, -0.36]} rotation={[-0.32, 0, 0]} material={materials.scooterBody} castShadow>
        <boxGeometry args={[0.50, 0.54, 0.04]} />
      </mesh>
      {/* Chrome Beading Border along Legshield */}
      <mesh position={[0, 0.56, -0.38]} rotation={[-0.32, 0, 0]} material={materials.scooterChrome}>
        <boxGeometry args={[0.52, 0.02, 0.02]} />
      </mesh>
      {/* Front Chrome Horncast Grille */}
      <mesh position={[0, 0.52, -0.40]} rotation={[-0.32, 0, 0]} material={materials.scooterChrome}>
        <boxGeometry args={[0.08, 0.16, 0.025]} />
      </mesh>

      {/* ========================================================
          4. FRONT FORK, WHEEL, HEADLIGHT & HANDLEBARS (North, -Z)
      ======================================================== */}
      <group ref={frontForkRef} position={[0, 0.27, -0.55]}>
        {/* Front Wheel */}
        <ScooterWheel rotationAngle={wheelAngle} />

        {/* Vintage Front Mudguard / Fender (Riviera Blue) */}
        <mesh position={[0, 0.12, 0]} material={materials.scooterBody} castShadow>
          <sphereGeometry args={[0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        {/* Chrome Crest on Front Mudguard */}
        <mesh position={[0, 0.32, -0.16]} rotation={[0.3, 0, 0]} material={materials.scooterChrome}>
          <boxGeometry args={[0.02, 0.03, 0.09]} />
        </mesh>

        {/* Chrome Front Fork Column */}
        <mesh position={[0, 0.32, 0.05]} rotation={[0.22, 0, 0]} material={materials.scooterChrome}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 10]} />
        </mesh>

        {/* Handlebar Headset Cowl */}
        <group position={[0, 0.62, 0.12]}>
          <mesh material={materials.scooterBody} castShadow>
            <boxGeometry args={[0.36, 0.12, 0.18]} />
          </mesh>

          {/* Central Round Chrome Headlight (Facing North, -Z) */}
          <mesh position={[0, 0, -0.09]} rotation={[-Math.PI / 2, 0, 0]} material={materials.scooterChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.11]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.075, 16]} />
            <primitive object={materials.headlightLens} />
          </mesh>

          {/* Headlight Spotlight Beam Projecting Forward into North (-Z) */}
          {headlightOn && (
            <spotLight
              position={[0, 0, -0.2]}
              target-position={[0, -0.3, -24]}
              color="#fef9c3"
              intensity={4.8}
              distance={40}
              angle={0.65}
              penumbra={0.4}
            />
          )}

          {/* Handlebar Grips */}
          <mesh position={[-0.30, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.scooterTire}>
            <cylinderGeometry args={[0.024, 0.024, 0.14, 10]} />
          </mesh>
          <mesh position={[0.30, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.scooterTire}>
            <cylinderGeometry args={[0.024, 0.024, 0.14, 10]} />
          </mesh>

          {/* Chrome Brake Levers */}
          <mesh position={[-0.24, -0.02, -0.05]} rotation={[0, -0.3, 0]} material={materials.scooterChrome}>
            <boxGeometry args={[0.12, 0.012, 0.015]} />
          </mesh>
          <mesh position={[0.24, -0.02, -0.05]} rotation={[0, 0.3, 0]} material={materials.scooterChrome}>
            <boxGeometry args={[0.12, 0.012, 0.015]} />
          </mesh>

          {/* Left Round Chrome Rearview Mirror */}
          <group position={[-0.24, 0.16, -0.02]}>
            <mesh material={materials.scooterChrome}>
              <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
            </mesh>
            <mesh position={[0, 0.11, 0]} rotation={[-0.2, 0.3, 0]} material={materials.scooterChrome}>
              <cylinderGeometry args={[0.048, 0.048, 0.015, 14]} />
            </mesh>
          </group>

          {/* Right Round Chrome Rearview Mirror */}
          <group position={[0.24, 0.16, -0.02]}>
            <mesh material={materials.scooterChrome}>
              <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
            </mesh>
            <mesh position={[0, 0.11, 0]} rotation={[-0.2, -0.3, 0]} material={materials.scooterChrome}>
              <cylinderGeometry args={[0.048, 0.048, 0.015, 14]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
