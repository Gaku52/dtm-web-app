// Professional Kick Drum Synthesizer
// Implements pitch envelope, sub-bass layer, and transient shaping
// Perfect for Techno, House, EDM

export interface KickSynthSettings {
  // Pitch envelope (frequency sweep from high to low)
  pitchStart: number      // Starting frequency (Hz) - typically 150-300
  pitchEnd: number        // Ending frequency (Hz) - typically 40-80
  pitchDecay: number      // Pitch envelope decay time (seconds) - typically 0.05-0.2

  // Sub-bass layer (deep low-end punch)
  subFrequency: number    // Sub-bass frequency (Hz) - typically 40-60
  subAmount: number       // Sub-bass mix level (0-1)
  subDecay: number        // Sub-bass decay time (seconds)

  // Amplitude envelope
  attack: number          // Attack time (seconds) - typically 0.001-0.01
  decay: number           // Decay time (seconds) - typically 0.2-1.0
  sustain: number         // Sustain level (0-1)
  release: number         // Release time (seconds)

  // Tone shaping
  clickAmount: number     // Click/transient amount (0-1)
  distortion: number      // Distortion amount (0-1)
  noiseAmount: number     // Noise click amount (0-1)

  // Output
  volume: number          // Master volume (0-1)
}

// Preset kick styles
export const KICK_PRESETS: { [key: string]: KickSynthSettings } = {
  // 909-style techno kick - punchy and tight
  kick_909_techno: {
    pitchStart: 250,
    pitchEnd: 50,
    pitchDecay: 0.08,
    subFrequency: 45,
    subAmount: 0.7,
    subDecay: 0.5,
    attack: 0.001,
    decay: 0.4,
    sustain: 0.0,
    release: 0.1,
    clickAmount: 0.6,
    distortion: 0.2,
    noiseAmount: 0.3,
    volume: 1.0
  },

  // 808-style hip-hop kick - deep and boomy
  kick_808_hiphop: {
    pitchStart: 180,
    pitchEnd: 40,
    pitchDecay: 0.15,
    subFrequency: 40,
    subAmount: 0.9,
    subDecay: 0.8,
    attack: 0.001,
    decay: 0.6,
    sustain: 0.0,
    release: 0.2,
    clickAmount: 0.3,
    distortion: 0.1,
    noiseAmount: 0.2,
    volume: 1.0
  },

  // EDM kick - massive sub-bass and punch
  kick_edm_massive: {
    pitchStart: 300,
    pitchEnd: 60,
    pitchDecay: 0.06,
    subFrequency: 50,
    subAmount: 0.85,
    subDecay: 0.6,
    attack: 0.001,
    decay: 0.5,
    sustain: 0.0,
    release: 0.15,
    clickAmount: 0.8,
    distortion: 0.35,
    noiseAmount: 0.4,
    volume: 1.0
  },

  // House kick - warm and groovy
  kick_house_classic: {
    pitchStart: 220,
    pitchEnd: 55,
    pitchDecay: 0.1,
    subFrequency: 50,
    subAmount: 0.75,
    subDecay: 0.55,
    attack: 0.002,
    decay: 0.45,
    sustain: 0.0,
    release: 0.12,
    clickAmount: 0.5,
    distortion: 0.15,
    noiseAmount: 0.25,
    volume: 1.0
  },

  // Deep house kick - ultra-deep sub
  kick_deep_house: {
    pitchStart: 200,
    pitchEnd: 45,
    pitchDecay: 0.12,
    subFrequency: 42,
    subAmount: 0.95,
    subDecay: 0.7,
    attack: 0.003,
    decay: 0.55,
    sustain: 0.0,
    release: 0.18,
    clickAmount: 0.4,
    distortion: 0.1,
    noiseAmount: 0.2,
    volume: 1.0
  },

  // Hardstyle kick - aggressive and distorted
  kick_hardstyle: {
    pitchStart: 350,
    pitchEnd: 65,
    pitchDecay: 0.05,
    subFrequency: 55,
    subAmount: 0.8,
    subDecay: 0.4,
    attack: 0.001,
    decay: 0.35,
    sustain: 0.0,
    release: 0.08,
    clickAmount: 0.9,
    distortion: 0.6,
    noiseAmount: 0.5,
    volume: 1.0
  }
}

export class KickSynth {
  private ctx: AudioContext
  private settings: KickSynthSettings

  constructor(ctx: AudioContext, settings: KickSynthSettings) {
    this.ctx = ctx
    this.settings = settings
  }

  private createDistortionCurve(amount: number): Float32Array<ArrayBuffer> | null {
    const samples = 256
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = (3 + amount * 100) * x * 20 * deg / (Math.PI + amount * 100 * Math.abs(x))
    }

