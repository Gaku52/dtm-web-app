const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  // Supabaseクライアント作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    // マイグレーションファイルを読み込み
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file loaded: 001_initial_schema.sql')
    console.log('📊 Creating 7 tables...\n')

    // SQLを実行
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).select()

    if (error) {
      // rpc関数が存在しない場合、直接SQL APIを使用
      console.log('⚠️  RPC method not available, using direct SQL execution...\n')

      // Supabase REST APIで直接SQL実行
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ sql_query: sql })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    console.log('✅ Migration completed successfully!\n')
    console.log('📋 Created tables:')
    console.log('   1. users')
    console.log('   2. projects')
    console.log('   3. tracks')
    console.log('   4. notes')
    console.log('   5. effects')
    console.log('   6. automation')
    console.log('   7. project_snapshots\n')
    console.log('🎉 Database setup complete!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
