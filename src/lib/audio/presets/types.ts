// Synth Preset Types for EDM Production

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'
export type LFOWaveform = 'sine' | 'square' | 'sawtooth' | 'triangle'
export type LFOTarget = 'filterCutoff' | 'pitch' | 'volume' | 'pan'

export interface LFOConfig {
  waveform: LFOWaveform
  rate: number // Hz (0.1 - 20)
  amount: number // 0-1
  target: LFOTarget
}

export interface NoiseConfig {
  type: 'white' | 'pink'
  amount: number // 0-1
}

export interface SynthPreset {
  id: string
  name: string
  category: PresetCategory
  subcategory: string

  // Oscillator
  oscillatorType: OscillatorType | 'custom' // 'custom' for wavetables
  oscillatorType2?: OscillatorType // Second oscillator for layering
  oscillatorMix?: number // Mix between osc1 and osc2 (0-1)
  wavetableId?: string // Wavetable ID (if oscillatorType is 'custom')
  detune?: number // Detune in cents
  octave?: number // Octave shift (-2 to +2)

  // Envelope (ADSR)
  attackTime: number
  decayTime: number
  sustainLevel: number
  releaseTime: number

  // Filter
  filterType?: 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'moog' | 'tb303'
  filterCutoff?: number // Hz
  filterResonance?: number // 0-1
  filterEnvAmount?: number // Filter envelope amount

  // Advanced Filters (Moog/TB-303)
  filterDrive?: number // Drive/saturation for Moog/TB-303 (0-1)
  filterAccent?: number // Accent for TB-303 (0-1)

  // Filter Envelope (separate from amp envelope)
  filterAttack?: number
  filterDecay?: number
  filterSustain?: number
  filterRelease?: number

  // LFO
  lfo?: LFOConfig

  // Noise
  noise?: NoiseConfig

  // Distortion/Waveshaping
  distortion?: number // 0-1

  // Analog Saturation (tape/tube/transformer)
  saturation?: {
    enabled: boolean
    type: 'tape' | 'tube' | 'transformer'
    drive: number // 0-1
    mix: number // 0-1
  }

  // Sub-Bass Enhancement
  subBass?: {
    enabled: boolean
    amount: number // 0-1
    frequency: number // Target frequency (40-60 Hz)
  }

  // Transient Designer (Attack/Sustain shaping)
  transient?: {
    enabled: boolean
    attack: number // -1 to +1 (reduce/boost attack)
    sustain: number // -1 to +1 (reduce/boost sustain)
  }

  // Sidechain Compressor (EDM pumping)
  sidechain?: {
    enabled: boolean
    amount: number // 0-1 (compression amount)
    rate: number // Hz (pumping rate, e.g., 120 BPM = 2 Hz)
    attack: number // seconds
    release: number // seconds
  }

  // Vintage Compressor (1176/LA-2A/SSL)
  compressor?: {
    enabled: boolean
    type: '1176' | 'LA2A' | 'SSL'
    threshold: number // dB
    ratio: number
    attack: number // seconds
    release: number // seconds
    makeup: number // dB
    mix: number // 0-1 (parallel compression)
  }

  // Volume
  volume: number

  // Effects (actual DSP processing)
  chorus?: {
    enabled: boolean
    rate: number // Hz
    depth: number // 0-1
    feedback: number // 0-1
  }
  reverb?: {
    enabled: boolean
    decay: number // seconds
    wet: number // 0-1
  }
  delay?: {
    enabled: boolean
    time: number // seconds
    feedback: number // 0-1
    wet: number // 0-1
  }

  // Additional
  portamento?: number // Glide time
  unison?: number // Number of voices (1-8)
  spread?: number // Stereo spread (0-1)
  phase?: number // Initial phase (0-1)

  // Tags for search
  tags?: string[]
}

export type PresetCategory =
  | 'lead'
  | 'bass'
  | 'pad'
  | 'piano'
  | 'brass'
  | 'strings'
  | 'fx'
  | 'drums'
  | 'vocal'
  | 'synth'

export interface PresetLibrary {
  presets: SynthPreset[]
  categories: {
    id: PresetCategory
    name: string
    subcategories: string[]
  }[]
}
