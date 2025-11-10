'use client'

import { useEffect, useRef, useState } from 'react'
import { SynthPreset, getPresetById } from '@/lib/audio/presets'
import { AdvancedSynthVoice } from '@/lib/audio/advanced-synth-engine'
import { ToneJsSample, getToneJsSampleById } from '@/lib/audio/samplers/tone-js-library'
import { getToneSampler } from '@/lib/audio/samplers/tone-sampler'
import { start as toneStart } from 'tone'

interface Note {
  id: string
  pitch: number
  start_time: number
  duration: number
  velocity: number
  track_id?: string
}

// Legacy type for backward compatibility
export type InstrumentType = 'piano' | 'synth' | 'bass' | 'drums' | 'guitar' | 'strings' | 'brass' | 'woodwind' | 'vocal' | 'percussion' | 'fx' | 'instrument' | 'lead' | 'pad'

export function useAudioEngine(tempo: number = 120) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const loopRef = useRef<number | null>(null)

  useEffect(() => {
    console.log('🎵 Initializing Web Audio API Engine...')

    try {
      // Web Audio APIを直接使用
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()

      console.log('✅ Web Audio API initialized successfully')
      console.log('AudioContext:', audioContextRef.current)
      console.log('Sample Rate:', audioContextRef.current.sampleRate, 'Hz')
      console.log('Tempo:', tempo, 'BPM')
    } catch (error) {
      console.error('❌ Failed to initialize Web Audio API:', error)
    }

    return () => {
      // クリーンアップ
      console.log('🧹 Cleaning up Web Audio API...')
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [tempo])

  const playNote = async (
    pitch: number,
    duration: number = 0.5,
    velocity: number = 100,
    instrumentOrPresetId: string = 'piano_bright_grand'
  ) => {
    if (!audioContextRef.current) {
      console.error('❌ AudioContext not initialized')
      return
    }

    try {
      const ctx = audioContextRef.current

      // AudioContextを再開（ブラウザのAutoplay policy対応）
      if (ctx.state === 'suspended') {
        await ctx.resume()
        await toneStart()
        console.log('🎵 Audio engines resumed')
      }

      // MIDI番号から周波数を計算 (A4 = 440Hz = MIDI 69)
      const frequency = 440 * Math.pow(2, (pitch - 69) / 12)

      // 1. Check if it's a Tone.js sampler
      const toneJsSample = getToneJsSampleById(instrumentOrPresetId)
      if (toneJsSample) {
        console.log(`🎹 Playing Tone.js sample: ${toneJsSample.name} - MIDI ${pitch}`)
        const sampler = getToneSampler(toneJsSample)
        await sampler.playNote(pitch, duration, velocity)
        console.log('✅ Note played with Tone.js sampler')
        return
      }

      // 2. Check if it's a premium preset
      const preset = getPresetById(instrumentOrPresetId)
      if (preset) {
        console.log(`🎵 Playing premium preset: ${preset.name} - MIDI ${pitch} (${frequency.toFixed(2)}Hz)`)
        const voice = new AdvancedSynthVoice(ctx, preset, frequency, velocity)
        voice.connect(ctx.destination)
        await voice.start(ctx.currentTime, duration)

        // Cleanup after sound finishes
        setTimeout(() => {
          voice.disconnect()
        }, (duration + 5) * 1000)

        console.log('✅ Note played with advanced synth engine')
        return
      }

      // 3. Fallback: use default preset
      console.warn(`⚠️ Instrument/preset "${instrumentOrPresetId}" not found, using default`)
      const defaultPreset = getPresetById('piano_bright_grand') || getPresetById('lead_supersaw_epic')
      if (defaultPreset) {
        const voice = new AdvancedSynthVoice(ctx, defaultPreset, frequency, velocity)
        voice.connect(ctx.destination)
        await voice.start(ctx.currentTime, duration)
        setTimeout(() => {
          voice.disconnect()
        }, (duration + 5) * 1000)
        console.log('✅ Note played with default preset')
      }
    } catch (error) {
      console.error('❌ Error playing note:', error)
    }
  }

  const scheduledNotesRef = useRef<Note[]>([])
  const playbackStartTimeRef = useRef<number>(0)
  const audioStartTimeRef = useRef<number>(0)

  const scheduleNotes = (notes: Note[]) => {
    console.log(`🎵 Scheduling ${notes.length} notes for playback`)
    scheduledNotesRef.current = notes
  }

  const play = async () => {
    if (!audioContextRef.current) {
      console.error('❌ AudioContext not initialized')
      return
    }

    const ctx = audioContextRef.current

    // AudioContextを再開（ブラウザのAutoplay policy対応）
    if (ctx.state === 'suspended') {
      await ctx.resume()
      console.log('🎵 AudioContext resumed')
    }

    console.log('🎵 Starting playback with', scheduledNotesRef.current.length, 'notes')
    setIsPlaying(true)

    // 再生開始時刻を記録
    playbackStartTimeRef.current = currentTime
    audioStartTimeRef.current = ctx.currentTime

    // 各ノートをスケジュール
    scheduledNotesRef.current.forEach((note) => {
      // currentTimeからの相対時間でノートをスケジュール
      const noteStartTime = note.start_time - playbackStartTimeRef.current
      if (noteStartTime >= 0) {
        const audioTime = audioStartTimeRef.current + noteStartTime
        scheduleNoteAtTime(note, audioTime)
      }
    })

    // アニメーションループで時間を更新
    const updateTime = () => {
      if (!audioContextRef.current) return

      const elapsed = audioContextRef.current.currentTime - audioStartTimeRef.current
      const newTime = playbackStartTimeRef.current + elapsed
      setCurrentTime(newTime)

      loopRef.current = requestAnimationFrame(updateTime)
    }
    updateTime()
  }

  const scheduleNoteAtTime = async (note: Note, audioTime: number, presetId: string = 'piano_bright_grand') => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const frequency = 440 * Math.pow(2, (note.pitch - 69) / 12)

    try {
      // Get preset for this note
      const preset = getPresetById(presetId)
      if (preset) {
        const voice = new AdvancedSynthVoice(ctx, preset, frequency, note.velocity)
        voice.connect(ctx.destination)
        await voice.start(audioTime, note.duration)

        // Cleanup after sound finishes
        setTimeout(() => {
          voice.disconnect()
        }, ((audioTime - ctx.currentTime) + note.duration + 5) * 1000)

        console.log(`🎵 Scheduled note: ${preset.name} MIDI ${note.pitch} at time ${audioTime.toFixed(2)}s`)
      }
    } catch (error) {
      console.error('❌ Error scheduling note:', error)
    }
  }

  const pause = () => {
    console.log('🎵 Pausing playback')
    setIsPlaying(false)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
      loopRef.current = null
    }
  }

  const stop = () => {
    console.log('🎵 Stopping playback')
    setIsPlaying(false)
    setCurrentTime(0)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
      loopRef.current = null
    }
  }

  return {
    isPlaying,
    currentTime,
    playNote,
    scheduleNotes,
    play,
    pause,
    stop,
  }
}
