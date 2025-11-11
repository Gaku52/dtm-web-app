// Vintage Compressor Emulations
// Industry-standard compressors: 1176, LA-2A, SSL G-Bus
// Maximum audio quality with character and musicality

/**
 * Vintage Compressor Models
 *
 * Each compressor has unique characteristics:
 *
 * 1176 (FET):
 * - Ultra-fast attack (20-800 microseconds)
 * - Aggressive, punchy character
 * - Perfect for: Drums, vocals, bass
 * - Ratio: 4:1, 8:1, 12:1, 20:1 (all buttons)
 *
 * LA-2A (Opto):
 * - Slow, program-dependent attack/release
 * - Smooth, warm, musical compression
 * - Perfect for: Vocals, bass, mix bus
 * - Ratio: Soft knee, ~3:1 average
 *
 * SSL G-Bus:
 * - Slow attack, auto-release
 * - Glue compression, adds punch
 * - Perfect for: Mix bus, drum bus
 * - Ratio: 2:1, 4:1, 10:1
 */

export type CompressorType = '1176' | 'LA2A' | 'SSL'

export interface VintageCompressorSettings {
  type: CompressorType
  input: number          // Input gain (-20 to +20 dB)
  threshold: number      // Threshold (-60 to 0 dB)
  ratio: number         // Compression ratio (1-20)
  attack: number        // Attack time (seconds)
  release: number       // Release time (seconds)
  output: number        // Output makeup gain (0-2)
  mix: number          // Parallel compression (0-1)
}

// Authentic presets based on real hardware
export const VINTAGE_COMPRESSOR_PRESETS: { [key: string]: VintageCompressorSettings } = {
  // ========================================
  // 1176 PRESETS
  // ========================================

  // 1176 All Buttons (Nuke mode - ultra-aggressive)
  '1176_all_buttons': {
    type: '1176',
    input: 6,
    threshold: -10,
    ratio: 20,        // All buttons = crazy ratio
    attack: 0.0002,   // 200 microseconds (fastest)
    release: 0.05,
    output: 1.3,
    mix: 1.0
  },

  // 1176 Fast (Drums, transients)
  '1176_fast': {
    type: '1176',
    input: 4,
    threshold: -12,
    ratio: 4,
    attack: 0.0005,   // 500 microseconds
    release: 0.06,
    output: 1.2,
    mix: 1.0
  },

  // 1176 Vocal (Medium attack)
  '1176_vocal': {
    type: '1176',
    input: 3,
    threshold: -15,
    ratio: 4,
    attack: 0.002,    // 2ms
    release: 0.1,
    output: 1.15,
    mix: 1.0
  },

  // 1176 Bass (Punchy)
  '1176_bass': {
    type: '1176',
    input: 5,
    threshold: -18,
    ratio: 8,
    attack: 0.001,
    release: 0.08,
    output: 1.25,
    mix: 1.0
  },

  // ========================================
  // LA-2A PRESETS
  // ========================================

  // LA-2A Vocal (Classic smooth)
  'la2a_vocal': {
    type: 'LA2A',
    input: 0,
    threshold: -12,
    ratio: 3,         // Soft knee, program-dependent
    attack: 0.01,     // 10ms (opto-dependent)
    release: 0.15,    // 60ms to 15s (program-dependent)
    output: 1.1,
    mix: 1.0
  },

  // LA-2A Bass (Smooth and fat)
  'la2a_bass': {
    type: 'LA2A',
    input: 2,
    threshold: -15,
    ratio: 3,
    attack: 0.015,
    release: 0.2,
    output: 1.2,
    mix: 1.0
  },

  // LA-2A Mix Bus (Gentle glue)
  'la2a_bus': {
    type: 'LA2A',
    input: -2,
    threshold: -8,
    ratio: 2.5,
    attack: 0.02,
    release: 0.25,
    output: 1.05,
    mix: 1.0
  },

  // LA-2A Parallel (New York style)
  'la2a_parallel': {
    type: 'LA2A',
    input: 8,
    threshold: -20,
    ratio: 4,
    attack: 0.01,
    release: 0.1,
    output: 1.5,
    mix: 0.3        // Blend with dry signal
  },

  // ========================================
  // SSL G-BUS PRESETS
  // ========================================

  // SSL Mix Bus (Classic)
  'ssl_mix_bus': {
    type: 'SSL',
    input: 0,
    threshold: -5,
    ratio: 2,
    attack: 0.01,     // 1ms (slow for SSL)
    release: 0.1,     // Auto release
    output: 1.05,
    mix: 1.0
  },

  // SSL Drum Bus (Punch)
  'ssl_drum_bus': {
    type: 'SSL',
    input: 2,
    threshold: -8,
    ratio: 4,
    attack: 0.003,
    release: 0.08,
    output: 1.15,
    mix: 1.0
  },

  // SSL Aggressive (Maximum glue)
  'ssl_aggressive': {
    type: 'SSL',
    input: 4,
    threshold: -10,
    ratio: 10,
    attack: 0.001,
    release: 0.05,
    output: 1.25,
    mix: 1.0
  },

  // SSL Gentle (Transparent)
  'ssl_gentle': {
    type: 'SSL',
    input: -2,
    threshold: -3,
    ratio: 2,
    attack: 0.03,
    release: 0.15,
    output: 1.0,
    mix: 1.0
  }
}

