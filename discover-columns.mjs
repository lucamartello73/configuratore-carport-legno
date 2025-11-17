import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 DISCOVER DATABASE COLUMNS\n')

// Query PostgreSQL information_schema
const { data: legnoColumns, error: legnoError } = await supabase
  .rpc('exec_sql', {
    query: `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'carport_legno_configurations'
      ORDER BY ordinal_position;
    `
  })

if (legnoError) {
  console.log('⚠️ Cannot query schema directly (RPC not available)')
  console.log('Using fallback method...\n')
  
  // Fallback: try to select from table and see error
  const { data: sample, error } = await supabase
    .from('carport_legno_configurations')
    .select('*')
    .limit(1)
  
  if (sample && sample.length > 0) {
    console.log('📋 carport_legno_configurations columns (from sample):')
    console.log(Object.keys(sample[0]).join(', '))
  } else {
    console.log('ℹ️  Table is empty, trying minimal insert to discover columns...')
    
    // Try minimal insert to trigger error with column name
    const { data, error: insertError } = await supabase
      .from('carport_legno_configurations')
      .insert({ test: 'test' })
      .select()
    
    if (insertError) {
      console.log('\n❌ Insert error (expected):')
      console.log('   ', insertError.message)
    }
  }
  
  // Same for ACCIAIO
  const { data: sample2, error: error2 } = await supabase
    .from('carport_configurations')
    .select('*')
    .limit(1)
  
  console.log('\n📋 carport_configurations columns (from sample):')
  if (sample2 && sample2.length > 0) {
    console.log(Object.keys(sample2[0]).join(', '))
  } else {
    console.log('   (table is empty)\n')
    
    // Try minimal insert
    const { data, error: insertError } = await supabase
      .from('carport_configurations')
      .insert({ test: 'test' })
      .select()
    
    if (insertError) {
      console.log('❌ Insert error (expected):')
      console.log('   ', insertError.message)
    }
  }
  
} else {
  console.log('📋 carport_legno_configurations columns:')
  legnoColumns.forEach(col => {
    console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`)
  })
}

console.log('\n✅ Discovery complete!')
