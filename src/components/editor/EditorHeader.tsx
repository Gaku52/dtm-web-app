'use client'

import { useState } from 'react'
import ExportButton from './ExportButton'

interface EditorHeaderProps {
  projectId: string
  projectName: string
  tempo: number
  onProjectNameChange: (name: string) => void
  onBack: () => void
  onSave: () => void
}

export default function EditorHeader({
  projectId,
  projectName,
  tempo,
  onProjectNameChange,
  onBack,
  onSave,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(projectName)

  const handleSave = () => {
    if (name.trim() && name !== projectName) {
      onProjectNameChange(name.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setName(projectName)
      setIsEditing(false)
    }
  }

  return (
    <header className="h-11 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title="ダッシュボードに戻る"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-base font-bold">DTM</div>

        {/* Project Name */}
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="px-2 py-0.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-0.5 hover:bg-gray-700 rounded transition-colors"
          >
            <span className="text-sm font-semibold">{projectName}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Auto-save indicator */}
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          自動保存済み
        </div>

        {/* Export Button */}
        <ExportButton projectId={projectId} projectName={projectName} tempo={tempo} />

        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1 text-xs"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          保存
        </button>
      </div>
    </header>
  )
}
