/**
 * Web Audio Ambient & Motorcycle Sound Generator
 * Generates cinematic ambient music, engine throttle, and UI audio without external audio dependencies.
 */

class AudioEngine {
  private ctx: AudioContext | null = null
  private isPlaying = false
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []

  // Engine sound nodes
  private engineGain: GainNode | null = null
  private engineOsc: OscillatorNode | null = null
  private engineFilter: BiquadFilterNode | null = null

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public playAmbient() {
    this.initContext()
    if (!this.ctx || !this.masterGain || this.isPlaying) return

    this.isPlaying = true
    const now = this.ctx.currentTime

    // Fade in master volume
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(0.001, now)
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 3)

    // Cinematic chord frequencies: D minor 9th (D2, A2, F3, C4, E4)
    const freqs = [73.42, 110.0, 174.61, 261.63, 329.63]

    this.oscillators = freqs.map((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      const filter = this.ctx!.createBiquadFilter()

      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      // Slow organic detune / chorus
      const lfo = this.ctx!.createOscillator()
      const lfoGain = this.ctx!.createGain()
      lfo.frequency.value = 0.1 + i * 0.05
      lfoGain.gain.value = 1.2
      lfo.connect(osc.detune)
      lfo.start(now)

      // Low pass filter
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450 + i * 120, now)

      gain.gain.setValueAtTime(0.08 / (i + 1), now)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain!)
      osc.start(now)

      return osc
    })
  }

  public stopAmbient() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return

    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop()
          osc.disconnect()
        } catch {
          // ignore
        }
      })
      this.oscillators = []
      this.isPlaying = false
    }, 1300)
  }

  public playIgnitionSound() {
    this.initContext()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // Starter motor whir / spark
    const starterOsc = this.ctx.createOscillator()
    const starterGain = this.ctx.createGain()
    starterOsc.type = 'sawtooth'
    starterOsc.frequency.setValueAtTime(140, now)
    starterOsc.frequency.exponentialRampToValueAtTime(280, now + 0.35)

    starterGain.gain.setValueAtTime(0.08, now)
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    starterOsc.connect(starterGain)
    starterGain.connect(this.ctx.destination)
    starterOsc.start(now)
    starterOsc.stop(now + 0.4)

    // Engine roar to life at t + 0.35
    setTimeout(() => {
      this.startEngine()
    }, 350)
  }

  public startEngine() {
    this.initContext()
    if (!this.ctx || this.engineOsc) return
    const now = this.ctx.currentTime

    this.engineGain = this.ctx.createGain()
    this.engineGain.gain.setValueAtTime(0.01, now)
    this.engineGain.gain.exponentialRampToValueAtTime(0.09, now + 0.4)

    this.engineFilter = this.ctx.createBiquadFilter()
    this.engineFilter.type = 'lowpass'
    this.engineFilter.frequency.setValueAtTime(180, now)

    this.engineOsc = this.ctx.createOscillator()
    this.engineOsc.type = 'sawtooth'
    this.engineOsc.frequency.setValueAtTime(45, now)

    this.engineOsc.connect(this.engineFilter)
    this.engineFilter.connect(this.engineGain)
    this.engineGain.connect(this.ctx.destination)
    this.engineOsc.start(now)
  }

  public setEngineSpeed(speedKmH: number, isAccelerating: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineFilter || !this.engineGain) return
    const now = this.ctx.currentTime

    // Target frequency ranges from 45Hz idle to 160Hz high rev
    const targetFreq = 45 + (speedKmH / 120) * 115 + (isAccelerating ? 15 : 0)
    const targetFilter = 180 + (speedKmH / 120) * 450 + (isAccelerating ? 80 : 0)
    const targetVolume = isAccelerating ? 0.12 : 0.07

    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1)
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.1)
    this.engineGain.gain.setTargetAtTime(targetVolume, now, 0.1)
  }

  public stopEngine() {
    if (!this.engineOsc || !this.engineGain || !this.ctx) return
    const now = this.ctx.currentTime
    this.engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
    setTimeout(() => {
      try {
        this.engineOsc?.stop()
        this.engineOsc?.disconnect()
      } catch {
        // ignore
      }
      this.engineOsc = null
      this.engineGain = null
      this.engineFilter = null
    }, 550)
  }

  public playStartChime() {
    this.initContext()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const notes = [440, 554.37, 659.25, 880, 1108.73]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(0.001, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.4)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 1.5)
    })
  }

  public playHoverBlip() {
    this.initContext()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04)

    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)
  }
}

export const audioEngine = new AudioEngine()
