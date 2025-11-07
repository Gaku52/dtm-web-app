'use client'

interface EditorToolbarProps {
  isPlaying: boolean
  tempo: number
  timeSignature: string
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onTempoChange: (tempo: number) => void
  onTimeSignatureChange: (timeSignature: string) => void
}

export default function EditorToolbar({
  isPlaying,
  tempo,
  timeSignature,
  onPlay,
  onPause,
  onStop,
  onTempoChange,
  onTimeSignatureChange,
}: EditorToolbarProps) {
  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-6 gap-6">
      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        {/* Stop */}
        <button
          onClick={onStop}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="停止"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>

        {/* Play/Pause */}
        {isPlaying ? (
          <button
            onClick={onPause}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            title="一時停止"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            title="再生"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      <div className="w-px h-8 bg-gray-700"></div>

      {/* Tempo */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTempoChange(Math.max(40, tempo - 1))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={tempo}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (val >= 40 && val <= 300) onTempoChange(val)
            }}
            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-sm focus:outline-none focus:border-blue-500"
            min="40"
            max="300"
          />
          <span className="text-sm text-gray-400">BPM</span>
        </div>
        <button
          onClick={() => onTempoChange(Math.min(300, tempo + 1))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="w-px h-8 bg-gray-700"></div>

      {/* Time Signature */}
      <div className="flex items-center gap-2">
        <select
          value={timeSignature}
          onChange={(e) => onTimeSignatureChange(e.target.value)}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="6/8">6/8</option>
          <option value="5/4">5/4</option>
          <option value="7/8">7/8</option>
        </select>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Info */}
      <div className="text-sm text-gray-400">
        00:00
      </div>
    </div>
  )
}
