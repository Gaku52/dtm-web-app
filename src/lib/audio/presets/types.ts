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
  oscillatorType: OscillatorType
  oscillatorType2?: OscillatorType // Second oscillator for layering
  oscillatorMix?: number // Mix between osc1 and osc2 (0-1)
  detune?: number // Detune in cents
  octave?: number // Octave shift (-2 to +2)

  // Envelope (ADSR)
  attackTime: number
  decayTime: number
  sustainLevel: number
  releaseTime: number

  // Filter
  filterType?: 'lowpass' | 'highpass' | 'bandpass' | 'notch'
  filterCutoff?: number // Hz
  filterResonance?: number // 0-1
  filterEnvAmount?: number // Filter envelope amount

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
