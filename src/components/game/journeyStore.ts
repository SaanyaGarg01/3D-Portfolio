import { WORLDS, ROAD_TOTAL_LENGTH, type JourneyPhase } from './types'

export interface SparkItem {
  id: string
  name: string
  category: string
  zPos: number
  color: string
}

export interface CharacterDialogue {
  id: string
  speaker: string
  role: string
  text: string
  icon: string
}

export const INNOVATION_SPARKS: SparkItem[] = [
  { id: 'spark-1', name: 'React.js', category: 'Frontend Architecture', zPos: -450, color: '#38bdf8' },
  { id: 'spark-2', name: 'TypeScript', category: 'Type Safety & Scale', zPos: -820, color: '#3b82f6' },
  { id: 'spark-3', name: 'Node.js', category: 'Backend Microservices', zPos: -1200, color: '#22c55e' },
  { id: 'spark-4', name: 'Docker', category: 'Containerization', zPos: -1520, color: '#06b6d4' },
  { id: 'spark-5', name: 'REST APIs', category: 'Distributed Systems', zPos: -1880, color: '#a855f7' },
  { id: 'spark-6', name: 'AWS Cloud', category: 'Cloud Infrastructure', zPos: -2240, color: '#f59e0b' },
  { id: 'spark-7', name: 'MongoDB', category: 'NoSQL Databases', zPos: -2620, color: '#10b981' },
  { id: 'spark-8', name: 'CI/CD Pipelines', category: 'Automated Releases', zPos: -2980, color: '#ec4899' },
]

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
  // Cinematic additions
  collectedSparks: string[]
  activeSparkNotification: { name: string; category: string } | null
  cinematicCameraMode: 'normal' | 'bridge' | 'trophy' | 'arrival'
  weatherState: 'clear' | 'mist' | 'rain' | 'sunrise'
  activeProjectPreview: string | null
  activeConstellation: string | null
  discoveredEasterEggs: string[]
  // Character & Companion additions
  activeDialogue: CharacterDialogue | null
  journalOpen: boolean
  discoveredCharacters: string[]
  byteMood: 'idle' | 'wave' | 'celebrate' | 'talking'
  sunoPlayerOpen: boolean
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
  collectedSparks: [],
  activeSparkNotification: null,
  cinematicCameraMode: 'normal',
  weatherState: 'clear',
  activeProjectPreview: null,
  activeConstellation: null,
  discoveredEasterEggs: [],
  activeDialogue: null,
  journalOpen: false,
  discoveredCharacters: [],
  byteMood: 'idle',
  sunoPlayerOpen: true,
}

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
    this.setState({
      phase: 'mounting',
      mountingProgress: 0,
      activeDialogue: {
        id: 'byte-welcome',
        speaker: 'Byte',
        role: 'AI Floating Companion',
        text: "Beep boop! 🤖 I'm Byte, your copilot! Scroll or press W to start riding through Saanya's portfolio. I'll guide you through each landmark!",
        icon: '🤖',
      },
      byteMood: 'wave',
    })
  }

  public finishMounting() {
    this.setState({ phase: 'riding', mountingProgress: 1, byteMood: 'idle' })
  }

  public setProgress(progress: number) {
    const clamped = Math.max(0, Math.min(1, progress))
    const distance = clamped * ROAD_TOTAL_LENGTH
    const currentZ = -distance

    // Calculate which world is active
    let activeWorld = 0
    for (let i = WORLDS.length - 1; i >= 0; i--) {
      if (clamped >= WORLDS[i].startProgress) {
        activeWorld = i
        break
      }
    }

    // Determine dynamic weather deterministically from distance
    let weather: 'clear' | 'mist' | 'rain' | 'sunrise' = 'clear'
    if (currentZ < -2100 && currentZ >= -2400) {
      weather = 'mist'
    } else if (currentZ < -2400 && currentZ >= -2750) {
      weather = 'rain'
    } else if (currentZ < -2750) {
      weather = 'sunrise'
    }

    // Determine camera mode: achievement bridge (-1580 to -1740) or final arrival
    let camMode: 'normal' | 'bridge' | 'trophy' | 'arrival' = 'normal'
    let mood: 'idle' | 'wave' | 'celebrate' | 'talking' = this.state.byteMood
    if (currentZ <= -1580 && currentZ >= -1740) {
      camMode = 'bridge'
      mood = 'celebrate'
    } else if (currentZ <= -2200 && currentZ >= -2320) {
      camMode = 'trophy'
      mood = 'celebrate'
    } else if (clamped >= 0.985) {
      camMode = 'arrival'
      mood = 'celebrate'
    }

    // Deterministic sparks collection based on distance (reversible when scrolling backward)
    const collected = INNOVATION_SPARKS.filter((s) => currentZ <= s.zPos).map((s) => s.id)

    const isArrived = clamped >= 0.985
    this.setState({
      progress: clamped,
      distance,
      activeWorldIndex: activeWorld,
      weatherState: weather,
      cinematicCameraMode: camMode,
      collectedSparks: collected,
      byteMood: mood,
      phase: isArrived ? 'arrived' : (this.state.phase === 'opening' ? 'opening' : 'riding'),
    })
  }

  public triggerSparkNotification(name: string, category: string) {
    this.setState({
      activeSparkNotification: { name, category },
    })
  }

  public clearSparkNotification() {
    this.setState({ activeSparkNotification: null })
  }

  public triggerDialogue(dialogue: CharacterDialogue) {
    const discovered = this.state.discoveredCharacters.includes(dialogue.speaker)
      ? this.state.discoveredCharacters
      : [...this.state.discoveredCharacters, dialogue.speaker]

    this.setState({
      activeDialogue: dialogue,
      discoveredCharacters: discovered,
      byteMood: dialogue.speaker === 'Byte' ? 'talking' : 'idle',
    })
  }

  public dismissDialogue() {
    this.setState({ activeDialogue: null, byteMood: 'idle' })
  }

  public toggleJournal() {
    this.setState({ journalOpen: !this.state.journalOpen })
  }

  public openProjectPreview(projectId: string | null) {
    this.setState({ activeProjectPreview: projectId })
  }

  public selectConstellation(category: string | null) {
    this.setState({ activeConstellation: category })
  }

  public discoverEasterEgg(eggId: string) {
    if (!this.state.discoveredEasterEggs.includes(eggId)) {
      this.setState({
        discoveredEasterEggs: [...this.state.discoveredEasterEggs, eggId],
      })
    }
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
      collectedSparks: [],
      activeSparkNotification: null,
      cinematicCameraMode: 'normal',
      weatherState: 'clear',
      activeProjectPreview: null,
      activeConstellation: null,
      discoveredEasterEggs: [],
      activeDialogue: null,
      journalOpen: false,
      discoveredCharacters: [],
      byteMood: 'idle',
      sunoPlayerOpen: false,
    })
  }

  public setAccelerating(isAccelerating: boolean) {
    this.setState({ isAccelerating })
  }

  public nudgeForward(amount: number = 0.03) {
    if (this.state.phase === 'opening') {
      this.setState({ phase: 'riding', mountingProgress: 1 })
    }
    const newProg = Math.min(1, this.state.progress + amount)
    this.setProgress(newProg)
  }

  public toggleSunoPlayer(open?: boolean) {
    this.setState({
      sunoPlayerOpen: open !== undefined ? open : !this.state.sunoPlayerOpen,
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
