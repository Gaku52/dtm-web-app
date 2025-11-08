// パスワードリセットメールを送信するスクリプト
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

async function sendPasswordReset() {
  const email = process.argv[2]

  if (!email) {
    console.log('使い方: node scripts/send-password-reset.js <email>')
    console.log('')
    console.log('例:')
    console.log('  node scripts/send-password-reset.js gan.hmhm333@gmail.com')
    process.exit(1)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔄 パスワードリセット')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log(`📧 メールアドレス: ${email}`)
  console.log('')
  console.log('パスワードリセットメール送信中...')
  console.log('')

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/update-password',
    })

    if (error) {
      console.log('❌ エラー:', error.message)
      process.exit(1)
    }

    console.log('✅ パスワードリセットメールを送信しました!')
    console.log('')
    console.log('次のステップ:')
    console.log('  1. メールボックスを確認してください')
    console.log('  2. 「Reset Password」リンクをクリック')
    console.log('  3. 新しいパスワードを設定')
    console.log('  4. 新しいパスワードでログイン')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (err) {
    console.log('❌ 予期しないエラー:', err)
    process.exit(1)
  }
}

sendPasswordReset()
