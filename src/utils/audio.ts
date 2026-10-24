/**
 * Unified Web Audio Engine — Consistent Sound Across Entire Portfolio
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────┐
 * │  masterGain (global mute / volume)              │
 * │  ├── bgMusicGain (background music layer)       │
 * │  │   ├── warm pad oscillators                   │
 * │  │   ├── melodic arpeggio layer                 │
 * │  │   └── bass drone layer                       │
 * │  ├── ambientGain (spatial atmosphere)            │
 * │  │   ├── ambient pad chords                     │
 * │  │   └── wind/rain noise generators             │
 * │  ├── engineGain (motorcycle engine)              │
 * │  ├── sfxGain (one-shot SFX: chime, blip, etc.)  │
 * │  └── voiceGain (voice-over ducking target)       │
 * └─────────────────────────────────────────────────┘
 *
 * Key design decisions:
 * - Single `enabled` flag controls ALL audio. Every public method checks it.
 * - Background music uses evolving chord progressions (not static drones).
 * - Zone-based atmosphere adapts to weather/location via `setZone()`.
 * - Melody sequencer plays gentle arpeggios that cycle through chord tones.
 */

type AudioZone = 'clear' | 'mist' | 'rain' | 'sunrise' | 'tunnel' | 'bridge'

class AudioEngine {
  private ctx: AudioContext | null = null
  private enabled = false // Single source of truth for sound on/off

  // Master bus
  private masterGain: GainNode | null = null

  // Sub-buses
  private bgMusicGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private engineGainNode: GainNode | null = null
  private sfxGain: GainNode | null = null

  // Background music state
  private bgPadOscs: OscillatorNode[] = []
  private bgPadGains: GainNode[] = []
  private bgBassOsc: OscillatorNode | null = null
  private bgBassGain: GainNode | null = null
  private bgMusicPlaying = false
  private melodyInterval: ReturnType<typeof setInterval> | null = null
  private chordIndex = 0
  private customAudio: HTMLAudioElement | null = null
  private customAudioLoaded = false

  // Ambient atmosphere state
  private ambientOscs: OscillatorNode[] = []
  private ambientPlaying = false
  private noiseNode: AudioBufferSourceNode | null = null
  private noiseGain: GainNode | null = null

  // Engine state
  private engineOsc: OscillatorNode | null = null
  private engineFilter: BiquadFilterNode | null = null
  private engineInternalGain: GainNode | null = null

  // Zone tracking
  private currentZone: AudioZone = 'clear'

  // Chord progression for evolving background music
  // I → vi → IV → V → iii → vi → ii → V (in C major, warm voicing)
  private readonly CHORD_PROGRESSION = [
    [261.63, 329.63, 392.00, 493.88],  // Cmaj7    (C E G B)
    [220.00, 261.63, 329.63, 392.00],  // Am7      (A C E G)
    [174.61, 220.00, 261.63, 329.63],  // Fmaj7    (F A C E)
    [196.00, 246.94, 293.66, 392.00],  // G7       (G B D G)
    [164.81, 196.00, 246.94, 329.63],  // Em7      (E G B E)
    [220.00, 261.63, 329.63, 440.00],  // Am7(high)(A C E A)
    [146.83, 174.61, 220.00, 293.66],  // Dm7      (D F A D)
    [196.00, 246.94, 293.66, 392.00],  // G7       (G B D G)
  ]

  // Melody note pools per chord (pentatonic-friendly)
  private readonly MELODY_POOLS = [
    [523.25, 587.33, 659.25, 783.99, 880.00],  // C major pent high
    [440.00, 523.25, 587.33, 659.25, 783.99],  // A minor pent
    [349.23, 440.00, 523.25, 587.33, 659.25],  // F major pent
    [392.00, 493.88, 587.33, 659.25, 783.99],  // G major pent
    [329.63, 392.00, 493.88, 587.33, 659.25],  // E minor pent
    [440.00, 523.25, 587.33, 659.25, 880.00],  // A minor pent high
    [293.66, 349.23, 440.00, 523.25, 587.33],  // D minor pent
    [392.00, 493.88, 587.33, 659.25, 783.99],  // G major pent
  ]

