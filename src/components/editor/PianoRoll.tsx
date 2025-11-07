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
  onPlayNote?: (pitch: number, duration?: number, velocity?: number) => void
}

export default function PianoRoll({
  projectId,
  selectedTrackId,
  currentTime,
  isPlaying,
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

    // グリッド線
    const gridSize = 40
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1

    // 縦線（時間軸）
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // 横線（音程軸）
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // ノートを描画
    ctx.fillStyle = '#60A5FA'
    notes.forEach((note) => {
      const x = note.start_time * 100 // 1拍 = 100px
      const y = (88 - note.pitch) * (canvas.height / 88)
      const width = note.duration * 100
      const height = canvas.height / 88

      ctx.fillStyle = `rgba(96, 165, 250, ${note.velocity / 127})`
      ctx.fillRect(x, y, width, height)
      ctx.strokeStyle = '#3B82F6'
      ctx.strokeRect(x, y, width, height)
    })

    // 再生ヘッド
    if (isPlaying) {
      const playheadX = currentTime * 100
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

    // クリック位置から音程と時間を計算
    const startTime = Math.floor(x / 100) // 100px = 1拍
    const pitch = Math.floor(88 - (y / canvas.height) * 88)

    // 音を鳴らす
    if (onPlayNote) {
      onPlayNote(pitch, 0.5, 100)
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
      <div className="flex-1 relative overflow-auto">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
          style={{ minWidth: '2000px', minHeight: '1000px' }}
        />
      </div>
    </div>
  )
}
