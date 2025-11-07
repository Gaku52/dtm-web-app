'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Supabase接続確認
        const { data: healthCheck, error: healthError } = await supabase
          .from('projects')
          .select('count')
          .limit(1)

        if (healthError && healthError.code !== 'PGRST116') {
          throw healthError
        }

        // Test 2: Storageバケット確認
        const { data: buckets, error: bucketError } = await supabase
          .storage
          .listBuckets()

        if (bucketError) throw bucketError

        setStatus('success')
        setMessage('✅ Supabase接続成功！')
        setDetails({
          database: 'Connected',
          buckets: buckets.map(b => b.name),
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        })
      } catch (error: any) {
        setStatus('error')
        setMessage('❌ 接続エラー')
        setDetails({
          error: error.message,
          code: error.code,
        })
      }
    }

    testConnection()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← ホームに戻る
        </Link>

        <h1 className="text-3xl font-bold mb-8">Supabase 接続テスト</h1>

        <div className={`p-6 rounded-lg ${
          status === 'loading' ? 'bg-gray-100' :
          status === 'success' ? 'bg-green-100' :
          'bg-red-100'
        }`}>
          <div className="text-2xl mb-4">
            {status === 'loading' && '⏳ テスト中...'}
            {status === 'success' && message}
            {status === 'error' && message}
          </div>

          {details && (
            <div className="mt-4">
              <h2 className="font-bold mb-2">詳細:</h2>
              <pre className="bg-white p-4 rounded text-sm overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🎉 接続成功！</h2>
            <p className="mb-4">次のステップ:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>認証ページの実装</li>
              <li>ダッシュボードの作成</li>
              <li>Piano Roll Editorの開発</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
