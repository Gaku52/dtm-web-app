'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'

interface Project {
  id: string
  name: string
  tempo: number
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered', { authLoading, user: user?.email })
    if (!authLoading && user) {
      console.log('[Dashboard] Loading projects for user:', user.email)
      loadProjects()
    } else if (!authLoading && !user) {
      console.log('[Dashboard] No user found, stopping loading')
      setLoading(false)
    }
  }, [user, authLoading])

  const loadProjects = async () => {
    console.log('[Dashboard] loadProjects called')
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('[Dashboard] Error loading projects:', error)
        throw error
      }

      console.log('[Dashboard] Projects loaded:', data?.length || 0)
      setProjects(data || [])
    } catch (error) {
      console.error('[Dashboard] Error loading projects:', error)
    } finally {
      console.log('[Dashboard] Setting loading to false')
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleCreateProject = async () => {
    if (!user) {
      console.error('User not logged in')
      alert('ログインしてください')
      return
    }

    console.log('Creating project for user:', user.id)

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            name: '新しいプロジェクト',
            tempo: 120,
            time_signature: '4/4',
            key: 'C',
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating project:', error)
        alert(`プロジェクト作成エラー: ${error.message}`)
        throw error
      }

      if (data) {
        console.log('✅ Project created:', data.id)
        router.push(`/editor/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string, e: React.MouseEvent) => {
    // カード全体のクリックイベントを防ぐ
    e.stopPropagation()

    // 確認ダイアログ
    const confirmed = window.confirm(
      `プロジェクト「${projectName}」を削除しますか？\n\nこの操作は取り消せません。`
    )

    if (!confirmed) return

    try {
      // プロジェクトを削除（CASCADE設定により、関連するトラックとノートも自動削除される）
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        console.error('Error deleting project:', error)
        alert(`プロジェクト削除エラー: ${error.message}`)
        throw error
      }

      console.log('✅ Project deleted:', projectId)

      // リストから削除
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DTM Web App</h1>
              <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">プロジェクト</h2>
          <button
            onClick={handleCreateProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新規プロジェクト
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              まだプロジェクトがありません
            </div>
            <p className="text-gray-500 mb-8">
              新しいプロジェクトを作成して音楽制作を始めましょう
            </p>
            <button
              onClick={handleCreateProject}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              最初のプロジェクトを作成
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/editor/${project.id}`)}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-all cursor-pointer group relative"
              >
                {/* 削除ボタン */}
                <button
                  onClick={(e) => handleDeleteProject(project.id, project.name, e)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="プロジェクトを削除"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <div className="flex items-start justify-between mb-4 pr-8">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
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
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    {project.tempo} BPM
                  </div>
                  <div className="flex items-center gap-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {new Date(project.updated_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
