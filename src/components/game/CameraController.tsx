import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { JourneyPhase } from './types'

interface CameraControllerProps {
  phase: JourneyPhase
  mountingProgress: number // 0 to 1
  bikePosition: [number, number, number]
  steerAngle: number
  leanAngle: number
  speed: number
}

export default function CameraController({
  phase,
  mountingProgress,
  bikePosition,
  steerAngle,
  leanAngle,
  speed,
}: CameraControllerProps) {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 1.0, -10))
  const firstFrame = useRef(true)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const [bx, by, bz] = bikePosition

    const targetPos = new THREE.Vector3()
    const targetLookAt = new THREE.Vector3()

    if (phase === 'opening') {
      // Cinematic opening: beautifully frame character standing proudly beside her vintage scooter
      const orbitX = Math.sin(time * 0.1) * 0.25
      const orbitY = Math.cos(time * 0.08) * 0.06

      targetPos.set(1.4 + orbitX, 1.35 + orbitY, 3.4)
      targetLookAt.set(-0.25, 0.85, -0.4)

      if (firstFrame.current) {
        camera.position.set(1.4, 1.35, 3.4)
        currentLookAt.current.set(-0.25, 0.85, -0.4)
        camera.lookAt(currentLookAt.current)
        firstFrame.current = false
      }
    } else if (phase === 'mounting') {
      // Smooth cinematic sweep from opening side view into riding chase view
      const t = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(mountingProgress, 0, 1), 0, 1)

      const startCam = new THREE.Vector3(1.4, 1.35, 3.4)
      const endCam = new THREE.Vector3(bx * 0.5, by + 1.45, bz + 4.2)
      targetPos.lerpVectors(startCam, endCam, t)

      const startLook = new THREE.Vector3(-0.25, 0.85, -0.4)
      const endLook = new THREE.Vector3(bx * 0.65, by + 0.85, bz - 16)
      targetLookAt.lerpVectors(startLook, endLook, t)
    } else if (phase === 'arrived') {
      // Final glamour shot
      targetPos.set(bx - 3.2, by + 1.6, bz + 3.8)
      targetLookAt.set(bx, by + 0.9, bz - 6)
    } else {
      // Riding: dynamic third-person chase camera showcasing the full motorcycle & rider
      const camHeight = 1.28 + (speed / 100) * 0.12
      const camDist = 3.8 + (speed / 100) * 0.50
      const latLag = bx * 0.5 - steerAngle * 0.22

      targetPos.set(latLag, by + camHeight, bz + camDist)

      // Look ahead down the boulevard towards North (-Z)
      const lookAhead = 18 + (speed / 100) * 10
      targetLookAt.set(bx * 0.65, by + 0.92, bz - lookAhead)
    }

    // Smooth camera interpolation
    const damp = phase === 'mounting' ? 3.0 : 6.0
    camera.position.lerp(targetPos, delta * damp)
    currentLookAt.current.lerp(targetLookAt, delta * damp)
    camera.lookAt(currentLookAt.current)

    // Motorcycle banking into turns
    if (phase === 'riding') {
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -leanAngle * 0.12, delta * 4)
    } else {
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, delta * 3)
    }
  })

  return null
}
