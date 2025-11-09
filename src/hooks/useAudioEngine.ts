'use client'

import { useEffect, useRef, useState } from 'react'

interface Note {
  id: string
  pitch: number
  start_time: number
  duration: number
  velocity: number
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

  const playNote = async (pitch: number, duration: number = 0.5, velocity: number = 100) => {
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

      // MIDI番号から周波数を計算 (A4 = 440Hz = MIDI 69)
      const frequency = 440 * Math.pow(2, (pitch - 69) / 12)
      const volume = (velocity / 127) * 0.3 // 音量を適切に調整

      console.log(`🎵 Playing note: MIDI ${pitch} (${frequency.toFixed(2)}Hz), duration: ${duration}s, velocity: ${velocity}`)

      // オシレーター（音源）を作成
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      // オシレーターを設定
      oscillator.type = 'triangle' // 三角波
      oscillator.frequency.value = frequency

      // エンベロープ（ADSR）を設定
      const now = ctx.currentTime
      const attackTime = 0.005
      const decayTime = 0.1
      const sustainLevel = 0.3
      const releaseTime = 0.1

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
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // 再生
      oscillator.start(now)
      oscillator.stop(releaseStart + releaseTime)

      console.log('✅ Note played successfully')
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