  // ── Initialization ──────────────────────────────

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()

      // Master bus
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      // Sub-buses
      this.bgMusicGain = this.ctx.createGain()
      this.bgMusicGain.gain.setValueAtTime(0.0001, this.ctx.currentTime)
      this.bgMusicGain.connect(this.masterGain)

      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime)
      this.ambientGain.connect(this.masterGain)

      this.engineGainNode = this.ctx.createGain()
      this.engineGainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime)
      this.engineGainNode.connect(this.masterGain)

      this.sfxGain = this.ctx.createGain()
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime)
      this.sfxGain.connect(this.masterGain)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // ── Global Enable / Disable ─────────────────────

  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Enable all audio: ramp master up, start bg music + ambient + engine if applicable.
   */
  public enable() {
    this.initContext()
    if (this.enabled) return
    this.enabled = true

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(
        Math.max(this.masterGain.gain.value, 0.0001), now
      )
      this.masterGain.gain.exponentialRampToValueAtTime(1.0, now + 0.6)
    }

    // Default music is Suno soundtrack exclusively (no synth chords)
    this.startAmbient()
    this.initCustomAudio()
    if (this.customAudio) {
      this.customAudio.volume = 0.55
      this.customAudio.play().catch(() => {})
    }
  }

  /**
   * Disable all audio: fade master to zero, then stop all oscillators.
   */
  public disable() {
    if (!this.enabled) return
    this.enabled = false

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(
        Math.max(this.masterGain.gain.value, 0.0001), now
      )
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
    }

    if (this.customAudio) {
      this.customAudio.pause()
    }

    // Stop everything after fade
    setTimeout(() => {
      this.stopAmbient()
      this.stopEngine()
    }, 600)
  }

  public initCustomAudio(src: string = '/music.mp3') {
    if (typeof window === 'undefined') return
    try {
      if (!this.customAudio) {
        this.customAudio = new Audio(src)
        this.customAudio.loop = true
        this.customAudio.volume = 0.55
        this.customAudio.addEventListener('canplaythrough', () => {
          this.customAudioLoaded = true
          if (this.enabled) {
            this.customAudio?.play().catch(() => {})
          }
        })
        this.customAudio.addEventListener('error', () => {
          if (src === '/music.mp3') {
            this.customAudio = null
            this.initCustomAudio('/saanya_theme.m4a')
          }
        })
      }
      if (this.enabled && this.customAudio) {
        this.customAudio.play().catch(() => {})
      }
    } catch {}
  }

  public setupAutoUnlock() {
    if (typeof window === 'undefined') return
    const unlock = () => {
      this.enable()
    }
    window.addEventListener('click', unlock, { once: true, passive: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true, passive: true })
  }

  // ── Background Music Layer ──────────────────────
  // Warm piano-like chords that evolve through a progression,
  // with a gentle arpeggio melody layer on top.

  public startBackgroundMusic() {
    this.initCustomAudio()
    if (this.customAudio && this.enabled) {
      this.customAudio.play().catch(() => {})
    }
  }

  private playChord(index: number) {
    if (!this.ctx || !this.bgMusicGain) return
    const now = this.ctx.currentTime
    const chord = this.CHORD_PROGRESSION[index]

    // Clear old pad oscs
    this.bgPadOscs.forEach(o => { try { o.stop(); o.disconnect() } catch {} })
    this.bgPadGains.forEach(g => { try { g.disconnect() } catch {} })
    this.bgPadOscs = []
    this.bgPadGains = []

    chord.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      const filter = this.ctx!.createBiquadFilter()

      // Warm sine with slight detune for richness
      osc.type = i % 3 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      osc.detune.setValueAtTime((i - 1.5) * 4, now) // subtle stereo spread

      // Gentle LFO for organic movement
      const lfo = this.ctx!.createOscillator()
      const lfoGain = this.ctx!.createGain()
      lfo.frequency.setValueAtTime(0.15 + i * 0.08, now)
      lfoGain.gain.setValueAtTime(1.5, now)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.detune)
      lfo.start(now)

      // Warm lowpass for piano character
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800 + i * 120, now)
      filter.Q.setValueAtTime(0.5, now)

      // Volume per voice (higher partials quieter)
      const voiceVol = 0.035 / (1 + i * 0.3)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(voiceVol, now + 0.8)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.bgMusicGain!)

      osc.start(now)
      this.bgPadOscs.push(osc)
      this.bgPadGains.push(gain)
    })
  }

  private crossfadeChord(index: number) {
    if (!this.ctx || !this.bgMusicGain || !this.bgMusicPlaying) return
    const now = this.ctx.currentTime

    // Fade out current pads
    this.bgPadGains.forEach(g => {
      g.gain.cancelScheduledValues(now)
      g.gain.setTargetAtTime(0.0001, now, 0.6)
    })

    // After fade-out, start new chord
    setTimeout(() => {
      if (this.bgMusicPlaying) this.playChord(index)
    }, 800)
  }

  private playMelodyNote() {
    if (!this.ctx || !this.bgMusicGain || !this.bgMusicPlaying) return
    const now = this.ctx.currentTime
    const pool = this.MELODY_POOLS[this.chordIndex]
    const noteFreq = pool[Math.floor(Math.random() * pool.length)]

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(noteFreq, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, now)

    // Bell-like envelope: quick attack, slow release
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.bgMusicGain)

    osc.start(now)
    osc.stop(now + 3.0)
  }

  private startBassDrone() {
    if (!this.ctx || !this.bgMusicGain) return
    const now = this.ctx.currentTime

    this.bgBassOsc = this.ctx.createOscillator()
    this.bgBassGain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    this.bgBassOsc.type = 'sine'
    this.bgBassOsc.frequency.setValueAtTime(65.41, now) // C2

    // Slow LFO on frequency for gentle pulse
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    lfo.frequency.setValueAtTime(0.08, now)
    lfoGain.gain.setValueAtTime(3, now)
    lfo.connect(lfoGain)
    lfoGain.connect(this.bgBassOsc.detune)
    lfo.start(now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(120, now)

    this.bgBassGain.gain.setValueAtTime(0.0001, now)
    this.bgBassGain.gain.exponentialRampToValueAtTime(0.06, now + 2)

    this.bgBassOsc.connect(filter)
    filter.connect(this.bgBassGain)
    this.bgBassGain.connect(this.bgMusicGain)
    this.bgBassOsc.start(now)
  }

  public stopBackgroundMusic() {
    if (!this.bgMusicPlaying) return
    this.bgMusicPlaying = false

    if (this.melodyInterval) {
      clearInterval(this.melodyInterval)
      this.melodyInterval = null
    }

    const cleanup = (oscs: OscillatorNode[], gains: GainNode[]) => {
      oscs.forEach(o => { try { o.stop(); o.disconnect() } catch {} })
      gains.forEach(g => { try { g.disconnect() } catch {} })
    }

    cleanup(this.bgPadOscs, this.bgPadGains)
    this.bgPadOscs = []
    this.bgPadGains = []

    if (this.bgBassOsc) {
      try { this.bgBassOsc.stop(); this.bgBassOsc.disconnect() } catch {}
      this.bgBassOsc = null
    }
    if (this.bgBassGain) {
      try { this.bgBassGain.disconnect() } catch {}
      this.bgBassGain = null
    }
  }

  /**
   * Duck background music during speech or important moments
   */
  public duckCorporateMusic(duckLevel = 0.03) {
    if (!this.ctx || !this.bgMusicGain) return
    const now = this.ctx.currentTime
    this.bgMusicGain.gain.cancelScheduledValues(now)
    this.bgMusicGain.gain.setTargetAtTime(duckLevel, now, 0.3)
  }

  /**
   * Restore background music volume
   */
  public restoreCorporateMusic(level = 0.12) {
    if (!this.ctx || !this.bgMusicGain) return
    const now = this.ctx.currentTime
    this.bgMusicGain.gain.cancelScheduledValues(now)
    this.bgMusicGain.gain.setTargetAtTime(level, now, 0.5)
  }

  // Legacy aliases for VideoElaboratedPresenter compatibility
  public startCorporateMusic(vol = 0.12) {
    if (!this.bgMusicPlaying) {
      this.startBackgroundMusic()
    }
    this.restoreCorporateMusic(vol)
  }
  public stopCorporateMusic() {
    this.duckCorporateMusic(0.03)
  }

  // ── Ambient Atmosphere Layer ────────────────────

  public startAmbient() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.ambientGain || this.ambientPlaying) return
    this.ambientPlaying = true

    const now = this.ctx.currentTime
    this.ambientGain.gain.cancelScheduledValues(now)
    this.ambientGain.gain.setValueAtTime(0.0001, now)
    this.ambientGain.gain.exponentialRampToValueAtTime(0.14, now + 2.5)

    // Ethereal pad: fifths with slow LFO modulation
    const padFreqs = [73.42, 110.0, 146.83, 220.0]
    this.ambientOscs = padFreqs.map((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      const filter = this.ctx!.createBiquadFilter()

      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      const lfo = this.ctx!.createOscillator()
      const lfoGain = this.ctx!.createGain()
      lfo.frequency.value = 0.06 + i * 0.03
      lfoGain.gain.value = 2.0
      lfo.connect(lfoGain)
      lfoGain.connect(osc.detune)
      lfo.start(now)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(350 + i * 100, now)

      gain.gain.setValueAtTime(0.06 / (i + 1), now)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ambientGain!)
      osc.start(now)

      return osc
    })
  }

  // Legacy aliases
  public playAmbient() { this.startAmbient() }

  public stopAmbient() {
    if (!this.ambientPlaying) return
    this.ambientPlaying = false

    this.ambientOscs.forEach(osc => {
      try { osc.stop(); osc.disconnect() } catch {}
    })
    this.ambientOscs = []

    if (this.noiseNode) {
      try { this.noiseNode.stop(); this.noiseNode.disconnect() } catch {}
      this.noiseNode = null
    }
    if (this.noiseGain) {
      try { this.noiseGain.disconnect() } catch {}
      this.noiseGain = null
    }
  }

  /**
   * Update ambient atmosphere based on journey zone.
   * Called by CinematicWorld on every store update.
   */
  public setZone(zone: AudioZone) {
    if (zone === this.currentZone || !this.ctx || !this.ambientGain) return
    this.currentZone = zone

    const now = this.ctx.currentTime

    // Clean up previous noise
    if (this.noiseNode) {
      try { this.noiseNode.stop(); this.noiseNode.disconnect() } catch {}
      this.noiseNode = null
    }
    if (this.noiseGain) {
      try { this.noiseGain.disconnect() } catch {}
      this.noiseGain = null
    }

    switch (zone) {
      case 'rain': {
        // Rain white noise
        const buf = this.createNoiseBuffer(2.0)
        this.noiseNode = this.ctx.createBufferSource()
        this.noiseNode.buffer = buf
        this.noiseNode.loop = true

        this.noiseGain = this.ctx.createGain()
        this.noiseGain.gain.setValueAtTime(0.0001, now)
        this.noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 1.5)

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2200, now)

        this.noiseNode.connect(filter)
        filter.connect(this.noiseGain)
        this.noiseGain.connect(this.ambientGain)
        this.noiseNode.start(now)
        break
      }
      case 'mist': {
        // Soft wind noise
        const buf = this.createNoiseBuffer(2.0)
        this.noiseNode = this.ctx.createBufferSource()
        this.noiseNode.buffer = buf
        this.noiseNode.loop = true

        this.noiseGain = this.ctx.createGain()
        this.noiseGain.gain.setValueAtTime(0.0001, now)
        this.noiseGain.gain.exponentialRampToValueAtTime(0.04, now + 2.0)

        const windFilter = this.ctx.createBiquadFilter()
        windFilter.type = 'bandpass'
        windFilter.frequency.setValueAtTime(600, now)
        windFilter.Q.setValueAtTime(1.5, now)

        this.noiseNode.connect(windFilter)
        windFilter.connect(this.noiseGain)
        this.noiseGain.connect(this.ambientGain)
        this.noiseNode.start(now)
        break
      }
      case 'tunnel': {
        // Reverberant echo feeling via filtered noise
        const buf = this.createNoiseBuffer(1.5)
        this.noiseNode = this.ctx.createBufferSource()
        this.noiseNode.buffer = buf
        this.noiseNode.loop = true

        this.noiseGain = this.ctx.createGain()
        this.noiseGain.gain.setValueAtTime(0.0001, now)
        this.noiseGain.gain.exponentialRampToValueAtTime(0.03, now + 0.8)

        const resoFilter = this.ctx.createBiquadFilter()
        resoFilter.type = 'bandpass'
        resoFilter.frequency.setValueAtTime(300, now)
        resoFilter.Q.setValueAtTime(8, now)

        this.noiseNode.connect(resoFilter)
        resoFilter.connect(this.noiseGain)
        this.noiseGain.connect(this.ambientGain)
        this.noiseNode.start(now)
        break
      }
      case 'bridge': {
        // Wind whistle on bridge
        const buf = this.createNoiseBuffer(2.0)
        this.noiseNode = this.ctx.createBufferSource()
        this.noiseNode.buffer = buf
        this.noiseNode.loop = true

        this.noiseGain = this.ctx.createGain()
        this.noiseGain.gain.setValueAtTime(0.0001, now)
        this.noiseGain.gain.exponentialRampToValueAtTime(0.05, now + 1.0)

        const bridgeFilter = this.ctx.createBiquadFilter()
        bridgeFilter.type = 'highpass'
        bridgeFilter.frequency.setValueAtTime(800, now)
        bridgeFilter.Q.setValueAtTime(2, now)

        this.noiseNode.connect(bridgeFilter)
        bridgeFilter.connect(this.noiseGain)
        this.noiseGain.connect(this.ambientGain)
        this.noiseNode.start(now)
        break
      }
      default:
        // 'clear' or 'sunrise' — no extra noise, just the pad
        break
    }
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate
    const length = sampleRate * seconds
    const buffer = this.ctx!.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5
    }
    return buffer
  }

  // ── Engine Sound ────────────────────────────────

  public startEngine() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.engineGainNode || this.engineOsc) return

    const now = this.ctx.currentTime

    this.engineGainNode.gain.cancelScheduledValues(now)
    this.engineGainNode.gain.setValueAtTime(0.0001, now)
    this.engineGainNode.gain.exponentialRampToValueAtTime(0.5, now + 0.3)

    this.engineInternalGain = this.ctx.createGain()
    this.engineInternalGain.gain.setValueAtTime(0.08, now)

    this.engineFilter = this.ctx.createBiquadFilter()
    this.engineFilter.type = 'lowpass'
    this.engineFilter.frequency.setValueAtTime(180, now)

    this.engineOsc = this.ctx.createOscillator()
    this.engineOsc.type = 'sawtooth'
    this.engineOsc.frequency.setValueAtTime(45, now)

    // Add sub-harmonic for rumble
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(22.5, now)
    subGain.gain.setValueAtTime(0.04, now)
    subOsc.connect(subGain)
    subGain.connect(this.engineGainNode)
    subOsc.start(now)

    this.engineOsc.connect(this.engineFilter)
    this.engineFilter.connect(this.engineInternalGain)
    this.engineInternalGain.connect(this.engineGainNode)
    this.engineOsc.start(now)
  }

  public setEngineSpeed(speedKmH: number, isAccelerating: boolean) {
    if (!this.enabled) return
    if (!this.ctx || !this.engineOsc || !this.engineFilter || !this.engineInternalGain) return
    const now = this.ctx.currentTime

    const targetFreq = 45 + (speedKmH / 120) * 115 + (isAccelerating ? 15 : 0)
    const targetFilter = 180 + (speedKmH / 120) * 450 + (isAccelerating ? 80 : 0)
    const targetVolume = isAccelerating ? 0.11 : 0.06

    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1)
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.1)
    this.engineInternalGain.gain.setTargetAtTime(targetVolume, now, 0.1)
  }

  public stopEngine() {
    if (!this.engineOsc || !this.ctx) return
    const now = this.ctx.currentTime

    if (this.engineInternalGain) {
      this.engineInternalGain.gain.cancelScheduledValues(now)
      this.engineInternalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
    }

    const oscRef = this.engineOsc
    const filterRef = this.engineFilter
    const gainRef = this.engineInternalGain

    setTimeout(() => {
      try { oscRef?.stop(); oscRef?.disconnect() } catch {}
      try { filterRef?.disconnect() } catch {}
      try { gainRef?.disconnect() } catch {}
    }, 500)

    this.engineOsc = null
    this.engineFilter = null
    this.engineInternalGain = null
  }

  // ── One-Shot SFX ────────────────────────────────

  public playIgnitionSound() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    const starterOsc = this.ctx.createOscillator()
    const starterGain = this.ctx.createGain()
    starterOsc.type = 'sawtooth'
    starterOsc.frequency.setValueAtTime(140, now)
    starterOsc.frequency.exponentialRampToValueAtTime(280, now + 0.35)

    starterGain.gain.setValueAtTime(0.06, now)
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    starterOsc.connect(starterGain)
    starterGain.connect(this.sfxGain)
    starterOsc.start(now)
    starterOsc.stop(now + 0.4)

    setTimeout(() => this.startEngine(), 350)
  }

  public playStartChime() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.1)

      gain.gain.setValueAtTime(0.0001, now + idx * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.1 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.6)

      osc.connect(gain)
      gain.connect(this.sfxGain!)
      osc.start(now + idx * 0.1)
      osc.stop(now + idx * 0.1 + 1.7)
    })
  }

  public playHoverBlip() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04)

    gain.gain.setValueAtTime(0.025, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.06)
  }

  /**
   * Spark collection celebration chime — ascending crystal arpeggio
   */
  public playSparkCollect() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    const sparkNotes = [659.25, 783.99, 987.77, 1318.51]
    sparkNotes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.06)

      gain.gain.setValueAtTime(0.0001, now + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.06 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.8)

      osc.connect(gain)
      gain.connect(this.sfxGain!)
      osc.start(now + i * 0.06)
      osc.stop(now + i * 0.06 + 0.9)
    })
  }

  /**
   * Achievement / trophy reveal fanfare
   */
  public playAchievementFanfare() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    const fanfareNotes = [
      { freq: 523.25, delay: 0, dur: 0.4 },
      { freq: 659.25, delay: 0.15, dur: 0.35 },
      { freq: 783.99, delay: 0.3, dur: 0.4 },
      { freq: 1046.50, delay: 0.5, dur: 0.8 },
    ]

    fanfareNotes.forEach(({ freq, delay, dur }) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + delay)

      gain.gain.setValueAtTime(0.0001, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.07, now + delay + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)

      osc.connect(gain)
      gain.connect(this.sfxGain!)
      osc.start(now + delay)
      osc.stop(now + delay + dur + 0.05)
    })
  }

  /**
   * Character encounter gentle notification
   */
  public playCharacterMeet() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime

    // Warm two-note ping
    const notes = [392.00, 523.25]
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.12)

      gain.gain.setValueAtTime(0.0001, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.04, now + i * 0.12 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.6)

      osc.connect(gain)
      gain.connect(this.sfxGain!)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.65)
    })
  }
}

export const audioEngine = new AudioEngine()
