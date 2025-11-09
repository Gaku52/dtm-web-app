import lamejs from 'lamejs'

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

  // Calculate actual duration based on notes
  const maxEndTime = notes.reduce((max, note) => {
    return Math.max(max, note.start_time + note.duration)
  }, 0)
  const actualDuration = Math.min(maxEndTime + 2, duration) // Add 2 seconds buffer

  if (onProgress) onProgress(0)

  // Filter tracks that have solo enabled
  const soloTracks = tracks.filter(t => t.solo)
  const activeTracks = soloTracks.length > 0 ? soloTracks : tracks.filter(t => !t.muted)

  // Create offline audio context
  const sampleRate = 44100
  const numberOfChannels = 2
  const offlineContext = new OfflineAudioContext(
    numberOfChannels,
    sampleRate * actualDuration,
    sampleRate
  )

  if (onProgress) onProgress(10)

  // Create audio for each active track
  activeTracks.forEach((track, trackIndex) => {
    const trackNotes = notes.filter(n => n.track_id === track.id)
    if (trackNotes.length === 0) return

    // Create notes for this track
    trackNotes.forEach(note => {
      const freq = noteNumberToFrequency(note.note_number)
      const velocity = note.velocity / 100
      const trackVolume = track.volume / 100

      // Create oscillator for this note
      const oscillator = offlineContext.createOscillator()
      const gainNode = offlineContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.value = freq

      // ADSR envelope
      const attackTime = 0.01
      const decayTime = 0.1
      const sustainLevel = 0.7
      const releaseTime = 0.3

      const startTime = note.start_time
      const endTime = note.start_time + note.duration
      const volume = velocity * trackVolume

      // Attack
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(volume, startTime + attackTime)

      // Decay to sustain
      gainNode.gain.linearRampToValueAtTime(volume * sustainLevel, startTime + attackTime + decayTime)

      // Sustain (maintain level)
      gainNode.gain.setValueAtTime(volume * sustainLevel, endTime - releaseTime)

      // Release
      gainNode.gain.linearRampToValueAtTime(0, endTime)

      oscillator.connect(gainNode)
      gainNode.connect(offlineContext.destination)

      oscillator.start(startTime)
      oscillator.stop(endTime)
    })

    if (onProgress) onProgress(10 + (trackIndex / activeTracks.length) * 40)
  })

  if (onProgress) onProgress(50)

  // Render offline
  const buffer = await offlineContext.startRendering()

  if (onProgress) onProgress(75)

  // Convert to WAV
  const wavBlob = audioBufferToWav(buffer)

  if (onProgress) onProgress(100)

  return wavBlob
}

// Export to MP3 format
export async function exportToMp3(
  tracks: Track[],
  notes: Note[],
  tempo: number,
  options: ExportOptions
): Promise<Blob> {
  const { quality = 192, duration = 60, onProgress } = options

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

// Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

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

  // Write PCM samples
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]))
    const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
    view.setInt16(offset, int16, true)
    offset += 2
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
    left[i] = leftChannel[i] * 0x7FFF
    right[i] = rightChannel[i] * 0x7FFF
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

  return new Blob([mp3Buffer], { type: 'audio/mp3' })
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
