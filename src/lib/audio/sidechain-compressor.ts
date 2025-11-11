// Sidechain Compressor
// Essential for EDM, House, Techno - creates the "pumping" groove effect
// When kick hits, bass ducks down, creating space and rhythm

/**
 * Sidechain Compression
 *
 * Classic technique where one signal (e.g., kick) controls the compression
 * of another signal (e.g., bass). When the kick plays, the bass volume
 * automatically reduces, creating the iconic "pumping" effect.
 *
 * Use cases:
 * - Kick + Bass (most common)
 * - Kick + Pad
 * - Kick + Entire mix
 */

export interface SidechainSettings {
  // Compression parameters
  threshold: number       // Threshold in dB (-60 to 0)
  ratio: number          // Compression ratio (1-20)
  attack: number         // Attack time in seconds (0.001-0.1)
  release: number        // Release time in seconds (0.01-1.0)

  // Sidechain specific
  duckAmount: number     // How much to duck (0-1) - easier than threshold

  // Mix
  mix: number           // Dry/wet mix (0-1)
}

// Preset sidechain settings for different styles
export const SIDECHAIN_PRESETS: { [key: string]: SidechainSettings } = {
  // Classic house pumping
  house_pump: {
    threshold: -20,
    ratio: 4,
    attack: 0.003,
    release: 0.15,
    duckAmount: 0.7,
    mix: 1.0
  },

  // Subtle ducking (for live instruments)
  subtle_duck: {
    threshold: -15,
    ratio: 3,
    attack: 0.005,
    release: 0.2,
    duckAmount: 0.4,
    mix: 1.0
  },

  // Heavy EDM pumping
  edm_heavy: {
    threshold: -25,
    ratio: 8,
    attack: 0.001,
    release: 0.1,
    duckAmount: 0.85,
    mix: 1.0
  },

  // Fast techno pump
  techno_fast: {
    threshold: -22,
    ratio: 6,
    attack: 0.001,
    release: 0.08,
    duckAmount: 0.75,
    mix: 1.0
  },

  // Smooth deep house
  deep_house_smooth: {
    threshold: -18,
    ratio: 3.5,
    attack: 0.01,
    release: 0.25,
    duckAmount: 0.5,
    mix: 1.0
  },

  // Aggressive dubstep
  dubstep_heavy: {
    threshold: -30,
    ratio: 12,
    attack: 0.001,
    release: 0.05,
    duckAmount: 0.9,
    mix: 1.0
  },

  // Gentle pad ducking
  pad_gentle: {
    threshold: -12,
    ratio: 2.5,
    attack: 0.02,
    release: 0.3,
    duckAmount: 0.3,
    mix: 1.0
  }
}

export class SidechainCompressor {
  private ctx: AudioContext
  private settings: SidechainSettings

  // Main signal path
  private input: GainNode
  private output: GainNode
  private compressor: DynamicsCompressorNode

  // Sidechain signal path
  private sidechainInput: GainNode
  private sidechainGain: GainNode

  // Mix control
  private wetGain: GainNode
  private dryGain: GainNode

  constructor(ctx: AudioContext, settings: SidechainSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create main nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.compressor = ctx.createDynamicsCompressor()
    this.wetGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    // Create sidechain nodes
    this.sidechainInput = ctx.createGain()
    this.sidechainGain = ctx.createGain()

    // Configure compressor
    this.compressor.threshold.value = settings.threshold
    this.compressor.ratio.value = settings.ratio
    this.compressor.attack.value = settings.attack
    this.compressor.release.value = settings.release
    this.compressor.knee.value = 0 // Hard knee for punchy ducking

    // Configure mix
    this.wetGain.gain.value = settings.mix
    this.dryGain.gain.value = 1 - settings.mix

    // Sidechain gain (boost to trigger compression)
    this.sidechainGain.gain.value = Math.pow(10, (Math.abs(settings.threshold) * 0.05))

    // Connect main signal path
    this.input.connect(this.dryGain)
    this.input.connect(this.compressor)
    this.compressor.connect(this.wetGain)

    this.dryGain.connect(this.output)
    this.wetGain.connect(this.output)

    // Connect sidechain path
    // Note: Web Audio API's DynamicsCompressorNode doesn't have explicit sidechain input,
    // but we can simulate it by processing the sidechain signal separately
    this.sidechainInput.connect(this.sidechainGain)
  }

