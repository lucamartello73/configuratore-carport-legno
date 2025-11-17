import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

const { data: model } = await supabase.from('carport_legno_models').select('id').limit(1).single()
const { data: coverage } = await supabase.from('carport_legno_coverage_types').select('id').limit(1).single()
const { data: color } = await supabase.from('carport_legno_colors').select('id').limit(1).single()
const { data: surface } = await supabase.from('carport_legno_surfaces').select('id').limit(1).single()
const { data: structure } = await supabase.from('carport_legno_structure_types').select('id').limit(1).single()

console.log('🧪 TESTING FULL CONFIGURATION INSERT\n')

// Test with minimal required fields
const testData = {
  model_id: model.id,
  coverage_id: coverage.id,
  color_id: color.id,
  surface_id: surface.id,
  structure_type_id: structure.id,
  width: 300,
  depth: 500,
  height: 250,
  customer_name: 'Mario Rossi',
  customer_email: 'mario.rossi@example.com',
  customer_phone: '+39 333 1234567',
  customer_address: 'Via Roma 123',
  customer_city: 'Milano',
  customer_postal_code: '20100',
  total_price: 5500.50,
  notes: 'Questa è una configurazione di test'
}

console.log('📋 Test Data:')
console.log(JSON.stringify(testData, null, 2))
console.log()

const { data, error } = await supabase
  .from('carport_legno_configurations')
  .insert(testData)
  .select()

if (error) {
  console.log('❌ INSERT FAILED:')
  console.log('   Code:', error.code)
  console.log('   Message:', error.message)
  console.log('   Details:', error.details)
  console.log('   Hint:', error.hint)
  
  // Try to understand what's required
  console.log('\n🔍 Analyzing error...')
  if (error.message.includes('check constraint')) {
    console.log('   ⚠️ CHECK CONSTRAINT VIOLATION')
    console.log('   This means a field has an enum or range restriction.')
    console.log('   Missing fields: contact_preference?, status?')
  }
} else {
  console.log('✅ INSERT SUCCESSFUL!')
  console.log('   ID:', data[0].id)
  console.log('   Created at:', data[0].created_at)
  console.log('\n📄 Full record:')
  console.log(JSON.stringify(data[0], null, 2))
  
  // Clean up
  await supabase.from('carport_legno_configurations').delete().eq('id', data[0].id)
  console.log('\n✓ Test record deleted')
}

console.log('\n✅ Test complete!')
