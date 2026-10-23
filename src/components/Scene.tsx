import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import CinematicWorld from './game/CinematicWorld'

// Sets the Three.js scene background color to the warm Parisian sunset
function SceneBackground() {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color('#d4917a')
  }, [scene])
  return null
}

export default function Scene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#d4917a',
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0.6, 1.65, 3.8], fov: 55, near: 0.1, far: 2000 }}
        dpr={[1, 1.5]}
        shadows
      >
        <SceneBackground />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <CinematicWorld />
      </Canvas>
    </div>
  )
}
