// Preset Generator for EDM Production
import { SynthPreset } from './types'

// Helper function to generate variations
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// Generate Lead Synth Presets (200)
function generateLeadPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Supersaw (60) - Calvin Harris signature sound
  for (let i = 0; i < 60; i++) {
    const t = i / 59
    presets.push({
      id: `lead_supersaw_${i + 1}`,
      name: `Supersaw ${i + 1}`,
      category: 'lead',
      subcategory: 'supersaw',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(5, 20, t), // Increasing thickness
      attackTime: lerp(0.01, 0.05, t),
      decayTime: lerp(0.1, 0.3, t),
      sustainLevel: lerp(0.6, 0.8, t),
      releaseTime: lerp(0.2, 0.5, t),
      filterType: 'lowpass',
      filterCutoff: lerp(2000, 8000, t),
      filterResonance: lerp(0.3, 0.7, t),
      volume: 0.35,
      unison: Math.floor(lerp(3, 8, t)),
      spread: lerp(0.5, 1.0, t),
      reverb: lerp(0.1, 0.3, t),
      tags: ['edm', 'progressive', 'big-room', 'epic']
    })
  }

  // Pluck (50) - Alesso style pluck leads
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `lead_pluck_${i + 1}`,
      name: `Pluck ${i + 1}`,
      category: 'lead',
      subcategory: 'pluck',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.3, 0.7, t),
      detune: lerp(0, 10, t),
      attackTime: 0.001, // Very fast attack
      decayTime: lerp(0.05, 0.15, t),
      sustainLevel: 0.0, // No sustain for pluck
      releaseTime: lerp(0.1, 0.3, t),
      filterType: 'lowpass',
      filterCutoff: lerp(3000, 10000, t),
      filterResonance: lerp(0.2, 0.6, t),
      filterEnvAmount: lerp(0.5, 1.0, t),
      volume: 0.4,
      chorus: lerp(0.1, 0.4, t),
      tags: ['pluck', 'staccato', 'bright', 'cutting']
    })
  }

  // Bright Lead (50)
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `lead_bright_${i + 1}`,
      name: `Bright Lead ${i + 1}`,
      category: 'lead',
      subcategory: 'bright',
      oscillatorType: i % 2 === 0 ? 'square' : 'sawtooth',
      detune: lerp(2, 8, t),
      attackTime: lerp(0.02, 0.08, t),
      decayTime: lerp(0.1, 0.2, t),
      sustainLevel: lerp(0.5, 0.7, t),
      releaseTime: lerp(0.15, 0.35, t),
      filterType: 'lowpass',
      filterCutoff: lerp(4000, 12000, t),
      filterResonance: lerp(0.4, 0.8, t),
      volume: 0.35,
      delay: lerp(0.1, 0.3, t),
      tags: ['bright', 'clear', 'melodic']
    })
  }

  // Epic Lead (40) - For drops
  for (let i = 0; i < 40; i++) {
    const t = i / 39
    presets.push({
      id: `lead_epic_${i + 1}`,
      name: `Epic Lead ${i + 1}`,
      category: 'lead',
      subcategory: 'epic',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: 0.6,
      detune: lerp(10, 25, t),
      attackTime: lerp(0.05, 0.15, t),
      decayTime: lerp(0.15, 0.3, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(0.3, 0.6, t),
      filterType: 'lowpass',
      filterCutoff: lerp(3000, 10000, t),
      filterResonance: lerp(0.5, 0.9, t),
      volume: 0.4,
      unison: 7,
      spread: 0.9,
      reverb: lerp(0.2, 0.4, t),
      tags: ['epic', 'massive', 'drop', 'festival']
    })
  }

  return presets
}

