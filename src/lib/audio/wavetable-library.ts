// Professional Wavetable Library
// Inspired by Serum, Massive, and Pigments

export interface Wavetable {
  id: string
  name: string
  category: 'basic' | 'analog' | 'digital' | 'vocal' | 'special'
  frames: Float32Array[] // Each frame is one waveform
  description: string
}

// Generate wavetables mathematically
function generateWavetable(generator: (phase: number, harmonic: number) => number, harmonics: number = 64): Float32Array {
  const size = 2048
  const wave = new Float32Array(size)

  for (let i = 0; i < size; i++) {
    const phase = (i / size) * Math.PI * 2
    let sample = 0

    for (let h = 1; h <= harmonics; h++) {
      sample += generator(phase, h)
    }

    wave[i] = sample
  }

  // Normalize
  const max = Math.max(...Array.from(wave).map(Math.abs))
  for (let i = 0; i < size; i++) {
    wave[i] /= max
  }

  return wave
}

// Wavetable generators
const WAVETABLE_GENERATORS = {
  // === BASIC WAVES ===
  sine: () => generateWavetable((phase, h) => h === 1 ? Math.sin(phase) : 0, 1),
  saw: () => generateWavetable((phase, h) => (2 / (h * Math.PI)) * Math.sin(h * phase) * (h % 2 === 1 ? 1 : -1), 32),
  square: () => generateWavetable((phase, h) => h % 2 === 1 ? (4 / (h * Math.PI)) * Math.sin(h * phase) : 0, 32),
  triangle: () => generateWavetable((phase, h) => h % 2 === 1 ? (8 / Math.pow(h * Math.PI, 2)) * Math.sin(h * phase) * Math.pow(-1, (h - 1) / 2) : 0, 32),

  // === ANALOG-STYLE ===
  supersaw: () => generateWavetable((phase, h) => {
    let sum = 0
    for (let detune = -0.1; detune <= 0.1; detune += 0.05) {
      sum += (2 / (h * Math.PI)) * Math.sin(h * phase * (1 + detune))
    }
    return sum
  }, 16),

  pwm: () => generateWavetable((phase, h) => {
    const pw = 0.25 + Math.sin(phase * 0.1) * 0.2 // Modulated pulse width
    return h % 2 === 1 ? (4 / (h * Math.PI)) * Math.sin(h * phase) * Math.cos(h * pw * Math.PI) : 0
  }, 32),

  // === DIGITAL ===
  digital: () => generateWavetable((phase) => {
    const p = phase / (Math.PI * 2)
    return p < 0.5 ? 1 : -1
  }, 1),

  bitcrushed: () => generateWavetable((phase) => {
    const bits = 4
    const levels = Math.pow(2, bits)
    const p = phase / (Math.PI * 2)
    return Math.floor(Math.sin(phase * Math.PI * 2) * levels) / levels
  }, 1),

  // === HARMONIC SERIES ===
  odd_harmonics: () => generateWavetable((phase, h) => h % 2 === 1 ? Math.sin(h * phase) / h : 0, 16),
  even_harmonics: () => generateWavetable((phase, h) => h % 2 === 0 ? Math.sin(h * phase) / h : 0, 16),

  // === FORMANT/VOCAL ===
  formant_a: () => generateWavetable((phase, h) => {
    // Emphasize harmonics around 800Hz, 1200Hz (vowel 'a')
    const emphasis = h === 4 || h === 6 ? 3 : h < 8 ? 1.5 : 0.5
    return Math.sin(h * phase) * emphasis / h
  }, 32),

  formant_e: () => generateWavetable((phase, h) => {
    // Emphasize harmonics around 500Hz, 2300Hz (vowel 'e')
    const emphasis = h === 3 || h === 11 ? 3 : h < 6 ? 1.5 : 0.5
    return Math.sin(h * phase) * emphasis / h
  }, 32),

  // === SPECIAL ===
  noise_wave: () => {
    const size = 2048
    const wave = new Float32Array(size)
    for (let i = 0; i < size; i++) {
      wave[i] = Math.random() * 2 - 1
    }
    return wave
  },

  inharmonic: () => generateWavetable((phase, h) => {
    const ratio = h * (1 + h * 0.01) // Slightly inharmonic
    return Math.sin(phase * ratio) / h
  }, 16),
}

