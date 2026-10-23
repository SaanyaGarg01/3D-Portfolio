import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Camera positions for each chapter
const CAMERA_STATES = [
  { position: [0, 0, 8] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 60 },       // 0 Hero
  { position: [-3, 1, 6] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 65 },      // 1 About
  { position: [3, -1, 7] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 60 },      // 2 Journey
  { position: [0, 0, 5] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 55 },       // 3 Projects
  { position: [-4, 2, 6] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 65 },      // 4 Skills
  { position: [4, -2, 7] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 60 },      // 5 Achievements
  { position: [0, 3, 9] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 55 },       // 6 Certs
  { position: [0, -1, 6] as [number,number,number], target: [0, 0, 0] as [number,number,number], fov: 60 },      // 7 Connect
]

// Floating nodes (skill/node particles)
function TechNodes() {
  const groupRef = useRef<THREE.Group>(null)
  const count = 40
  const positions = useMemo(() => {
    const arr: [number,number,number][] = []
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5,
      ])
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.05
  })

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04 + Math.random() * 0.06, 8, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#6a6a7a' : '#4a4a5a'}
            emissive={i % 3 === 0 ? '#1d4ed8' : '#000000'}
            emissiveIntensity={i % 3 === 0 ? 2 : 0}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

// Connection lines between nodes
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const geometry = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i < 15; i++) {
      const x1 = (Math.random() - 0.5) * 20
      const y1 = (Math.random() - 0.5) * 15
      const z1 = (Math.random() - 0.5) * 10 - 3
      const x2 = x1 + (Math.random() - 0.5) * 6
      const y2 = y1 + (Math.random() - 0.5) * 4
      const z2 = z1 + (Math.random() - 0.5) * 3
      points.push(x1, y1, z1, x2, y2, z2)
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geom
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#1d4ed8" opacity={0.2} transparent />
    </lineSegments>
  )
}

