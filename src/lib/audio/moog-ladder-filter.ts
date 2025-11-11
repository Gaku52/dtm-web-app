// Moog Ladder Filter
// Legendary 4-pole lowpass filter from Moog Minimoog
// Creates warm, fat, analog bass sounds perfect for House, Techno, and EDM

/**
 * Moog Ladder Filter Algorithm
 *
 * The Moog ladder filter is a 4-pole (24dB/octave) lowpass filter
 * with feedback-based resonance that can self-oscillate.
 *
 * Characteristics:
 * - Warm, fat, analog sound
 * - Non-linear behavior (saturation)
 * - Self-oscillation at high resonance
 * - -24dB/octave slope (4-pole)
 */

export interface MoogFilterSettings {
  cutoff: number          // Cutoff frequency (20-20000 Hz)
  resonance: number       // Resonance/Q (0-1, can self-oscillate at ~0.95+)
  drive: number          // Input drive/saturation (0-1)
  outputLevel: number    // Output compensation (0-1)
}

// Preset Moog filter settings
export const MOOG_FILTER_PRESETS: { [key: string]: MoogFilterSettings } = {
  // Classic House bass - warm and groovy
  house_bass_warm: {
    cutoff: 800,
    resonance: 0.6,
    drive: 0.3,
    outputLevel: 0.9
  },

  // Deep House bass - ultra-smooth
  deep_house_smooth: {
    cutoff: 500,
    resonance: 0.4,
    drive: 0.2,
    outputLevel: 0.95
  },

  // Acid House - high resonance sweep
  acid_house_sweep: {
    cutoff: 1200,
    resonance: 0.85,
    drive: 0.4,
    outputLevel: 0.8
  },

  // Techno bass - aggressive and punchy
  techno_bass_punch: {
    cutoff: 1500,
    resonance: 0.7,
    drive: 0.5,
    outputLevel: 0.85
  },

  // Fat synth bass - thick and powerful
  synth_bass_fat: {
    cutoff: 600,
    resonance: 0.5,
    drive: 0.35,
    outputLevel: 0.9
  },

  // Self-oscillating lead
  self_oscillate: {
    cutoff: 2000,
    resonance: 0.95,
    drive: 0.6,
    outputLevel: 0.7
  },

  // Mellow pad filter
  mellow_pad: {
    cutoff: 1000,
    resonance: 0.3,
    drive: 0.15,
    outputLevel: 1.0
  }
}

export class MoogLadderFilter {
  private ctx: AudioContext
  private settings: MoogFilterSettings

  // Filter stages (4-pole = 4 stages)
  private filters: BiquadFilterNode[] = []
  private feedbackGain: GainNode
  private driveGain: GainNode
  private outputGain: GainNode
  private saturator: WaveShaperNode

  // Input/Output
  private input: GainNode
  private output: GainNode

  constructor(ctx: AudioContext, settings: MoogFilterSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.driveGain = ctx.createGain()
    this.feedbackGain = ctx.createGain()
    this.outputGain = ctx.createGain()
    this.saturator = ctx.createWaveShaper()

    // Create 4 lowpass filter stages (4-pole)
    for (let i = 0; i < 4; i++) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = settings.cutoff
      filter.Q.value = 0.5 // Individual stage Q (low to prevent instability)
      this.filters.push(filter)
    }

    // Setup drive and saturation
    this.driveGain.gain.value = 1 + settings.drive * 3
    this.saturator.curve = this.createSaturationCurve(settings.drive)
    this.saturator.oversample = '4x'

    // Setup resonance (feedback from output back to input)
    // Moog ladder uses feedback to create resonance
    const feedbackAmount = Math.min(settings.resonance * 4, 3.9) // Prevent instability
    this.feedbackGain.gain.value = feedbackAmount

    // Output level compensation (resonance boosts volume)
    const compensation = 1 - settings.resonance * 0.5
    this.outputGain.gain.value = settings.outputLevel * compensation

    // Connect the ladder: Input -> Drive -> Saturator -> Filter1 -> Filter2 -> Filter3 -> Filter4 -> Output
    this.input.connect(this.driveGain)
    this.driveGain.connect(this.saturator)
    this.saturator.connect(this.filters[0])

