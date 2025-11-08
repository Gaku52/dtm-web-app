// 完全なログインフローをテストするスクリプト
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// .env.localファイルを読み込む
const envPath = path.join(__dirname, '..', '.env.local')
const envFile = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ブラウザと同じ設定でSupabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

async function testFullLoginFlow() {
  const email = 'gan.hmhm333@gmail.com'
  const password = 'password123'

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 完全なログインフローテスト')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  try {
    // ステップ1: ログイン前の状態確認
    console.log('【ステップ1】ログイン前の状態確認')
    const { data: { session: beforeSession } } = await supabase.auth.getSession()
    console.log('  現在のセッション:', beforeSession ? '存在する' : '存在しない')
    console.log('')

    // ステップ2: ログイン実行
    console.log('【ステップ2】ログイン実行')
    console.log(`  メールアドレス: ${email}`)
    console.log(`  パスワード: ${'*'.repeat(password.length)}`)
    console.log('')

    const startTime = Date.now()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    const endTime = Date.now()

    console.log(`  実行時間: ${endTime - startTime}ms`)
    console.log('')

    if (error) {
      console.log('❌ ログイン失敗')
      console.log('  エラーメッセージ:', error.message)
      console.log('  エラーコード:', error.status)
      console.log('  エラー詳細:', JSON.stringify(error, null, 2))
      process.exit(1)
    }

    console.log('✅ ログイン成功')
    console.log('')

    // ステップ3: ユーザー情報確認
    console.log('【ステップ3】ユーザー情報確認')
    console.log('  ユーザーID:', data.user.id)
    console.log('  メール:', data.user.email)
    console.log('  メール確認済み:', data.user.email_confirmed_at ? 'はい' : 'いいえ')
    console.log('  最終ログイン:', data.user.last_sign_in_at ? new Date(data.user.last_sign_in_at).toLocaleString('ja-JP') : 'なし')
    console.log('')

    // ステップ4: セッション情報確認
    console.log('【ステップ4】セッション情報確認')
    console.log('  アクセストークン:', data.session.access_token.substring(0, 30) + '...')
    console.log('  リフレッシュトークン:', data.session.refresh_token.substring(0, 30) + '...')
    console.log('  トークンタイプ:', data.session.token_type)
    console.log('  有効期限:', new Date(data.session.expires_at * 1000).toLocaleString('ja-JP'))
    const expiresIn = Math.floor((data.session.expires_at * 1000 - Date.now()) / 1000 / 60)
    console.log(`  残り時間: ${expiresIn}分`)
    console.log('')

    // ステップ5: セッション永続性確認
    console.log('【ステップ5】セッション永続性確認')
    const { data: { session: afterSession } } = await supabase.auth.getSession()
    console.log('  セッション取得:', afterSession ? '成功' : '失敗')
    if (afterSession) {
      console.log('  セッションユーザー:', afterSession.user.email)
    }
    console.log('')

    // ステップ6: 認証状態確認
    console.log('【ステップ6】認証状態確認')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('  認証済みユーザー:', user ? user.email : 'なし')
    console.log('')

    // ステップ7: プロジェクトデータアクセステスト
    console.log('【ステップ7】データベースアクセステスト')
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .limit(5)

    if (projectError) {
      console.log('  ⚠️  プロジェクト取得エラー:', projectError.message)
    } else {
      console.log('  ✅ プロジェクト取得成功')
      console.log('  プロジェクト数:', projects.length)
    }
    console.log('')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✨ すべてのステップが正常に完了しました!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('📋 ブラウザでのログインテスト手順:')
    console.log('  1. http://localhost:3000/auth/login を開く')
    console.log(`  2. メールアドレス: ${email}`)
    console.log(`  3. パスワード: ${password}`)
    console.log('  4. ログインボタンをクリック')
    console.log('')
    console.log('期待される動作:')
    console.log('  → ログイン成功')
    console.log('  → /dashboard にリダイレクト')
    console.log('  → プロジェクト一覧が表示される')
    console.log('')

  } catch (err) {
    console.log('❌ 予期しないエラー')
    console.log('')
    console.log(err)
    process.exit(1)
  }
}

testFullLoginFlow()
