import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🧪 TEST MINIMAL INSERT\n')

// First, get real model_id, coverage_id, etc from database
const { data: model } = await supabase
  .from('carport_legno_models')
  .select('id')
  .limit(1)
  .single()

const { data: coverage } = await supabase
  .from('carport_legno_coverage_types')
  .select('id')
  .limit(1)
  .single()

const { data: color } = await supabase
  .from('carport_legno_colors')
  .select('id')
  .limit(1)
  .single()

const { data: surface } = await supabase
  .from('carport_legno_surfaces')
  .select('id')
  .limit(1)
  .single()

const { data: structure } = await supabase
  .from('carport_legno_structure_types')
  .select('id')
  .limit(1)
  .single()

console.log('📋 Real IDs from database:')
console.log('   model_id:', model?.id)
console.log('   coverage_id:', coverage?.id)
console.log('   color_id:', color?.id)
console.log('   surface_id:', surface?.id)
console.log('   structure_type_id:', structure?.id)
console.log()

// Try progressively adding fields
const tests = [
  {
    name: 'Test 1: Only required FK',
    data: {
      model_id: model?.id,
      coverage_id: coverage?.id,
      color_id: color?.id,
      surface_id: surface?.id,
      structure_type_id: structure?.id,
    }
  },
  {
    name: 'Test 2: Add dimensions',
    data: {
      model_id: model?.id,
      coverage_id: coverage?.id,
      color_id: color?.id,
      surface_id: surface?.id,
      structure_type_id: structure?.id,
      width: 300,
      depth: 500,
      height: 250,
    }
  },
  {
    name: 'Test 3: Add customer fields (NO province)',
    data: {
      model_id: model?.id,
      coverage_id: coverage?.id,
      color_id: color?.id,
      surface_id: surface?.id,
      structure_type_id: structure?.id,
      width: 300,
      depth: 500,
      height: 250,
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '+39 123456789',
      customer_address: 'Via Test 123',
      customer_city: 'Milano',
      customer_postal_code: '20100',
      package_type: 'chiavi-in-mano',
      contact_preference: 'email',
      total_price: 5000,
      status: 'test',
    }
  }
]

for (const test of tests) {
  console.log(`\n🧪 ${test.name}`)
  const { data, error } = await supabase
    .from('carport_legno_configurations')
    .insert(test.data)
    .select()
  
  if (error) {
    console.log(`   ❌ FAILED: ${error.message}`)
  } else {
    console.log(`   ✅ SUCCESS! ID: ${data[0].id}`)
    // Delete test record
    await supabase.from('carport_legno_configurations').delete().eq('id', data[0].id)
    console.log(`   ✓ Test record deleted`)
  }
}

console.log('\n✅ Test complete!')
