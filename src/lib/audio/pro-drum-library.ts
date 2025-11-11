// Professional Drum Sample Library
// High-quality drum samples from legendary drum machines
// Includes 909, CR-78, Linn Drum, and more

export interface DrumSample {
  id: string
  name: string
  category: 'kick' | 'snare' | 'hihat' | 'tom' | 'cymbal' | 'perc'
  machine: string        // Source drum machine
  url: string           // Sample URL
  note?: string         // MIDI note if applicable
  description: string
  quality: 'standard' | 'premium'
}

// Professional drum machines
export const PRO_DRUM_MACHINES = {
  // Roland TR-909 (House/Techno standard)
  TR909: {
    id: 'tr909',
    name: 'Roland TR-909',
    year: 1983,
    description: 'Legendary analog/digital hybrid. The sound of house and techno.',
    baseUrl: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/909'
  },

  // Roland CR-78 (First programmable rhythm machine)
  CR78: {
    id: 'cr78',
    name: 'Roland CR-78',
    year: 1978,
    description: 'First programmable drum machine. Used by Phil Collins, Ultravox.',
    baseUrl: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/cr'
  },

  // Linn Drum (80s pop standard)
  LINN: {
    id: 'linn',
    name: 'Linn Drum LM-1',
    year: 1980,
    description: 'First drum machine with real recorded samples. 80s pop icon.',
    baseUrl: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/linnhats'
  },

  // Oberheim DMX (Hip-hop classic)
  DMX: {
    id: 'dmx',
    name: 'Oberheim DMX',
    year: 1981,
    description: 'Hip-hop classic. Used by Run-DMC, LL Cool J.',
    baseUrl: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/hit'
  }
}

// Professional drum samples
export const PRO_DRUM_SAMPLES: DrumSample[] = [
  // ========================================
  // TR-909 (House/Techno)
  // ========================================
  {
    id: '909_kick_1',
    name: '909 Kick (Classic)',
    category: 'kick',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/BD/0.wav`,
    description: 'Classic 909 kick. Punchy and deep. Perfect for house.',
    quality: 'premium'
  },
  {
    id: '909_kick_2',
    name: '909 Kick (Hard)',
    category: 'kick',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/BD/1.wav`,
    description: 'Hard-hitting 909 kick. Aggressive techno sound.',
    quality: 'premium'
  },
  {
    id: '909_snare_1',
    name: '909 Snare (Tight)',
    category: 'snare',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/SD/0.wav`,
    description: 'Tight 909 snare. Essential for techno and house.',
    quality: 'premium'
  },
  {
    id: '909_snare_2',
    name: '909 Snare (Rim)',
    category: 'snare',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/SD/1.wav`,
    description: 'Rimshot-style 909 snare. Sharp and cutting.',
    quality: 'premium'
  },
  {
    id: '909_hihat_closed',
    name: '909 Hi-hat (Closed)',
    category: 'hihat',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/CH/0.wav`,
    description: 'Classic closed hi-hat. Crisp and metallic.',
    quality: 'premium'
  },
  {
    id: '909_hihat_open',
    name: '909 Hi-hat (Open)',
    category: 'hihat',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/OH/0.wav`,
    description: 'Open hi-hat with long decay. House groove essential.',
    quality: 'premium'
  },
  {
    id: '909_clap',
    name: '909 Clap',
    category: 'perc',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/CP/0.wav`,
    description: 'Iconic 909 handclap. Dense and powerful.',
    quality: 'premium'
  },
  {
    id: '909_cymbal',
    name: '909 Cymbal (Crash)',
    category: 'cymbal',
    machine: 'TR-909',
    url: `${PRO_DRUM_MACHINES.TR909.baseUrl}/CY/0.wav`,
    description: 'Bright crash cymbal. Perfect for transitions.',
    quality: 'premium'
  },

  // ========================================
  // CR-78 (Vintage Character)
  // ========================================
  {
    id: 'cr78_kick',
    name: 'CR-78 Kick',
    category: 'kick',
    machine: 'CR-78',
    url: `${PRO_DRUM_MACHINES.CR78.baseUrl}/0.wav`,
    description: 'Vintage analog kick. Warm and round.',
    quality: 'premium'
  },
  {
    id: 'cr78_snare',
    name: 'CR-78 Snare',
    category: 'snare',
    machine: 'CR-78',
    url: `${PRO_DRUM_MACHINES.CR78.baseUrl}/1.wav`,
    description: 'Classic 70s snare sound. Used by Phil Collins.',
    quality: 'premium'
  },

  // ========================================
  // Linn Drum (80s Pop)
  // ========================================
  {
    id: 'linn_hihat_closed',
    name: 'Linn Hi-hat (Closed)',
    category: 'hihat',
    machine: 'Linn Drum',
    url: `${PRO_DRUM_MACHINES.LINN.baseUrl}/0.wav`,
    description: 'Natural sampled hi-hat. 80s pop sound.',
    quality: 'premium'
  },
  {
    id: 'linn_hihat_open',
    name: 'Linn Hi-hat (Open)',
    category: 'hihat',
    machine: 'Linn Drum',
    url: `${PRO_DRUM_MACHINES.LINN.baseUrl}/1.wav`,
    description: 'Realistic open hi-hat sample.',
    quality: 'premium'
  },

  // ========================================
  // DMX (Hip-hop)
  // ========================================
  {
    id: 'dmx_snare',
    name: 'DMX Snare',
    category: 'snare',
    machine: 'DMX',
    url: `${PRO_DRUM_MACHINES.DMX.baseUrl}/0.wav`,
    description: 'Punchy DMX snare. Hip-hop classic.',
    quality: 'premium'
  }
]

// Get drum sample by ID
export function getDrumSampleById(id: string): DrumSample | undefined {
  return PRO_DRUM_SAMPLES.find(s => s.id === id)
}

// Get samples by category
export function getDrumSamplesByCategory(category: DrumSample['category']): DrumSample[] {
  return PRO_DRUM_SAMPLES.filter(s => s.category === category)
}

// Get samples by machine
export function getDrumSamplesByMachine(machine: string): DrumSample[] {
  return PRO_DRUM_SAMPLES.filter(s => s.machine === machine)
}

// Load drum sample
export async function loadDrumSample(
  ctx: AudioContext,
  sampleId: string
): Promise<AudioBuffer> {
  const sample = getDrumSampleById(sampleId)
  if (!sample) {
    throw new Error(`Drum sample not found: ${sampleId}`)
  }

  const response = await fetch(sample.url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

  return audioBuffer
}

// Play drum sample
export async function playDrumSample(
  ctx: AudioContext,
  sampleId: string,
  startTime: number,
  velocity: number = 1.0,
  destination: AudioNode
) {
  const buffer = await loadDrumSample(ctx, sampleId)

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const gain = ctx.createGain()
  gain.gain.value = velocity

  source.connect(gain)
  gain.connect(destination)

  source.start(startTime)
}

console.log('🥁 Professional Drum Library Loaded')
console.log(`   Machines: ${Object.keys(PRO_DRUM_MACHINES).length} (909, CR-78, Linn, DMX)`)
console.log(`   Samples: ${PRO_DRUM_SAMPLES.length} premium drum sounds`)
console.log('   Quality: Studio-grade recordings from legendary hardware')
console.log('   Perfect for: House, Techno, Hip-hop, 80s pop')
console.log('   🎹 The sound of classic drum machines!')
