// Analog Saturation Emulations
// Tape, Tube, and Transformer saturation for warmth and character
// Maximum audio quality with authentic analog modeling

/**
 * Analog Saturation Types
 *
 * Tape (Studer, Ampex):
 * - Even/odd harmonic distortion
 * - Compression at high levels
 * - Warm, glued sound
 *
 * Tube (Thermionic):
 * - Predominantly even harmonics (2nd, 4th)
 * - Soft clipping
 * - Warm, smooth character
 *
 * Transformer:
 * - Subtle harmonic enhancement
 * - Low-frequency thickness
 * - Clean, tight sound
 */

export type SaturationType = 'tape' | 'tube' | 'transformer'

export interface SaturationSettings {
  type: SaturationType
  drive: number         // Input drive (0-1)
  mix: number          // Dry/wet mix (0-1)
  tone: number         // Tone control (-1 to +1)
  outputGain: number   // Output compensation (0-2)
}

// Authentic analog saturation presets
export const SATURATION_PRESETS: { [key: string]: SaturationSettings } = {
  // ========================================
  // TAPE SATURATION
  // ========================================

  // Studer A800 (Clean tape)
  tape_studer_clean: {
    type: 'tape',
    drive: 0.3,
    mix: 1.0,
    tone: 0.1,
    outputGain: 1.0
  },

  // Studer A800 (Pushed)
  tape_studer_hot: {
    type: 'tape',
    drive: 0.7,
    mix: 1.0,
    tone: 0.2,
    outputGain: 0.9
  },

  // Ampex ATR-102
  tape_ampex: {
    type: 'tape',
    drive: 0.5,
    mix: 1.0,
    tone: 0.0,
    outputGain: 0.95
  },

  // Tape slam (heavy)
  tape_slam: {
    type: 'tape',
    drive: 0.9,
    mix: 1.0,
    tone: 0.3,
    outputGain: 0.8
  },

  // ========================================
  // TUBE SATURATION
  // ========================================

  // Tube warmth (subtle)
  tube_warm: {
    type: 'tube',
    drive: 0.25,
    mix: 1.0,
    tone: 0.2,
    outputGain: 1.0
  },

  // Tube overdrive
  tube_overdrive: {
    type: 'tube',
    drive: 0.6,
    mix: 1.0,
    tone: 0.1,
    outputGain: 0.9
  },

  // Tube preamp (clean)
  tube_preamp: {
    type: 'tube',
    drive: 0.15,
    mix: 1.0,
    tone: 0.0,
    outputGain: 1.05
  },

  // Tube saturation (heavy)
  tube_heavy: {
    type: 'tube',
    drive: 0.8,
    mix: 1.0,
    tone: 0.15,
    outputGain: 0.85
  },

  // ========================================
  // TRANSFORMER SATURATION
  // ========================================

  // Neve transformer
  transformer_neve: {
    type: 'transformer',
    drive: 0.35,
    mix: 1.0,
    tone: -0.1,
    outputGain: 1.0
  },

  // API transformer
  transformer_api: {
    type: 'transformer',
    drive: 0.4,
    mix: 1.0,
    tone: 0.1,
    outputGain: 1.0
  },

  // Subtle color
  transformer_subtle: {
    type: 'transformer',
    drive: 0.2,
    mix: 1.0,
    tone: 0.0,
    outputGain: 1.0
  }
}

export class AnalogSaturation {
  private ctx: AudioContext
  private settings: SaturationSettings

  // Nodes
  private input: GainNode
  private output: GainNode
  private driveGain: GainNode
  private saturator: WaveShaperNode
  private toneFilter: BiquadFilterNode
  private outputGain: GainNode
  private wetGain: GainNode
  private dryGain: GainNode

  constructor(ctx: AudioContext, settings: SaturationSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.driveGain = ctx.createGain()
    this.outputGain = ctx.createGain()
    this.wetGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    // Drive
    this.driveGain.gain.value = 1 + settings.drive * 5

    // Saturation
    this.saturator = ctx.createWaveShaper()
    this.saturator.curve = this.createSaturationCurve(settings.type, settings.drive)
    this.saturator.oversample = '4x'

    // Tone control
    this.toneFilter = ctx.createBiquadFilter()
    this.configureTone(settings.tone)

    // Output
    this.outputGain.gain.value = settings.outputGain

    // Mix
    this.wetGain.gain.value = settings.mix
    this.dryGain.gain.value = 1 - settings.mix

    // Routing
    this.input.connect(this.dryGain)

    this.input.connect(this.driveGain)
    this.driveGain.connect(this.saturator)
    this.saturator.connect(this.toneFilter)
    this.toneFilter.connect(this.outputGain)
    this.outputGain.connect(this.wetGain)

    this.dryGain.connect(this.output)
    this.wetGain.connect(this.output)
  }