// Central hero orb
function HeroOrb({ hasEntered }: { hasEntered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const targetScale = hasEntered ? 1 : 0.01
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05)
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
    if (ringRef.current) {
      ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05)
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.2
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group position={[2.5, 0, -1]}>
        {/* Core sphere */}
        <Sphere ref={meshRef} args={[0.7, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#1a1a30"
            emissive="#0d2060"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            distort={0.15}
            speed={2}
          />
        </Sphere>

        {/* Outer glow ring */}
        <Torus ref={ringRef} args={[1.1, 0.012, 8, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#60a5fa"
            emissiveIntensity={3}
            transparent
            opacity={0.7}
          />
        </Torus>

        {/* Second ring */}
        <Torus args={[1.5, 0.006, 8, 100]} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial
            color="#1d4ed8"
            emissive="#3b82f6"
            emissiveIntensity={2}
            transparent
            opacity={0.4}
          />
        </Torus>

        {/* Inner light */}
        <pointLight color="#3b82f6" intensity={2} distance={4} />
      </group>
    </Float>
  )
}

// Ambient geometric shapes floating in background
function AmbientGeometry() {
  const shapes = useMemo(() => [
    { pos: [-8, 3, -10] as [number,number,number], type: 'box', size: 0.8, speed: 0.3, color: '#1d2030' },
    { pos: [9, -4, -12] as [number,number,number], type: 'torus', size: 1.2, speed: 0.2, color: '#1d3050' },
    { pos: [-6, -5, -8] as [number,number,number], type: 'box', size: 0.5, speed: 0.5, color: '#0f1520' },
    { pos: [7, 5, -15] as [number,number,number], type: 'sphere', size: 1.5, speed: 0.15, color: '#0a1520' },
    { pos: [0, -8, -12] as [number,number,number], type: 'torus', size: 2.0, speed: 0.25, color: '#0d1540' },
  ], [])

  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    refs.current.forEach((ref, i) => {
      if (!ref) return
      ref.rotation.x = state.clock.elapsedTime * shapes[i].speed
      ref.rotation.y = state.clock.elapsedTime * shapes[i].speed * 0.7
    })
  })

  return (
    <group>
      {shapes.map((shape, i) => (
        <mesh key={i} ref={el => refs.current[i] = el} position={shape.pos}>
          {shape.type === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
          {shape.type === 'torus' && <torusGeometry args={[shape.size, shape.size * 0.15, 8, 30]} />}
          {shape.type === 'sphere' && <sphereGeometry args={[shape.size, 16, 16]} />}
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            wireframe={shape.type === 'torus'}
          />
        </mesh>
      ))}
    </group>
  )
}

// Grid floor plane
function GridFloor() {
  return (
    <gridHelper
      args={[60, 30, '#1d4ed8', '#0a0a14']}
      position={[0, -6, -5]}
      rotation={[0, 0, 0]}
    />
  )
}

// Particle field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 800

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      const isBlue = Math.random() > 0.7
      colors[i * 3] = isBlue ? 0.23 : 0.26
      colors[i * 3 + 1] = isBlue ? 0.51 : 0.26
      colors[i * 3 + 2] = isBlue ? 0.96 : 0.35
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Main scene that handles camera based on scroll
interface Props {
  currentChapter: number
  hasEntered: boolean
  soundEnabled: boolean
}

export default function MainScene({ currentChapter = 0, hasEntered, soundEnabled = false }: Props) {
  const { camera } = useThree()
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0))
  const cameraPos = useRef(new THREE.Vector3(0, 0, 8))
  const mouseRef = useRef({ x: 0, y: 0 })

  // Mouse parallax
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  // Scroll-driven camera using GSAP ScrollTrigger
  useEffect(() => {
    const sections = document.querySelectorAll('.chapter-section')
    if (!sections.length) return

    // Create a proxy object for camera animation
    const proxy = {
      x: CAMERA_STATES[0].position[0],
      y: CAMERA_STATES[0].position[1],
      z: CAMERA_STATES[0].position[2],
      tx: CAMERA_STATES[0].target[0],
      ty: CAMERA_STATES[0].target[1],
      tz: CAMERA_STATES[0].target[2],
    }

    sections.forEach((section, i) => {
      if (i >= CAMERA_STATES.length) return
      const state = CAMERA_STATES[i]
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(proxy, {
            x: state.position[0],
            y: state.position[1],
            z: state.position[2],
            tx: state.target[0],
            ty: state.target[1],
            tz: state.target[2],
            duration: 2,
            ease: 'power3.inOut',
            onUpdate: () => {
              cameraPos.current.set(proxy.x, proxy.y, proxy.z)
              cameraTarget.current.set(proxy.tx, proxy.ty, proxy.tz)
            }
          })
        },
        onEnterBack: () => {
          const prevState = CAMERA_STATES[Math.max(0, i)]
          gsap.to(proxy, {
            x: prevState.position[0],
            y: prevState.position[1],
            z: prevState.position[2],
            tx: prevState.target[0],
            ty: prevState.target[1],
            tz: prevState.target[2],
            duration: 2,
            ease: 'power3.inOut',
            onUpdate: () => {
              cameraPos.current.set(proxy.x, proxy.y, proxy.z)
              cameraTarget.current.set(proxy.tx, proxy.ty, proxy.tz)
            }
          })
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // Apply camera position each frame with mouse parallax
  useFrame(() => {
    const mx = mouseRef.current.x * 0.3
    const my = mouseRef.current.y * 0.2

    camera.position.lerp(
      new THREE.Vector3(
        cameraPos.current.x + mx,
        cameraPos.current.y + my,
        cameraPos.current.z
      ),
      0.05
    )
    camera.lookAt(cameraTarget.current)
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#1d4ed8" />
      <pointLight position={[10, 5, -10]} intensity={soundEnabled ? 0.6 : 0.3} color={currentChapter % 2 === 0 ? "#3b82f6" : "#60a5fa"} />

      {/* Fog */}
      <fog attach="fog" args={['#0d0d0f', 20, 60]} />

      {/* Background stars */}
      <Stars radius={80} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* Scene elements */}
      <HeroOrb hasEntered={hasEntered} />
      <TechNodes />
      <ConnectionLines />
      <AmbientGeometry />
      <GridFloor />
      <ParticleField />
    </>
  )
}
