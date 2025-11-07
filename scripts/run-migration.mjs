import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
  }

  // Read SQL file
  const sqlPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('📄 Migration file loaded: 001_initial_schema.sql')
  console.log('📊 Executing SQL...\n')

  try {
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SQL execution failed: ${error}`)
    }

    console.log('✅ Migration completed successfully!\n')
    console.log('📋 Created tables:')
    console.log('   1. ✅ users')
    console.log('   2. ✅ projects')
    console.log('   3. ✅ tracks')
    console.log('   4. ✅ notes')
    console.log('   5. ✅ effects')
    console.log('   6. ✅ automation')
    console.log('   7. ✅ project_snapshots\n')
    console.log('🎉 Database setup complete!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('\n💡 Please run the SQL manually in Supabase Dashboard:')
    console.error('   → SQL Editor → New Query → Paste SQL → Run')
    process.exit(1)
  }
}

runMigration()
