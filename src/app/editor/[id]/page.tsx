'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import EditorLayout from '@/components/editor/EditorLayout'

interface Project {
  id: string
  name: string
  tempo: number
  time_signature: string
  key: string
  user_id: string
  created_at: string
  updated_at: string
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && params.id) {
      loadProject()
    }
  }, [user, authLoading, params.id])

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      // 自分のプロジェクトかチェック
      if (data.user_id !== user?.id) {
        setError('このプロジェクトにアクセスする権限がありません')
        return
      }

      setProject(data)
    } catch (error: any) {
      console.error('Error loading project:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (updates: Partial<Project>) => {
    if (!project) return

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id)

      if (error) throw error

      setProject({ ...project, ...updates })
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || 'プロジェクトが見つかりません'}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <EditorLayout
      project={project}
      onUpdateProject={updateProject}
      onBack={() => router.push('/dashboard')}
    />
  )
}