  /**
   * Connect audio source to be compressed (e.g., bass)
   */
  connectInput(source: AudioNode) {
    source.connect(this.input)
  }

  /**
   * Connect sidechain trigger source (e.g., kick)
   */
  connectSidechain(source: AudioNode) {
    source.connect(this.sidechainInput)
    // Connect to compressor to trigger compression
    this.sidechainGain.connect(this.compressor)
  }

  /**
   * Manually trigger ducking (useful for kick patterns)
   * This simulates the pumping effect when a kick plays
   */
  triggerDuck(time: number, duration: number = 0.15) {
    const { duckAmount, attack, release } = this.settings

    // Calculate duck amount
    const targetGain = 1 - duckAmount

    // Duck down
    this.wetGain.gain.cancelScheduledValues(time)
    this.wetGain.gain.setValueAtTime(this.wetGain.gain.value, time)
    this.wetGain.gain.linearRampToValueAtTime(targetGain, time + attack)

    // Return to normal
    this.wetGain.gain.linearRampToValueAtTime(1.0, time + attack + release)
  }

  /**
   * Trigger duck for multiple kick hits (pattern)
   */
  triggerPattern(kickTimes: number[], baseTime: number) {
    kickTimes.forEach(kickTime => {
      this.triggerDuck(baseTime + kickTime)
    })
  }

  /**
   * Update compression settings in real-time
   */
  setThreshold(value: number) {
    this.settings.threshold = value
    this.compressor.threshold.value = value
  }

  setRatio(value: number) {
    this.settings.ratio = value
    this.compressor.ratio.value = value
  }

  setAttack(value: number) {
    this.settings.attack = value
    this.compressor.attack.value = value
  }

  setRelease(value: number) {
    this.settings.release = value
    this.compressor.release.value = value
  }

  setDuckAmount(value: number) {
    this.settings.duckAmount = Math.min(Math.max(value, 0), 1)
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

  getSidechainInput(): AudioNode {
    return this.sidechainInput
  }

  getOutput(): AudioNode {
    return this.output
  }
}

/**
 * Helper function to get sidechain preset
 */
export function getSidechainPreset(presetId: string): SidechainSettings | undefined {
  return SIDECHAIN_PRESETS[presetId]
}

/**
 * Simple helper to create classic kick + bass sidechain
 */
export function createKickBassSidechain(
  ctx: AudioContext,
  bassSource: AudioNode,
  kickSource: AudioNode,
  presetId: string,
  destination: AudioNode
): SidechainCompressor {
  const preset = getSidechainPreset(presetId)
  if (!preset) {
    console.error(`Sidechain preset not found: ${presetId}`)
    bassSource.connect(destination)
    return new SidechainCompressor(ctx, SIDECHAIN_PRESETS['house_pump'])
  }

  const sidechain = new SidechainCompressor(ctx, preset)
  sidechain.connectInput(bassSource)
  sidechain.connectSidechain(kickSource)
  sidechain.connect(destination)

  return sidechain
}

/**
 * Create sidechain with manual kick pattern (for synced ducking)
 * This is useful when you want precise control over ducking timing
 */
export function createPatternSidechain(
  ctx: AudioContext,
  source: AudioNode,
  kickPattern: number[], // Array of kick times in seconds
  startTime: number,
  presetId: string,
  destination: AudioNode
): SidechainCompressor {
  const preset = getSidechainPreset(presetId)
  if (!preset) {
    console.error(`Sidechain preset not found: ${presetId}`)
    source.connect(destination)
    return new SidechainCompressor(ctx, SIDECHAIN_PRESETS['house_pump'])
  }

  const sidechain = new SidechainCompressor(ctx, preset)
  source.connect(sidechain.getInput())
  sidechain.connect(destination)

  // Trigger ducking for each kick
  sidechain.triggerPattern(kickPattern, startTime)

  return sidechain
}

console.log('🎚️ Sidechain Compressor Loaded')
console.log(`   Presets: ${Object.keys(SIDECHAIN_PRESETS).length}`)
console.log('   Features: Kick ducking, Pattern sync, Manual triggering')
console.log('   Use cases: Kick+Bass, Kick+Pad, EDM pumping effect')
console.log('   Perfect for: House, Techno, EDM, Dubstep')
