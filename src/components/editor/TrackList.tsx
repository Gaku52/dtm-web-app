'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ALL_PRESETS, PRESET_CATEGORIES, getPresetById } from '@/lib/audio/presets'
import { TONE_JS_SAMPLES } from '@/lib/audio/samplers/tone-js-library'

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
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType>('piano')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('piano_bright_grand')
  const [trackToDelete, setTrackToDelete] = useState<string | null>(null)

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
      // Get preset info
      const preset = getPresetById(selectedPresetId)
      if (!preset) {
        console.error('❌ Preset not found:', selectedPresetId)
        return
      }

      console.log('✅ Adding track with preset:', {
        id: selectedPresetId,
        name: preset.name,
        category: preset.category
      })

      // 同じプリセットのトラック数をカウント
      const samePresetCount = tracks.filter(t => t.instrument === selectedPresetId).length

      // Get category config for icon and color
      const categoryConfig = PRESET_CATEGORIES.find(c => c.id === preset.category)
      const defaultIcon = categoryConfig?.icon || '🎵'

      // Color mapping for categories
      const categoryColors: Record<string, string> = {
        lead: '#EC4899',
        bass: '#10B981',
        pad: '#8B5CF6',
        piano: '#3B82F6',
        brass: '#FBBF24',
        strings: '#F97316',
        fx: '#06B6D4',
        drums: '#F59E0B',
        vocal: '#EF4444',
        synth: '#EC4899'
      }
      const defaultColor = categoryColors[preset.category] || '#60A5FA'

      const trackData = {
        project_id: projectId,
        name: samePresetCount === 0 ? preset.name : `${preset.name} ${samePresetCount + 1}`,
        instrument: selectedPresetId, // Store preset ID
        track_type: preset.category as TrackType,
        icon: defaultIcon,
        color: defaultColor,
        volume: 80,
        muted: false,
        solo: false,
        order_index: tracks.length,
      }

      console.log('💾 Saving track to database:', {
        name: trackData.name,
        instrument: trackData.instrument,
        track_type: trackData.track_type
      })

      const { data, error} = await supabase
        .from('tracks')
        .insert([trackData])
        .select()
        .single()

      if (error) throw error
      if (data) {
        console.log('✅ Track saved successfully:', data)
        setTracks([...tracks, data])
        onSelectTrack(data.id)
      }
    } catch (error) {
      console.error('❌ Error adding track:', error)
    }
  }

  const deleteTrack = async (trackId: string) => {
    try {
      // ノートも一緒に削除
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('track_id', trackId)

      if (notesError) throw notesError

      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId)

      if (error) throw error

      setTracks(tracks.filter((t) => t.id !== trackId))

      // 削除したトラックが選択されていた場合、選択を解除または別のトラックを選択
      if (selectedTrackId === trackId) {
        const remaining = tracks.filter((t) => t.id !== trackId)
        if (remaining.length > 0) {
          onSelectTrack(remaining[0].id)
        }
      }

      setTrackToDelete(null)
    } catch (error) {
      console.error('Error deleting track:', error)
      setTrackToDelete(null)
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
      <div className="w-48 bg-gray-800 border-r border-gray-700 p-3">
        <div className="text-gray-400 text-xs">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="w-48 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-xs font-semibold text-gray-300 mb-2">トラック追加</h3>
        <select
          value={selectedPresetId}
          onChange={(e) => setSelectedPresetId(e.target.value)}
          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs mb-2 focus:outline-none focus:border-blue-500 max-h-32"
        >
          {/* Tone.js Samples */}
          <optgroup label="🎹 リアル楽器 (Tone.js)">
            {TONE_JS_SAMPLES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.name}
              </option>
            ))}
          </optgroup>

          {/* Premium Presets by Category */}
          {PRESET_CATEGORIES.map((category) => {
            const presetsInCategory = ALL_PRESETS.filter(p => p.category === category.id)
            if (presetsInCategory.length === 0) return null

            return (
              <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                {presetsInCategory.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </optgroup>
            )
          })}
        </select>
        <button
          onClick={addTrack}
          className="w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          トラックを追加
        </button>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="p-3 text-xs text-gray-400 text-center">
            トラックがありません
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`p-2 border-b border-gray-700 cursor-pointer transition-colors ${
                selectedTrackId === track.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-750'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {/* Track Icon */}
                  <div className="text-sm flex-shrink-0">
                    {track.icon || TRACK_TYPE_CONFIG[track.track_type || 'instrument'].icon}
                  </div>
                  {/* Track Name */}
                  <div className="text-xs font-medium truncate flex-1">
                    {track.name}
                  </div>
                  {/* Color Indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: track.color }}
                  ></div>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setTrackToDelete(track.id)
                    }}
                    className="flex-shrink-0 p-0.5 hover:bg-red-600 rounded transition-colors"
                    title="トラックを削除"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 ml-5">
                <span className="capitalize truncate">
                  {(() => {
                    // Try to get preset name
                    const preset = getPresetById(track.instrument)
                    if (preset) return preset.name

                    // Fallback to old track type config
                    if (track.track_type && TRACK_TYPE_CONFIG[track.track_type]) {
                      return TRACK_TYPE_CONFIG[track.track_type].label
                    }

                    // Last resort: display instrument field
                    return track.instrument
                  })()}
                </span>
                <span>•</span>
                <span>{track.volume}%</span>
              </div>

              <div className="flex items-center gap-1 mt-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute(track.id)
                  }}
                  className={`px-1.5 py-0.5 text-[10px] rounded ${
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
                  className={`px-1.5 py-0.5 text-[10px] rounded ${
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

      {/* Delete Confirmation Dialog */}
      {trackToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-4 max-w-sm mx-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-2">トラックを削除</h3>
            <p className="text-xs text-gray-300 mb-4">
              このトラックと、このトラックに含まれるすべてのノートが削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setTrackToDelete(null)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => trackToDelete && deleteTrack(trackToDelete)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
