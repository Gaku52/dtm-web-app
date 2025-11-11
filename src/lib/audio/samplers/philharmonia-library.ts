// Philharmonia Orchestra - Professional Orchestral Sample Library
// CC BY-SA 3.0 License
// From: https://philharmonia.co.uk/resources/sound-samples/

export interface PhilharmoniaSample {
  id: string
  name: string
  category: 'strings' | 'woodwinds' | 'brass' | 'percussion'
  section?: string // e.g., 'violin', 'cello', 'flute'
  articulation: 'long' | 'short' | 'tremolo' | 'pizzicato' | 'staccato' | 'legato'
  dynamics: 'pp' | 'mf' | 'ff' // pianissimo, mezzo-forte, fortissimo
  baseUrl: string
  notes: string[]
  license: 'CC BY-SA 3.0'
  description: string
}

// Philharmonia Orchestra uses structured URL format:
// https://philharmonia.co.uk/assets/audio/samples/[instrument]/[articulation]/[dynamic]/[note].mp3
// Example: https://philharmonia.co.uk/assets/audio/samples/violin/long-notes/mf/C4.mp3

const PHILHARMONIA_BASE = 'https://philharmonia.co.uk/assets/audio/samples'

// Standard orchestral note range
const ORCHESTRAL_NOTES = {
  low: ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2'],
  mid: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
  high: ['C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
         'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6'],
}

export const PHILHARMONIA_SAMPLES: PhilharmoniaSample[] = [
  // ========================================
  // STRINGS SECTION - Professional Quality
  // ========================================

  // VIOLIN - Multiple articulations and dynamics
  {
    id: 'phil_violin_long_mf',
    name: 'Philharmonia Violin (Sustained)',
    category: 'strings',
    section: 'violin',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/violin/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.mid, ...ORCHESTRAL_NOTES.high],
    license: 'CC BY-SA 3.0',
    description: 'Professional violin with sustained notes. Expressive and warm tone. BBC Symphony quality.'
  },
  {
    id: 'phil_violin_pizz',
    name: 'Philharmonia Violin (Pizzicato)',
    category: 'strings',
    section: 'violin',
    articulation: 'pizzicato',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/violin/pizzicato`,
    notes: [...ORCHESTRAL_NOTES.mid, ...ORCHESTRAL_NOTES.high],
    license: 'CC BY-SA 3.0',
    description: 'Plucked violin strings. Perfect for rhythmic patterns and staccato passages.'
  },
  {
    id: 'phil_violin_tremolo',
    name: 'Philharmonia Violin (Tremolo)',
    category: 'strings',
    section: 'violin',
    articulation: 'tremolo',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/violin/tremolo`,
    notes: [...ORCHESTRAL_NOTES.mid, ...ORCHESTRAL_NOTES.high],
    license: 'CC BY-SA 3.0',
    description: 'Rapid bow tremolo. Creates tension and dramatic atmosphere.'
  },

  // VIOLA - Rich middle strings
  {
    id: 'phil_viola_long_mf',
    name: 'Philharmonia Viola (Sustained)',
    category: 'strings',
    section: 'viola',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/viola/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Warm viola tone. Essential for inner orchestral harmony and solo passages.'
  },

  // CELLO - Deep and expressive
  {
    id: 'phil_cello_long_mf',
    name: 'Philharmonia Cello (Sustained)',
    category: 'strings',
    section: 'cello',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/cello/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Rich cello with emotional depth. Perfect for melodic bass lines and solos.'
  },
  {
    id: 'phil_cello_pizz',
    name: 'Philharmonia Cello (Pizzicato)',
    category: 'strings',
    section: 'cello',
    articulation: 'pizzicato',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/cello/pizzicato`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Deep plucked cello. Great for walking bass lines.'
  },

  // DOUBLE BASS - Foundation
  {
    id: 'phil_bass_long_mf',
    name: 'Philharmonia Double Bass (Sustained)',
    category: 'strings',
    section: 'double-bass',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/double-bass/long-notes/mf`,
    notes: ORCHESTRAL_NOTES.low,
    license: 'CC BY-SA 3.0',
    description: 'Deep orchestral bass. Foundation of the string section.'
  },

  // ========================================
  // WOODWINDS SECTION
  // ========================================

  // FLUTE
  {
    id: 'phil_flute_long_mf',
    name: 'Philharmonia Flute (Sustained)',
    category: 'woodwinds',
    section: 'flute',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/flute/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.mid, ...ORCHESTRAL_NOTES.high],
    license: 'CC BY-SA 3.0',
    description: 'Bright, airy flute. Perfect for soaring melodies.'
  },

  // OBOE
  {
    id: 'phil_oboe_long_mf',
    name: 'Philharmonia Oboe (Sustained)',
    category: 'woodwinds',
    section: 'oboe',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/oboe/long-notes/mf`,
    notes: ORCHESTRAL_NOTES.mid,
    license: 'CC BY-SA 3.0',
    description: 'Penetrating oboe tone. Distinctive double-reed character.'
  },

  // CLARINET
  {
    id: 'phil_clarinet_long_mf',
    name: 'Philharmonia Clarinet (Sustained)',
    category: 'woodwinds',
    section: 'clarinet',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/clarinet/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Warm clarinet with wide range. Versatile for all musical styles.'
  },

  // BASSOON
  {
    id: 'phil_bassoon_long_mf',
    name: 'Philharmonia Bassoon (Sustained)',
    category: 'woodwinds',
    section: 'bassoon',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/bassoon/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Deep bassoon for woodwind bass. Rich and resonant.'
  },

  // ========================================
  // BRASS SECTION
  // ========================================

  // TRUMPET
  {
    id: 'phil_trumpet_long_mf',
    name: 'Philharmonia Trumpet (Sustained)',
    category: 'brass',
    section: 'trumpet',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/trumpet/long-notes/mf`,
    notes: ORCHESTRAL_NOTES.mid,
    license: 'CC BY-SA 3.0',
    description: 'Bright, heroic trumpet. Perfect for fanfares and solos.'
  },

  // FRENCH HORN
  {
    id: 'phil_horn_long_mf',
    name: 'Philharmonia French Horn (Sustained)',
    category: 'brass',
    section: 'french-horn',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/french-horn/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Noble French horn. Warm and majestic tone.'
  },

  // TROMBONE
  {
    id: 'phil_trombone_long_mf',
    name: 'Philharmonia Trombone (Sustained)',
    category: 'brass',
    section: 'trombone',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/trombone/long-notes/mf`,
    notes: [...ORCHESTRAL_NOTES.low, ...ORCHESTRAL_NOTES.mid],
    license: 'CC BY-SA 3.0',
    description: 'Powerful trombone. Essential for brass section power.'
  },

  // TUBA
  {
    id: 'phil_tuba_long_mf',
    name: 'Philharmonia Tuba (Sustained)',
    category: 'brass',
    section: 'tuba',
    articulation: 'long',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/tuba/long-notes/mf`,
    notes: ORCHESTRAL_NOTES.low,
    license: 'CC BY-SA 3.0',
    description: 'Deep tuba foundation. Supports the entire brass section.'
  },

  // ========================================
  // PERCUSSION
  // ========================================

  // TIMPANI
  {
    id: 'phil_timpani',
    name: 'Philharmonia Timpani',
    category: 'percussion',
    section: 'timpani',
    articulation: 'short',
    dynamics: 'mf',
    baseUrl: `${PHILHARMONIA_BASE}/timpani`,
    notes: ORCHESTRAL_NOTES.low,
    license: 'CC BY-SA 3.0',
    description: 'Orchestral timpani. Dramatic and powerful percussion.'
  },
]

