'use client'

import { useEffect, useRef, useState } from 'react'
// Tone.jsのインポート問題を一時的に回避
// import { PolySynth, Synth, Frequency, start, getTransport } from 'tone'

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
  const synthRef = useRef<any>(null)
  const loopRef = useRef<number | null>(null)

  useEffect(() => {
    // Tone.js機能は一時的に無効化
    console.log('🎵 Audio Engine: Tone.js temporarily disabled')

    // TODO: Tone.jsのインポート問題を解決後に有効化
    /*
    console.log('[DEBUG] PolySynth:', PolySynth)
    console.log('[DEBUG] Synth:', Synth)

    // Synthを初期化
    console.log('🎵 Initializing Audio Engine...')
    try {
      // PolySynthとSynthのコンストラクタを使用
      synthRef.current = new PolySynth(Synth, {
        oscillator: {
          type: 'triangle',
        },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination()

      // テンポを設定
      const transport = getTransport()
      transport.bpm.value = tempo

      console.log('✅ Audio Engine initialized successfully')
      console.log('Synth:', synthRef.current)
      console.log('Tempo:', tempo, 'BPM')
    } catch (error) {
      console.error('❌ Failed to initialize Audio Engine:', error)
    }

    return () => {
      // クリーンアップ
      console.log('🧹 Cleaning up Audio Engine...')
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      const transport = getTransport()
      transport.stop()
      transport.cancel()
    }
    */
  }, [tempo])

  const playNote = async (pitch: number, duration: number = 0.5, velocity: number = 100) => {
    console.log(`🎵 [Placeholder] Would play note: MIDI ${pitch}, duration: ${duration}s, velocity: ${velocity}`)
    // TODO: Tone.js機能を有効化後に実装
    /*
    if (!synthRef.current) {
      console.error('❌ Synth not initialized')
      return
    }

    try {
      await start()
      console.log('🎵 Tone.js context started')

      const frequency = Frequency(pitch, 'midi').toFrequency()
      const volume = (velocity / 127) * 0.8

      console.log(`🎵 Playing note: MIDI ${pitch} (${frequency}Hz), duration: ${duration}s, velocity: ${velocity}`)

      synthRef.current.triggerAttackRelease(frequency, duration, undefined, volume)

      console.log('✅ Note played successfully')
    } catch (error) {
      console.error('❌ Error playing note:', error)
    }
    */
  }

  const scheduleNotes = (notes: Note[]) => {
    console.log(`🎵 [Placeholder] Would schedule ${notes.length} notes`)
    // TODO: Tone.js機能を有効化後に実装
  }

  const play = async () => {
    console.log('🎵 [Placeholder] Would start playback')
    setIsPlaying(true)
    // TODO: Tone.js機能を有効化後に実装
  }

  const pause = () => {
    console.log('🎵 [Placeholder] Would pause playback')
    setIsPlaying(false)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
    }
  }

  const stop = () => {
    console.log('🎵 [Placeholder] Would stop playback')
    setIsPlaying(false)
    setCurrentTime(0)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
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
