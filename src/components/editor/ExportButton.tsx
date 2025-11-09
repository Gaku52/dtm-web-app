'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useExport } from '@/hooks/useExport'
import ExportDialog from './ExportDialog'
import type { Track, Note } from '@/lib/audio/exporter'

interface ExportButtonProps {
  projectId: string
  projectName: string
  tempo: number
}

export default function ExportButton({ projectId, projectName, tempo }: ExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)

  const { isExporting, progress, error, exportAudio, reset } = useExport({
    projectName,
    tempo,
  })

  // Load tracks and notes when dialog is opened
  useEffect(() => {
    if (isDialogOpen && tracks.length === 0) {
      loadData()
    }
  }, [isDialogOpen])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load tracks
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

      if (tracksError) throw tracksError

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')

      if (notesError) throw notesError

      // Filter notes for this project's tracks
      const trackIds = tracksData?.map(t => t.id) || []
      const filteredNotes = notesData?.filter(n => trackIds.includes(n.track_id)) || []

      setTracks(tracksData || [])
      setNotes(filteredNotes)
    } catch (error) {
      console.error('Error loading data for export:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
    reset() // Reset any previous error state
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    // Don't reset tracks/notes to avoid reloading next time
  }

  const handleExport = (options: any) => {
    exportAudio(tracks, notes, options)
  }

  // Close dialog when export is complete and successful
  useEffect(() => {
    if (!isExporting && progress === 100 && !error) {
      // Wait a bit to show completion, then close
      const timer = setTimeout(() => {
        setIsDialogOpen(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isExporting, progress, error])

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="オーディオをエクスポート"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>

      <ExportDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onExport={handleExport}
        isExporting={isExporting}
        progress={progress}
        error={error}
      />
    </>
  )
}
