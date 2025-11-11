import lamejs from 'lamejs'
import { getPresetById } from './presets'
import { AdvancedSynthVoice } from './advanced-synth-engine'

// Types
export interface Note {
  id: string
  track_id: string
  note_number: number
  start_time: number
  duration: number
  velocity: number
}

export interface Track {
  id: string
  name: string
  instrument: string
  color: string
  volume: number
  muted: boolean
  solo: boolean
}

export interface ExportOptions {
  format: 'wav' | 'mp3'
  quality?: number // MP3 bitrate: 128, 192, 320 (kbps)
  duration?: number // Maximum duration in seconds
  onProgress?: (progress: number) => void
}

// Note number to frequency conversion
function noteNumberToFrequency(noteNumber: number): number {
  return 440 * Math.pow(2, (noteNumber - 69) / 12)
}

// Export to WAV format using Web Audio API
export async function exportToWav(
  tracks: Track[],
  notes: Note[],
  tempo: number,
  options: ExportOptions
): Promise<Blob> {
  const { duration = 60, onProgress } = options

  if (onProgress) onProgress(0)

  // Filter tracks that have solo enabled
  const soloTracks = tracks.filter(t => t.solo)
  const activeTracks = soloTracks.length > 0 ? soloTracks : tracks.filter(t => !t.muted)

  // Filter notes for active tracks only
  const activeTrackIds = new Set(activeTracks.map(t => t.id))
  const activeNotes = notes.filter(n => activeTrackIds.has(n.track_id))

  // Calculate actual duration based on notes
  const maxEndTime = activeNotes.reduce((max, note) => {
    const endTime = (note.start_time || 0) + (note.duration || 0)
    return Math.max(max, endTime)
  }, 0)

  // Ensure minimum duration of 1 second, maximum of requested duration
  const actualDuration = Math.max(1, Math.min(maxEndTime + 2, duration))

  // Validate actualDuration is finite
  if (!isFinite(actualDuration) || actualDuration <= 0) {
    throw new Error('Invalid audio duration calculated')
  }

  // Create offline audio context
  const sampleRate = 44100
  const numberOfChannels = 2
  const offlineContext = new OfflineAudioContext(
    numberOfChannels,
    Math.floor(sampleRate * actualDuration),
    sampleRate
  )

  if (onProgress) onProgress(10)

  console.log('🎵 Exporting with Professional Presets Engine...')

  // Create audio for each active track using AdvancedSynthVoice
  // Process tracks sequentially to handle async preset loading
  for (let trackIndex = 0; trackIndex < activeTracks.length; trackIndex++) {
    const track = activeTracks[trackIndex]
    const trackNotes = activeNotes.filter(n => n.track_id === track.id)

    if (trackNotes.length === 0) continue

    const presetId = track.instrument || 'piano_bright_grand'
    const preset = getPresetById(presetId)

    if (!preset) {
      console.warn(`❌ Preset not found: ${presetId}, using default`)
      continue
    }

    console.log(`🎹 Exporting Track "${track.name}" with preset "${preset.name}"`)

    // Create notes for this track
    for (const note of trackNotes) {
      // Validate note data
      if (!isFinite(note.note_number) || !isFinite(note.start_time) || !isFinite(note.duration)) {
        console.warn('Skipping invalid note:', note)
        continue
      }

      if (note.duration <= 0 || note.start_time < 0) {
        console.warn('Skipping note with invalid timing:', note)
        continue
      }

      const freq = noteNumberToFrequency(note.note_number)
      const velocity = Math.max(0, Math.min(127, note.velocity || 80))

      // Validate frequency
      if (!isFinite(freq) || freq <= 0) {
        console.warn('Skipping note with invalid frequency:', note.note_number)
        continue
      }

      try {
        // Use the same AdvancedSynthVoice as playback!
        const voice = new AdvancedSynthVoice(offlineContext as unknown as AudioContext, preset, freq, velocity)
        voice.connect(offlineContext.destination)
        await voice.start(note.start_time, note.duration)
      } catch (error) {
        console.error('Error creating voice:', error)
      }
    }

    if (onProgress) onProgress(10 + ((trackIndex + 1) / activeTracks.length) * 40)
  }

  console.log('✅ All tracks scheduled for export')

  if (onProgress) onProgress(50)

  // Render offline
  const buffer = await offlineContext.startRendering()

  if (onProgress) onProgress(75)

  // Convert to WAV
  const wavBlob = audioBufferToWav(buffer)

  if (onProgress) onProgress(100)

  return wavBlob
}

