// Roland TB-303 Filter Emulation
// Iconic acid bass filter from the legendary TB-303 Bass Line
// Creates squelchy, growling, resonant bass sounds

/**
 * TB-303 Filter Algorithm
 *
 * The TB-303 uses a unique 18dB/octave (3-pole) lowpass filter
 * with strong non-linear behavior and envelope modulation.
 *
 * Key characteristics:
 * - 3-pole (18dB/octave) lowpass
 * - Strong resonance with non-linear feedback
 * - Envelope modulation (Env Mod)
 * - Accent for dynamic control
 * - Characteristic "squelch" and "growl"
 */

export interface TB303FilterSettings {
  // Filter parameters
  cutoff: number          // Base cutoff frequency (20-10000 Hz)
  resonance: number       // Resonance amount (0-1)
  envMod: number         // Envelope modulation amount (0-1)

  // Envelope
  decay: number          // Envelope decay time (0.01-2.0 seconds)

  // Accent and dynamics
  accent: number         // Accent amount (0-1)

  // Distortion/Overdrive
  overdrive: number      // Overdrive amount (0-1)

  // Output
  volume: number         // Output level (0-1)
}

// TB-303 presets for different acid bass styles
export const TB303_PRESETS: { [key: string]: TB303FilterSettings } = {
  // Classic acid house squelch
  acid_classic: {
    cutoff: 800,
    resonance: 0.8,
    envMod: 0.7,
    decay: 0.3,
    accent: 0.6,
    overdrive: 0.3,
    volume: 0.9
  },

  // Deep acid bass
  acid_deep: {
    cutoff: 400,
    resonance: 0.7,
    envMod: 0.6,
    decay: 0.5,
    accent: 0.4,
    overdrive: 0.2,
    volume: 0.95
  },

  // Aggressive squelch
  acid_aggressive: {
    cutoff: 1200,
    resonance: 0.9,
    envMod: 0.85,
    decay: 0.2,
    accent: 0.8,
    overdrive: 0.5,
    volume: 0.85
  },

  // Smooth acid lead
  acid_smooth: {
    cutoff: 1000,
    resonance: 0.6,
    envMod: 0.5,
    decay: 0.4,
    accent: 0.3,
    overdrive: 0.15,
    volume: 1.0
  },

  // Percussive bass
  acid_percussive: {
    cutoff: 600,
    resonance: 0.75,
    envMod: 0.9,
    decay: 0.15,
    accent: 0.7,
    overdrive: 0.4,
    volume: 0.9
  },

  // Wobble bass (dubstep-style)
  acid_wobble: {
    cutoff: 500,
    resonance: 0.85,
    envMod: 0.8,
    decay: 0.25,
    accent: 0.5,
    overdrive: 0.35,
    volume: 0.88
  },

  // House bass (warm)
  house_303: {
    cutoff: 700,
    resonance: 0.65,
    envMod: 0.55,
    decay: 0.35,
    accent: 0.4,
    overdrive: 0.25,
    volume: 0.92
  }
}

export class TB303Filter {
  private ctx: AudioContext
  private settings: TB303FilterSettings

  // Filter stages (3-pole = 3 stages for 18dB/oct)
  private filters: BiquadFilterNode[] = []
  private feedbackGain: GainNode
  private overdriveNode: WaveShaperNode
  private inputGain: GainNode
  private outputGain: GainNode

  // Input/Output
  private input: GainNode
  private output: GainNode

  constructor(ctx: AudioContext, settings: TB303FilterSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.inputGain = ctx.createGain()
    this.feedbackGain = ctx.createGain()
    this.overdriveNode = ctx.createWaveShaper()
    this.outputGain = ctx.createGain()

    // Create 3 lowpass filter stages (3-pole for 18dB/oct)
    for (let i = 0; i < 3; i++) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = settings.cutoff
      filter.Q.value = 0.7 // Moderate Q per stage
      this.filters.push(filter)
    }

    // Setup input gain (accent effect)
    this.inputGain.gain.value = 1 + settings.accent * 0.5

    // Setup overdrive
    this.overdriveNode.curve = this.createOverdriveCurve(settings.overdrive)
    this.overdriveNode.oversample = '4x'

    // Setup resonance (feedback)
    const feedbackAmount = Math.min(settings.resonance * 3.5, 3.2)
    this.feedbackGain.gain.value = feedbackAmount

    // Output level compensation
    const compensation = 1 - settings.resonance * 0.4
    this.outputGain.gain.value = settings.volume * compensation

    // Connect the 303 filter chain:
    // Input -> InputGain -> Overdrive -> Filter1 -> Filter2 -> Filter3 -> Output
    this.input.connect(this.inputGain)
    this.inputGain.connect(this.overdriveNode)
    this.overdriveNode.connect(this.filters[0])

    for (let i = 0; i < 2; i++) {
      this.filters[i].connect(this.filters[i + 1])
    }

    this.filters[2].connect(this.outputGain)
    this.outputGain.connect(this.output)