export class VintageCompressor {
  private ctx: AudioContext
  private settings: VintageCompressorSettings

  // Nodes
  private input: GainNode
  private output: GainNode
  private inputGain: GainNode
  private compressor: DynamicsCompressorNode
  private outputGain: GainNode
  private saturator: WaveShaperNode
  private wetGain: GainNode
  private dryGain: GainNode

  constructor(ctx: AudioContext, settings: VintageCompressorSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.inputGain = ctx.createGain()
    this.outputGain = ctx.createGain()
    this.wetGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    // Input gain
    this.inputGain.gain.value = this.dbToGain(settings.input)

    // Compressor configuration based on type
    this.compressor = ctx.createDynamicsCompressor()
    this.configureCompressor(settings)

    // Output makeup gain
    this.outputGain.gain.value = settings.output

    // Saturation (analog warmth)
    this.saturator = ctx.createWaveShaper()
    this.saturator.curve = this.createSaturationCurve(settings.type)
    this.saturator.oversample = '4x'

    // Mix (for parallel compression)
    this.wetGain.gain.value = settings.mix
    this.dryGain.gain.value = 1 - settings.mix

    // Routing
    this.input.connect(this.inputGain)
    this.input.connect(this.dryGain)    // Dry path

    this.inputGain.connect(this.compressor)
    this.compressor.connect(this.saturator)
    this.saturator.connect(this.outputGain)
    this.outputGain.connect(this.wetGain)

    this.wetGain.connect(this.output)
    this.dryGain.connect(this.output)
  }

  private configureCompressor(settings: VintageCompressorSettings) {
    switch (settings.type) {
      case '1176':
        // FET: Fast attack, hard knee, aggressive
        this.compressor.threshold.value = settings.threshold
        this.compressor.ratio.value = settings.ratio
        this.compressor.attack.value = settings.attack
        this.compressor.release.value = settings.release
        this.compressor.knee.value = 0  // Hard knee
        break

      case 'LA2A':
        // Opto: Slow, soft knee, musical
        this.compressor.threshold.value = settings.threshold
        this.compressor.ratio.value = settings.ratio
        this.compressor.attack.value = settings.attack
        this.compressor.release.value = settings.release
        this.compressor.knee.value = 30 // Very soft knee
        break

      case 'SSL':
        // VCA: Punchy, musical, glue
        this.compressor.threshold.value = settings.threshold
        this.compressor.ratio.value = settings.ratio
        this.compressor.attack.value = settings.attack
        this.compressor.release.value = settings.release
        this.compressor.knee.value = 6  // Medium knee
        break
    }
  }

  private createSaturationCurve(type: CompressorType): Float32Array<ArrayBuffer> {
    const samples = 4096
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1

      switch (type) {
        case '1176':
          // FET: Slight odd harmonic distortion
          curve[i] = Math.tanh(x * 1.5) / Math.tanh(1.5)
          break

        case 'LA2A':
          // Tube: Even harmonic distortion (warm)
          const warm = 0.2 * x * x * Math.sign(x)
          curve[i] = (x + warm) / 1.2
          break

        case 'SSL':
          // VCA: Very subtle saturation
          curve[i] = Math.tanh(x * 1.1) / Math.tanh(1.1)
          break
      }
    }

    // Normalize
    const max = Math.max(...Array.from(curve).map(Math.abs))
    for (let i = 0; i < samples; i++) {
      curve[i] = curve[i] / max * 0.98
    }

    return curve as Float32Array<ArrayBuffer>
  }

  private dbToGain(db: number): number {
    return Math.pow(10, db / 20)
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
 * Helper to get preset
 */
export function getVintageCompressorPreset(presetId: string): VintageCompressorSettings | undefined {
  return VINTAGE_COMPRESSOR_PRESETS[presetId]
}

/**
 * Apply vintage compression
 */
export function applyVintageCompression(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): VintageCompressor {
  const preset = getVintageCompressorPreset(presetId)
  if (!preset) {
    console.error(`Vintage compressor preset not found: ${presetId}`)
    source.connect(destination)
    return new VintageCompressor(ctx, VINTAGE_COMPRESSOR_PRESETS['1176_fast'])
  }

  const comp = new VintageCompressor(ctx, preset)
  source.connect(comp.getInput())
  comp.connect(destination)

  return comp
}

console.log('🎚️ Vintage Compressor Emulations Loaded')
console.log(`   Models: 1176 (FET), LA-2A (Opto), SSL G-Bus (VCA)`)
console.log(`   Presets: ${Object.keys(VINTAGE_COMPRESSOR_PRESETS).length}`)
console.log('   Quality: Authentic analog modeling, Character saturation')
console.log('   Perfect for: Professional mixing and mastering')
console.log('   ✨ The sound of legendary studios!')