// Generate Bass Presets (200)
function generateBassPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Sub Bass (50) - Deep low end
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `bass_sub_${i + 1}`,
      name: `Sub Bass ${i + 1}`,
      category: 'bass',
      subcategory: 'sub',
      oscillatorType: 'sine',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.7, 0.9, t),
      attackTime: lerp(0.001, 0.01, t),
      decayTime: lerp(0.05, 0.15, t),
      sustainLevel: lerp(0.8, 1.0, t),
      releaseTime: lerp(0.05, 0.15, t),
      filterType: 'lowpass',
      filterCutoff: lerp(80, 200, t),
      filterResonance: lerp(0.1, 0.3, t),
      volume: 0.6,
      tags: ['sub', 'deep', 'low-end', 'foundation']
    })
  }

  // Acid Bass (50) - TB-303 style
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `bass_acid_${i + 1}`,
      name: `Acid Bass ${i + 1}`,
      category: 'bass',
      subcategory: 'acid',
      oscillatorType: 'sawtooth',
      detune: lerp(0, 5, t),
      attackTime: 0.001,
      decayTime: lerp(0.1, 0.3, t),
      sustainLevel: lerp(0.3, 0.7, t),
      releaseTime: lerp(0.05, 0.15, t),
      filterType: 'lowpass',
      filterCutoff: lerp(400, 2000, t),
      filterResonance: lerp(0.6, 0.95, t), // High resonance for squelch
      filterEnvAmount: lerp(0.7, 1.0, t),
      volume: 0.45,
      portamento: lerp(0, 0.1, t),
      tags: ['acid', 'squelch', '303', 'techno']
    })
  }

  // Reese Bass (50) - Fat detuned bass
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `bass_reese_${i + 1}`,
      name: `Reese Bass ${i + 1}`,
      category: 'bass',
      subcategory: 'reese',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(15, 40, t), // Heavy detune
      attackTime: lerp(0.01, 0.05, t),
      decayTime: lerp(0.1, 0.2, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(0.1, 0.2, t),
      filterType: 'lowpass',
      filterCutoff: lerp(300, 1000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.5,
      unison: 4,
      spread: lerp(0.5, 0.8, t),
      tags: ['reese', 'fat', 'heavy', 'drum-and-bass']
    })
  }

  // Wobble Bass (50) - Dubstep style
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `bass_wobble_${i + 1}`,
      name: `Wobble Bass ${i + 1}`,
      category: 'bass',
      subcategory: 'wobble',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: lerp(0.4, 0.7, t),
      detune: lerp(5, 15, t),
      attackTime: 0.001,
      decayTime: lerp(0.05, 0.15, t),
      sustainLevel: lerp(0.6, 0.8, t),
      releaseTime: 0.05,
      filterType: 'lowpass',
      filterCutoff: lerp(300, 1500, t),
      filterResonance: lerp(0.7, 0.95, t),
      filterEnvAmount: 1.0,
      volume: 0.5,
      tags: ['wobble', 'dubstep', 'modulated', 'aggressive']
    })
  }

  return presets
}

