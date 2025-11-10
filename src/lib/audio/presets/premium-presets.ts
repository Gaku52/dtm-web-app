// Premium Hand-Crafted Presets - Professional Quality
// Inspired by Serum, Massive, and Sylenth1

import { SynthPreset } from './types'

export const PREMIUM_PRESETS: SynthPreset[] = [
  // ========================================
  // LEAD SYNTH - Epic & Powerful (10)
  // ========================================
  {
    id: 'lead_supersaw_epic',
    name: 'Epic Supersaw',
    category: 'lead',
    subcategory: 'supersaw',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 25,
    octave: 0,
    attackTime: 0.05,
    decayTime: 0.2,
    sustainLevel: 0.8,
    releaseTime: 0.5,
    filterType: 'lowpass',
    filterCutoff: 4000,
    filterResonance: 0.6,
    filterEnvAmount: 0.8,
    filterAttack: 0.1,
    filterDecay: 0.3,
    filterSustain: 0.7,
    filterRelease: 0.5,
    unison: 8,
    spread: 1.0,
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.25
    },
    tags: ['epic', 'massive', 'drop', 'festival']
  },
  {
    id: 'lead_pluck_sharp',
    name: 'Sharp Pluck',
    category: 'lead',
    subcategory: 'pluck',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.4,
    detune: 8,
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 0.0,
    releaseTime: 0.15,
    filterType: 'lowpass',
    filterCutoff: 8000,
    filterResonance: 0.5,
    filterEnvAmount: 1.0,
    filterAttack: 0.001,
    filterDecay: 0.1,
    filterSustain: 0.0,
    filterRelease: 0.1,
    volume: 0.45,
    delay: {
      enabled: true,
      time: 0.375,
      feedback: 0.3,
      wet: 0.2
    },
    tags: ['pluck', 'staccato', 'bright', 'rhythmic']
  },
  {
    id: 'lead_bright_synth',
    name: 'Bright Lead',
    category: 'lead',
    subcategory: 'bright',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.6,
    detune: 10,
    attackTime: 0.03,
    decayTime: 0.15,
    sustainLevel: 0.7,
    releaseTime: 0.3,
    filterType: 'lowpass',
    filterCutoff: 6000,
    filterResonance: 0.7,
    volume: 0.38,
    lfo: {
      waveform: 'sine',
      rate: 5,
      amount: 0.3,
      target: 'filterCutoff'
    },
    chorus: {
      enabled: true,
      rate: 1.5,
      depth: 0.5,
      feedback: 0.3
    },
    tags: ['bright', 'melodic', 'cutting', 'clear']
  },

  // ========================================
  // BASS - Deep & Powerful (10)
  // ========================================
  {
    id: 'bass_sub_deep',
    name: 'Deep Sub Bass',
    category: 'bass',
    subcategory: 'sub',
    oscillatorType: 'sine',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.8,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 1.0,
    releaseTime: 0.08,
    filterType: 'lowpass',
    filterCutoff: 120,
    filterResonance: 0.2,
    volume: 0.7,
    distortion: 0.1,
    tags: ['sub', 'deep', 'foundation', 'low-end']
  },
  {
    id: 'bass_reese_fat',
    name: 'Fat Reese Bass',
    category: 'bass',
    subcategory: 'reese',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 35,
    octave: -1,
    attackTime: 0.02,
    decayTime: 0.15,
    sustainLevel: 0.9,
    releaseTime: 0.15,
    filterType: 'lowpass',
    filterCutoff: 800,
    filterResonance: 0.5,
    unison: 4,
    spread: 0.7,
    volume: 0.55,
    distortion: 0.2,
    tags: ['reese', 'fat', 'heavy', 'drum-and-bass']
  },
  {
    id: 'bass_acid_303',
    name: 'TB-303 Acid',
    category: 'bass',
    subcategory: 'acid',
    oscillatorType: 'sawtooth',
    detune: 0,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.15,
    sustainLevel: 0.4,
    releaseTime: 0.08,
    filterType: 'lowpass',
    filterCutoff: 600,
    filterResonance: 0.9,
    filterEnvAmount: 1.0,
    filterAttack: 0.001,
    filterDecay: 0.2,
    filterSustain: 0.2,
    filterRelease: 0.1,
    volume: 0.5,
    portamento: 0.05,
    tags: ['acid', 'squelch', '303', 'techno']
  },
  {
    id: 'bass_wobble_monster',
    name: 'Monster Wobble',
    category: 'bass',
    subcategory: 'wobble',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 15,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 0.8,
    releaseTime: 0.05,
    filterType: 'lowpass',
    filterCutoff: 400,
    filterResonance: 0.85,
    lfo: {
      waveform: 'sine',
      rate: 6,
      amount: 0.9,
      target: 'filterCutoff'
    },
    volume: 0.6,
    distortion: 0.3,
    tags: ['wobble', 'dubstep', 'modulated', 'aggressive']
  },

  // ========================================
  // PAD - Atmospheric & Beautiful (8)
  // ========================================
  {
    id: 'pad_ethereal_space',
    name: 'Ethereal Space',
    category: 'pad',
    subcategory: 'atmospheric',
    oscillatorType: 'sine',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.6,
    detune: 12,
    attackTime: 1.5,
    decayTime: 0.5,
    sustainLevel: 0.85,
    releaseTime: 2.5,
    filterType: 'lowpass',
    filterCutoff: 2000,
    filterResonance: 0.3,
    unison: 6,
    spread: 0.9,
    volume: 0.28,
    reverb: {
      enabled: true,
      decay: 4.0,
      wet: 0.6
    },
    chorus: {
      enabled: true,
      rate: 0.5,
      depth: 0.6,
      feedback: 0.4
    },
    tags: ['ethereal', 'spacious', 'ambient', 'dreamy']
  },
  {
    id: 'pad_warm_strings',
    name: 'Warm Strings',
    category: 'pad',
    subcategory: 'string',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 15,
    attackTime: 0.8,
    decayTime: 0.3,
    sustainLevel: 0.8,
    releaseTime: 1.5,
    filterType: 'lowpass',
    filterCutoff: 3500,
    filterResonance: 0.4,
    unison: 7,
    spread: 0.85,
    volume: 0.3,
    lfo: {
      waveform: 'triangle',
      rate: 0.2,
      amount: 0.15,
      target: 'volume'
    },
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.4
    },
    tags: ['warm', 'strings', 'orchestral', 'lush']
  },

  // ========================================
  // PIANO - Bright & Expressive (6)
  // ========================================
  {
    id: 'piano_bright_grand',
    name: 'Bright Grand Piano',
    category: 'piano',
    subcategory: 'piano',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.7,
    detune: 2,
    attackTime: 0.003,
    decayTime: 0.2,
    sustainLevel: 0.3,
    releaseTime: 0.6,
    filterType: 'lowpass',
    filterCutoff: 5000,
    filterResonance: 0.2,
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 1.5,
      wet: 0.2
    },
    tags: ['piano', 'bright', 'acoustic', 'grand']
  },
  {
    id: 'piano_electric_rhodes',
    name: 'Electric Rhodes',
    category: 'piano',
    subcategory: 'electric',
    oscillatorType: 'sine',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.6,
    detune: 3,
    attackTime: 0.005,
    decayTime: 0.3,
    sustainLevel: 0.4,
    releaseTime: 0.8,
    filterType: 'lowpass',
    filterCutoff: 4000,
    filterResonance: 0.3,
    volume: 0.38,
    chorus: {
      enabled: true,
      rate: 2.0,
      depth: 0.4,
      feedback: 0.2
    },
    reverb: {
      enabled: true,
      decay: 1.8,
      wet: 0.25
    },
    tags: ['electric-piano', 'rhodes', 'vintage', 'soulful']
  },

  // ========================================
  // FX - Risers & Impacts (8)
  // ========================================
  {
    id: 'fx_epic_riser',
    name: 'Epic Riser',
    category: 'fx',
    subcategory: 'riser',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 30,
    attackTime: 4.0,
    decayTime: 0.2,
    sustainLevel: 0.9,
    releaseTime: 1.0,
    filterType: 'lowpass',
    filterCutoff: 500,
    filterResonance: 0.7,
    filterEnvAmount: 1.0,
    filterAttack: 4.0,
    filterDecay: 0.5,
    filterSustain: 0.8,
    filterRelease: 1.0,
    noise: {
      type: 'white',
      amount: 0.3
    },
    unison: 8,
    spread: 1.0,
    volume: 0.5,
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.5
    },
    tags: ['riser', 'build-up', 'tension', 'epic']
  },
  {
    id: 'fx_heavy_impact',
    name: 'Heavy Impact',
    category: 'fx',
    subcategory: 'impact',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 40,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.5,
    sustainLevel: 0.0,
    releaseTime: 1.5,
    filterType: 'lowpass',
    filterCutoff: 800,
    filterResonance: 0.8,
    noise: {
      type: 'white',
      amount: 0.5
    },
    unison: 8,
    spread: 1.0,
    volume: 0.65,
    distortion: 0.4,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.6
    },
    tags: ['impact', 'hit', 'drop', 'explosion']
  },

  // ========================================
  // DRUMS - Punchy & Tight (8)
  // ========================================
  {
    id: 'drums_kick_808',
    name: '808 Kick',
    category: 'drums',
    subcategory: 'kick',
    oscillatorType: 'sine',
    octave: -2,
    attackTime: 0.001,
    decayTime: 0.6,
    sustainLevel: 0.0,
    releaseTime: 0.05,
    filterType: 'lowpass',
    filterCutoff: 150,
    filterResonance: 0.3,
    filterEnvAmount: 0.5,
    filterAttack: 0.001,
    filterDecay: 0.15,
    filterSustain: 0.0,
    filterRelease: 0.05,
    lfo: {
      waveform: 'sine',
      rate: 50,
      amount: 0.5,
      target: 'pitch'
    },
    volume: 0.8,
    distortion: 0.15,
    tags: ['kick', '808', 'bass-drum', 'punch']
  },
  {
    id: 'drums_snare_crisp',
    name: 'Crisp Snare',
    category: 'drums',
    subcategory: 'snare',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 50,
    attackTime: 0.001,
    decayTime: 0.15,
    sustainLevel: 0.0,
    releaseTime: 0.1,
    filterType: 'highpass',
    filterCutoff: 2000,
    filterResonance: 0.5,
    noise: {
      type: 'white',
      amount: 0.7
    },
    volume: 0.6,
    distortion: 0.2,
    tags: ['snare', 'crisp', 'snap', 'electronic']
  },
  {
    id: 'drums_hihat_closed',
    name: 'Closed Hi-Hat',
    category: 'drums',
    subcategory: 'hihat',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 80,
    attackTime: 0.001,
    decayTime: 0.05,
    sustainLevel: 0.0,
    releaseTime: 0.02,
    filterType: 'highpass',
    filterCutoff: 8000,
    filterResonance: 0.4,
    noise: {
      type: 'white',
      amount: 0.9
    },
    volume: 0.45,
    tags: ['hi-hat', 'closed', 'tight', 'electronic']
  },

  // ========================================
  // VOCAL - Ethereal & Human (5)
  // ========================================
  {
    id: 'vocal_choir_angelic',
    name: 'Angelic Choir',
    category: 'vocal',
    subcategory: 'choir',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.5,
    detune: 18,
    attackTime: 0.8,
    decayTime: 0.4,
    sustainLevel: 0.85,
    releaseTime: 1.8,
    filterType: 'bandpass',
    filterCutoff: 2000,
    filterResonance: 0.6,
    lfo: {
      waveform: 'sine',
      rate: 0.15,
      amount: 0.2,
      target: 'volume'
    },
    unison: 8,
    spread: 0.95,
    volume: 0.32,
    reverb: {
      enabled: true,
      decay: 4.5,
      wet: 0.7
    },
    chorus: {
      enabled: true,
      rate: 0.3,
      depth: 0.7,
      feedback: 0.5
    },
    tags: ['choir', 'vocal', 'angelic', 'ethereal']
  },

  // ========================================
  // LEAD SYNTH - Additional (7 more)
  // ========================================
  {
    id: 'lead_arpeggio_fast',
    name: 'Fast Arpeggio',
    category: 'lead',
    subcategory: 'pluck',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 5,
    attackTime: 0.001,
    decayTime: 0.05,
    sustainLevel: 0.0,
    releaseTime: 0.1,
    filterType: 'lowpass',
    filterCutoff: 10000,
    filterResonance: 0.4,
    volume: 0.4,
    delay: {
      enabled: true,
      time: 0.125,
      feedback: 0.4,
      wet: 0.3
    },
    tags: ['arpeggio', 'fast', 'rhythmic', 'melodic']
  },
  {
    id: 'lead_synth_saw_stack',
    name: 'Saw Stack Lead',
    category: 'lead',
    subcategory: 'supersaw',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 30,
    attackTime: 0.02,
    decayTime: 0.1,
    sustainLevel: 0.9,
    releaseTime: 0.3,
    filterType: 'lowpass',
    filterCutoff: 5000,
    filterResonance: 0.5,
    unison: 8,
    spread: 1.0,
    volume: 0.38,
    chorus: {
      enabled: true,
      rate: 2.0,
      depth: 0.6,
      feedback: 0.3
    },
    tags: ['supersaw', 'thick', 'powerful', 'festival']
  },
  {
    id: 'lead_metallic_bells',
    name: 'Metallic Bells',
    category: 'lead',
    subcategory: 'bright',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.7,
    detune: 12,
    attackTime: 0.002,
    decayTime: 0.3,
    sustainLevel: 0.2,
    releaseTime: 0.8,
    filterType: 'highpass',
    filterCutoff: 800,
    filterResonance: 0.3,
    volume: 0.42,
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.4
    },
    tags: ['bells', 'metallic', 'bright', 'resonant']
  },
  {
    id: 'lead_vocal_synth',
    name: 'Vocal Lead',
    category: 'lead',
    subcategory: 'bright',
    oscillatorType: 'sawtooth',
    detune: 8,
    attackTime: 0.1,
    decayTime: 0.2,
    sustainLevel: 0.8,
    releaseTime: 0.4,
    filterType: 'bandpass',
    filterCutoff: 1500,
    filterResonance: 0.8,
    lfo: {
      waveform: 'sine',
      rate: 4,
      amount: 0.5,
      target: 'filterCutoff'
    },
    volume: 0.36,
    tags: ['vocal', 'formant', 'human', 'expressive']
  },
  {
    id: 'lead_digital_stab',
    name: 'Digital Stab',
    category: 'lead',
    subcategory: 'pluck',
    oscillatorType: 'square',
    detune: 0,
    attackTime: 0.001,
    decayTime: 0.15,
    sustainLevel: 0.0,
    releaseTime: 0.2,
    filterType: 'lowpass',
    filterCutoff: 12000,
    filterResonance: 0.6,
    filterEnvAmount: 1.0,
    filterAttack: 0.001,
    filterDecay: 0.15,
    filterSustain: 0.0,
    filterRelease: 0.2,
    volume: 0.48,
    distortion: 0.15,
    tags: ['stab', 'digital', 'sharp', 'punchy']
  },
  {
    id: 'lead_portamento_glide',
    name: 'Glide Lead',
    category: 'lead',
    subcategory: 'bright',
    oscillatorType: 'sawtooth',
    detune: 10,
    attackTime: 0.05,
    decayTime: 0.15,
    sustainLevel: 0.75,
    releaseTime: 0.25,
    filterType: 'lowpass',
    filterCutoff: 4500,
    filterResonance: 0.6,
    portamento: 0.15,
    volume: 0.35,
    reverb: {
      enabled: true,
      decay: 2.0,
      wet: 0.3
    },
    tags: ['portamento', 'glide', 'smooth', 'melodic']
  },
  {
    id: 'lead_epic_anthem',
    name: 'Epic Anthem',
    category: 'lead',
    subcategory: 'epic',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.6,
    detune: 20,
    attackTime: 0.08,
    decayTime: 0.25,
    sustainLevel: 0.85,
    releaseTime: 0.6,
    filterType: 'lowpass',
    filterCutoff: 3500,
    filterResonance: 0.7,
    filterEnvAmount: 0.9,
    filterAttack: 0.15,
    filterDecay: 0.3,
    filterSustain: 0.7,
    filterRelease: 0.6,
    unison: 8,
    spread: 1.0,
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 3.5,
      wet: 0.35
    },
    chorus: {
      enabled: true,
      rate: 1.2,
      depth: 0.5,
      feedback: 0.4
    },
    tags: ['epic', 'anthem', 'festival', 'massive']
  },

  // ========================================
  // BASS - Additional (6 more)
  // ========================================
  {
    id: 'bass_growl_midrange',
    name: 'Midrange Growl',
    category: 'bass',
    subcategory: 'wobble',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 20,
    octave: 0,
    attackTime: 0.005,
    decayTime: 0.1,
    sustainLevel: 0.8,
    releaseTime: 0.08,
    filterType: 'bandpass',
    filterCutoff: 800,
    filterResonance: 0.8,
    lfo: {
      waveform: 'square',
      rate: 8,
      amount: 0.85,
      target: 'filterCutoff'
    },
    volume: 0.55,
    distortion: 0.35,
    tags: ['growl', 'midrange', 'aggressive', 'dubstep']
  },
  {
    id: 'bass_sine_sub_clean',
    name: 'Clean Sub Sine',
    category: 'bass',
    subcategory: 'sub',
    oscillatorType: 'sine',
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.05,
    sustainLevel: 1.0,
    releaseTime: 0.05,
    filterType: 'lowpass',
    filterCutoff: 100,
    filterResonance: 0.0,
    volume: 0.75,
    tags: ['sub', 'clean', 'pure', 'fundamental']
  },
  {
    id: 'bass_fm_pluck',
    name: 'FM Bass Pluck',
    category: 'bass',
    subcategory: 'acid',
    oscillatorType: 'sine',
    detune: 5,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.2,
    sustainLevel: 0.0,
    releaseTime: 0.1,
    filterType: 'lowpass',
    filterCutoff: 1200,
    filterResonance: 0.7,
    filterEnvAmount: 0.8,
    filterAttack: 0.001,
    filterDecay: 0.15,
    filterSustain: 0.0,
    filterRelease: 0.1,
    volume: 0.52,
    distortion: 0.1,
    tags: ['fm', 'pluck', 'funky', 'percussive']
  },
  {
    id: 'bass_distorted_monster',
    name: 'Distorted Monster',
    category: 'bass',
    subcategory: 'reese',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 40,
    octave: -1,
    attackTime: 0.01,
    decayTime: 0.1,
    sustainLevel: 0.95,
    releaseTime: 0.1,
    filterType: 'lowpass',
    filterCutoff: 600,
    filterResonance: 0.6,
    unison: 6,
    spread: 0.8,
    volume: 0.6,
    distortion: 0.45,
    tags: ['distorted', 'monster', 'heavy', 'aggressive']
  },
  {
    id: 'bass_funky_slap',
    name: 'Funky Slap Bass',
    category: 'bass',
    subcategory: 'acid',
    oscillatorType: 'triangle',
    detune: 3,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 0.3,
    releaseTime: 0.05,
    filterType: 'lowpass',
    filterCutoff: 2000,
    filterResonance: 0.8,
    filterEnvAmount: 1.0,
    filterAttack: 0.001,
    filterDecay: 0.06,
    filterSustain: 0.2,
    filterRelease: 0.05,
    volume: 0.48,
    tags: ['funky', 'slap', 'percussive', 'rhythmic']
  },
  {
    id: 'bass_detuned_wobble',
    name: 'Detuned Wobble',
    category: 'bass',
    subcategory: 'wobble',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 25,
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.05,
    sustainLevel: 0.9,
    releaseTime: 0.03,
    filterType: 'lowpass',
    filterCutoff: 500,
    filterResonance: 0.9,
    lfo: {
      waveform: 'triangle',
      rate: 4,
      amount: 0.8,
      target: 'filterCutoff'
    },
    unison: 4,
    spread: 0.6,
    volume: 0.58,
    distortion: 0.25,
    tags: ['detuned', 'wobble', 'thick', 'modulated']
  },

  // ========================================
  // PAD - Additional (6 more)
  // ========================================
  {
    id: 'pad_analog_warmth',
    name: 'Analog Warmth',
    category: 'pad',
    subcategory: 'warm',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.6,
    detune: 10,
    attackTime: 1.0,
    decayTime: 0.4,
    sustainLevel: 0.8,
    releaseTime: 2.0,
    filterType: 'lowpass',
    filterCutoff: 2500,
    filterResonance: 0.3,
    unison: 6,
    spread: 0.8,
    volume: 0.3,
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.5
    },
    tags: ['analog', 'warm', 'vintage', 'smooth']
  },
  {
    id: 'pad_celestial_choir',
    name: 'Celestial Choir',
    category: 'pad',
    subcategory: 'atmospheric',
    oscillatorType: 'sine',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.5,
    detune: 15,
    attackTime: 2.0,
    decayTime: 0.6,
    sustainLevel: 0.9,
    releaseTime: 3.0,
    filterType: 'bandpass',
    filterCutoff: 1800,
    filterResonance: 0.5,
    lfo: {
      waveform: 'sine',
      rate: 0.3,
      amount: 0.2,
      target: 'volume'
    },
    unison: 8,
    spread: 1.0,
    volume: 0.26,
    reverb: {
      enabled: true,
      decay: 5.0,
      wet: 0.7
    },
    chorus: {
      enabled: true,
      rate: 0.4,
      depth: 0.7,
      feedback: 0.5
    },
    tags: ['celestial', 'choir', 'heavenly', 'ethereal']
  },
  {
    id: 'pad_dark_ambient',
    name: 'Dark Ambient',
    category: 'pad',
    subcategory: 'atmospheric',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 18,
    octave: -1,
    attackTime: 1.5,
    decayTime: 0.5,
    sustainLevel: 0.85,
    releaseTime: 2.5,
    filterType: 'lowpass',
    filterCutoff: 1200,
    filterResonance: 0.4,
    unison: 7,
    spread: 0.9,
    volume: 0.28,
    reverb: {
      enabled: true,
      decay: 4.5,
      wet: 0.6
    },
    tags: ['dark', 'ambient', 'atmospheric', 'moody']
  },
  {
    id: 'pad_sweeping_motion',
    name: 'Sweeping Motion',
    category: 'pad',
    subcategory: 'atmospheric',
    oscillatorType: 'sawtooth',
    detune: 12,
    attackTime: 1.2,
    decayTime: 0.4,
    sustainLevel: 0.8,
    releaseTime: 2.0,
    filterType: 'lowpass',
    filterCutoff: 2000,
    filterResonance: 0.5,
    lfo: {
      waveform: 'triangle',
      rate: 0.15,
      amount: 0.6,
      target: 'filterCutoff'
    },
    unison: 6,
    spread: 0.85,
    volume: 0.29,
    reverb: {
      enabled: true,
      decay: 3.5,
      wet: 0.5
    },
    tags: ['sweeping', 'motion', 'evolving', 'dynamic']
  },
  {
    id: 'pad_glassy_shimmer',
    name: 'Glassy Shimmer',
    category: 'pad',
    subcategory: 'atmospheric',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.6,
    detune: 20,
    octave: 1,
    attackTime: 0.8,
    decayTime: 0.3,
    sustainLevel: 0.75,
    releaseTime: 1.8,
    filterType: 'highpass',
    filterCutoff: 800,
    filterResonance: 0.4,
    unison: 8,
    spread: 1.0,
    volume: 0.3,
    chorus: {
      enabled: true,
      rate: 1.8,
      depth: 0.6,
      feedback: 0.4
    },
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.5
    },
    tags: ['glassy', 'shimmer', 'bright', 'crystalline']
  },
  {
    id: 'pad_lush_orchestra',
    name: 'Lush Orchestra',
    category: 'pad',
    subcategory: 'string',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 14,
    attackTime: 1.0,
    decayTime: 0.4,
    sustainLevel: 0.85,
    releaseTime: 1.8,
    filterType: 'lowpass',
    filterCutoff: 3000,
    filterResonance: 0.35,
    lfo: {
      waveform: 'sine',
      rate: 0.25,
      amount: 0.15,
      target: 'volume'
    },
    unison: 8,
    spread: 0.9,
    volume: 0.32,
    reverb: {
      enabled: true,
      decay: 2.8,
      wet: 0.45
    },
    tags: ['lush', 'orchestra', 'strings', 'cinematic']
  },

  // ========================================
  // PIANO - Additional (4 more)
  // ========================================
  {
    id: 'piano_soft_touch',
    name: 'Soft Touch Piano',
    category: 'piano',
    subcategory: 'piano',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.8,
    detune: 1,
    attackTime: 0.005,
    decayTime: 0.25,
    sustainLevel: 0.25,
    releaseTime: 0.8,
    filterType: 'lowpass',
    filterCutoff: 4000,
    filterResonance: 0.15,
    volume: 0.35,
    reverb: {
      enabled: true,
      decay: 2.0,
      wet: 0.25
    },
    tags: ['piano', 'soft', 'gentle', 'intimate']
  },
  {
    id: 'piano_jazz_bar',
    name: 'Jazz Bar Piano',
    category: 'piano',
    subcategory: 'piano',
    oscillatorType: 'triangle',
    detune: 2,
    attackTime: 0.004,
    decayTime: 0.18,
    sustainLevel: 0.35,
    releaseTime: 0.5,
    filterType: 'lowpass',
    filterCutoff: 4500,
    filterResonance: 0.25,
    volume: 0.38,
    reverb: {
      enabled: true,
      decay: 1.2,
      wet: 0.15
    },
    tags: ['piano', 'jazz', 'vintage', 'warm']
  },
  {
    id: 'piano_wurlitzer',
    name: 'Wurlitzer Electric',
    category: 'piano',
    subcategory: 'electric',
    oscillatorType: 'sine',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.7,
    detune: 2,
    attackTime: 0.003,
    decayTime: 0.25,
    sustainLevel: 0.35,
    releaseTime: 0.6,
    filterType: 'lowpass',
    filterCutoff: 3500,
    filterResonance: 0.3,
    volume: 0.36,
    chorus: {
      enabled: true,
      rate: 1.5,
      depth: 0.3,
      feedback: 0.2
    },
    reverb: {
      enabled: true,
      decay: 1.5,
      wet: 0.2
    },
    tags: ['wurlitzer', 'electric-piano', 'vintage', 'funky']
  },
  {
    id: 'piano_music_box',
    name: 'Music Box',
    category: 'piano',
    subcategory: 'bell',
    oscillatorType: 'triangle',
    detune: 5,
    octave: 2,
    attackTime: 0.001,
    decayTime: 0.4,
    sustainLevel: 0.0,
    releaseTime: 0.8,
    filterType: 'highpass',
    filterCutoff: 1000,
    filterResonance: 0.2,
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.4
    },
    tags: ['music-box', 'toy', 'delicate', 'nostalgic']
  },

  // ========================================
  // FX - Additional (6 more)
  // ========================================
  {
    id: 'fx_downlifter',
    name: 'Downlifter',
    category: 'fx',
    subcategory: 'riser',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 35,
    attackTime: 0.1,
    decayTime: 3.0,
    sustainLevel: 0.1,
    releaseTime: 0.5,
    filterType: 'lowpass',
    filterCutoff: 8000,
    filterResonance: 0.6,
    filterEnvAmount: -1.0,
    filterAttack: 0.1,
    filterDecay: 3.0,
    filterSustain: 0.1,
    filterRelease: 0.5,
    noise: {
      type: 'white',
      amount: 0.4
    },
    unison: 6,
    spread: 0.9,
    volume: 0.55,
    reverb: {
      enabled: true,
      decay: 2.0,
      wet: 0.5
    },
    tags: ['downlifter', 'drop', 'fall', 'transition']
  },
  {
    id: 'fx_white_noise_sweep',
    name: 'Noise Sweep',
    category: 'fx',
    subcategory: 'noise',
    oscillatorType: 'sine',
    octave: -2,
    attackTime: 0.5,
    decayTime: 1.0,
    sustainLevel: 0.5,
    releaseTime: 1.0,
    filterType: 'highpass',
    filterCutoff: 500,
    filterResonance: 0.7,
    filterEnvAmount: 1.0,
    filterAttack: 0.5,
    filterDecay: 1.5,
    filterSustain: 0.3,
    filterRelease: 1.0,
    noise: {
      type: 'white',
      amount: 1.0
    },
    volume: 0.5,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.4
    },
    tags: ['noise', 'sweep', 'whoosh', 'transition']
  },
  {
    id: 'fx_laser_zap',
    name: 'Laser Zap',
    category: 'fx',
    subcategory: 'impact',
    oscillatorType: 'sine',
    octave: 2,
    attackTime: 0.001,
    decayTime: 0.3,
    sustainLevel: 0.0,
    releaseTime: 0.2,
    filterType: 'lowpass',
    filterCutoff: 10000,
    filterResonance: 0.9,
    filterEnvAmount: -1.0,
    filterAttack: 0.001,
    filterDecay: 0.25,
    filterSustain: 0.0,
    filterRelease: 0.2,
    lfo: {
      waveform: 'sine',
      rate: 30,
      amount: 0.8,
      target: 'pitch'
    },
    volume: 0.5,
    distortion: 0.2,
    tags: ['laser', 'zap', 'sci-fi', 'electronic']
  },
  {
    id: 'fx_explosion',
    name: 'Explosion',
    category: 'fx',
    subcategory: 'impact',
    oscillatorType: 'square',
    octave: -2,
    attackTime: 0.001,
    decayTime: 0.8,
    sustainLevel: 0.0,
    releaseTime: 1.5,
    filterType: 'lowpass',
    filterCutoff: 2000,
    filterResonance: 0.5,
    noise: {
      type: 'white',
      amount: 0.8
    },
    unison: 8,
    spread: 1.0,
    volume: 0.7,
    distortion: 0.5,
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.6
    },
    tags: ['explosion', 'boom', 'impact', 'heavy']
  },
  {
    id: 'fx_vinyl_stop',
    name: 'Vinyl Stop',
    category: 'fx',
    subcategory: 'impact',
    oscillatorType: 'sawtooth',
    detune: 20,
    attackTime: 0.001,
    decayTime: 0.6,
    sustainLevel: 0.0,
    releaseTime: 0.1,
    filterType: 'lowpass',
    filterCutoff: 5000,
    filterResonance: 0.4,
    lfo: {
      waveform: 'sine',
      rate: 15,
      amount: 1.0,
      target: 'pitch'
    },
    volume: 0.45,
    tags: ['vinyl', 'stop', 'slow-down', 'retro']
  },
  {
    id: 'fx_build_tension',
    name: 'Tension Builder',
    category: 'fx',
    subcategory: 'riser',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.5,
    detune: 25,
    attackTime: 3.0,
    decayTime: 0.3,
    sustainLevel: 0.8,
    releaseTime: 0.5,
    filterType: 'lowpass',
    filterCutoff: 800,
    filterResonance: 0.8,
    filterEnvAmount: 1.0,
    filterAttack: 3.0,
    filterDecay: 0.5,
    filterSustain: 0.7,
    filterRelease: 0.5,
    noise: {
      type: 'white',
      amount: 0.25
    },
    unison: 7,
    spread: 1.0,
    volume: 0.48,
    delay: {
      enabled: true,
      time: 0.25,
      feedback: 0.5,
      wet: 0.3
    },
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.4
    },
    tags: ['tension', 'build', 'anticipation', 'pre-drop']
  },

  // ========================================
  // DRUMS - Additional (5 more)
  // ========================================
  {
    id: 'drums_rim_shot',
    name: 'Rim Shot',
    category: 'drums',
    subcategory: 'snare',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 40,
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 0.0,
    releaseTime: 0.05,
    filterType: 'highpass',
    filterCutoff: 3000,
    filterResonance: 0.4,
    noise: {
      type: 'white',
      amount: 0.5
    },
    volume: 0.5,
    tags: ['rim-shot', 'snap', 'sharp', 'percussion']
  },
  {
    id: 'drums_clap',
    name: 'Hand Clap',
    category: 'drums',
    subcategory: 'percussion',
    oscillatorType: 'square',
    detune: 60,
    attackTime: 0.001,
    decayTime: 0.1,
    sustainLevel: 0.0,
    releaseTime: 0.08,
    filterType: 'bandpass',
    filterCutoff: 1500,
    filterResonance: 0.5,
    noise: {
      type: 'white',
      amount: 0.8
    },
    volume: 0.55,
    delay: {
      enabled: true,
      time: 0.02,
      feedback: 0.4,
      wet: 0.3
    },
    tags: ['clap', 'hand', 'percussion', 'electronic']
  },
  {
    id: 'drums_tom_low',
    name: 'Low Tom',
    category: 'drums',
    subcategory: 'percussion',
    oscillatorType: 'sine',
    octave: -1,
    attackTime: 0.001,
    decayTime: 0.3,
    sustainLevel: 0.0,
    releaseTime: 0.1,
    filterType: 'lowpass',
    filterCutoff: 400,
    filterResonance: 0.6,
    lfo: {
      waveform: 'sine',
      rate: 40,
      amount: 0.3,
      target: 'pitch'
    },
    volume: 0.65,
    tags: ['tom', 'low', 'drum', 'percussion']
  },
  {
    id: 'drums_ride_cymbal',
    name: 'Ride Cymbal',
    category: 'drums',
    subcategory: 'hihat',
    oscillatorType: 'square',
    oscillatorType2: 'sawtooth',
    oscillatorMix: 0.5,
    detune: 100,
    attackTime: 0.001,
    decayTime: 0.4,
    sustainLevel: 0.1,
    releaseTime: 0.3,
    filterType: 'highpass',
    filterCutoff: 6000,
    filterResonance: 0.3,
    noise: {
      type: 'white',
      amount: 0.7
    },
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 1.5,
      wet: 0.2
    },
    tags: ['ride', 'cymbal', 'metallic', 'sustained']
  },
  {
    id: 'drums_shaker',
    name: 'Shaker',
    category: 'drums',
    subcategory: 'percussion',
    oscillatorType: 'square',
    detune: 80,
    attackTime: 0.001,
    decayTime: 0.06,
    sustainLevel: 0.0,
    releaseTime: 0.04,
    filterType: 'highpass',
    filterCutoff: 7000,
    filterResonance: 0.2,
    noise: {
      type: 'white',
      amount: 0.95
    },
    volume: 0.35,
    tags: ['shaker', 'percussion', 'rhythm', 'light']
  },

  // ========================================
  // VOCAL - Additional (4 more)
  // ========================================
  {
    id: 'vocal_formant_pad',
    name: 'Formant Pad',
    category: 'vocal',
    subcategory: 'pad',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.5,
    detune: 12,
    attackTime: 0.6,
    decayTime: 0.3,
    sustainLevel: 0.8,
    releaseTime: 1.2,
    filterType: 'bandpass',
    filterCutoff: 1800,
    filterResonance: 0.7,
    lfo: {
      waveform: 'sine',
      rate: 0.2,
      amount: 0.3,
      target: 'filterCutoff'
    },
    unison: 7,
    spread: 0.9,
    volume: 0.3,
    reverb: {
      enabled: true,
      decay: 3.5,
      wet: 0.6
    },
    tags: ['formant', 'vocal', 'pad', 'human']
  },
  {
    id: 'vocal_breath_whisper',
    name: 'Breath Whisper',
    category: 'vocal',
    subcategory: 'pad',
    oscillatorType: 'sine',
    detune: 8,
    attackTime: 0.4,
    decayTime: 0.2,
    sustainLevel: 0.6,
    releaseTime: 1.0,
    filterType: 'highpass',
    filterCutoff: 2000,
    filterResonance: 0.3,
    noise: {
      type: 'white',
      amount: 0.6
    },
    unison: 5,
    spread: 0.8,
    volume: 0.25,
    reverb: {
      enabled: true,
      decay: 3.0,
      wet: 0.55
    },
    tags: ['breath', 'whisper', 'airy', 'intimate']
  },
  {
    id: 'vocal_epic_ohh',
    name: 'Epic Ohh',
    category: 'vocal',
    subcategory: 'choir',
    oscillatorType: 'triangle',
    oscillatorType2: 'sine',
    oscillatorMix: 0.6,
    detune: 15,
    attackTime: 0.5,
    decayTime: 0.3,
    sustainLevel: 0.9,
    releaseTime: 1.5,
    filterType: 'bandpass',
    filterCutoff: 1500,
    filterResonance: 0.6,
    unison: 8,
    spread: 1.0,
    volume: 0.33,
    chorus: {
      enabled: true,
      rate: 0.4,
      depth: 0.6,
      feedback: 0.4
    },
    reverb: {
      enabled: true,
      decay: 4.0,
      wet: 0.65
    },
    tags: ['epic', 'ohh', 'vocal', 'cinematic']
  },
  {
    id: 'vocal_staccato_choir',
    name: 'Staccato Choir',
    category: 'vocal',
    subcategory: 'choir',
    oscillatorType: 'triangle',
    detune: 10,
    attackTime: 0.05,
    decayTime: 0.15,
    sustainLevel: 0.0,
    releaseTime: 0.3,
    filterType: 'bandpass',
    filterCutoff: 2000,
    filterResonance: 0.5,
    unison: 6,
    spread: 0.85,
    volume: 0.36,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.5
    },
    tags: ['staccato', 'choir', 'short', 'rhythmic']
  },

  // ========================================
  // BRASS - New Category (3)
  // ========================================
  {
    id: 'brass_trumpet_bright',
    name: 'Bright Trumpet',
    category: 'brass',
    subcategory: 'trumpet',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'square',
    oscillatorMix: 0.6,
    detune: 8,
    attackTime: 0.05,
    decayTime: 0.12,
    sustainLevel: 0.75,
    releaseTime: 0.25,
    filterType: 'lowpass',
    filterCutoff: 3000,
    filterResonance: 0.5,
    filterEnvAmount: 0.6,
    filterAttack: 0.08,
    filterDecay: 0.15,
    filterSustain: 0.6,
    filterRelease: 0.3,
    volume: 0.4,
    reverb: {
      enabled: true,
      decay: 1.8,
      wet: 0.3
    },
    tags: ['trumpet', 'brass', 'bright', 'bold']
  },
  {
    id: 'brass_trombone_deep',
    name: 'Deep Trombone',
    category: 'brass',
    subcategory: 'trombone',
    oscillatorType: 'sawtooth',
    detune: 5,
    octave: -1,
    attackTime: 0.08,
    decayTime: 0.15,
    sustainLevel: 0.8,
    releaseTime: 0.3,
    filterType: 'lowpass',
    filterCutoff: 2000,
    filterResonance: 0.4,
    volume: 0.42,
    reverb: {
      enabled: true,
      decay: 2.0,
      wet: 0.35
    },
    tags: ['trombone', 'brass', 'deep', 'powerful']
  },
  {
    id: 'brass_sax_smooth',
    name: 'Smooth Sax',
    category: 'brass',
    subcategory: 'sax',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.6,
    detune: 6,
    attackTime: 0.06,
    decayTime: 0.12,
    sustainLevel: 0.7,
    releaseTime: 0.35,
    filterType: 'lowpass',
    filterCutoff: 2500,
    filterResonance: 0.5,
    lfo: {
      waveform: 'sine',
      rate: 0.5,
      amount: 0.15,
      target: 'volume'
    },
    volume: 0.38,
    reverb: {
      enabled: true,
      decay: 2.2,
      wet: 0.3
    },
    tags: ['saxophone', 'sax', 'smooth', 'jazzy']
  },

  // ========================================
  // STRINGS - New Category (2)
  // ========================================
  {
    id: 'strings_violin_expressive',
    name: 'Expressive Violin',
    category: 'strings',
    subcategory: 'violin',
    oscillatorType: 'sawtooth',
    detune: 8,
    attackTime: 0.12,
    decayTime: 0.2,
    sustainLevel: 0.8,
    releaseTime: 0.4,
    filterType: 'lowpass',
    filterCutoff: 4000,
    filterResonance: 0.4,
    lfo: {
      waveform: 'sine',
      rate: 0.3,
      amount: 0.12,
      target: 'volume'
    },
    volume: 0.35,
    reverb: {
      enabled: true,
      decay: 2.5,
      wet: 0.4
    },
    tags: ['violin', 'strings', 'expressive', 'solo']
  },
  {
    id: 'strings_cello_rich',
    name: 'Rich Cello',
    category: 'strings',
    subcategory: 'cello',
    oscillatorType: 'sawtooth',
    oscillatorType2: 'triangle',
    oscillatorMix: 0.6,
    detune: 6,
    octave: -1,
    attackTime: 0.15,
    decayTime: 0.25,
    sustainLevel: 0.75,
    releaseTime: 0.5,
    filterType: 'lowpass',
    filterCutoff: 2500,
    filterResonance: 0.35,
    volume: 0.38,
    reverb: {
      enabled: true,
      decay: 2.8,
      wet: 0.4
    },
    tags: ['cello', 'strings', 'rich', 'warm']
  },
]

export const PREMIUM_PRESET_COUNT = PREMIUM_PRESETS.length

console.log(`🎵 Premium Preset Library: ${PREMIUM_PRESET_COUNT} hand-crafted presets`)
