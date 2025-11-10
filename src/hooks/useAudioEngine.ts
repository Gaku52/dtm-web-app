'use client'

import { useEffect, useRef, useState } from 'react'
import { SynthPreset, getPresetById } from '@/lib/audio/presets'
import { AdvancedSynthVoice } from '@/lib/audio/advanced-synth-engine'

interface Note {
  id: string
  pitch: number
  start_time: number
  duration: number
  velocity: number
  track_id?: string
}

export type InstrumentType = 'piano' | 'synth' | 'bass' | 'drums' | 'guitar' | 'strings' | 'brass' | 'woodwind' | 'vocal' | 'percussion' | 'fx' | 'instrument' | 'lead' | 'pad'

// 楽器タイプごとの音色設定
const INSTRUMENT_CONFIGS: Record<InstrumentType, {
  oscillatorType: OscillatorType
  attackTime: number
  decayTime: number
  sustainLevel: number
  releaseTime: number
  volume: number
  detune?: number // デチューン（音の厚み）
}> = {
  piano: {
    oscillatorType: 'triangle',
    attackTime: 0.005,
    decayTime: 0.1,
    sustainLevel: 0.3,
    releaseTime: 0.3,
    volume: 0.3,
  },
  synth: {
    oscillatorType: 'sawtooth',
    attackTime: 0.02,
    decayTime: 0.15,
    sustainLevel: 0.5,
    releaseTime: 0.2,
    volume: 0.25,
    detune: 5, // わずかにデチューン
  },
  bass: {
    oscillatorType: 'sawtooth',
    attackTime: 0.01,
    decayTime: 0.2,
    sustainLevel: 0.7,
    releaseTime: 0.1,
    volume: 0.4,
  },
  drums: {
    oscillatorType: 'square',
    attackTime: 0.001,
    decayTime: 0.05,
    sustainLevel: 0.0,
    releaseTime: 0.05,
    volume: 0.5,
  },
  guitar: {
    oscillatorType: 'sawtooth',
    attackTime: 0.003,
    decayTime: 0.08,
    sustainLevel: 0.4,
    releaseTime: 0.4,
    volume: 0.3,
    detune: 3,
  },
  strings: {
    oscillatorType: 'sawtooth',
    attackTime: 0.15,
    decayTime: 0.2,
    sustainLevel: 0.6,
    releaseTime: 0.5,
    volume: 0.25,
  },
  brass: {
    oscillatorType: 'sawtooth',
    attackTime: 0.05,
    decayTime: 0.1,
    sustainLevel: 0.7,
    releaseTime: 0.3,
    volume: 0.35,
  },
  woodwind: {
    oscillatorType: 'sine',
    attackTime: 0.03,
    decayTime: 0.1,
    sustainLevel: 0.5,
    releaseTime: 0.25,
    volume: 0.28,
  },
  vocal: {
    oscillatorType: 'sine',
    attackTime: 0.02,
    decayTime: 0.15,
    sustainLevel: 0.6,
    releaseTime: 0.3,
    volume: 0.3,
  },
  percussion: {
    oscillatorType: 'square',
    attackTime: 0.001,
    decayTime: 0.08,
    sustainLevel: 0.1,
    releaseTime: 0.1,
    volume: 0.4,
  },
  fx: {
    oscillatorType: 'sine',
    attackTime: 0.1,
    decayTime: 0.3,
    sustainLevel: 0.4,
    releaseTime: 0.5,
    volume: 0.2,
    detune: 10,
  },
  instrument: {
    oscillatorType: 'triangle',
    attackTime: 0.01,
    decayTime: 0.1,
    sustainLevel: 0.4,
    releaseTime: 0.2,
    volume: 0.3,
  },
  lead: {
    oscillatorType: 'sawtooth',
    attackTime: 0.02,
    decayTime: 0.15,
    sustainLevel: 0.6,
    releaseTime: 0.2,
    volume: 0.35,
    detune: 8,
  },
  pad: {
    oscillatorType: 'sine',
    attackTime: 0.5,
    decayTime: 0.3,
    sustainLevel: 0.7,
    releaseTime: 1.5,
    volume: 0.25,
    detune: 10,
  },
}

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
    instrumentOrPreset: InstrumentType | SynthPreset | string = 'piano'
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
        console.log('🎵 AudioContext resumed')
      }

      // プリセットまたは楽器タイプから設定を取得
      let preset: SynthPreset | null = null
      let config: any

      if (typeof instrumentOrPreset === 'string') {
        // プリセットIDかもしれないので検索
        const foundPreset = getPresetById(instrumentOrPreset)
        if (foundPreset) {
          preset = foundPreset
        } else {
          // 楽器タイプとして扱う
          config = INSTRUMENT_CONFIGS[instrumentOrPreset as InstrumentType] || INSTRUMENT_CONFIGS.piano
        }
      } else if (typeof instrumentOrPreset === 'object' && 'oscillatorType' in instrumentOrPreset) {
        // SynthPresetオブジェクト
        preset = instrumentOrPreset
      } else {
        config = INSTRUMENT_CONFIGS[instrumentOrPreset as InstrumentType] || INSTRUMENT_CONFIGS.piano
      }

      // プリセットがあれば使用、なければ従来のconfig
      if (preset) {
        config = preset
      }

      // MIDI番号から周波数を計算 (A4 = 440Hz = MIDI 69)
      const frequency = 440 * Math.pow(2, (pitch - 69) / 12)

      const displayName = preset ? preset.name : (instrumentOrPreset as string)
      console.log(`🎵 Playing ${displayName}: MIDI ${pitch} (${frequency.toFixed(2)}Hz), duration: ${duration}s, velocity: ${velocity}`)

      // If we have a full SynthPreset, use advanced engine
      if (preset && 'lfo' in preset) {
        const voice = new AdvancedSynthVoice(ctx, preset, frequency, velocity)
        voice.connect(ctx.destination)
        await voice.start(ctx.currentTime, duration)

        // Cleanup after sound finishes
        setTimeout(() => {
          voice.disconnect()
        }, (duration + 5) * 1000)

        console.log('✅ Note played with advanced engine')
        return
      }

      // Fallback to basic engine for backward compatibility
      const volume = (velocity / 127) * config.volume
      const oscillator = ctx.createOscillator()
      const oscillator2 = config.oscillatorType2 ? ctx.createOscillator() : null
      const gainNode = ctx.createGain()

      // 第1オシレーターを設定
      oscillator.type = config.oscillatorType
      oscillator.frequency.value = frequency

      // デチューン（音の厚み）を設定
      if (config.detune) {
        oscillator.detune.value = config.detune
      }

      // 第2オシレーター（レイヤリング）
      if (oscillator2 && config.oscillatorType2) {
        oscillator2.type = config.oscillatorType2
        oscillator2.frequency.value = frequency
        if (config.detune) {
          oscillator2.detune.value = -config.detune // 逆方向にデチューン
        }
      }

      // フィルター（オプション）
      let filterNode: BiquadFilterNode | null = null
      if (config.filterCutoff) {
        filterNode = ctx.createBiquadFilter()
        filterNode.type = config.filterType || 'lowpass'
        filterNode.frequency.value = config.filterCutoff
        filterNode.Q.value = (config.filterResonance || 0) * 30 // Resonance scaling
      }

      // エンベロープ（ADSR）を設定
      const now = ctx.currentTime
      const { attackTime, decayTime, sustainLevel, releaseTime } = config

      // Attack
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(volume, now + attackTime)

      // Decay
      gainNode.gain.linearRampToValueAtTime(volume * sustainLevel, now + attackTime + decayTime)

      // Sustain (durationの間維持)
      const sustainDuration = Math.max(0, duration - attackTime - decayTime - releaseTime)

      // Release
      const releaseStart = now + attackTime + decayTime + sustainDuration
      gainNode.gain.setValueAtTime(volume * sustainLevel, releaseStart)
      gainNode.gain.linearRampToValueAtTime(0, releaseStart + releaseTime)

      // オーディオグラフを接続
      if (filterNode) {
        oscillator.connect(filterNode)
        if (oscillator2) oscillator2.connect(filterNode)
        filterNode.connect(gainNode)
      } else {
        oscillator.connect(gainNode)
        if (oscillator2) oscillator2.connect(gainNode)
      }
      gainNode.connect(ctx.destination)

      // 再生
      oscillator.start(now)
      if (oscillator2) oscillator2.start(now)
      oscillator.stop(releaseStart + releaseTime)
      if (oscillator2) oscillator2.stop(releaseStart + releaseTime)

      console.log('✅ Note played successfully (basic engine)')
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

  const scheduleNoteAtTime = (note: Note, audioTime: number) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const frequency = 440 * Math.pow(2, (note.pitch - 69) / 12)
    const volume = (note.velocity / 127) * 0.3

    // オシレーター（音源）を作成
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    // オシレーターを設定
    oscillator.type = 'triangle'
    oscillator.frequency.value = frequency

    // エンベロープ（ADSR）を設定
    const attackTime = 0.005
    const decayTime = 0.1
    const sustainLevel = 0.3
    const releaseTime = 0.1

    // Attack
    gainNode.gain.setValueAtTime(0, audioTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioTime + attackTime)

    // Decay
    gainNode.gain.linearRampToValueAtTime(volume * sustainLevel, audioTime + attackTime + decayTime)

    // Sustain
    const sustainDuration = Math.max(0, note.duration - attackTime - decayTime - releaseTime)

    // Release
    const releaseStart = audioTime + attackTime + decayTime + sustainDuration
    gainNode.gain.setValueAtTime(volume * sustainLevel, releaseStart)
    gainNode.gain.linearRampToValueAtTime(0, releaseStart + releaseTime)

    // オーディオグラフを接続
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // 再生
    oscillator.start(audioTime)
    oscillator.stop(releaseStart + releaseTime)

    console.log(`🎵 Scheduled note: MIDI ${note.pitch} at time ${audioTime.toFixed(2)}s`)
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