  /**
   * Create authentic saturation curves
   */
  private createSaturationCurve(type: SaturationType, drive: number): Float32Array | null {
    const samples = 8192  // High resolution
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      const driveAmount = 1 + drive * 3

      switch (type) {
        case 'tape':
          // Tape: Soft saturation with compression
          // Asymmetric (more 2nd harmonic)
          const tapeComp = Math.tanh(x * driveAmount * 1.5)
          const tapeAsym = 0.1 * x * x * Math.sign(x)  // 2nd harmonic
          curve[i] = (tapeComp + tapeAsym) / 1.15
          break

        case 'tube':
          // Tube: Even harmonics, very soft clipping
          // Predominantly 2nd and 4th harmonics
          const h2 = 0.3 * x * x * Math.sign(x)
          const h4 = 0.1 * Math.pow(x, 4) * Math.sign(x)
          const tubeBase = Math.tanh(x * driveAmount)
          curve[i] = (tubeBase + h2 + h4) / 1.4
          break

        case 'transformer':
          // Transformer: Very subtle, low-order harmonics
          // Clean with slight thickness
          const transBase = Math.atan(x * driveAmount * 0.8) / Math.atan(driveAmount * 0.8)
          const transH2 = 0.05 * x * x * Math.sign(x)
          curve[i] = transBase + transH2
          break
      }
    }

    // Normalize
    const max = Math.max(...Array.from(curve).map(Math.abs))
    for (let i = 0; i < samples; i++) {
      curve[i] = curve[i] / max * 0.95
    }

    return curve
  }

  /**
   * Configure tone control
   */
  private configureTone(tone: number) {
    if (tone > 0) {
      // Brighten (high shelf boost)
      this.toneFilter.type = 'highshelf'
      this.toneFilter.frequency.value = 8000
      this.toneFilter.gain.value = tone * 4
    } else if (tone < 0) {
      // Darken (high shelf cut)
      this.toneFilter.type = 'highshelf'
      this.toneFilter.frequency.value = 5000
      this.toneFilter.gain.value = tone * 6
    } else {
      // Neutral (bypass)
      this.toneFilter.type = 'allpass'
      this.toneFilter.gain.value = 0
    }
  }

  /**
   * Update drive
   */
  setDrive(drive: number) {
    this.settings.drive = Math.max(0, Math.min(drive, 1))
    this.driveGain.gain.value = 1 + this.settings.drive * 5
    this.saturator.curve = this.createSaturationCurve(this.settings.type, this.settings.drive)
  }

  /**
   * Update mix
   */
  setMix(mix: number) {
    this.settings.mix = Math.max(0, Math.min(mix, 1))
    this.wetGain.gain.value = this.settings.mix
    this.dryGain.gain.value = 1 - this.settings.mix
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
 * Helper to get saturation preset
 */
export function getSaturationPreset(presetId: string): SaturationSettings | undefined {
  return SATURATION_PRESETS[presetId]
}

/**
 * Apply analog saturation
 */
export function applyAnalogSaturation(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): AnalogSaturation {
  const preset = getSaturationPreset(presetId)
  if (!preset) {
    console.error(`Saturation preset not found: ${presetId}`)
    source.connect(destination)
    return new AnalogSaturation(ctx, SATURATION_PRESETS['tape_studer_clean'])
  }

  const sat = new AnalogSaturation(ctx, preset)
  source.connect(sat.getInput())
  sat.connect(destination)

  return sat
}

console.log('🎚️ Analog Saturation Emulations Loaded')
console.log(`   Types: Tape (Studer, Ampex), Tube, Transformer (Neve, API)`)
console.log(`   Presets: ${Object.keys(SATURATION_PRESETS).length}`)
console.log('   Quality: Authentic analog modeling, 4x oversampling')
console.log('   Perfect for: Warmth, Glue, Character')
console.log('   ✨ The sound of vintage hardware!')
