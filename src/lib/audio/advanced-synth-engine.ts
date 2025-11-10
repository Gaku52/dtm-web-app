// Advanced Synth Engine with Professional Sound Quality
// Implements LFO, Effects, Modulation, and Complex Synthesis

import { SynthPreset } from './presets/types'

export class AdvancedSynthVoice {
  private ctx: AudioContext
  private preset: SynthPreset
  private frequency: number
  private velocity: number

  // Audio nodes
  private oscillator1: OscillatorNode | null = null
  private oscillator2: OscillatorNode | null = null
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

  private async createSimpleReverb(): Promise<AudioBuffer> {
    const rate = this.ctx.sampleRate
    const length = rate * (this.preset.reverb?.decay || 2)
    const impulse = this.ctx.createBuffer(2, length, rate)

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }

    return impulse
  }

  async start(time: number, duration: number) {
    const now = time
    const endTime = time + duration
    const volume = (this.velocity / 127) * this.preset.volume

    // === OSCILLATORS ===
    this.oscillator1 = this.ctx.createOscillator()
    this.oscillator1.type = this.preset.oscillatorType
    this.oscillator1.frequency.value = this.frequency * Math.pow(2, (this.preset.octave || 0))

    if (this.preset.detune) {
      this.oscillator1.detune.value = this.preset.detune
    }

    // Second oscillator
    if (this.preset.oscillatorType2) {
      this.oscillator2 = this.ctx.createOscillator()
      this.oscillator2.type = this.preset.oscillatorType2
      this.oscillator2.frequency.value = this.frequency * Math.pow(2, (this.preset.octave || 0))

      if (this.preset.detune) {
        this.oscillator2.detune.value = -this.preset.detune // Opposite detune
      }
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

    // Reverb
    if (this.preset.reverb?.enabled) {
      this.reverbNode = this.ctx.createConvolver()
      this.reverbNode.buffer = await this.createSimpleReverb()

      const reverbWet = this.ctx.createGain()
      reverbWet.gain.value = this.preset.reverb.wet

      this.reverbNode.connect(reverbWet)
      reverbWet.connect(this.output)
    }

    // === AUDIO GRAPH CONNECTION ===
    let currentNode: AudioNode = this.ampGain

    // Connect oscillators
    this.oscillator1.connect(this.ampGain)
    if (this.oscillator2) {
      this.oscillator2.connect(this.ampGain)
    }
    if (this.noiseGain) {
      this.noiseGain.connect(this.ampGain)
    }

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
    this.oscillator1.start(now)
    if (this.oscillator2) this.oscillator2.start(now)
    if (this.noiseSource) this.noiseSource.start(now)

    // === STOP ===
    this.oscillator1.stop(endTime)
    if (this.oscillator2) this.oscillator2.stop(endTime)
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
