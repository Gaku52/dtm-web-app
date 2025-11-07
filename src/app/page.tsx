import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎹 DTM Web App
        </h1>
        <p className="text-center text-lg mb-8">
          ブラウザベースの音楽制作アプリケーション
        </p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Link
            href="/test"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Supabase接続テスト
          </Link>

          <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">✅ セットアップ完了</h2>
            <ul className="space-y-2 text-sm">
              <li>✅ Next.js 15</li>
              <li>✅ Supabase Pro</li>
              <li>✅ データベース（7テーブル）</li>
              <li>✅ Row Level Security</li>
              <li>✅ Storage（2バケット）</li>
              <li>✅ コスト制限設定</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
