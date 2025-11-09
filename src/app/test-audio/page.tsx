'use client'

import { useState, useRef, useEffect } from 'react'
import { PolySynth, Synth, Frequency, start } from 'tone'

export default function TestAudioPage() {
  const [isReady, setIsReady] = useState(false)
  const [lastNote, setLastNote] = useState<string>('')
  const synthRef = useRef<PolySynth | null>(null)

  useEffect(() => {
    // Synthを初期化
    console.log('🎵 Initializing Tone.js...')

    try {
      synthRef.current = new PolySynth(Synth, {
        oscillator: {
          type: 'triangle',
        },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination()

      console.log('✅ Synth initialized:', synthRef.current)
      setIsReady(true)
    } catch (error) {
      console.error('❌ Failed to initialize synth:', error)
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [])

  const playNote = async (noteName: string) => {
    try {
      // Tone.jsを起動（ユーザーインタラクションが必要）
      await start()
      console.log('🎵 Tone.js context started')

      if (!synthRef.current) {
        console.error('❌ Synth not initialized')
        return
      }

      console.log(`🎵 Playing note: ${noteName}`)

      // 音を鳴らす
      synthRef.current.triggerAttackRelease(noteName, '8n')

      setLastNote(noteName)
      console.log('✅ Note played successfully')
    } catch (error) {
      console.error('❌ Error playing note:', error)
    }
  }

  const playMIDINote = async (midiNumber: number) => {
    try {
      await start()

      if (!synthRef.current) {
        console.error('❌ Synth not initialized')
        return
      }

      // MIDIノート番号を周波数に変換
      const frequency = Frequency(midiNumber, 'midi').toFrequency()
      console.log(`🎵 Playing MIDI ${midiNumber} (${frequency}Hz)`)

      synthRef.current.triggerAttackRelease(frequency, 0.5)

      setLastNote(`MIDI ${midiNumber}`)
      console.log('✅ MIDI note played successfully')
    } catch (error) {
      console.error('❌ Error playing MIDI note:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Tone.js 音声テスト</h1>
        <p className="text-gray-400 mb-8">
          各ボタンをクリックして音が鳴るか確認してください
        </p>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {isReady ? 'Tone.js 初期化完了' : 'Tone.js 初期化中...'}
            </span>
          </div>

          {lastNote && (
            <div className="text-sm text-gray-400">
              最後に鳴らした音: <span className="text-blue-400">{lastNote}</span>
            </div>
          )}
        </div>

        {/* 音名で再生 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. 音名で再生（C4, E4, G4）</h2>
          <div className="flex gap-3 flex-wrap">
            {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map((note) => (
              <button
                key={note}
                onClick={() => playNote(note)}
                disabled={!isReady}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* MIDIノート番号で再生 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. MIDIノート番号で再生（60=C4）</h2>
          <div className="flex gap-3 flex-wrap">
            {[60, 62, 64, 65, 67, 69, 71, 72].map((midi) => (
              <button
                key={midi}
                onClick={() => playMIDINote(midi)}
                disabled={!isReady}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                MIDI {midi}
              </button>
            ))}
          </div>
        </div>

        {/* 和音 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3. 和音（Chord）</h2>
          <button
            onClick={async () => {
              await start()
              if (synthRef.current) {
                console.log('🎵 Playing C major chord')
                synthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '2n')
                setLastNote('C major (C4-E4-G4)')
              }
            }}
            disabled={!isReady}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            C Major コード
          </button>
        </div>

        {/* 音量テスト */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">4. 音量テスト</h2>
          <div className="flex gap-3 flex-wrap">
            {[0.2, 0.5, 0.8, 1.0].map((velocity) => (
              <button
                key={velocity}
                onClick={async () => {
                  await start()
                  if (synthRef.current) {
                    console.log(`🎵 Playing C4 with velocity ${velocity}`)
                    synthRef.current.triggerAttackRelease('C4', '4n', undefined, velocity)
                    setLastNote(`C4 (velocity: ${velocity})`)
                  }
                }}
                disabled={!isReady}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                音量 {Math.round(velocity * 100)}%
              </button>
            ))}
          </div>
        </div>

        {/* デバッグ情報 */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">デバッグ情報</h3>
          <div className="text-sm text-gray-400 space-y-1 font-mono">
            <div>Tone.js インストール済み: ✅</div>
            <div>Synth Ready: {isReady ? 'Yes' : 'No'}</div>
            <div>Synth Initialized: {synthRef.current ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* ブラウザコンソールを確認 */}
        <div className="mt-6 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            <strong>重要:</strong> ブラウザの開発者ツール（F12）を開いて、コンソールログを確認してください。
            各ボタンクリック時に 🎵 や ✅ のログが表示されるはずです。
          </p>
        </div>
      </div>
    </div>
  )
}