// Generate Pad Presets (150)
function generatePadPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Atmospheric (60)
  for (let i = 0; i < 60; i++) {
    const t = i / 59
    presets.push({
      id: `pad_atmospheric_${i + 1}`,
      name: `Atmospheric Pad ${i + 1}`,
      category: 'pad',
      subcategory: 'atmospheric',
      oscillatorType: 'sine',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.5, 0.8, t),
      detune: lerp(3, 12, t),
      attackTime: lerp(0.5, 2.0, t), // Slow attack
      decayTime: lerp(0.3, 0.8, t),
      sustainLevel: lerp(0.6, 0.9, t),
      releaseTime: lerp(1.0, 3.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1000, 4000, t),
      filterResonance: lerp(0.2, 0.5, t),
      volume: 0.25,
      unison: 5,
      spread: lerp(0.7, 1.0, t),
      reverb: lerp(0.4, 0.8, t),
      chorus: lerp(0.2, 0.5, t),
      tags: ['atmospheric', 'ambient', 'spacious', 'ethereal']
    })
  }

  // String Pad (50)
  for (let i = 0; i < 50; i++) {
    const t = i / 49
    presets.push({
      id: `pad_string_${i + 1}`,
      name: `String Pad ${i + 1}`,
      category: 'pad',
      subcategory: 'string',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(8, 15, t),
      attackTime: lerp(0.3, 1.0, t),
      decayTime: lerp(0.2, 0.5, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(0.8, 2.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(2000, 6000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.28,
      unison: 6,
      spread: 0.8,
      reverb: lerp(0.3, 0.6, t),
      tags: ['string', 'orchestral', 'warm', 'lush']
    })
  }

  // Warm Pad (40)
  for (let i = 0; i < 40; i++) {
    const t = i / 39
    presets.push({
      id: `pad_warm_${i + 1}`,
      name: `Warm Pad ${i + 1}`,
      category: 'pad',
      subcategory: 'warm',
      oscillatorType: 'triangle',
      oscillatorType2: 'sine',
      oscillatorMix: lerp(0.6, 0.8, t),
      detune: lerp(2, 8, t),
      attackTime: lerp(0.4, 1.5, t),
      decayTime: lerp(0.2, 0.4, t),
      sustainLevel: lerp(0.7, 0.95, t),
      releaseTime: lerp(1.0, 2.5, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1500, 5000, t),
      filterResonance: lerp(0.2, 0.4, t),
      volume: 0.27,
      chorus: lerp(0.3, 0.6, t),
      reverb: lerp(0.3, 0.5, t),
      tags: ['warm', 'soft', 'gentle', 'mellow']
    })
  }

  return presets
}

// Generate Piano & Keys Presets (100)
function generatePianoPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Bright Piano (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `piano_bright_${i + 1}`,
      name: `Bright Piano ${i + 1}`,
      category: 'piano',
      subcategory: 'piano',
      oscillatorType: 'triangle',
      oscillatorType2: 'sine',
      oscillatorMix: lerp(0.7, 0.9, t),
      attackTime: 0.003,
      decayTime: lerp(0.1, 0.3, t),
      sustainLevel: lerp(0.2, 0.5, t),
      releaseTime: lerp(0.3, 0.8, t),
      filterType: 'lowpass',
      filterCutoff: lerp(3000, 8000, t),
      filterResonance: lerp(0.1, 0.3, t),
      volume: 0.35,
      reverb: lerp(0.1, 0.3, t),
      tags: ['piano', 'bright', 'acoustic', 'melodic']
    })
  }

  // Electric Piano (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `piano_electric_${i + 1}`,
      name: `Electric Piano ${i + 1}`,
      category: 'piano',
      subcategory: 'electric',
      oscillatorType: 'sine',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.5, 0.8, t),
      detune: lerp(0, 5, t),
      attackTime: 0.005,
      decayTime: lerp(0.15, 0.4, t),
      sustainLevel: lerp(0.3, 0.6, t),
      releaseTime: lerp(0.4, 1.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(2000, 6000, t),
      filterResonance: lerp(0.2, 0.5, t),
      volume: 0.33,
      chorus: lerp(0.2, 0.5, t),
      reverb: lerp(0.1, 0.3, t),
      tags: ['electric-piano', 'rhodes', 'wurlitzer', 'vintage']
    })
  }

  // Organ (20)
  for (let i = 0; i < 20; i++) {
    const t = i / 19
    presets.push({
      id: `piano_organ_${i + 1}`,
      name: `Organ ${i + 1}`,
      category: 'piano',
      subcategory: 'organ',
      oscillatorType: 'sine',
      oscillatorType2: 'sine',
      oscillatorMix: 0.5,
      attackTime: 0.001,
      decayTime: 0.05,
      sustainLevel: lerp(0.8, 1.0, t),
      releaseTime: lerp(0.05, 0.2, t),
      filterType: 'lowpass',
      filterCutoff: lerp(2000, 8000, t),
      filterResonance: 0.2,
      volume: 0.4,
      chorus: lerp(0.3, 0.7, t),
      tags: ['organ', 'hammond', 'church', 'sustained']
    })
  }

  // Bell (20)
  for (let i = 0; i < 20; i++) {
    const t = i / 19
    presets.push({
      id: `piano_bell_${i + 1}`,
      name: `Bell ${i + 1}`,
      category: 'piano',
      subcategory: 'bell',
      oscillatorType: 'sine',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.6, 0.9, t),
      detune: lerp(0, 3, t),
      attackTime: 0.001,
      decayTime: lerp(0.3, 1.0, t),
      sustainLevel: lerp(0.1, 0.3, t),
      releaseTime: lerp(1.0, 3.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(4000, 12000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.35,
      reverb: lerp(0.3, 0.6, t),
      tags: ['bell', 'metallic', 'resonant', 'bright']
    })
  }

  return presets
}

