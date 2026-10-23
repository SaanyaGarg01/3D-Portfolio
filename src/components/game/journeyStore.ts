import { WORLDS, ROAD_TOTAL_LENGTH, type JourneyPhase } from './types'

export interface JourneyState {
  phase: JourneyPhase
  progress: number // 0 to 1
  distance: number // 0 to ROAD_TOTAL_LENGTH
  speed: number // km/h
  lateralOffset: number // -3.5 to 3.5 meters
  steerAngle: number // radians
  leanAngle: number // radians
  mountingProgress: number // 0 to 1
  activeWorldIndex: number
  soundEnabled: boolean
  isMenuOpen: boolean
  isBraking: boolean
  isAccelerating: boolean
}

const initialState: JourneyState = {
  phase: 'opening',
  progress: 0.0,
  distance: 0,
  speed: 0,
  lateralOffset: 0,
  steerAngle: 0,
  leanAngle: 0,
  mountingProgress: 0,
  activeWorldIndex: 0,
  soundEnabled: false,
  isMenuOpen: false,
  isBraking: false,
  isAccelerating: false,
}

// Lightweight reactive store without external state-management dependencies
class JourneyStore {
  private state: JourneyState = { ...initialState }
  private listeners: Set<(state: JourneyState) => void> = new Set()

  public getState(): JourneyState {
    return this.state
  }

  public setState(partial: Partial<JourneyState>) {
    this.state = { ...this.state, ...partial }
    this.notify()
  }

  public subscribe(listener: (state: JourneyState) => void) {
    this.listeners.add(listener)
    listener(this.state)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }

  public startMounting() {
    if (this.state.phase !== 'opening') return
    this.setState({ phase: 'mounting', mountingProgress: 0 })
  }

  public finishMounting() {
    this.setState({ phase: 'riding', mountingProgress: 1 })
  }

  public setProgress(progress: number) {
    const clamped = Math.max(0, Math.min(1, progress))
    const distance = clamped * ROAD_TOTAL_LENGTH

    // Calculate which world is active
    let activeWorld = 0
    for (let i = WORLDS.length - 1; i >= 0; i--) {
      if (clamped >= WORLDS[i].startProgress) {
        activeWorld = i
        break
      }
    }

    const isArrived = clamped >= 0.99
    this.setState({
      progress: clamped,
      distance,
      activeWorldIndex: activeWorld,
      phase: isArrived ? 'arrived' : (this.state.phase === 'opening' ? 'opening' : 'riding'),
    })
  }

  public jumpToWorld(worldIndex: number) {
    const world = WORLDS[worldIndex]
    if (!world) return
    if (this.state.phase === 'opening') {
      this.setState({ phase: 'riding', mountingProgress: 1 })
    }
    this.setProgress(world.startProgress)
    this.setState({ isMenuOpen: false })
  }

  public restartJourney() {
    this.setState({
      phase: 'opening',
      progress: 0,
      distance: 0,
      speed: 0,
      lateralOffset: 0,
      steerAngle: 0,
      leanAngle: 0,
      mountingProgress: 0,
      activeWorldIndex: 0,
      isMenuOpen: false,
    })
  }

  public toggleMenu() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  }

  public toggleSound() {
    this.setState({ soundEnabled: !this.state.soundEnabled })
  }
}

export const journeyStore = new JourneyStore()
