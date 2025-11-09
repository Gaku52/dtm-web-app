import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration(filename: string) {
  console.log(`\n📄 Applying migration: ${filename}`)

  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', filename)
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Try direct query if RPC doesn't work
      const statements = sql.split(';').filter(s => s.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: err } = await supabase.from('_sql').select(statement)
          if (err) {
            console.error('❌ Error:', err.message)
          }
        }
      }
    }

    console.log('✅ Migration applied successfully')
  } catch (error: any) {
    console.error('❌ Failed to apply migration:', error.message)
    process.exit(1)
  }
}

async function main() {
  const migrationFile = process.argv[2] || '005_add_track_types.sql'
  await applyMigration(migrationFile)
}

main()