// Create wavetable library
export const WAVETABLES: Wavetable[] = [
  // === BASIC ===
  {
    id: 'wt_sine',
    name: 'Pure Sine',
    category: 'basic',
    frames: [WAVETABLE_GENERATORS.sine()],
    description: 'Clean sine wave. Perfect for sub bass and pads.'
  },
  {
    id: 'wt_saw',
    name: 'Sawtooth',
    category: 'basic',
    frames: [WAVETABLE_GENERATORS.saw()],
    description: 'Classic sawtooth. Rich in harmonics, great for leads.'
  },
  {
    id: 'wt_square',
    name: 'Square Wave',
    category: 'basic',
    frames: [WAVETABLE_GENERATORS.square()],
    description: 'Hollow square wave. Perfect for bass and leads.'
  },
  {
    id: 'wt_triangle',
    name: 'Triangle',
    category: 'basic',
    frames: [WAVETABLE_GENERATORS.triangle()],
    description: 'Soft triangle wave. Great for mellow sounds.'
  },

  // === ANALOG ===
  {
    id: 'wt_supersaw',
    name: 'SuperSaw',
    category: 'analog',
    frames: [WAVETABLE_GENERATORS.supersaw()],
    description: 'Thick detuned sawtooth. Essential for EDM leads.'
  },
  {
    id: 'wt_pwm',
    name: 'Pulse Width Modulation',
    category: 'analog',
    frames: [WAVETABLE_GENERATORS.pwm()],
    description: 'Modulated pulse width. Classic analog character.'
  },

  // === DIGITAL ===
  {
    id: 'wt_digital',
    name: 'Digital Square',
    category: 'digital',
    frames: [WAVETABLE_GENERATORS.digital()],
    description: 'Hard digital square. Great for chiptune and harsh sounds.'
  },
  {
    id: 'wt_bitcrushed',
    name: 'Bitcrushed',
    category: 'digital',
    frames: [WAVETABLE_GENERATORS.bitcrushed()],
    description: 'Lo-fi bitcrushed wave. Perfect for retro sounds.'
  },

  // === HARMONIC ===
  {
    id: 'wt_odd',
    name: 'Odd Harmonics',
    category: 'analog',
    frames: [WAVETABLE_GENERATORS.odd_harmonics()],
    description: 'Only odd harmonics. Hollow, clarinet-like tone.'
  },
  {
    id: 'wt_even',
    name: 'Even Harmonics',
    category: 'analog',
    frames: [WAVETABLE_GENERATORS.even_harmonics()],
    description: 'Only even harmonics. Warm, flute-like tone.'
  },

  // === VOCAL ===
  {
    id: 'wt_formant_a',
    name: 'Vocal A',
    category: 'vocal',
    frames: [WAVETABLE_GENERATORS.formant_a()],
    description: 'Formant vowel "A". Vocal-like character.'
  },
  {
    id: 'wt_formant_e',
    name: 'Vocal E',
    category: 'vocal',
    frames: [WAVETABLE_GENERATORS.formant_e()],
    description: 'Formant vowel "E". Bright vocal sound.'
  },

  // === SPECIAL ===
  {
    id: 'wt_noise',
    name: 'Noise Wave',
    category: 'special',
    frames: [WAVETABLE_GENERATORS.noise_wave()],
    description: 'Noisy waveform. Great for textures and percussion.'
  },
  {
    id: 'wt_inharmonic',
    name: 'Inharmonic',
    category: 'special',
    frames: [WAVETABLE_GENERATORS.inharmonic()],
    description: 'Slightly detuned harmonics. Bell-like, metallic character.'
  },
]

// Create PeriodicWave for Web Audio API
export function createPeriodicWave(ctx: AudioContext, wavetable: Wavetable, frameIndex: number = 0): PeriodicWave {
  const frame = wavetable.frames[frameIndex]
  const size = frame.length

  // Convert time-domain waveform to frequency-domain (Fourier coefficients)
  const real = new Float32Array(size / 2)
  const imag = new Float32Array(size / 2)

  // Simple DFT (good enough for wavetables)
  for (let k = 0; k < size / 2; k++) {
    let realSum = 0
    let imagSum = 0

    for (let n = 0; n < size; n++) {
      const angle = (2 * Math.PI * k * n) / size
      realSum += frame[n] * Math.cos(angle)
      imagSum += frame[n] * -Math.sin(angle)
    }

    real[k] = realSum / size
    imag[k] = imagSum / size
  }

  return ctx.createPeriodicWave(real, imag, { disableNormalization: false })
}

// Get wavetable by ID
export function getWavetableById(id: string): Wavetable | undefined {
  return WAVETABLES.find(wt => wt.id === id)
}

// Get wavetables by category
export function getWavetablesByCategory(category: Wavetable['category']): Wavetable[] {
  return WAVETABLES.filter(wt => wt.category === category)
}

console.log('🌊 Professional Wavetable Library Loaded:')
console.log(`   Total Wavetables: ${WAVETABLES.length}`)
console.log(`   Basic: ${getWavetablesByCategory('basic').length} | Analog: ${getWavetablesByCategory('analog').length} | Digital: ${getWavetablesByCategory('digital').length}`)
console.log(`   Vocal: ${getWavetablesByCategory('vocal').length} | Special: ${getWavetablesByCategory('special').length}`)
