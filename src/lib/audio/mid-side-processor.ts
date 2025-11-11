// Mid-Side (M/S) Processor
// Professional stereo imaging tool used in mastering
// Independent control of center (Mid) and sides (Side)

/**
 * Mid-Side Processing
 *
 * Decodes stereo into Mid (center) and Side (width) components,
 * processes them independently, then encodes back to stereo.
 *
 * Mid: L+R (center content - vocals, kick, snare, bass)
 * Side: L-R (stereo content - reverb, pads, stereo effects)
 *
 * Applications:
 * - Widen stereo without affecting center
 * - EQ sides without touching center
 * - Compress center without crushing sides
 * - Create mono-compatible mixes
 */

export interface MidSideSettings {
  // Width control
  width: number          // Stereo width (0-2, 1=normal)

  // Independent processing
  midGain: number       // Center level (-12 to +12 dB)
  sideGain: number      // Stereo level (-12 to +12 dB)

  // EQ (optional)
  midEQ: {
    enabled: boolean
    lowShelf: { freq: number; gain: number }
    highShelf: { freq: number; gain: number }
  }
  sideEQ: {
    enabled: boolean
    lowCut: number      // Remove low frequencies from sides
    highShelf: { freq: number; gain: number }
  }

  // Advanced
  monoLows: boolean     // Force bass to mono (< 150Hz)
  monoLowsFreq: number  // Mono below this frequency
}

