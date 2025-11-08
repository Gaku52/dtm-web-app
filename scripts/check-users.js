// Supabaseに登録されているユーザーを確認するスクリプト
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkUsers() {
  console.log('📊 Supabaseに登録されているユーザーを確認中...\n')

  try {
    // Admin APIを使用してすべてのユーザーを取得
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('❌ エラー:', error.message)
      return
    }

    if (!users || users.length === 0) {
      console.log('ℹ️  登録されているユーザーはいません')
      return
    }

    console.log(`✅ ${users.length}人のユーザーが登録されています\n`)
    console.log('=' .repeat(80))

    users.forEach((user, index) => {
      console.log(`\n【ユーザー ${index + 1}】`)
      console.log(`ID: ${user.id}`)
      console.log(`Email: ${user.email}`)
      console.log(`Email確認済み: ${user.email_confirmed_at ? '✅ はい (' + new Date(user.email_confirmed_at).toLocaleString('ja-JP') + ')' : '❌ いいえ'}`)
      console.log(`登録日時: ${new Date(user.created_at).toLocaleString('ja-JP')}`)
      console.log(`最終ログイン: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ja-JP') : 'なし'}`)
      console.log(`プロバイダー: ${user.app_metadata.provider || 'email'}`)

      if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
        console.log(`メタデータ:`, user.user_metadata)
      }
    })

    console.log('\n' + '='.repeat(80))

  } catch (err) {
    console.error('❌ 予期しないエラー:', err)
  }
}

checkUsers()
