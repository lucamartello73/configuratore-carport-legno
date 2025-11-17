import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('📋 VERIFICA SCHEMA TABELLE CONFIGURATIONS\n')

// Test insert LEGNO
console.log('🌳 Test INSERT carport_legno_configurations...\n')

const legnoTestData = {
  width: 300,
  depth: 500,
  height: 250,
  model_id: 'test-model-id',
  coverage_id: 'test-coverage-id',
  surface_id: 'test-surface-id',
  structure_type_id: 'test-structure-id',
  color_id: 'test-color-id',
  package_type: 'chiavi-in-mano',
  customer_name: 'Test User',
  customer_email: 'test@example.com',
  customer_phone: '+39 123456789',
  customer_address: 'Via Test 123',
  customer_city: 'Milano',
  customer_postal_code: '20100',
  customer_province: 'MI',
  contact_preference: 'email',
  total_price: 5000,
  status: 'test'
}

const { data: legnoData, error: legnoError } = await supabase
  .from('carport_legno_configurations')
  .insert(legnoTestData)
  .select()

if (legnoError) {
  console.log('❌ ERRORE INSERT LEGNO:')
  console.log('   Code:', legnoError.code)
  console.log('   Message:', legnoError.message)
  console.log('   Details:', legnoError.details)
  console.log('   Hint:', legnoError.hint)
} else {
  console.log('✅ INSERT LEGNO RIUSCITO!')
  console.log('   ID:', legnoData[0].id)
  
  // Elimina test record
  await supabase
    .from('carport_legno_configurations')
    .delete()
    .eq('id', legnoData[0].id)
  console.log('   ✓ Test record eliminato\n')
}

// Test insert ACCIAIO
console.log('🏗️  Test INSERT carport_configurations...\n')

const acciaioTestData = {
  width: 300,
  depth: 500,
  height: 250,
  structure_type: 'test-structure',
  model_id: 'test-model-id',
  coverage_id: 'test-coverage-id',
  structure_color_id: 'test-color-id',
  coverage_color_id: null,
  surface_id: null,
  package_type: 'chiavi-in-mano',
  customer_name: 'Test User',
  customer_email: 'test@example.com',
  customer_phone: '+39 123456789',
  customer_address: 'Via Test 123',
  customer_city: 'Milano',
  customer_cap: '20100',
  customer_province: 'MI',
  contact_preference: 'email',
  total_price: 5000,
  status: 'test'
}

const { data: acciaioData, error: acciaioError } = await supabase
  .from('carport_configurations')
  .insert(acciaioTestData)
  .select()

if (acciaioError) {
  console.log('❌ ERRORE INSERT ACCIAIO:')
  console.log('   Code:', acciaioError.code)
  console.log('   Message:', acciaioError.message)
  console.log('   Details:', acciaioError.details)
  console.log('   Hint:', acciaioError.hint)
} else {
  console.log('✅ INSERT ACCIAIO RIUSCITO!')
  console.log('   ID:', acciaioData[0].id)
  
  // Elimina test record
  await supabase
    .from('carport_configurations')
    .delete()
    .eq('id', acciaioData[0].id)
  console.log('   ✓ Test record eliminato\n')
}

console.log('✅ Test schema completato!')
