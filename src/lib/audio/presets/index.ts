// EDM Preset Library - 1,000 Professional Presets
// Designed for Calvin Harris & Alesso style production

import { generateAllPresets, PRESET_COUNT } from './generator'
import { SynthPreset, PresetCategory, PresetLibrary } from './types'

// Generate all presets
const ALL_PRESETS = generateAllPresets()

// Category definitions
export const PRESET_CATEGORIES = [
  {
    id: 'lead' as PresetCategory,
    name: 'Lead Synth',
    icon: '🎹',
    subcategories: ['supersaw', 'pluck', 'bright', 'epic']
  },
  {
    id: 'bass' as PresetCategory,
    name: 'Bass',
    icon: '🔊',
    subcategories: ['sub', 'acid', 'reese', 'wobble']
  },
  {
    id: 'pad' as PresetCategory,
    name: 'Pad',
    icon: '🌊',
    subcategories: ['atmospheric', 'string', 'warm']
  },
  {
    id: 'piano' as PresetCategory,
    name: 'Piano & Keys',
    icon: '🎹',
    subcategories: ['piano', 'electric', 'organ', 'bell']
  },
  {
    id: 'brass' as PresetCategory,
    name: 'Brass',
    icon: '🎺',
    subcategories: ['trumpet', 'trombone', 'sax']
  },
  {
    id: 'strings' as PresetCategory,
    name: 'Strings',
    icon: '🎻',
    subcategories: ['violin', 'cello', 'ensemble']
  },
  {
    id: 'fx' as PresetCategory,
    name: 'FX',
    icon: '⚡',
    subcategories: ['riser', 'impact', 'noise']
  },
  {
    id: 'drums' as PresetCategory,
    name: 'Drums',
    icon: '🥁',
    subcategories: ['kick', 'snare', 'hihat', 'percussion']
  },
  {
    id: 'vocal' as PresetCategory,
    name: 'Vocal',
    icon: '🎤',
    subcategories: ['pad', 'choir']
  },
  {
    id: 'synth' as PresetCategory,
    name: 'Synth',
    icon: '🎛️',
    subcategories: ['general']
  }
]

// Preset Library
export const PRESET_LIBRARY: PresetLibrary = {
  presets: ALL_PRESETS,
  categories: PRESET_CATEGORIES
}

// Helper functions
export function getPresetById(id: string): SynthPreset | undefined {
  return ALL_PRESETS.find(p => p.id === id)
}

export function getPresetsByCategory(category: PresetCategory): SynthPreset[] {
  return ALL_PRESETS.filter(p => p.category === category)
}

export function getPresetsBySubcategory(category: PresetCategory, subcategory: string): SynthPreset[] {
  return ALL_PRESETS.filter(p => p.category === category && p.subcategory === subcategory)
}

export function searchPresets(query: string): SynthPreset[] {
  const lowerQuery = query.toLowerCase()
  return ALL_PRESETS.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.subcategory.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getRandomPreset(category?: PresetCategory): SynthPreset {
  const pool = category ? getPresetsByCategory(category) : ALL_PRESETS
  return pool[Math.floor(Math.random() * pool.length)]
}

// Export preset count for debugging
console.log('🎵 EDM Preset Library Loaded:')
console.log(`   Total Presets: ${ALL_PRESETS.length}`)
console.log(`   Lead: ${PRESET_COUNT.lead}`)
console.log(`   Bass: ${PRESET_COUNT.bass}`)
console.log(`   Pad: ${PRESET_COUNT.pad}`)
console.log(`   Piano: ${PRESET_COUNT.piano}`)
console.log(`   Brass: ${PRESET_COUNT.brass}`)
console.log(`   Strings: ${PRESET_COUNT.strings}`)
console.log(`   FX: ${PRESET_COUNT.fx}`)
console.log(`   Drums: ${PRESET_COUNT.drums}`)
console.log(`   Vocal: ${PRESET_COUNT.vocal}`)

export { ALL_PRESETS, PRESET_COUNT }
export type { SynthPreset, PresetCategory, PresetLibrary }