// Helper functions
export function getPhilharmoniaSampleById(id: string): PhilharmoniaSample | undefined {
  return PHILHARMONIA_SAMPLES.find(s => s.id === id)
}

export function getPhilharmoniaSamplesByCategory(category: PhilharmoniaSample['category']): PhilharmoniaSample[] {
  return PHILHARMONIA_SAMPLES.filter(s => s.category === category)
}

export function getPhilharmoniaSamplesBySection(section: string): PhilharmoniaSample[] {
  return PHILHARMONIA_SAMPLES.filter(s => s.section === section)
}

export function getPhilharmoniaSamplesByArticulation(articulation: string): PhilharmoniaSample[] {
  return PHILHARMONIA_SAMPLES.filter(s => s.articulation === articulation)
}

console.log('🎻 Philharmonia Orchestra Library Loaded:')
console.log(`   Total Instruments: ${PHILHARMONIA_SAMPLES.length} (BBC Symphony Quality)`)
console.log(`   Strings: ${getPhilharmoniaSamplesByCategory('strings').length}`)
console.log(`   Woodwinds: ${getPhilharmoniaSamplesByCategory('woodwinds').length}`)
console.log(`   Brass: ${getPhilharmoniaSamplesByCategory('brass').length}`)
console.log(`   Percussion: ${getPhilharmoniaSamplesByCategory('percussion').length}`)
console.log('   ✨ Professional orchestral samples with multiple articulations!')
console.log('   License: CC BY-SA 3.0 (Free for commercial use)')
