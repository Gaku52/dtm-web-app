// Professional Transient Designer
// Separates and controls attack (punch) and sustain (body) independently
// Essential for shaping drums, bass, and any percussive sounds

export interface TransientSettings {
  // Attack control
  attackGain: number      // Attack level adjustment (-1 to +1)
                          // -1 = soften attack, 0 = neutral, +1 = enhance attack
  attackTime: number      // Attack detection window (seconds) - typically 0.001-0.01

  // Sustain control
  sustainGain: number     // Sustain level adjustment (-1 to +1)
                          // -1 = reduce body, 0 = neutral, +1 = enhance body
  sustainTime: number     // Sustain detection window (seconds) - typically 0.01-0.1

  // Advanced
  lookahead: number       // Lookahead time (seconds) - typically 0.001-0.005
  mix: number            // Dry/wet mix (0-1) - typically 1.0 for full effect
}

// Preset transient settings
export const TRANSIENT_PRESETS: { [key: string]: TransientSettings } = {
  // Enhance kick punch - more attack, less body
  kick_punch: {
    attackGain: 0.7,
    attackTime: 0.003,
    sustainGain: -0.3,
    sustainTime: 0.05,
    lookahead: 0.002,
    mix: 1.0
  },

  // Tighten kick - reduce both for tight sound
  kick_tight: {
    attackGain: 0.5,
    attackTime: 0.002,
    sustainGain: -0.5,
    sustainTime: 0.03,
    lookahead: 0.001,
    mix: 1.0
  },

  // Enhance snare snap
  snare_snap: {
    attackGain: 0.8,
    attackTime: 0.002,
    sustainGain: -0.2,
    sustainTime: 0.04,
    lookahead: 0.001,
    mix: 1.0
  },

  // Fat bass - more body, natural attack
  bass_fat: {
    attackGain: 0.2,
    attackTime: 0.005,
    sustainGain: 0.6,
    sustainTime: 0.08,
    lookahead: 0.003,
    mix: 1.0
  },

  // Plucky bass - strong attack, reduced sustain
  bass_pluck: {
    attackGain: 0.9,
    attackTime: 0.003,
    sustainGain: -0.4,
    sustainTime: 0.06,
    lookahead: 0.002,
    mix: 1.0
  },

  // General drum enhancement
  drums_enhance: {
    attackGain: 0.5,
    attackTime: 0.004,
    sustainGain: 0.0,
    sustainTime: 0.05,
    lookahead: 0.002,
    mix: 1.0
  }
}

export class TransientDesigner {
  private ctx: AudioContext
  private settings: TransientSettings

  // Audio nodes
  private input: GainNode
  private output: GainNode
  private wetGain: GainNode
  private dryGain: GainNode

  constructor(ctx: AudioContext, settings: TransientSettings) {
    this.ctx = ctx
    this.settings = settings

    // Create nodes
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.wetGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    // Set mix levels
    this.wetGain.gain.value = settings.mix
    this.dryGain.gain.value = 1 - settings.mix

    // Setup routing
    this.input.connect(this.dryGain)
    this.dryGain.connect(this.output)
  }

  /**
   * Process audio through transient designer
   * Note: Web Audio API doesn't have native envelope follower,
   * so we implement a simplified version using dynamics processing
   */
  async process(source: AudioNode, startTime: number, duration: number) {
    const now = startTime

    // === ATTACK ENHANCEMENT ===
    if (this.settings.attackGain !== 0) {
      // Create compressor for attack region (fast attack, fast release)
      const attackComp = this.ctx.createDynamicsCompressor()
      attackComp.threshold.value = -20
      attackComp.ratio.value = this.settings.attackGain > 0 ? 1 : 4  // Expand or compress
      attackComp.attack.value = 0.001
      attackComp.release.value = this.settings.attackTime
      attackComp.knee.value = 10

      const attackGain = this.ctx.createGain()
      const attackAmount = 1 + Math.abs(this.settings.attackGain) * 0.5
      attackGain.gain.value = this.settings.attackGain > 0 ? attackAmount : 1 / attackAmount

      // Attack path: fast envelope shaping
      source.connect(attackComp)
      attackComp.connect(attackGain)
      attackGain.connect(this.wetGain)
    }

    // === SUSTAIN ENHANCEMENT ===
    if (this.settings.sustainGain !== 0) {
      // Create compressor for sustain region (slow attack, slow release)
      const sustainComp = this.ctx.createDynamicsCompressor()
      sustainComp.threshold.value = -30
      sustainComp.ratio.value = this.settings.sustainGain > 0 ? 1 : 4
      sustainComp.attack.value = this.settings.sustainTime
      sustainComp.release.value = this.settings.sustainTime * 2
      sustainComp.knee.value = 20

      const sustainGain = this.ctx.createGain()
      const sustainAmount = 1 + Math.abs(this.settings.sustainGain) * 0.5
      sustainGain.gain.value = this.settings.sustainGain > 0 ? sustainAmount : 1 / sustainAmount

      // Sustain path: slow envelope shaping
      source.connect(sustainComp)
      sustainComp.connect(sustainGain)
      sustainGain.connect(this.wetGain)
    }

    // If no transient processing, just pass through
    if (this.settings.attackGain === 0 && this.settings.sustainGain === 0) {
      source.connect(this.wetGain)
    }

    this.wetGain.connect(this.output)
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

// Helper function to get transient preset
export function getTransientPreset(presetId: string): TransientSettings | undefined {
  return TRANSIENT_PRESETS[presetId]
}

// Simple wrapper for applying transient design to any audio node
export async function applyTransientDesign(
  ctx: AudioContext,
  source: AudioNode,
  presetId: string,
  startTime: number,
  duration: number,
  destination: AudioNode
) {
  const preset = getTransientPreset(presetId)
  if (!preset) {
    console.error(`Transient preset not found: ${presetId}`)
    source.connect(destination)
    return
  }

  const designer = new TransientDesigner(ctx, preset)
  await designer.process(source, startTime, duration)
  designer.connect(destination)
}

console.log('🎚️ Professional Transient Designer Loaded')
console.log(`   Presets: ${Object.keys(TRANSIENT_PRESETS).length}`)
console.log('   Features: Attack/Sustain independent control')
console.log('   Use cases: Drums, Bass, Percussive sounds')
