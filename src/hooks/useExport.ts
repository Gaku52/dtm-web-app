import { useState, useCallback } from 'react'
import { exportToWav, exportToMp3, downloadBlob, type Track, type Note, type ExportOptions } from '@/lib/audio/exporter'

interface UseExportOptions {
  projectName: string
  tempo: number
}

interface ExportState {
  isExporting: boolean
  progress: number
  error: string | null
}

export function useExport({ projectName, tempo }: UseExportOptions) {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null,
  })

  const handleExport = useCallback(
    async (tracks: Track[], notes: Note[], options: ExportOptions) => {
      setState({ isExporting: true, progress: 0, error: null })

      try {
        let blob: Blob
        let extension: string

        if (options.format === 'wav') {
          extension = 'wav'
          blob = await exportToWav(tracks, notes, tempo, {
            ...options,
            onProgress: (progress) => {
              setState((prev) => ({ ...prev, progress }))
            },
          })
        } else {
          extension = 'mp3'
          blob = await exportToMp3(tracks, notes, tempo, {
            ...options,
            onProgress: (progress) => {
              setState((prev) => ({ ...prev, progress }))
            },
          })
        }

        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
        const filename = `${projectName}_${timestamp}.${extension}`

        // Download the file
        downloadBlob(blob, filename)

        setState({ isExporting: false, progress: 100, error: null })
      } catch (error) {
        console.error('Export error:', error)
        setState({
          isExporting: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'エクスポート中にエラーが発生しました',
        })
      }
    },
    [projectName, tempo]
  )

  const reset = useCallback(() => {
    setState({ isExporting: false, progress: 0, error: null })
  }, [])

  return {
    isExporting: state.isExporting,
    progress: state.progress,
    error: state.error,
    exportAudio: handleExport,
    reset,
  }
}
