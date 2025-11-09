'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Note {
  id: string
  track_id: string
  pitch: number
  start_time: number
  duration: number
  velocity: number
}

interface PianoRollProps {
  projectId: string
  selectedTrackId: string | null
  currentTime: number
  isPlaying: boolean
  tempo?: number
  timeSignature?: string
  onPlayNote?: (pitch: number, duration?: number, velocity?: number) => Promise<void>
}

// Grid constants
const PIXELS_PER_BEAT = 100 // 1拍 = 100px
const PIXELS_PER_SECOND = 50 // 1秒 = 50px (at 120 BPM, 1 beat = 0.5s)
const NOTE_HEIGHT = 20 // 各音程の高さ
const TOTAL_NOTES = 88 // ピアノの鍵盤数（MIDI 21-108）
const LOWEST_NOTE = 21 // A0

export default function PianoRoll({
  projectId,
  selectedTrackId,
  currentTime,
  isPlaying,
  tempo = 120,
  timeSignature = '4/4',
  onPlayNote,
}: PianoRollProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (selectedTrackId) {
      loadNotes()
    }
  }, [selectedTrackId])

  useEffect(() => {
    drawPianoRoll()
  }, [notes, currentTime])

  const loadNotes = async () => {
    if (!selectedTrackId) return

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('track_id', selectedTrackId)

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  const drawPianoRoll = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズを設定
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // 背景
    ctx.fillStyle = '#1F2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 拍子を解析 (例: "4/4" -> beatsPerMeasure=4)
    const [beatsPerMeasure] = timeSignature.split('/').map(Number)
    const pixelsPerMeasure = PIXELS_PER_BEAT * beatsPerMeasure

    // === 縦線（時間軸）を描画 ===
    // 16分音符単位のグリッド（細い線）
    ctx.strokeStyle = '#2D3748'
    ctx.lineWidth = 0.5
    const sixteenthNoteWidth = PIXELS_PER_BEAT / 4 // 16分音符 = 1拍の1/4
    for (let x = 0; x < canvas.width; x += sixteenthNoteWidth) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // 拍単位のグリッド（中間の線）
    ctx.strokeStyle = '#4A5568'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += PIXELS_PER_BEAT) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // 小節単位のグリッド（太い線）
    ctx.strokeStyle = '#718096'
    ctx.lineWidth = 2
    for (let x = 0; x < canvas.width; x += pixelsPerMeasure) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()

      // 小節番号を表示
      ctx.fillStyle = '#A0AEC0'
      ctx.font = '12px monospace'
      const measureNumber = Math.floor(x / pixelsPerMeasure) + 1
      ctx.fillText(`${measureNumber}`, x + 4, 14)
    }

    // === 横線（音程軸）を描画 ===
    ctx.strokeStyle = '#2D3748'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= TOTAL_NOTES; i++) {
      const y = i * NOTE_HEIGHT
      const midiNote = LOWEST_NOTE + (TOTAL_NOTES - i - 1)
      const isWhiteKey = ![1, 3, 6, 8, 10].includes(midiNote % 12) // C#, D#, F#, G#, A# = 黒鍵

      // 白鍵と黒鍵で背景色を変える
      if (!isWhiteKey) {
        ctx.fillStyle = '#2A3544'
        ctx.fillRect(0, y, canvas.width, NOTE_HEIGHT)
      }

      ctx.strokeStyle = '#374151'
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // ノートを描画
    notes.forEach((note) => {
      const x = note.start_time * PIXELS_PER_BEAT // 1拍 = 100px
      const noteIndex = note.pitch - LOWEST_NOTE
      const y = (TOTAL_NOTES - noteIndex - 1) * NOTE_HEIGHT
      const width = note.duration * PIXELS_PER_BEAT
      const height = NOTE_HEIGHT

      // ノートの色（ベロシティで透明度を変える）
      ctx.fillStyle = `rgba(96, 165, 250, ${note.velocity / 127})`
      ctx.fillRect(x, y, width, height)

      // ノートの枠線
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, width, height)
    })

    // 再生ヘッド
    if (isPlaying) {
      const playheadX = currentTime * PIXELS_PER_BEAT
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(playheadX, 0)
      ctx.lineTo(playheadX, canvas.height)
      ctx.stroke()
    }
  }

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTrackId) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // クリック位置から音程と時間を計算（16分音符単位でスナップ）
    const sixteenthNoteWidth = PIXELS_PER_BEAT / 4
    const startTime = Math.floor(x / sixteenthNoteWidth) * (1 / 4) // 16分音符単位

    // 音程を計算
    const noteIndex = Math.floor(y / NOTE_HEIGHT)
    const pitch = LOWEST_NOTE + (TOTAL_NOTES - noteIndex - 1)

    // 音を鳴らす
    if (onPlayNote) {
      console.log('🎹 Piano Roll: Playing note', { pitch, velocity: 100 })
      await onPlayNote(pitch, 0.5, 100)
    }

    // ノートを追加
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            track_id: selectedTrackId,
            pitch,
            start_time: startTime,
            duration: 1, // 1拍
            velocity: 100,
          },
        ])
        .select()
        .single()

      if (error) throw error
      if (data) {
        setNotes([...notes, data])
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  if (!selectedTrackId) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <p className="text-lg mb-2">トラックを選択してください</p>
          <p className="text-sm text-gray-500">
            左側からトラックを選択するか、新しいトラックを追加してください
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col overflow-hidden">
      {/* Piano Roll Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <div className="text-sm text-gray-400">
          クリックしてノートを追加
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-auto bg-gray-900">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-crosshair"
          style={{
            width: '4000px', // 40小節分 (100px * 4拍 * 10小節)
            height: `${TOTAL_NOTES * NOTE_HEIGHT}px`, // 88鍵盤 * 20px
          }}
        />
      </div>
    </div>
  )
}