    // Feedback path for resonance
    if (settings.resonance > 0) {
      this.filters[2].connect(this.feedbackGain)
      this.feedbackGain.connect(this.filters[0])
    }
  }

  /**
   * Create TB-303 style overdrive curve
   * TB-303 has characteristic soft clipping
   */
  private createOverdriveCurve(amount: number): Float32Array<ArrayBuffer> {
    const samples = 2048
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      const drive = 1 + amount * 5

      // Soft clipping with asymmetry (like real 303)
      if (x > 0) {
        curve[i] = Math.tanh(x * drive * 1.2) / Math.tanh(drive * 1.2)
      } else {
        curve[i] = Math.tanh(x * drive) / Math.tanh(drive)
      }
    }

    return curve as Float32Array<ArrayBuffer>
  }

  /**
   * Set cutoff frequency
   */
  setCutoff(frequency: number) {
    this.settings.cutoff = frequency
    this.filters.forEach(filter => {
      filter.frequency.value = frequency
    })
  }

  /**
   * Set resonance
   */
  setResonance(resonance: number) {
    this.settings.resonance = Math.min(Math.max(resonance, 0), 0.99)
    const feedbackAmount = Math.min(this.settings.resonance * 3.5, 3.2)
    this.feedbackGain.gain.value = feedbackAmount

    // Adjust output compensation
    const compensation = 1 - this.settings.resonance * 0.4
    this.outputGain.gain.value = this.settings.volume * compensation
  }

  /**
   * Trigger filter envelope (for each note)
   * This is the key to the TB-303 sound!
   */
  triggerEnvelope(startTime: number, velocity: number = 1.0) {
    const { cutoff, envMod, decay, accent } = this.settings

    // Calculate envelope amount
    const envAmount = envMod * 5000 * velocity // Scale by velocity
    const accentAmount = 1 + accent * velocity * 0.5
    const peakCutoff = Math.min(cutoff + envAmount * accentAmount, 20000)

    // Envelope: instant attack, exponential decay
    this.filters.forEach(filter => {
      filter.frequency.cancelScheduledValues(startTime)
      filter.frequency.setValueAtTime(peakCutoff, startTime)
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(cutoff, 20),
        startTime + decay
      )
    })

    // Accent also affects input gain
    if (accent > 0) {
      const accentGain = 1 + accent * velocity * 0.5
      this.inputGain.gain.cancelScheduledValues(startTime)
      this.inputGain.gain.setValueAtTime(accentGain, startTime)
      this.inputGain.gain.exponentialRampToValueAtTime(1.0, startTime + decay * 0.5)
    }
  }

  /**
   * Animate cutoff sweep (for LFO or automation)
   */
  animateCutoff(startFreq: number, endFreq: number, startTime: number, duration: number) {
    this.filters.forEach(filter => {
      filter.frequency.setValueAtTime(startFreq, startTime)
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(endFreq, 20),
        startTime + duration
      )
    })
  }

  /**
   * Create classic TB-303 pattern with slides
   */
  playPattern(notes: Array<{ time: number; freq: number; accent: boolean; slide: boolean }>, startTime: number) {
    notes.forEach((note, i) => {
      const noteTime = startTime + note.time
      const velocity = note.accent ? 1.0 : 0.7

      // Trigger envelope
      this.triggerEnvelope(noteTime, velocity)

      // Handle slide (portamento between notes)
      if (note.slide && i < notes.length - 1) {
        const nextNote = notes[i + 1]
        const slideTime = nextNote.time - note.time
        // Note: Frequency slide would be handled at oscillator level
        // This is just for reference
      }
    })
  }

  connect(destination: AudioNode) {
    this.output.connect(destination)
  }

  disconnect() {
    this.output.disconnect()
  }

  getInput(): AudioNode {
    return this.input
  }

  getOutput(): AudioNode {
    return this.output
  }
}

/**
 * Helper function to get TB-303 preset
 */
export function getTB303Preset(presetId: string): TB303FilterSettings | undefined {
  return TB303_PRESETS[presetId]
}

/**
 * Apply TB-303 filter to audio source
 */
export function applyTB303Filter(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): TB303Filter {
  const preset = getTB303Preset(presetId)
  if (!preset) {
    console.error(`TB-303 preset not found: ${presetId}`)
    source.connect(destination)
    return new TB303Filter(ctx, TB303_PRESETS['acid_classic'])
  }

  const filter = new TB303Filter(ctx, preset)
  source.connect(filter.getInput())
  filter.connect(destination)

  return filter
}

/**
 * Create classic acid bassline with TB-303 filter
 */
export function createAcidBassline(
  ctx: AudioContext,
  oscillator: OscillatorNode,
  presetId: string,
  startTime: number,
  notes: Array<{ time: number; freq: number; accent: boolean; duration: number }>,
  destination: AudioNode
): TB303Filter {
  const filter = applyTB303Filter(ctx, oscillator, presetId, destination)

  // Trigger envelope for each note
  notes.forEach(note => {
    filter.triggerEnvelope(startTime + note.time, note.accent ? 1.0 : 0.7)
  })

  return filter
}

console.log('🎹 Roland TB-303 Filter Emulation Loaded')
console.log(`   Presets: ${Object.keys(TB303_PRESETS).length}`)
console.log('   Type: 3-pole (18dB/oct) lowpass with envelope')
console.log('   Features: Envelope modulation, Accent, Resonance, Overdrive')
console.log('   Perfect for: Acid house, Acid techno, Squelchy bass')
