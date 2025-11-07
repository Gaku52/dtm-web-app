'use client'

import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

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
    // Synthを初期化
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
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
    Tone.Transport.bpm.value = tempo

    return () => {
      // クリーンアップ
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      Tone.Transport.stop()
      Tone.Transport.cancel()
    }
  }, [])

  useEffect(() => {
    Tone.Transport.bpm.value = tempo
  }, [tempo])

  const playNote = (pitch: number, duration: number = 0.5, velocity: number = 100) => {
    if (!synthRef.current) return

    const frequency = Tone.Frequency(pitch, 'midi').toFrequency()
    const volume = (velocity / 127) * 0.8 // 0-0.8の範囲に正規化

    synthRef.current.triggerAttackRelease(frequency, duration, undefined, volume)
  }

  const scheduleNotes = (notes: Note[]) => {
    if (!synthRef.current) return

    // 既存のスケジュールをクリア
    Tone.Transport.cancel()

    notes.forEach((note) => {
      const frequency = Tone.Frequency(note.pitch, 'midi').toFrequency()
      const volume = (note.velocity / 127) * 0.8
      const startTime = `${note.start_time}n` // n = note (quarter note)
      const duration = `${note.duration}n`

      Tone.Transport.schedule((time) => {
        synthRef.current?.triggerAttackRelease(frequency, duration, time, volume)
      }, startTime)
    })
  }

  const play = async () => {
    await Tone.start()
    Tone.Transport.start()
    setIsPlaying(true)

    // 時間を更新するループ
    const updateTime = () => {
      setCurrentTime(Tone.Transport.seconds)
      loopRef.current = requestAnimationFrame(updateTime)
    }
    updateTime()
  }

  const pause = () => {
    Tone.Transport.pause()
    setIsPlaying(false)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
    }
  }

  const stop = () => {
    Tone.Transport.stop()
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