// Generate Brass Presets (80)
function generateBrassPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Trumpet (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `brass_trumpet_${i + 1}`,
      name: `Trumpet ${i + 1}`,
      category: 'brass',
      subcategory: 'trumpet',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: lerp(0.6, 0.8, t),
      detune: lerp(2, 8, t),
      attackTime: lerp(0.05, 0.15, t),
      decayTime: lerp(0.1, 0.2, t),
      sustainLevel: lerp(0.6, 0.8, t),
      releaseTime: lerp(0.2, 0.4, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1500, 4000, t),
      filterResonance: lerp(0.4, 0.7, t),
      volume: 0.38,
      reverb: lerp(0.1, 0.3, t),
      tags: ['trumpet', 'brass', 'fanfare', 'bright']
    })
  }

  // Trombone (20)
  for (let i = 0; i < 20; i++) {
    const t = i / 19
    presets.push({
      id: `brass_trombone_${i + 1}`,
      name: `Trombone ${i + 1}`,
      category: 'brass',
      subcategory: 'trombone',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.7, 0.9, t),
      detune: lerp(3, 10, t),
      attackTime: lerp(0.08, 0.2, t),
      decayTime: lerp(0.15, 0.3, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(0.3, 0.5, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1000, 3000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.4,
      tags: ['trombone', 'brass', 'deep', 'mellow']
    })
  }

  // Sax (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `brass_sax_${i + 1}`,
      name: `Sax ${i + 1}`,
      category: 'brass',
      subcategory: 'sax',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: lerp(0.5, 0.7, t),
      detune: lerp(3, 12, t),
      attackTime: lerp(0.03, 0.1, t),
      decayTime: lerp(0.1, 0.25, t),
      sustainLevel: lerp(0.6, 0.85, t),
      releaseTime: lerp(0.2, 0.5, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1200, 3500, t),
      filterResonance: lerp(0.4, 0.75, t),
      volume: 0.37,
      reverb: lerp(0.1, 0.3, t),
      tags: ['saxophone', 'sax', 'smooth', 'jazz']
    })
  }

  return presets
}

// Generate Strings Presets (80)
function generateStringsPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Violin (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `strings_violin_${i + 1}`,
      name: `Violin ${i + 1}`,
      category: 'strings',
      subcategory: 'violin',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.6, 0.8, t),
      detune: lerp(2, 8, t),
      attackTime: lerp(0.1, 0.3, t),
      decayTime: lerp(0.15, 0.3, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(0.4, 0.8, t),
      filterType: 'lowpass',
      filterCutoff: lerp(2000, 6000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.32,
      reverb: lerp(0.2, 0.4, t),
      tags: ['violin', 'strings', 'orchestral', 'expressive']
    })
  }

  // Cello (20)
  for (let i = 0; i < 20; i++) {
    const t = i / 19
    presets.push({
      id: `strings_cello_${i + 1}`,
      name: `Cello ${i + 1}`,
      category: 'strings',
      subcategory: 'cello',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.7, 0.9, t),
      detune: lerp(3, 10, t),
      attackTime: lerp(0.15, 0.4, t),
      decayTime: lerp(0.2, 0.4, t),
      sustainLevel: lerp(0.8, 0.95, t),
      releaseTime: lerp(0.5, 1.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(800, 2500, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.35,
      reverb: lerp(0.2, 0.4, t),
      tags: ['cello', 'strings', 'deep', 'rich']
    })
  }

  // String Ensemble (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `strings_ensemble_${i + 1}`,
      name: `String Ensemble ${i + 1}`,
      category: 'strings',
      subcategory: 'ensemble',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(8, 18, t),
      attackTime: lerp(0.2, 0.6, t),
      decayTime: lerp(0.2, 0.4, t),
      sustainLevel: lerp(0.75, 0.95, t),
      releaseTime: lerp(0.6, 1.5, t),
      filterType: 'lowpass',
      filterCutoff: lerp(1500, 5000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.3,
      unison: 6,
      spread: lerp(0.6, 0.9, t),
      reverb: lerp(0.3, 0.5, t),
      chorus: lerp(0.2, 0.4, t),
      tags: ['strings', 'ensemble', 'orchestral', 'full']
    })
  }

  return presets
}