// Export to MP3 format (maximum quality)
export async function exportToMp3(
  tracks: Track[],
  notes: Note[],
  tempo: number,
  options: ExportOptions
): Promise<Blob> {
  const { quality = 320, duration = 60, onProgress } = options

  // First render to WAV
  if (onProgress) onProgress(0)

  const wavBlob = await exportToWav(tracks, notes, tempo, {
    format: 'wav',
    duration,
    onProgress: (progress) => {
      if (onProgress) onProgress(progress * 0.7) // WAV rendering is 70% of total
    }
  })

  if (onProgress) onProgress(70)

  // Convert WAV to AudioBuffer
  const arrayBuffer = await wavBlob.arrayBuffer()
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  if (onProgress) onProgress(75)

  // Encode to MP3
  const mp3Blob = await encodeToMp3(audioBuffer, quality, (progress) => {
    if (onProgress) onProgress(75 + progress * 0.25) // MP3 encoding is 25% of total
  })

  if (onProgress) onProgress(100)

  return mp3Blob
}

// Convert AudioBuffer to WAV Blob (32-bit float for maximum quality)
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 3 // IEEE Float (32-bit)
  const bitDepth = 32

  const bytesPerSample = bitDepth / 8
  const blockAlign = numberOfChannels * bytesPerSample

  const data = new Float32Array(buffer.length * numberOfChannels)

  // Interleave channels
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel)
    for (let i = 0; i < buffer.length; i++) {
      data[i * numberOfChannels + channel] = channelData[i]
    }
  }

  const dataLength = data.length * bytesPerSample
  const bufferLength = 44 + dataLength
  const arrayBuffer = new ArrayBuffer(bufferLength)
  const view = new DataView(arrayBuffer)

  // Write WAV header
  let offset = 0

  // "RIFF" chunk descriptor
  writeString(view, offset, 'RIFF'); offset += 4
  view.setUint32(offset, bufferLength - 8, true); offset += 4
  writeString(view, offset, 'WAVE'); offset += 4

  // "fmt " sub-chunk
  writeString(view, offset, 'fmt '); offset += 4
  view.setUint32(offset, 16, true); offset += 4 // Sub-chunk size
  view.setUint16(offset, format, true); offset += 2 // Audio format (PCM)
  view.setUint16(offset, numberOfChannels, true); offset += 2
  view.setUint32(offset, sampleRate, true); offset += 4
  view.setUint32(offset, sampleRate * blockAlign, true); offset += 4 // Byte rate
  view.setUint16(offset, blockAlign, true); offset += 2
  view.setUint16(offset, bitDepth, true); offset += 2

  // "data" sub-chunk
  writeString(view, offset, 'data'); offset += 4
  view.setUint32(offset, dataLength, true); offset += 4

  // Write 32-bit float samples (lossless quality)
  for (let i = 0; i < data.length; i++) {
    view.setFloat32(offset, data[i], true)
    offset += 4
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

// Helper function to write string to DataView
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

// Encode AudioBuffer to MP3
async function encodeToMp3(
  buffer: AudioBuffer,
  bitrate: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const channels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate)
  const mp3Data: Int8Array[] = []

  const samplesPerFrame = 1152
  const leftChannel = buffer.getChannelData(0)
  const rightChannel = channels > 1 ? buffer.getChannelData(1) : leftChannel

  // Convert float samples to int16
  const left = new Int16Array(leftChannel.length)
  const right = new Int16Array(rightChannel.length)

  for (let i = 0; i < leftChannel.length; i++) {
    // Clamp values to [-1, 1] range and convert to int16 with proper rounding
    const leftSample = Math.max(-1, Math.min(1, leftChannel[i]))
    const rightSample = Math.max(-1, Math.min(1, rightChannel[i]))
    left[i] = Math.round(leftSample < 0 ? leftSample * 0x8000 : leftSample * 0x7FFF)
    right[i] = Math.round(rightSample < 0 ? rightSample * 0x8000 : rightSample * 0x7FFF)
  }

  // Encode in chunks
  const totalFrames = Math.ceil(left.length / samplesPerFrame)
  for (let i = 0; i < left.length; i += samplesPerFrame) {
    const leftChunk = left.subarray(i, i + samplesPerFrame)
    const rightChunk = right.subarray(i, i + samplesPerFrame)
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk)

    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }

    if (onProgress && i % (samplesPerFrame * 10) === 0) {
      onProgress((i / left.length) * 100)
    }
  }

  // Flush remaining data
  const mp3buf = mp3encoder.flush()
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf)
  }

  if (onProgress) onProgress(100)

  // Convert Int8Array[] to Uint8Array for Blob
  const mp3Buffer = new Uint8Array(mp3Data.reduce((acc, arr) => acc + arr.length, 0))
  let offset = 0
  mp3Data.forEach(arr => {
    mp3Buffer.set(arr, offset)
    offset += arr.length
  })

  return new Blob([mp3Buffer], { type: 'audio/mpeg' })
}

// Download blob as file
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