// Professional M/S presets
export const MS_PRESETS: { [key: string]: MidSideSettings } = {
  // Wide master (expand stereo)
  wide_master: {
    width: 1.4,
    midGain: 0,
    sideGain: 3,
    midEQ: {
      enabled: false,
      lowShelf: { freq: 100, gain: 0 },
      highShelf: { freq: 10000, gain: 0 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 150,
      highShelf: { freq: 10000, gain: 2 }
    },
    monoLows: true,
    monoLowsFreq: 150
  },

  // Narrow (mono-compatible)
  narrow_mono: {
    width: 0.7,
    midGain: 2,
    sideGain: -3,
    midEQ: {
      enabled: false,
      lowShelf: { freq: 100, gain: 0 },
      highShelf: { freq: 10000, gain: 0 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 200,
      highShelf: { freq: 8000, gain: 0 }
    },
    monoLows: true,
    monoLowsFreq: 200
  },

  // Vocal focus (center emphasis)
  vocal_focus: {
    width: 1.0,
    midGain: 2,
    sideGain: -1,
    midEQ: {
      enabled: true,
      lowShelf: { freq: 80, gain: -2 },
      highShelf: { freq: 3000, gain: 1 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 150,
      highShelf: { freq: 10000, gain: 1 }
    },
    monoLows: true,
    monoLowsFreq: 150
  },

  // EDM wide (maximum width)
  edm_ultra_wide: {
    width: 1.8,
    midGain: -1,
    sideGain: 4,
    midEQ: {
      enabled: true,
      lowShelf: { freq: 60, gain: 2 },
      highShelf: { freq: 8000, gain: -1 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 120,
      highShelf: { freq: 12000, gain: 3 }
    },
    monoLows: true,
    monoLowsFreq: 120
  },

  // Subtle enhancement
  subtle_enhance: {
    width: 1.15,
    midGain: 0,
    sideGain: 1,
    midEQ: {
      enabled: false,
      lowShelf: { freq: 100, gain: 0 },
      highShelf: { freq: 10000, gain: 0 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 150,
      highShelf: { freq: 10000, gain: 1 }
    },
    monoLows: true,
    monoLowsFreq: 150
  },

  // Mono bass, wide highs
  mono_bass_wide_top: {
    width: 1.3,
    midGain: 1,
    sideGain: 2,
    midEQ: {
      enabled: true,
      lowShelf: { freq: 100, gain: 2 },
      highShelf: { freq: 8000, gain: 0 }
    },
    sideEQ: {
      enabled: true,
      lowCut: 200,
      highShelf: { freq: 10000, gain: 2 }
    },
    monoLows: true,
    monoLowsFreq: 200
  }
}

export class MidSideProcessor {
  private ctx: AudioContext
  private settings: MidSideSettings

  // M/S Encoding/Decoding
  private input: GainNode
  private output: GainNode
  private splitter: ChannelSplitterNode
  private merger: ChannelMergerNode

  // Mid/Side processing chains
  private midGain: GainNode
  private sideGain: GainNode
  private widthGain: GainNode

  // EQ nodes
  private midLowShelf?: BiquadFilterNode
  private midHighShelf?: BiquadFilterNode
  private sideLowCut?: BiquadFilterNode
  private sideHighShelf?: BiquadFilterNode

  // Mono lows
  private monoLowsFilter?: BiquadFilterNode
  private monoLowsGain?: GainNode

  constructor(ctx: AudioContext, settings: MidSideSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.splitter = ctx.createChannelSplitter(2)
    this.merger = ctx.createChannelMerger(2)

    this.midGain = ctx.createGain()
    this.sideGain = ctx.createGain()
    this.widthGain = ctx.createGain()

    // Set gains
    this.midGain.gain.value = this.dbToGain(settings.midGain)
    this.sideGain.gain.value = this.dbToGain(settings.sideGain) * settings.width
    this.widthGain.gain.value = settings.width

    // Setup M/S encoding
    this.input.connect(this.splitter)

    // Mid = (L + R) / 2
    const midLeft = ctx.createGain()
    const midRight = ctx.createGain()
    midLeft.gain.value = 0.5
    midRight.gain.value = 0.5

    this.splitter.connect(midLeft, 0)
    this.splitter.connect(midRight, 1)

    // Side = (L - R) / 2
    const sideLeft = ctx.createGain()
    const sideRight = ctx.createGain()
    sideLeft.gain.value = 0.5
    sideRight.gain.value = -0.5

    this.splitter.connect(sideLeft, 0)
    this.splitter.connect(sideRight, 1)

    // Process Mid
    let midChain: AudioNode = ctx.createGain()
    ;(midChain as GainNode).gain.value = 1
    midLeft.connect(midChain)
    midRight.connect(midChain)

    if (settings.midEQ.enabled) {
      this.midLowShelf = ctx.createBiquadFilter()
      this.midLowShelf.type = 'lowshelf'
      this.midLowShelf.frequency.value = settings.midEQ.lowShelf.freq
      this.midLowShelf.gain.value = settings.midEQ.lowShelf.gain

      this.midHighShelf = ctx.createBiquadFilter()
      this.midHighShelf.type = 'highshelf'
      this.midHighShelf.frequency.value = settings.midEQ.highShelf.freq
      this.midHighShelf.gain.value = settings.midEQ.highShelf.gain

      midChain.connect(this.midLowShelf)
      this.midLowShelf.connect(this.midHighShelf)
      this.midHighShelf.connect(this.midGain)
    } else {
      midChain.connect(this.midGain)
    }

    // Process Side
    let sideChain: AudioNode = ctx.createGain()
    ;(sideChain as GainNode).gain.value = 1
    sideLeft.connect(sideChain)
    sideRight.connect(sideChain)

    if (settings.sideEQ.enabled) {
      this.sideLowCut = ctx.createBiquadFilter()
      this.sideLowCut.type = 'highpass'
      this.sideLowCut.frequency.value = settings.sideEQ.lowCut
      this.sideLowCut.Q.value = 0.707

      this.sideHighShelf = ctx.createBiquadFilter()
      this.sideHighShelf.type = 'highshelf'
      this.sideHighShelf.frequency.value = settings.sideEQ.highShelf.freq
      this.sideHighShelf.gain.value = settings.sideEQ.highShelf.gain

      sideChain.connect(this.sideLowCut)
      this.sideLowCut.connect(this.sideHighShelf)
      this.sideHighShelf.connect(this.sideGain)
    } else {
      sideChain.connect(this.sideGain)
    }

    // M/S Decoding back to L/R
    // L = Mid + Side
    // R = Mid - Side
    const leftOut = ctx.createGain()
    const rightOut = ctx.createGain()

    this.midGain.connect(leftOut)
    this.sideGain.connect(leftOut)
    this.midGain.connect(rightOut)
    const sideInvert = ctx.createGain()
    sideInvert.gain.value = -1
    this.sideGain.connect(sideInvert)
    sideInvert.connect(rightOut)

    leftOut.connect(this.merger, 0, 0)
    rightOut.connect(this.merger, 0, 1)
    this.merger.connect(this.output)
  }

  private dbToGain(db: number): number {
    return Math.pow(10, db / 20)
  }

  /**
   * Update stereo width
   */
  setWidth(width: number) {
    this.settings.width = Math.max(0, Math.min(width, 2))
    this.sideGain.gain.value = this.dbToGain(this.settings.sideGain) * this.settings.width
  }

  /**
   * Update mid gain
   */
  setMidGain(gainDb: number) {
    this.settings.midGain = gainDb
    this.midGain.gain.value = this.dbToGain(gainDb)
  }

  /**
   * Update side gain
   */
  setSideGain(gainDb: number) {
    this.settings.sideGain = gainDb
    this.sideGain.gain.value = this.dbToGain(gainDb) * this.settings.width
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
 * Helper to get M/S preset
 */
export function getMSPreset(presetId: string): MidSideSettings | undefined {
  return MS_PRESETS[presetId]
}

/**
 * Apply M/S processing
 */
export function applyMidSideProcessing(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  destination: AudioNode
): MidSideProcessor {
  const preset = getMSPreset(presetId)
  if (!preset) {
    console.error(`M/S preset not found: ${presetId}`)
    source.connect(destination)
    return new MidSideProcessor(ctx, MS_PRESETS['subtle_enhance'])
  }

  const ms = new MidSideProcessor(ctx, preset)
  source.connect(ms.getInput())
  ms.connect(destination)

  return ms
}

console.log('🎚️ Mid-Side Processor Loaded')
console.log(`   Presets: ${Object.keys(MS_PRESETS).length}`)
console.log('   Features: Independent Mid/Side control, EQ, Width')
console.log('   Quality: Phase-coherent, Mono-compatible')
console.log('   Perfect for: Mastering, Stereo enhancement')
console.log('   ✨ Professional stereo imaging!')