// Generate FX Presets (90)
function generateFXPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Riser (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `fx_riser_${i + 1}`,
      name: `Riser ${i + 1}`,
      category: 'fx',
      subcategory: 'riser',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: 0.5,
      detune: lerp(10, 30, t),
      attackTime: lerp(2.0, 8.0, t), // Very long attack
      decayTime: 0.1,
      sustainLevel: 0.9,
      releaseTime: 0.5,
      filterType: 'lowpass',
      filterCutoff: lerp(500, 5000, t),
      filterResonance: lerp(0.5, 0.9, t),
      filterEnvAmount: 1.0,
      volume: 0.4,
      unison: 8,
      spread: 1.0,
      reverb: lerp(0.4, 0.8, t),
      tags: ['riser', 'build-up', 'tension', 'fx']
    })
  }

  // Impact (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `fx_impact_${i + 1}`,
      name: `Impact ${i + 1}`,
      category: 'fx',
      subcategory: 'impact',
      oscillatorType: 'square',
      oscillatorType2: 'sawtooth',
      oscillatorMix: lerp(0.4, 0.7, t),
      detune: lerp(20, 50, t),
      attackTime: 0.001,
      decayTime: lerp(0.3, 1.0, t),
      sustainLevel: 0.0,
      releaseTime: lerp(0.5, 2.0, t),
      filterType: 'lowpass',
      filterCutoff: lerp(300, 1500, t),
      filterResonance: lerp(0.6, 0.9, t),
      volume: 0.5,
      unison: 8,
      spread: 1.0,
      reverb: lerp(0.3, 0.7, t),
      tags: ['impact', 'hit', 'drop', 'explosion']
    })
  }

  // Noise (30)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    presets.push({
      id: `fx_noise_${i + 1}`,
      name: `Noise ${i + 1}`,
      category: 'fx',
      subcategory: 'noise',
      oscillatorType: 'sawtooth',
      oscillatorType2: 'square',
      oscillatorMix: 0.5,
      detune: lerp(30, 80, t),
      attackTime: lerp(0.01, 0.5, t),
      decayTime: lerp(0.1, 1.0, t),
      sustainLevel: lerp(0.0, 0.5, t),
      releaseTime: lerp(0.1, 1.0, t),
      filterType: i % 2 === 0 ? 'highpass' : 'lowpass',
      filterCutoff: lerp(1000, 8000, t),
      filterResonance: lerp(0.3, 0.8, t),
      volume: 0.35,
      reverb: lerp(0.2, 0.6, t),
      tags: ['noise', 'texture', 'atmospheric', 'fx']
    })
  }

  return presets
}

// Generate Drums Presets (50)
function generateDrumsPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Kick (13)
  for (let i = 0; i < 13; i++) {
    const t = i / 12
    presets.push({
      id: `drums_kick_${i + 1}`,
      name: `Kick ${i + 1}`,
      category: 'drums',
      subcategory: 'kick',
      oscillatorType: 'sine',
      attackTime: 0.001,
      decayTime: lerp(0.2, 0.8, t),
      sustainLevel: 0.0,
      releaseTime: 0.05,
      filterType: 'lowpass',
      filterCutoff: lerp(100, 300, t),
      filterResonance: 0.3,
      filterEnvAmount: 0.8,
      volume: 0.7,
      tags: ['kick', 'bass-drum', 'electronic', 'punch']
    })
  }

  // Snare (12)
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    presets.push({
      id: `drums_snare_${i + 1}`,
      name: `Snare ${i + 1}`,
      category: 'drums',
      subcategory: 'snare',
      oscillatorType: 'square',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(20, 60, t),
      attackTime: 0.001,
      decayTime: lerp(0.1, 0.25, t),
      sustainLevel: 0.0,
      releaseTime: lerp(0.05, 0.15, t),
      filterType: 'highpass',
      filterCutoff: lerp(1000, 4000, t),
      filterResonance: lerp(0.3, 0.7, t),
      volume: 0.55,
      tags: ['snare', 'snap', 'electronic', 'crisp']
    })
  }

  // Hi-hat (13)
  for (let i = 0; i < 13; i++) {
    const t = i / 12
    presets.push({
      id: `drums_hihat_${i + 1}`,
      name: `Hi-hat ${i + 1}`,
      category: 'drums',
      subcategory: 'hihat',
      oscillatorType: 'square',
      oscillatorType2: 'sawtooth',
      oscillatorMix: 0.5,
      detune: lerp(40, 100, t),
      attackTime: 0.001,
      decayTime: lerp(0.03, 0.15, t),
      sustainLevel: 0.0,
      releaseTime: 0.02,
      filterType: 'highpass',
      filterCutoff: lerp(6000, 12000, t),
      filterResonance: lerp(0.2, 0.6, t),
      volume: 0.4,
      tags: ['hi-hat', 'hihat', 'cymbal', 'electronic']
    })
  }

  // Percussion (12)
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    presets.push({
      id: `drums_perc_${i + 1}`,
      name: `Percussion ${i + 1}`,
      category: 'drums',
      subcategory: 'percussion',
      oscillatorType: i % 2 === 0 ? 'triangle' : 'square',
      detune: lerp(10, 40, t),
      attackTime: 0.001,
      decayTime: lerp(0.05, 0.3, t),
      sustainLevel: 0.0,
      releaseTime: lerp(0.03, 0.2, t),
      filterType: 'bandpass',
      filterCutoff: lerp(800, 4000, t),
      filterResonance: lerp(0.4, 0.8, t),
      volume: 0.45,
      tags: ['percussion', 'tom', 'cowbell', 'clap']
    })
  }

  return presets
}

