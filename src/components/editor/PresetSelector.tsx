'use client'

import { useState, useMemo } from 'react'
import {
  PRESET_CATEGORIES,
  getPresetsByCategory,
  getPresetsBySubcategory,
  searchPresets,
  SynthPreset,
  PresetCategory
} from '@/lib/audio/presets'

interface PresetSelectorProps {
  value?: string // Preset ID
  onChange: (presetId: string, preset: SynthPreset) => void
  className?: string
}

export default function PresetSelector({ value, onChange, className = '' }: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get current preset
  const currentPreset = useMemo(() => {
    if (!value) return null
    const allPresets = PRESET_CATEGORIES.flatMap(cat =>
      getPresetsByCategory(cat.id)
    )
    return allPresets.find(p => p.id === value)
  }, [value])

  // Filter presets
  const filteredPresets = useMemo(() => {
    if (searchQuery) {
      return searchPresets(searchQuery)
    }
    if (selectedSubcategory && selectedCategory) {
      return getPresetsBySubcategory(selectedCategory, selectedSubcategory)
    }
    if (selectedCategory) {
      return getPresetsByCategory(selectedCategory)
    }
    return []
  }, [searchQuery, selectedCategory, selectedSubcategory])

  const handleSelectPreset = (preset: SynthPreset) => {
    onChange(preset.id, preset)
    setIsOpen(false)
    setSearchQuery('')
  }

  const getCategoryColor = (category: PresetCategory): string => {
    const colors: Record<PresetCategory, string> = {
      lead: '#EC4899',
      bass: '#10B981',
      pad: '#3B82F6',
      piano: '#6366F1',
      brass: '#F59E0B',
      strings: '#F97316',
      fx: '#06B6D4',
      drums: '#EF4444',
      vocal: '#8B5CF6',
      synth: '#84CC16'
    }
    return colors[category] || '#60A5FA'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors text-left flex items-center justify-between group"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentPreset && (
            <>
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: getCategoryColor(currentPreset.category) }}
              />
              <span className="text-sm font-medium text-gray-200 truncate">
                {currentPreset.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {currentPreset.subcategory}
              </span>
            </>
          )}
          {!currentPreset && (
            <span className="text-sm text-gray-400">プリセットを選択...</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute z-20 mt-2 w-full min-w-[400px] max-w-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (e.target.value) {
                      setSelectedCategory(null)
                      setSelectedSubcategory(null)
                    }
                  }}
                  placeholder="プリセット検索... (例: supersaw, acid, pad)"
                  className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex max-h-[500px]">
              {/* Category Sidebar */}
              {!searchQuery && (
                <div className="w-48 border-r border-gray-800 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {PRESET_CATEGORIES.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSelectedSubcategory(null)
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getCategoryColor(category.id) }}
                            />
                            <span className="truncate">{category.name}</span>
                          </div>
                        </button>

                        {/* Subcategories */}
                        {selectedCategory === category.id && category.subcategories.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {category.subcategories.map((sub) => (
                              <button
                                key={sub}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`w-full px-3 py-1.5 rounded text-left text-xs transition-colors ${
                                  selectedSubcategory === sub
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
                                }`}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset List */}
              <div className="flex-1 overflow-y-auto">
                {filteredPresets.length === 0 && (selectedCategory || searchQuery) && (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                    </svg>
                    {searchQuery ? 'プリセットが見つかりません' : 'カテゴリを選択してください'}
                  </div>
                )}
                {filteredPresets.length === 0 && !selectedCategory && !searchQuery && (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-3">🎹</div>
                    <p className="font-medium mb-1">1,000のプロフェッショナルプリセット</p>
                    <p className="text-sm">カテゴリを選択するか、検索してください</p>
                  </div>
                )}
                <div className="p-2 space-y-0.5">
                  {filteredPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full px-3 py-2.5 rounded-lg text-left transition-all group ${
                        currentPreset?.id === preset.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(preset.category) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {preset.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs opacity-70 truncate">
                              {preset.subcategory}
                            </span>
                            {preset.tags && preset.tags.length > 0 && (
                              <span className="text-xs opacity-50">
                                • {preset.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        {currentPreset?.id === preset.id && (
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                <span>{filteredPresets.length} プリセット</span>
                {currentPreset && (
                  <span className="font-mono">{currentPreset.oscillatorType}</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