    return curve as Float32Array<ArrayBuffer>
  }

  async play(startTime: number, destination: AudioNode) {
    const now = startTime
    const {
      pitchStart, pitchEnd, pitchDecay,
      subFrequency, subAmount, subDecay,
      attack, decay, sustain, release,
      clickAmount, distortion, noiseAmount,
      volume
    } = this.settings

    // === MAIN KICK OSCILLATOR (with pitch envelope) ===
    const kickOsc = this.ctx.createOscillator()
    kickOsc.type = 'sine'
    kickOsc.frequency.setValueAtTime(pitchStart, now)
    kickOsc.frequency.exponentialRampToValueAtTime(pitchEnd, now + pitchDecay)

    const kickGain = this.ctx.createGain()
    kickGain.gain.setValueAtTime(0, now)
    kickGain.gain.linearRampToValueAtTime(volume, now + attack)
    kickGain.gain.exponentialRampToValueAtTime(volume * sustain + 0.001, now + attack + decay)
    kickGain.gain.linearRampToValueAtTime(0.001, now + attack + decay + release)

    kickOsc.connect(kickGain)

    // === SUB-BASS LAYER ===
    let subGain: GainNode | null = null
    let subOsc: OscillatorNode | null = null

    if (subAmount > 0) {
      subOsc = this.ctx.createOscillator()
      subOsc.type = 'sine'
      subOsc.frequency.value = subFrequency

      subGain = this.ctx.createGain()
      subGain.gain.setValueAtTime(0, now)
      subGain.gain.linearRampToValueAtTime(volume * subAmount, now + attack)
      subGain.gain.exponentialRampToValueAtTime(0.001, now + attack + subDecay)

      subOsc.connect(subGain)
    }

    // === CLICK/TRANSIENT LAYER (noise burst) ===
    let noiseSource: AudioBufferSourceNode | null = null
    let noiseGain: GainNode | null = null

    if (noiseAmount > 0) {
      // Create short white noise burst
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate)
      const noiseData = noiseBuffer.getChannelData(0)
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseData.length * 0.1))
      }

      noiseSource = this.ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer

      noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(noiseAmount * volume * clickAmount, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)

      noiseSource.connect(noiseGain)
    }

    // === CLICK OSCILLATOR (high-frequency transient) ===
    let clickOsc: OscillatorNode | null = null
    let clickGain: GainNode | null = null

    if (clickAmount > 0) {
      clickOsc = this.ctx.createOscillator()
      clickOsc.type = 'sine'
      clickOsc.frequency.setValueAtTime(1500, now)
      clickOsc.frequency.exponentialRampToValueAtTime(50, now + 0.01)

      clickGain = this.ctx.createGain()
      clickGain.gain.setValueAtTime(volume * clickAmount * 0.3, now)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

      clickOsc.connect(clickGain)
    }

    // === DISTORTION ===
    let distortionNode: WaveShaperNode | null = null
    if (distortion > 0) {
      distortionNode = this.ctx.createWaveShaper()
      distortionNode.curve = this.createDistortionCurve(distortion)
      distortionNode.oversample = '4x'
    }

    // === MIXING ===
    const mixer = this.ctx.createGain()
    mixer.gain.value = 1.0

    kickGain.connect(mixer)
    if (subGain) subGain.connect(mixer)
    if (noiseGain) noiseGain.connect(mixer)
    if (clickGain) clickGain.connect(mixer)

    // Apply distortion if enabled
    if (distortionNode) {
      mixer.connect(distortionNode)
      distortionNode.connect(destination)
    } else {
      mixer.connect(destination)
    }

    // === START & STOP ===
    const duration = attack + decay + release

    kickOsc.start(now)
    kickOsc.stop(now + duration)

    if (subOsc) {
      subOsc.start(now)
      subOsc.stop(now + duration)
    }

    if (noiseSource) {
      noiseSource.start(now)
    }

    if (clickOsc) {
      clickOsc.start(now)
      clickOsc.stop(now + 0.02)
    }
  }
}

// Helper function to get kick preset by ID
export function getKickPreset(presetId: string): KickSynthSettings | undefined {
  return KICK_PRESETS[presetId]
}

// Helper function to play kick with preset
export async function playKick(
  ctx: AudioContext,
  presetId: string,
  startTime: number,
  destination: AudioNode
) {
  const preset = getKickPreset(presetId)
  if (!preset) {
    console.error(`Kick preset not found: ${presetId}`)
    return
  }

  const kick = new KickSynth(ctx, preset)
  await kick.play(startTime, destination)
}

console.log('🥁 Professional Kick Drum Synthesizer Loaded')
console.log(`   Presets: ${Object.keys(KICK_PRESETS).length}`)
console.log('   Features: Pitch envelope, Sub-bass layer, Transient shaping')
console.log('   Styles: 909, 808, EDM, House, Deep House, Hardstyle')