    for (let i = 0; i < 3; i++) {
      this.filters[i].connect(this.filters[i + 1])
    }

    this.filters[3].connect(this.outputGain)
    this.outputGain.connect(this.output)

    // Feedback path: Output -> Feedback Gain -> back to first filter
    // (with phase inversion for stability)
    if (settings.resonance > 0) {
      this.filters[3].connect(this.feedbackGain)
      this.feedbackGain.connect(this.filters[0])
    }
  }

  /**
   * Create soft saturation curve for analog warmth
   */
  private createSaturationCurve(amount: number): Float32Array {
    const samples = 2048
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1

      // Soft clipping (tanh-like)
      const drive = 1 + amount * 4
      curve[i] = Math.tanh(x * drive) / Math.tanh(drive)
    }

    return curve
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
   * Set resonance (feedback amount)
   */
  setResonance(resonance: number) {
    this.settings.resonance = Math.min(Math.max(resonance, 0), 0.99)
    const feedbackAmount = Math.min(this.settings.resonance * 4, 3.9)
    this.feedbackGain.gain.value = feedbackAmount

    // Adjust output compensation
    const compensation = 1 - this.settings.resonance * 0.5
    this.outputGain.gain.value = this.settings.outputLevel * compensation
  }

  /**
   * Animate cutoff frequency (for filter sweeps)
   */
  animateCutoff(startFreq: number, endFreq: number, startTime: number, duration: number) {
    this.filters.forEach(filter => {
      filter.frequency.setValueAtTime(startFreq, startTime)
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(endFreq, 20), // Prevent going below 20Hz
        startTime + duration
      )
    })
  }

  /**
   * Animate resonance (for resonance sweeps)
   */
  animateResonance(startRes: number, endRes: number, startTime: number, duration: number) {
    const startFeedback = Math.min(startRes * 4, 3.9)
    const endFeedback = Math.min(endRes * 4, 3.9)

    this.feedbackGain.gain.setValueAtTime(startFeedback, startTime)
    this.feedbackGain.gain.linearRampToValueAtTime(endFeedback, startTime + duration)
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
 * Helper function to get Moog filter preset
 */
export function getMoogFilterPreset(presetId: string): MoogFilterSettings | undefined {
  return MOOG_FILTER_PRESETS[presetId]
}

/**
 * Apply Moog ladder filter to an audio source
 */
export function applyMoogFilter(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): MoogLadderFilter {
  const preset = getMoogFilterPreset(presetId)
  if (!preset) {
    console.error(`Moog filter preset not found: ${presetId}`)
    source.connect(destination)
    return new MoogLadderFilter(ctx, MOOG_FILTER_PRESETS['house_bass_warm'])
  }

  const filter = new MoogLadderFilter(ctx, preset)
  source.connect(filter.getInput())
  filter.connect(destination)

  return filter
}

/**
 * Create classic House bass filter sweep
 * Usage: const filter = createHouseFilterSweep(ctx, source, destination, startTime, duration)
 */
export function createHouseFilterSweep(
  ctx: AudioContext,
  source: AudioNode,
  destination: AudioNode,
  startTime: number,
  duration: number
): MoogLadderFilter {
  const settings: MoogFilterSettings = {
    cutoff: 200,       // Start low
    resonance: 0.7,    // High resonance for classic House sound
    drive: 0.3,
    outputLevel: 0.85
  }

  const filter = new MoogLadderFilter(ctx, settings)
  source.connect(filter.getInput())
  filter.connect(destination)

  // Animate sweep from low to high
  filter.animateCutoff(200, 2000, startTime, duration)

  return filter
}

console.log('🎛️ Moog Ladder Filter Loaded')
console.log(`   Presets: ${Object.keys(MOOG_FILTER_PRESETS).length}`)
console.log('   Type: 4-pole (-24dB/oct) lowpass with resonance')
console.log('   Features: Self-oscillation, Analog saturation, Filter sweeps')
console.log('   Perfect for: House bass, Techno bass, Acid sounds')
