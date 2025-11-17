import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testing Supabase Connection...\n')

// Test tabelle LEGNO
const legnoTables = [
  'carport_legno_configurations',
  'carport_legno_models',
  'carport_legno_colors',
  'carport_legno_coverage_types',
  'carport_legno_structure_types',
]

console.log('📦 TABELLE LEGNO:\n')
for (const table of legnoTables) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.log(`❌ ${table}: ${error.message}`)
  } else {
    console.log(`✅ ${table}: ${count} rows`)
  }
}

// Test tabelle ACCIAIO
const acciaioTables = [
  'carport_configurations',
  'carport_models',
  'carport_colors',
]

console.log('\n🏗️  TABELLE ACCIAIO:\n')
for (const table of acciaioTables) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.log(`❌ ${table}: ${error.message}`)
  } else {
    console.log(`✅ ${table}: ${count} rows`)
  }
}

console.log('\n✅ Test completato!')
