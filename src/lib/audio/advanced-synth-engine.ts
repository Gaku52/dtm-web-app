// Advanced Synth Engine with Professional Sound Quality
// Implements LFO, Effects, Modulation, and Complex Synthesis

import { SynthPreset } from './presets/types'
import { loadImpulseResponse, getDefaultIR } from './ir-library'
import { getWavetableById, createPeriodicWave } from './wavetable-library'
import { MoogLadderFilter, type MoogFilterSettings } from './moog-ladder-filter'
import { TB303Filter, type TB303FilterSettings } from './tb303-filter'
import { AnalogSaturation, type SaturationSettings } from './analog-saturation'
import { SubBassEnhancer, type SubBassSettings } from './sub-bass-enhancer'
import { TransientDesigner, type TransientSettings } from './transient-designer'
import { SidechainCompressor, type SidechainSettings } from './sidechain-compressor'
import { VintageCompressor, type VintageCompressorSettings } from './vintage-compressors'

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
  private moogFilter: MoogLadderFilter | null = null
  private tb303Filter: TB303Filter | null = null
  private distortion: WaveShaperNode | null = null
  private saturationNode: AnalogSaturation | null = null
  private subBassNode: SubBassEnhancer | null = null
  private transientDesigner: TransientDesigner | null = null
  private sidechainCompressor: SidechainCompressor | null = null
  private vintageCompressor: VintageCompressor | null = null

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
      const filterType = this.preset.filterType || 'lowpass'

      if (filterType === 'moog') {
        // Moog Ladder Filter (House/Deep Bass)
        const moogSettings: MoogFilterSettings = {
          cutoff: this.preset.filterCutoff,
          resonance: this.preset.filterResonance || 0.5,
          drive: this.preset.filterDrive || 0.3,
          outputLevel: 0.9
        }
        this.moogFilter = new MoogLadderFilter(this.ctx, moogSettings)
        console.log('🎛️ Using Moog Ladder Filter')
      } else if (filterType === 'tb303') {
        // TB-303 Filter (Acid Bass)
        const tb303Settings: TB303FilterSettings = {
          cutoff: this.preset.filterCutoff,
          resonance: this.preset.filterResonance || 0.7,
          envMod: this.preset.filterEnvAmount || 0.5,
          decay: this.preset.filterDecay || 0.2,
          accent: this.preset.filterAccent || 0.5,
          overdrive: this.preset.filterDrive || 0.4,
          volume: 0.9
        }
        this.tb303Filter = new TB303Filter(this.ctx, tb303Settings)
        console.log('🎛️ Using TB-303 Filter')
      } else {
        // Standard BiquadFilter
        this.filter = this.ctx.createBiquadFilter()
        this.filter.type = filterType
        this.filter.frequency.value = this.preset.filterCutoff
        this.filter.Q.value = (this.preset.filterResonance || 0) * 30
      }

      // Filter envelope (only for BiquadFilter, Moog/TB-303 have built-in envelopes)
      if (this.filter && this.preset.filterEnvAmount) {
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

    // Apply sub-bass enhancement (before distortion for clean harmonics)
    if (this.preset.subBass?.enabled) {
      const subBassSettings: SubBassSettings = {
        lowCutoff: 20,
        highCutoff: this.preset.subBass.frequency || 60,
        amount: this.preset.subBass.amount || 0.5,
        harmonics: 0.3,
        octaveDown: 0.2,
        saturation: 0.2,
        mono: true,
        mix: 0.5,
        outputGain: 1.0
      }
      this.subBassNode = new SubBassEnhancer(this.ctx, subBassSettings)
      currentNode.connect(this.subBassNode.getInput())
      currentNode = this.subBassNode.getOutput()
      console.log('🔊 Sub-Bass Enhancement enabled')
    }

    // Apply transient designer (shape attack/sustain)
    if (this.preset.transient?.enabled) {
      const transientSettings: TransientSettings = {
        attackGain: this.preset.transient.attack || 0,
        attackTime: 0.005,
        sustainGain: this.preset.transient.sustain || 0,
        sustainTime: 0.05,
        lookahead: 0.001,
        mix: 1.0
      }
      this.transientDesigner = new TransientDesigner(this.ctx, transientSettings)
      currentNode.connect(this.transientDesigner.getInput())
      currentNode = this.transientDesigner.getOutput()
      console.log('⚡ Transient Designer enabled')
    }

    // Apply distortion
    if (this.distortion) {
      currentNode.connect(this.distortion)
      currentNode = this.distortion
    }

    // Apply vintage compressor (1176/LA-2A/SSL)
    if (this.preset.compressor?.enabled) {
      const compSettings: VintageCompressorSettings = {
        type: this.preset.compressor.type,
        input: 0,
        threshold: this.preset.compressor.threshold || -20,
        ratio: this.preset.compressor.ratio || 4,
        attack: this.preset.compressor.attack || 0.005,
        release: this.preset.compressor.release || 0.1,
        output: 1.0,
        mix: this.preset.compressor.mix || 1.0
      }
      this.vintageCompressor = new VintageCompressor(this.ctx, compSettings)
      currentNode.connect(this.vintageCompressor.getInput())
      currentNode = this.vintageCompressor.getOutput()
      console.log(`🎛️ ${this.preset.compressor.type} Compressor enabled`)
    }

    // Apply sidechain compressor (EDM pumping)
    if (this.preset.sidechain?.enabled) {
      const sidechainSettings: SidechainSettings = {
        threshold: -20,
        ratio: 8,
        attack: this.preset.sidechain.attack || 0.001,
        release: this.preset.sidechain.release || 0.2,
        duckAmount: this.preset.sidechain.amount || 0.7,
        mix: 1.0
      }
      this.sidechainCompressor = new SidechainCompressor(this.ctx, sidechainSettings)
      currentNode.connect(this.sidechainCompressor.getInput())
      currentNode = this.sidechainCompressor.getOutput()
      console.log('🔊 Sidechain Compressor enabled (EDM pump)')
    }

    // Apply analog saturation (after distortion for warmth)
    if (this.preset.saturation?.enabled) {
      const saturationSettings: SaturationSettings = {
        type: this.preset.saturation.type,
        drive: this.preset.saturation.drive || 0.5,
        mix: this.preset.saturation.mix || 1.0,
        tone: 0,
        outputGain: 1.0
      }
      this.saturationNode = new AnalogSaturation(this.ctx, saturationSettings)
      currentNode.connect(this.saturationNode.getInput())
      currentNode = this.saturationNode.getOutput()
      console.log(`🎚️ Analog Saturation enabled (${this.preset.saturation.type})`)
    }

    // Apply filter (standard, Moog, or TB-303)
    if (this.filter) {
      currentNode.connect(this.filter)
      currentNode = this.filter
    } else if (this.moogFilter) {
      currentNode.connect(this.moogFilter.getInput())
      currentNode = this.moogFilter.getOutput()
    } else if (this.tb303Filter) {
      currentNode.connect(this.tb303Filter.getInput())
      // TB-303 envelope trigger
      if (this.preset.filterEnvAmount) {
        this.tb303Filter.triggerEnvelope(now, this.velocity / 127)
      }
      currentNode = this.tb303Filter.getOutput()
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
