'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type TrackType = 'vocal' | 'bass' | 'drums' | 'guitar' | 'piano' | 'synth' | 'strings' | 'brass' | 'woodwind' | 'percussion' | 'fx' | 'instrument'

interface Track {
  id: string
  name: string
  instrument: string
  track_type?: TrackType
  icon?: string
  color: string
  volume: number
  muted: boolean
  solo: boolean
}

// Track type configurations
const TRACK_TYPE_CONFIG: Record<TrackType, { label: string; icon: string; defaultColor: string }> = {
  vocal: { label: 'ボーカル', icon: '🎤', defaultColor: '#EF4444' },
  bass: { label: 'ベース', icon: '🎸', defaultColor: '#10B981' },
  drums: { label: 'ドラム', icon: '🥁', defaultColor: '#F59E0B' },
  guitar: { label: 'ギター', icon: '🎸', defaultColor: '#8B5CF6' },
  piano: { label: 'ピアノ', icon: '🎹', defaultColor: '#3B82F6' },
  synth: { label: 'シンセ', icon: '🎛️', defaultColor: '#EC4899' },
  strings: { label: 'ストリングス', icon: '🎻', defaultColor: '#F97316' },
  brass: { label: 'ブラス', icon: '🎺', defaultColor: '#FBBF24' },
  woodwind: { label: 'ウッドウィンド', icon: '🎷', defaultColor: '#84CC16' },
  percussion: { label: 'パーカッション', icon: '🥁', defaultColor: '#F43F5E' },
  fx: { label: 'FX', icon: '✨', defaultColor: '#06B6D4' },
  instrument: { label: '楽器', icon: '🎵', defaultColor: '#60A5FA' },
}

interface TrackListProps {
  projectId: string
  selectedTrackId: string | null
  onSelectTrack: (trackId: string) => void
}

export default function TrackList({
  projectId,
  selectedTrackId,
  onSelectTrack,
}: TrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTracks()
  }, [projectId])

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setTracks(data || [])

      // 自動的に最初のトラックを選択
      if (data && data.length > 0 && !selectedTrackId) {
        onSelectTrack(data[0].id)
      }
    } catch (error) {
      console.error('Error loading tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTrack = async () => {
    try {
      // 既存のトラックタイプをカウントして、次のトラックタイプを決定
      const trackTypeOrder: TrackType[] = ['vocal', 'bass', 'drums', 'guitar', 'piano', 'synth']
      const nextTypeIndex = tracks.length % trackTypeOrder.length
      const trackType = trackTypeOrder[nextTypeIndex]
      const config = TRACK_TYPE_CONFIG[trackType]

      const { data, error} = await supabase
        .from('tracks')
        .insert([
          {
            project_id: projectId,
            name: `${config.label} ${Math.floor(tracks.length / trackTypeOrder.length) + 1}`,
            instrument: trackType,
            track_type: trackType,
            icon: config.icon,
            color: config.defaultColor,
            volume: 80,
            muted: false,
            solo: false,
            order_index: tracks.length,
          },
        ])
        .select()
        .single()

      if (error) throw error
      if (data) {
        setTracks([...tracks, data])
        onSelectTrack(data.id)
      }
    } catch (error) {
      console.error('Error adding track:', error)
    }
  }

  const toggleMute = async (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (!track) return

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ muted: !track.muted })
        .eq('id', trackId)

      if (error) throw error

      setTracks(
        tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
      )
    } catch (error) {
      console.error('Error toggling mute:', error)
    }
  }

  const toggleSolo = async (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (!track) return

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ solo: !track.solo })
        .eq('id', trackId)

      if (error) throw error

      setTracks(
        tracks.map((t) => (t.id === trackId ? { ...t, solo: !t.solo } : t))
      )
    } catch (error) {
      console.error('Error toggling solo:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">トラック</h3>
        <button
          onClick={addTrack}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          トラックを追加
        </button>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="p-4 text-sm text-gray-400 text-center">
            トラックがありません
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`p-3 border-b border-gray-700 cursor-pointer transition-colors ${
                selectedTrackId === track.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-750'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Track Icon */}
                  <div className="text-lg flex-shrink-0">
                    {track.icon || TRACK_TYPE_CONFIG[track.track_type || 'instrument'].icon}
                  </div>
                  {/* Track Name */}
                  <div className="text-sm font-medium truncate flex-1">
                    {track.name}
                  </div>
                  {/* Color Indicator */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: track.color }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 ml-7">
                <span className="capitalize">
                  {track.track_type ? TRACK_TYPE_CONFIG[track.track_type].label : track.instrument}
                </span>
                <span>•</span>
                <span>{track.volume}%</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute(track.id)
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    track.muted
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSolo(track.id)
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    track.solo
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  S
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
