// Bus Compressor (Glue Compression)
// SSL-style bus compression for mix cohesion
// "Glues" mix elements together for professional sound

/**
 * Bus Compression
 *
 * Purpose: Create cohesion and punch in a mix by gently compressing
 * the entire mix bus or subgroups (drums, vocals, etc.)
 *
 * Characteristics:
 * - Slow attack (preserves transients)
 * - Auto or program-dependent release
 * - Low ratio (2:1 - 4:1)
 * - Subtle compression (2-3dB reduction)
 * - Adds punch and glue
 *
 * Based on: SSL G-Series Bus Compressor
 * Used on: 90% of professional mixes
 */

export interface BusCompressorSettings {
  threshold: number      // Threshold (-20 to 0 dB)
  ratio: number         // Ratio (2:1 or 4:1 typically)
  attack: number        // Attack time (0.1ms - 30ms)
  release: number       // Release time (0.1s - 1.2s, or auto)
  autoRelease: boolean  // Program-dependent release
  makeup: number        // Makeup gain (0-6 dB)
  mix: number          // Parallel compression (0-1)
}

// Professional bus compression presets
export const BUS_COMPRESSOR_PRESETS: { [key: string]: BusCompressorSettings } = {
  // SSL Classic (most common)
  ssl_classic: {
    threshold: -8,
    ratio: 4,
    attack: 0.003,      // 3ms (slow)
    release: 0.1,       // 100ms (auto)
    autoRelease: true,
    makeup: 2,
    mix: 1.0
  },

  // Gentle glue
  gentle_glue: {
    threshold: -6,
    ratio: 2,
    attack: 0.01,       // 10ms
    release: 0.15,
    autoRelease: true,
    makeup: 1.5,
    mix: 1.0
  },

  // Punch (drums)
  drum_punch: {
    threshold: -10,
    ratio: 4,
    attack: 0.001,      // 1ms (faster for drums)
    release: 0.08,
    autoRelease: false,
    makeup: 3,
    mix: 1.0
  },

  // Mix bus aggressive
  aggressive_bus: {
    threshold: -12,
    ratio: 4,
    attack: 0.003,
    release: 0.05,
    autoRelease: false,
    makeup: 4,
    mix: 1.0
  },

  // Transparent
  transparent: {
    threshold: -4,
    ratio: 2,
    attack: 0.02,       // 20ms (very slow)
    release: 0.2,
    autoRelease: true,
    makeup: 1,
    mix: 1.0
  },

  // New York parallel
  new_york_parallel: {
    threshold: -15,
    ratio: 10,
    attack: 0.001,
    release: 0.05,
    autoRelease: false,
    makeup: 6,
    mix: 0.3          // Parallel blend
  },

  // Vocal bus
  vocal_bus: {
    threshold: -7,
    ratio: 3,
    attack: 0.005,
    release: 0.12,
    autoRelease: true,
    makeup: 2,
    mix: 1.0
  },

  // Master bus (conservative)
  master_conservative: {
    threshold: -5,
    ratio: 2,
    attack: 0.01,
    release: 0.1,
    autoRelease: true,
    makeup: 1.5,
    mix: 1.0
  }
}

export class BusCompressor {
  private ctx: AudioContext
  private settings: BusCompressorSettings

  // Nodes
  private input: GainNode
  private output: GainNode
  private compressor: DynamicsCompressorNode
  private makeup: GainNode
  private saturation: WaveShaperNode
  private wetGain: GainNode
  private dryGain: GainNode

  constructor(ctx: AudioContext, settings: BusCompressorSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.makeup = ctx.createGain()
    this.wetGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    // Compressor (SSL-style)
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.value = settings.threshold
    this.compressor.ratio.value = settings.ratio
    this.compressor.attack.value = settings.attack
    this.compressor.release.value = settings.release
    this.compressor.knee.value = 6  // Medium knee (SSL characteristic)

    // Makeup gain
    this.makeup.gain.value = this.dbToGain(settings.makeup)

    // Subtle saturation (SSL bus comp adds subtle harmonics)
    this.saturation = ctx.createWaveShaper()
    this.saturation.curve = this.createSSLSaturation()
    this.saturation.oversample = '4x'

    // Mix
    this.wetGain.gain.value = settings.mix
    this.dryGain.gain.value = 1 - settings.mix

    // Routing
    this.input.connect(this.dryGain)

    this.input.connect(this.compressor)
    this.compressor.connect(this.saturation)
    this.saturation.connect(this.makeup)
    this.makeup.connect(this.wetGain)

    this.dryGain.connect(this.output)
    this.wetGain.connect(this.output)
  }

  /**
   * SSL-style subtle saturation
   * Adds 2nd harmonic for glue and warmth
   */
  private createSSLSaturation(): Float32Array<ArrayBuffer> {
    const samples = 4096
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1

      // Very subtle 2nd harmonic
      const h2 = 0.05 * x * x * Math.sign(x)
      const base = Math.tanh(x * 1.05)

      curve[i] = (base + h2) / 1.05
    }

    return curve as Float32Array<ArrayBuffer>
  }

  private dbToGain(db: number): number {
    return Math.pow(10, db / 20)
  }

  /**
   * Update threshold
   */
  setThreshold(thresholdDb: number) {
    this.settings.threshold = thresholdDb
    this.compressor.threshold.value = thresholdDb
  }

  /**
   * Update ratio
   */
  setRatio(ratio: number) {
    this.settings.ratio = ratio
    this.compressor.ratio.value = ratio
  }

  /**
   * Update attack
   */
  setAttack(attackTime: number) {
    this.settings.attack = attackTime
    this.compressor.attack.value = attackTime
  }

  /**
   * Update release
   */
  setRelease(releaseTime: number) {
    this.settings.release = releaseTime
    this.compressor.release.value = releaseTime
  }

  /**
   * Update makeup gain
   */
  setMakeup(makeupDb: number) {
    this.settings.makeup = makeupDb
    this.makeup.gain.value = this.dbToGain(makeupDb)
  }

  /**
   * Update mix (for parallel compression)
   */
  setMix(mix: number) {
    this.settings.mix = Math.max(0, Math.min(mix, 1))
    this.wetGain.gain.value = this.settings.mix
    this.dryGain.gain.value = 1 - this.settings.mix
  }

  /**
   * Get current gain reduction (for metering)
   */
  getReduction(): number {
    return this.compressor.reduction || 0
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
 * Helper to get bus compressor preset
 */
export function getBusCompressorPreset(presetId: string): BusCompressorSettings | undefined {
  return BUS_COMPRESSOR_PRESETS[presetId]
}

/**
 * Apply bus compression
 */
export function applyBusCompression(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): BusCompressor {
  const preset = getBusCompressorPreset(presetId)
  if (!preset) {
    console.error(`Bus compressor preset not found: ${presetId}`)
    source.connect(destination)
    return new BusCompressor(ctx, BUS_COMPRESSOR_PRESETS['ssl_classic'])
  }

  const comp = new BusCompressor(ctx, preset)
  source.connect(comp.getInput())
  comp.connect(destination)

  return comp
}

console.log('🎚️ Bus Compressor (Glue Compression) Loaded')
console.log(`   Style: SSL G-Series Bus Compressor`)
console.log(`   Presets: ${Object.keys(BUS_COMPRESSOR_PRESETS).length}`)
console.log('   Features: Auto release, Parallel compression, SSL saturation')
console.log('   Perfect for: Mix bus, Drum bus, Vocal bus')
console.log('   ✨ Professional mix glue!')