// Generate Vocal Presets (50)
function generateVocalPresets(): SynthPreset[] {
  const presets: SynthPreset[] = []

  // Vocal Pad (25)
  for (let i = 0; i < 25; i++) {
    const t = i / 24
    presets.push({
      id: `vocal_pad_${i + 1}`,
      name: `Vocal Pad ${i + 1}`,
      category: 'vocal',
      subcategory: 'pad',
      oscillatorType: 'sine',
      oscillatorType2: 'triangle',
      oscillatorMix: lerp(0.6, 0.9, t),
      detune: lerp(5, 15, t),
      attackTime: lerp(0.5, 1.5, t),
      decayTime: lerp(0.3, 0.6, t),
      sustainLevel: lerp(0.7, 0.9, t),
      releaseTime: lerp(1.0, 2.5, t),
      filterType: 'bandpass',
      filterCutoff: lerp(800, 3000, t),
      filterResonance: lerp(0.4, 0.7, t),
      volume: 0.28,
      unison: 5,
      spread: 0.8,
      reverb: lerp(0.4, 0.7, t),
      chorus: lerp(0.3, 0.6, t),
      tags: ['vocal', 'choir', 'ethereal', 'human']
    })
  }

  // Choir (25)
  for (let i = 0; i < 25; i++) {
    const t = i / 24
    presets.push({
      id: `vocal_choir_${i + 1}`,
      name: `Choir ${i + 1}`,
      category: 'vocal',
      subcategory: 'choir',
      oscillatorType: 'triangle',
      oscillatorType2: 'sine',
      oscillatorMix: lerp(0.5, 0.8, t),
      detune: lerp(8, 20, t),
      attackTime: lerp(0.3, 1.0, t),
      decayTime: lerp(0.2, 0.5, t),
      sustainLevel: lerp(0.75, 0.95, t),
      releaseTime: lerp(0.8, 2.0, t),
      filterType: 'bandpass',
      filterCutoff: lerp(1000, 4000, t),
      filterResonance: lerp(0.3, 0.6, t),
      volume: 0.3,
      unison: 7,
      spread: lerp(0.7, 1.0, t),
      reverb: lerp(0.5, 0.8, t),
      chorus: lerp(0.4, 0.7, t),
      tags: ['choir', 'vocal', 'ensemble', 'angelic']
    })
  }

  return presets
}

// Generate all presets
export function generateAllPresets(): SynthPreset[] {
  return [
    ...generateLeadPresets(),     // 200
    ...generateBassPresets(),     // 200
    ...generatePadPresets(),      // 150
    ...generatePianoPresets(),    // 100
    ...generateBrassPresets(),    // 80
    ...generateStringsPresets(),  // 80
    ...generateFXPresets(),       // 90
    ...generateDrumsPresets(),    // 50
    ...generateVocalPresets(),    // 50
  ]
}

// Export preset count for verification
export const PRESET_COUNT = {
  lead: 200,
  bass: 200,
  pad: 150,
  piano: 100,
  brass: 80,
  strings: 80,
  fx: 90,
  drums: 50,
  vocal: 50,
  total: 1000
}
