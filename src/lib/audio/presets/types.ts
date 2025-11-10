// Synth Preset Types for EDM Production

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'

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

  // Envelope (ADSR)
  attackTime: number
  decayTime: number
  sustainLevel: number
  releaseTime: number

  // Filter
  filterType?: 'lowpass' | 'highpass' | 'bandpass'
  filterCutoff?: number // Hz
  filterResonance?: number // 0-1
  filterEnvAmount?: number // Filter envelope amount

  // Volume
  volume: number

  // Effects
  chorus?: number // 0-1
  reverb?: number // 0-1
  delay?: number // 0-1

  // Additional
  portamento?: number // Glide time
  unison?: number // Number of voices (1-8)
  spread?: number // Stereo spread (0-1)

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
