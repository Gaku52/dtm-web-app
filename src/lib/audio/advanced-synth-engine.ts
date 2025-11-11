// Advanced Synth Engine with Professional Sound Quality
// Implements LFO, Effects, Modulation, and Complex Synthesis

import { SynthPreset } from './presets/types'
import { loadImpulseResponse, getDefaultIR } from './ir-library'
import { getWavetableById, createPeriodicWave } from './wavetable-library'

export class AdvancedSynthVoice {
  private ctx: AudioContext
  private preset: SynthPreset
  private frequency: number
  private velocity: number

  // Audio nodes - Unison support
  private unisonVoices: Array<{
    oscillator1: OscillatorNode
    oscillator2?: OscillatorNode
    gain: GainNode
    panner: StereoPannerNode
  }> = []
  private noiseSource: AudioBufferSourceNode | null = null
  private noiseBuffer: AudioBuffer | null = null

  private filter: BiquadFilterNode | null = null
  private distortion: WaveShaperNode | null = null

  private ampGain: GainNode
  private filterGain: GainNode
  private noiseGain: GainNode | null = null

  // Effects
  private chorusNodes: { lfo: OscillatorNode; delay: DelayNode; gain: GainNode } | null = null
  private delayNode: DelayNode | null = null
  private delayFeedbackGain: GainNode | null = null
  private reverbNode: ConvolverNode | null = null

  // LFO
  private lfo: OscillatorNode | null = null
  private lfoGain: GainNode | null = null

  // Master output
  private output: GainNode

  constructor(ctx: AudioContext, preset: SynthPreset, frequency: number, velocity: number) {
    this.ctx = ctx
    this.preset = preset
    this.frequency = frequency
    this.velocity = velocity

    // Create master nodes
    this.ampGain = ctx.createGain()
    this.filterGain = ctx.createGain()
    this.output = ctx.createGain()

    // Initialize
    this.setupNoise()
  }

  private setupNoise() {
    if (!this.preset.noise || this.preset.noise.amount === 0) return

    // Create white noise buffer
    const bufferSize = this.ctx.sampleRate * 2
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = this.noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
  }

