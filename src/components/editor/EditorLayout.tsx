'use client'

import { useState } from 'react'
import EditorHeader from './EditorHeader'
import EditorToolbar from './EditorToolbar'
import TrackList from './TrackList'
import PianoRoll from './PianoRoll'
import { useAudioEngine } from '@/hooks/useAudioEngine'

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

export default function EditorLayout({
  project,
  onUpdateProject,
  onBack,
}: EditorLayoutProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)

  const {
    isPlaying,
    currentTime,
    playNote,
    scheduleNotes,
    play,
    pause,
    stop,
  } = useAudioEngine(project.tempo)

  const handlePlay = () => {
    play()
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
        projectName={project.name}
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
          onSelectTrack={setSelectedTrackId}
        />

        {/* Piano Roll */}
        <PianoRoll
          projectId={project.id}
          selectedTrackId={selectedTrackId}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onPlayNote={playNote}
        />
      </div>
    </div>
  )
}
