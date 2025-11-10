// Tone.js Official Sample Library - MIT License
// All samples are free, legal, and redistribution-allowed

export interface ToneJsSample {
  id: string
  name: string
  category: 'piano' | 'guitar' | 'bass' | 'drums' | 'keys'
  baseUrl: string
  notes: string[]
  license: string
  description: string
}

export const TONE_JS_SAMPLES: ToneJsSample[] = [
  {
    id: 'salamander_piano',
    name: 'Salamander Grand Piano',
    category: 'piano',
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
    notes: [
      'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
      'D#1', 'D#2', 'D#3', 'D#4', 'D#5', 'D#6', 'D#7',
      'F#1', 'F#2', 'F#3', 'F#4', 'F#5', 'F#6', 'F#7'
    ],
    license: 'MIT License',
    description: 'Professional grand piano samples with excellent dynamic range. Perfect for classical, pop, and EDM productions.'
  },
  {
    id: 'casio_mt500',
    name: 'Casio MT-500',
    category: 'keys',
    baseUrl: 'https://tonejs.github.io/audio/casio/',
    notes: [
      'A1', 'A2', 'A3', 'A4',
      'C1', 'C2', 'C3', 'C4', 'C5',
      'D#1', 'D#2', 'D#3', 'D#4',
      'F#1', 'F#2', 'F#3', 'F#4'
    ],
    license: 'MIT License',
    description: 'Vintage Casio keyboard tones. Great for lo-fi, retro, and electronic music.'
  }
]

export function getToneJsSampleById(id: string): ToneJsSample | undefined {
  return TONE_JS_SAMPLES.find(s => s.id === id)
}

export function getToneJsSamplesByCategory(category: ToneJsSample['category']): ToneJsSample[] {
  return TONE_JS_SAMPLES.filter(s => s.category === category)
}

console.log('🎹 Tone.js Sample Library Loaded:')
console.log(`   Total Instruments: ${TONE_JS_SAMPLES.length} (MIT Licensed)`)
console.log('   All samples are free, legal, and redistribution-allowed')
