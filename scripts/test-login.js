// ログインをテストするスクリプト
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

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  // 引数からメールアドレスとパスワードを取得
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.log('使い方: node scripts/test-login.js <email> <password>')
    console.log('')
    console.log('例:')
    console.log('  node scripts/test-login.js gan.hmhm333@gmail.com yourpassword')
    process.exit(1)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔐 ログインテスト')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log(`📧 メールアドレス: ${email}`)
  console.log(`🔑 パスワード: ${'*'.repeat(password.length)}`)
  console.log('')
  console.log('ログイン試行中...')
  console.log('')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log('❌ ログイン失敗')
      console.log('')
      console.log('エラー詳細:')
      console.log('  メッセージ:', error.message)
      console.log('  ステータス:', error.status)
      console.log('')

      if (error.message.includes('Invalid login credentials')) {
        console.log('💡 考えられる原因:')
        console.log('  1. パスワードが間違っています')
        console.log('  2. メールアドレスが間違っています')
        console.log('  3. アカウントが存在しません')
        console.log('')
        console.log('解決方法:')
        console.log('  - パスワードリセットを試してください')
        console.log('  - http://localhost:3000/auth/reset-password')
      } else if (error.message.includes('Email not confirmed')) {
        console.log('💡 考えられる原因:')
        console.log('  - メールアドレスが未確認です')
        console.log('')
        console.log('解決方法:')
        console.log('  - 確認メールのリンクをクリックしてください')
      }

      process.exit(1)
    }

    console.log('✅ ログイン成功!')
    console.log('')
    console.log('ユーザー情報:')
    console.log('  ID:', data.user.id)
    console.log('  Email:', data.user.email)
    console.log('  Email確認済み:', data.user.email_confirmed_at ? 'はい' : 'いいえ')
    console.log('  作成日時:', new Date(data.user.created_at).toLocaleString('ja-JP'))
    console.log('')
    console.log('セッション情報:')
    console.log('  アクセストークン:', data.session.access_token.substring(0, 20) + '...')
    console.log('  有効期限:', new Date(data.session.expires_at * 1000).toLocaleString('ja-JP'))
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✨ ログインは正常に動作しています!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (err) {
    console.log('❌ 予期しないエラー')
    console.log('')
    console.log(err)
    process.exit(1)
  }
}

testLogin()
