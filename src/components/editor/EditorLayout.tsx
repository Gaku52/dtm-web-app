'use client'

import { useState, useEffect } from 'react'
import EditorHeader from './EditorHeader'
import EditorToolbar from './EditorToolbar'
import TrackList from './TrackList'
import PianoRoll from './PianoRoll'
import { useAudioEngine, type InstrumentType } from '@/hooks/useAudioEngine'
import { supabase } from '@/lib/supabase/client'

interface Project {
  id: string
  name: string
  tempo: number
  time_signature: string
  key: string
}

interface EditorLayoutProps {
  project: Project
  onUpdateProject: (updates: Partial<Project>) => void
  onBack: () => void
}

interface Note {
  id: string
  track_id: string
  pitch: number
  start_time: number
  duration: number
  velocity: number
}

interface Track {
  id: string
  instrument: string
  track_type?: string
}

export default function EditorLayout({
  project,
  onUpdateProject,
  onBack,
}: EditorLayoutProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [allNotes, setAllNotes] = useState<Note[]>([])

  const {
    isPlaying,
    currentTime,
    playNote,
    scheduleNotes,
    play,
    pause,
    stop,
  } = useAudioEngine(project.tempo)

  // プロジェクトの全ノートを読み込む
  useEffect(() => {
    loadAllNotes()
  }, [project.id])

  const loadAllNotes = async () => {
    try {
      // プロジェクトに属する全トラックのノートを取得
      const { data: tracks, error: tracksError } = await supabase
        .from('tracks')
        .select('id')
        .eq('project_id', project.id)

      if (tracksError) throw tracksError

      if (tracks && tracks.length > 0) {
        const trackIds = tracks.map(t => t.id)

        const { data: notes, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .in('track_id', trackIds)

        if (notesError) throw notesError

        console.log('📝 Loaded', notes?.length || 0, 'notes for playback')
        setAllNotes(notes || [])
        scheduleNotes(notes || [])
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  const handlePlay = () => {
    // 再生前に最新のノートを読み込んでスケジュール
    loadAllNotes().then(() => {
      play()
    })
  }

  const handlePause = () => {
    pause()
  }

  const handleStop = () => {
    stop()
  }

  const handleTempoChange = (tempo: number) => {
    onUpdateProject({ tempo })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <EditorHeader
        projectId={project.id}
        projectName={project.name}
        tempo={project.tempo}
        onProjectNameChange={(name) => onUpdateProject({ name })}
        onBack={onBack}
        onSave={() => {
          // TODO: 手動保存処理
          console.log('Manual save triggered')
        }}
      />

      {/* Toolbar */}
      <EditorToolbar
        isPlaying={isPlaying}
        tempo={project.tempo}
        timeSignature={project.time_signature}
        currentTime={currentTime}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onTempoChange={handleTempoChange}
        onTimeSignatureChange={(timeSignature) =>
          onUpdateProject({ time_signature: timeSignature })
        }
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track List */}
        <TrackList
          projectId={project.id}
          selectedTrackId={selectedTrackId}
          onSelectTrack={async (trackId) => {
            setSelectedTrackId(trackId)
            // トラック情報を取得
            const { data } = await supabase
              .from('tracks')
              .select('id, instrument, track_type')
              .eq('id', trackId)
              .single()
            setSelectedTrack(data)
          }}
        />

        {/* Piano Roll */}
        <PianoRoll
          projectId={project.id}
          selectedTrackId={selectedTrackId}
          currentTime={currentTime}
          isPlaying={isPlaying}
          tempo={project.tempo}
          timeSignature={project.time_signature}
          instrumentType={(selectedTrack?.track_type || selectedTrack?.instrument || 'piano') as InstrumentType}
          onPlayNote={playNote}
        />
      </div>
    </div>
  )
}
