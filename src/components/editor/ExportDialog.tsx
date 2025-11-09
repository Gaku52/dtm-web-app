'use client'

import { useState, useEffect } from 'react'
import type { ExportOptions } from '@/lib/audio/exporter'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
  isExporting: boolean
  progress: number
  error: string | null
}

export default function ExportDialog({
  isOpen,
  onClose,
  onExport,
  isExporting,
  progress,
  error,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav')
  const [quality, setQuality] = useState<number>(192)

  useEffect(() => {
    // Reset error when dialog is opened
    if (isOpen && !isExporting) {
      // Error will be handled by parent component
    }
  }, [isOpen, isExporting])

  const handleExport = () => {
    const options: ExportOptions = {
      format,
      quality: format === 'mp3' ? quality : undefined,
      duration: 300, // 5 minutes max
    }
    onExport(options)
  }

  const handleClose = () => {
    if (!isExporting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">オーディオをエクスポート</h2>
          {!isExporting && (
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        {isExporting ? (
          // Progress view
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-2">
                エクスポート中...
              </div>
              <div className="text-sm text-gray-400">
                {format.toUpperCase()} 形式に変換しています
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-400">
                    進捗状況
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              この処理には数秒かかる場合があります
            </p>
          </div>
        ) : error ? (
          // Error view
          <div className="space-y-4">
            <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 text-red-200 px-4 py-3 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <div className="font-medium mb-1">エラーが発生しました</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        ) : (
          // Settings view
          <div className="space-y-6">
            {/* Format selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                形式
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat('wav')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    format === 'wav'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold">WAV</div>
                  <div className="text-xs opacity-75">無圧縮・高品質</div>
                </button>
                <button
                  onClick={() => setFormat('mp3')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    format === 'mp3'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold">MP3</div>
                  <div className="text-xs opacity-75">圧縮・小容量</div>
                </button>
              </div>
            </div>

            {/* MP3 quality selection */}
            {format === 'mp3' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  音質（ビットレート）
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value={128}>128 kbps - 標準</option>
                  <option value={192}>192 kbps - 高品質</option>
                  <option value={320}>320 kbps - 最高品質</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {quality === 128 && 'ファイルサイズが小さく、一般的な用途に適しています'}
                  {quality === 192 && 'バランスの取れた品質とファイルサイズ'}
                  {quality === 320 && '最高品質ですが、ファイルサイズが大きくなります'}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 text-blue-200 px-3 py-2 rounded-lg text-xs">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  エクスポートされたファイルは自動的にダウンロードされます。
                  {format === 'mp3' && 'MP3エンコードには数秒かかる場合があります。'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                エクスポート
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
