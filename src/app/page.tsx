import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="block">Create Music</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                In Your Browser
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              ブラウザで完結する、次世代の音楽制作プラットフォーム
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                無料で始める
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white bg-opacity-10 backdrop-blur-sm text-white rounded-full font-bold text-lg hover:bg-opacity-20 transition-all border-2 border-white border-opacity-30"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          主要機能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🎹</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              ピアノロール
            </h3>
            <p className="text-gray-300">
              直感的なピアノロールエディタで、自由自在に音符を配置。ズーム機能で細かい編集も簡単。
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🎸</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              多彩な音源
            </h3>
            <p className="text-gray-300">
              ピアノ、ギター、ドラム、シンセなど、12種類以上の楽器タイプをサポート。
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">☁️</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              クラウド保存
            </h3>
            <p className="text-gray-300">
              作品は自動的にクラウドに保存。どこからでもアクセスして制作を続行。
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            今すぐ音楽制作を始めよう
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            アカウント登録は無料。すぐに作曲を開始できます。
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            無料アカウントを作成
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400 text-sm">
        <p>&copy; 2024 DTM Web App. All rights reserved.</p>
      </footer>
    </main>
  )
}
