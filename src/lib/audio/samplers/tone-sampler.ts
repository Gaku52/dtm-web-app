// Tone.js Sampler Integration
// Provides high-quality sampled instruments

import * as Tone from 'tone'
import { ToneJsSample } from './tone-js-library'

export class ToneSampler {
  private sampler: Tone.Sampler | null = null
  private sample: ToneJsSample
  private isLoaded: boolean = false
  private loadPromise: Promise<void> | null = null

  constructor(sample: ToneJsSample) {
    this.sample = sample
  }

  async load(): Promise<void> {
    if (this.isLoaded) return
    if (this.loadPromise) return this.loadPromise

    this.loadPromise = new Promise((resolve, reject) => {
      try {
        // Create note mapping for Sampler
        const urls: Record<string, string> = {}
        this.sample.notes.forEach(note => {
          urls[note] = `${note}.mp3`
        })

        this.sampler = new Tone.Sampler({
          urls,
          baseUrl: this.sample.baseUrl,
          onload: () => {
            console.log(`✅ Loaded ${this.sample.name}`)
            this.isLoaded = true
            resolve()
          },
          onerror: (error) => {
            console.error(`❌ Failed to load ${this.sample.name}:`, error)
            reject(error)
          }
        }).toDestination()
      } catch (error) {
        console.error(`❌ Error creating sampler for ${this.sample.name}:`, error)
        reject(error)
      }
    })

    return this.loadPromise
  }

  async playNote(
    pitch: number,
    duration: number = 0.5,
    velocity: number = 100,
    time?: number
  ): Promise<void> {
    if (!this.isLoaded || !this.sampler) {
      await this.load()
    }

    if (!this.sampler) {
      throw new Error('Sampler not initialized')
    }

    // Convert MIDI number to note name
    const noteName = this.midiToNoteName(pitch)
    const velocityNormalized = velocity / 127
    const playTime = time ?? Tone.now()

    // Play the note
    this.sampler.triggerAttackRelease(noteName, duration, playTime, velocityNormalized)

    console.log(`🎵 Playing ${this.sample.name}: ${noteName} (MIDI ${pitch}), duration: ${duration}s, velocity: ${velocity}`)
  }

  private midiToNoteName(midi: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octave = Math.floor(midi / 12) - 1
    const note = noteNames[midi % 12]
    return `${note}${octave}`
  }

  dispose() {
    if (this.sampler) {
      this.sampler.dispose()
      this.sampler = null
    }
    this.isLoaded = false
    this.loadPromise = null
  }

  get loaded(): boolean {
    return this.isLoaded
  }

  get sampleInfo(): ToneJsSample {
    return this.sample
  }
}

// Cache for loaded samplers
const samplerCache = new Map<string, ToneSampler>()

export function getToneSampler(sample: ToneJsSample): ToneSampler {
  if (!samplerCache.has(sample.id)) {
    samplerCache.set(sample.id, new ToneSampler(sample))
  }
  return samplerCache.get(sample.id)!
}

export function disposeSampler(sampleId: string) {
  const sampler = samplerCache.get(sampleId)
  if (sampler) {
    sampler.dispose()
    samplerCache.delete(sampleId)
  }
}

export function disposeAllSamplers() {
  samplerCache.forEach(sampler => sampler.dispose())
  samplerCache.clear()
}