  private createDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const samples = 256
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x))
    }

    return curve as Float32Array<ArrayBuffer>
  }

  private async createProfessionalReverb(): Promise<AudioBuffer> {
    // Use professional impulse response instead of random noise
    const defaultIR = getDefaultIR()
    const impulseResponse = await loadImpulseResponse(this.ctx, defaultIR)
    console.log(`🎧 Using professional IR: ${defaultIR.name}`)
    return impulseResponse
  }

  async start(time: number, duration: number) {
    const now = time
    const endTime = time + duration
    const volume = (this.velocity / 127) * this.preset.volume

    // === UNISON OSCILLATORS ===
    const unisonCount = this.preset.unison || 1
    const spread = this.preset.spread || 0
    const baseFrequency = this.frequency * Math.pow(2, (this.preset.octave || 0))

    console.log(`🎵 Creating ${unisonCount} unison voices with spread ${spread}`)

    for (let i = 0; i < unisonCount; i++) {
      // Calculate detune for each voice (creates thickness)
      const voiceDetune = unisonCount > 1
        ? ((i / (unisonCount - 1)) - 0.5) * 50 * (this.preset.detune || 10) / 10
        : 0

      // Calculate stereo pan (creates width)
      const pan = unisonCount > 1
        ? ((i / (unisonCount - 1)) - 0.5) * 2 * spread
        : 0

      // Create oscillator 1
      const osc1 = this.ctx.createOscillator()

      // Use wavetable if specified, otherwise use standard oscillator type
      if (this.preset.oscillatorType === 'custom' && this.preset.wavetableId) {
        const wavetable = getWavetableById(this.preset.wavetableId)
        if (wavetable) {
          const periodicWave = createPeriodicWave(this.ctx, wavetable, 0)
          osc1.setPeriodicWave(periodicWave)
          console.log(`🌊 Using wavetable: ${wavetable.name}`)
        } else {
          console.warn(`⚠️ Wavetable not found: ${this.preset.wavetableId}, using sine`)
          osc1.type = 'sine'
        }
      } else {
        osc1.type = this.preset.oscillatorType as OscillatorType
      }

      osc1.frequency.value = baseFrequency
      osc1.detune.value = voiceDetune

      // Create oscillator 2 (if specified)
      let osc2: OscillatorNode | undefined
      if (this.preset.oscillatorType2) {
        osc2 = this.ctx.createOscillator()
        osc2.type = this.preset.oscillatorType2
        osc2.frequency.value = baseFrequency
        osc2.detune.value = voiceDetune * 0.98 // Slightly different for richness
      }

      // Create gain and panner for this voice
      const voiceGain = this.ctx.createGain()
      const voicePanner = this.ctx.createStereoPanner()

      // Reduce volume per voice to prevent clipping
      voiceGain.gain.value = 1 / Math.sqrt(unisonCount)
      voicePanner.pan.value = Math.max(-1, Math.min(1, pan))

      this.unisonVoices.push({
        oscillator1: osc1,
        oscillator2: osc2,
        gain: voiceGain,
        panner: voicePanner
      })
    }

    // === NOISE ===
    if (this.preset.noise && this.preset.noise.amount > 0 && this.noiseBuffer) {
      this.noiseSource = this.ctx.createBufferSource()
      this.noiseSource.buffer = this.noiseBuffer
      this.noiseSource.loop = true

      this.noiseGain = this.ctx.createGain()
      this.noiseGain.gain.value = this.preset.noise.amount * volume

      this.noiseSource.connect(this.noiseGain)
    }

    // === FILTER ===
    if (this.preset.filterCutoff) {
      this.filter = this.ctx.createBiquadFilter()
      this.filter.type = this.preset.filterType || 'lowpass'
      this.filter.frequency.value = this.preset.filterCutoff
      this.filter.Q.value = (this.preset.filterResonance || 0) * 30

      // Filter envelope
      if (this.preset.filterEnvAmount) {
        const filterAttack = this.preset.filterAttack || this.preset.attackTime
        const filterDecay = this.preset.filterDecay || this.preset.decayTime
        const filterSustain = this.preset.filterSustain || this.preset.sustainLevel
        const filterRelease = this.preset.filterRelease || this.preset.releaseTime

        const envAmount = this.preset.filterEnvAmount * 5000 // Scale to Hz
        const baseCutoff = this.preset.filterCutoff

        this.filter.frequency.setValueAtTime(baseCutoff, now)
        this.filter.frequency.linearRampToValueAtTime(baseCutoff + envAmount, now + filterAttack)
        this.filter.frequency.linearRampToValueAtTime(
          baseCutoff + envAmount * filterSustain,
          now + filterAttack + filterDecay
        )
        this.filter.frequency.setValueAtTime(
          baseCutoff + envAmount * filterSustain,
          endTime - filterRelease
        )
        this.filter.frequency.linearRampToValueAtTime(baseCutoff, endTime)
      }
    }

    // === LFO ===
    if (this.preset.lfo && this.preset.lfo.target === 'filterCutoff' && this.filter) {
      this.lfo = this.ctx.createOscillator()
      this.lfo.type = this.preset.lfo.waveform
      this.lfo.frequency.value = this.preset.lfo.rate

      this.lfoGain = this.ctx.createGain()
      this.lfoGain.gain.value = this.preset.lfo.amount * 1000 // Scale for filter

      this.lfo.connect(this.lfoGain)
      this.lfoGain.connect(this.filter.frequency)
      this.lfo.start(now)
    }

    // === DISTORTION ===
    if (this.preset.distortion && this.preset.distortion > 0) {
      this.distortion = this.ctx.createWaveShaper()
      this.distortion.curve = this.createDistortionCurve(this.preset.distortion * 100)
      this.distortion.oversample = '4x'
    }

    // === AMP ENVELOPE ===
    const { attackTime, decayTime, sustainLevel, releaseTime } = this.preset

    this.ampGain.gain.setValueAtTime(0, now)
    this.ampGain.gain.linearRampToValueAtTime(volume, now + attackTime)
    this.ampGain.gain.linearRampToValueAtTime(volume * sustainLevel, now + attackTime + decayTime)
    this.ampGain.gain.setValueAtTime(volume * sustainLevel, endTime - releaseTime)
    this.ampGain.gain.linearRampToValueAtTime(0, endTime)

    // === EFFECTS ===

    // Chorus
    if (this.preset.chorus?.enabled) {
      const chorusDelay = this.ctx.createDelay()
      chorusDelay.delayTime.value = 0.02

      const chorusLFO = this.ctx.createOscillator()
      chorusLFO.type = 'sine'
      chorusLFO.frequency.value = this.preset.chorus.rate

      const chorusLFOGain = this.ctx.createGain()
      chorusLFOGain.gain.value = this.preset.chorus.depth * 0.01

      const chorusFeedback = this.ctx.createGain()
      chorusFeedback.gain.value = this.preset.chorus.feedback

      const chorusWet = this.ctx.createGain()
      chorusWet.gain.value = 0.5

      chorusLFO.connect(chorusLFOGain)
      chorusLFOGain.connect(chorusDelay.delayTime)

      this.chorusNodes = {
        lfo: chorusLFO,
        delay: chorusDelay,
        gain: chorusWet
      }

      chorusLFO.start(now)
    }

    // Delay
    if (this.preset.delay?.enabled) {
      this.delayNode = this.ctx.createDelay()
      this.delayNode.delayTime.value = this.preset.delay.time

      this.delayFeedbackGain = this.ctx.createGain()
      this.delayFeedbackGain.gain.value = this.preset.delay.feedback

      const delayWet = this.ctx.createGain()
      delayWet.gain.value = this.preset.delay.wet

      this.delayNode.connect(this.delayFeedbackGain)
      this.delayFeedbackGain.connect(this.delayNode)
      this.delayNode.connect(delayWet)
      delayWet.connect(this.output)
    }

    // Professional Convolution Reverb
    if (this.preset.reverb?.enabled) {
      this.reverbNode = this.ctx.createConvolver()
      this.reverbNode.buffer = await this.createProfessionalReverb()

      const reverbWet = this.ctx.createGain()
      reverbWet.gain.value = this.preset.reverb.wet

      const reverbDry = this.ctx.createGain()
      reverbDry.gain.value = 1 - this.preset.reverb.wet

      this.reverbNode.connect(reverbWet)
      reverbWet.connect(this.output)

      console.log(`🎵 Professional Reverb: Wet ${(this.preset.reverb.wet * 100).toFixed(0)}%`)
    }

    // === AUDIO GRAPH CONNECTION ===
    // Create unison mixer (combines all voices)
    const unisonMixer = this.ctx.createGain()
    unisonMixer.gain.value = 1.0

    // Connect each unison voice
    this.unisonVoices.forEach(voice => {
      // Connect oscillators to voice gain
      voice.oscillator1.connect(voice.gain)
      if (voice.oscillator2) {
        voice.oscillator2.connect(voice.gain)
      }

      // Connect voice gain to panner, then to mixer
      voice.gain.connect(voice.panner)
      voice.panner.connect(unisonMixer)
    })

    // Connect noise
    if (this.noiseGain) {
      this.noiseGain.connect(unisonMixer)
    }

    // Connect mixer to amp gain
    unisonMixer.connect(this.ampGain)
    let currentNode: AudioNode = this.ampGain

    // Apply distortion
    if (this.distortion) {
      this.ampGain.connect(this.distortion)
      currentNode = this.distortion
    }

    // Apply filter
    if (this.filter) {
      currentNode.connect(this.filter)
      currentNode = this.filter
    }

    // Apply chorus
    if (this.chorusNodes) {
      currentNode.connect(this.chorusNodes.delay)
      this.chorusNodes.delay.connect(this.chorusNodes.gain)
      this.chorusNodes.gain.connect(this.output)
      currentNode.connect(this.output) // Dry signal
    } else {
      currentNode.connect(this.output)
    }

    // Apply delay
    if (this.delayNode) {
      currentNode.connect(this.delayNode)
    }

    // Apply reverb
    if (this.reverbNode) {
      currentNode.connect(this.reverbNode)
    }

    // === START ===
    this.unisonVoices.forEach(voice => {
      voice.oscillator1.start(now)
      if (voice.oscillator2) {
        voice.oscillator2.start(now)
      }
    })
    if (this.noiseSource) this.noiseSource.start(now)

    // === STOP ===
    this.unisonVoices.forEach(voice => {
      voice.oscillator1.stop(endTime)
      if (voice.oscillator2) {
        voice.oscillator2.stop(endTime)
      }
    })
    if (this.noiseSource) this.noiseSource.stop(endTime + 1) // Extra time for reverb tail
    if (this.lfo) this.lfo.stop(endTime)
    if (this.chorusNodes) this.chorusNodes.lfo.stop(endTime)
  }

  connect(destination: AudioNode) {
    this.output.connect(destination)
  }

  disconnect() {
    this.output.disconnect()
  }
}

export async function playPresetNote(
  ctx: AudioContext,
  preset: SynthPreset,
  frequency: number,
  duration: number,
  velocity: number,
  destination: AudioNode
) {
  const voice = new AdvancedSynthVoice(ctx, preset, frequency, velocity)
  voice.connect(destination)
  await voice.start(ctx.currentTime, duration)

  // Cleanup after sound finishes
  setTimeout(() => {
    voice.disconnect()
  }, (duration + 5) * 1000) // Extra time for reverb/delay tails
}
