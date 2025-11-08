// Service Roleキーを使って直接パスワードをリセットするスクリプト
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
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY が設定されていません')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetPassword() {
  const email = process.argv[2]
  const newPassword = process.argv[3]

  if (!email || !newPassword) {
    console.log('使い方: node scripts/reset-password-direct.js <email> <new-password>')
    console.log('')
    console.log('例:')
    console.log('  node scripts/reset-password-direct.js gan.hmhm333@gmail.com newpassword123')
    console.log('')
    console.log('注意: パスワードは8文字以上必要です')
    process.exit(1)
  }

  if (newPassword.length < 8) {
    console.log('❌ パスワードは8文字以上必要です')
    process.exit(1)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔑 パスワード直接リセット')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log(`📧 メールアドレス: ${email}`)
  console.log(`🔑 新しいパスワード: ${'*'.repeat(newPassword.length)}`)
  console.log('')

  try {
    // まずユーザーを検索
    console.log('ユーザーを検索中...')
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.log('❌ ユーザー検索エラー:', listError.message)
      process.exit(1)
    }

    const user = users.find(u => u.email === email)

    if (!user) {
      console.log('❌ ユーザーが見つかりません:', email)
      console.log('')
      console.log('登録済みユーザー:')
      users.forEach(u => {
        console.log('  -', u.email)
      })
      process.exit(1)
    }

    console.log('✓ ユーザーを発見しました')
    console.log('')
    console.log('パスワードを更新中...')

    // パスワードを更新
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (error) {
      console.log('❌ パスワード更新エラー:', error.message)
      process.exit(1)
    }

    console.log('')
    console.log('✅ パスワードを更新しました!')
    console.log('')
    console.log('次のステップ:')
    console.log('  1. http://localhost:3000/auth/login にアクセス')
    console.log(`  2. メールアドレス: ${email}`)
    console.log(`  3. パスワード: ${newPassword}`)
    console.log('  4. ログインボタンをクリック')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (err) {
    console.log('❌ 予期しないエラー:', err)
    process.exit(1)
  }
}

resetPassword()
