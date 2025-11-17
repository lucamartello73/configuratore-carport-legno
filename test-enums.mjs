import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

const { data: model } = await supabase.from('carport_legno_models').select('id').limit(1).single()
const { data: coverage } = await supabase.from('carport_legno_coverage_types').select('id').limit(1).single()
const { data: color } = await supabase.from('carport_legno_colors').select('id').limit(1).single()
const { data: surface } = await supabase.from('carport_legno_surfaces').select('id').limit(1).single()
const { data: structure } = await supabase.from('carport_legno_structure_types').select('id').limit(1).single()

const baseData = {
  model_id: model.id,
  coverage_id: coverage.id,
  color_id: color.id,
  surface_id: surface.id,
  structure_type_id: structure.id,
  width: 300,
  depth: 500,
  height: 250,
  customer_name: 'Test',
  customer_email: 'test@test.com',
  customer_phone: '+39123456789',
  customer_address: 'Via Test',
  customer_city: 'Milano',
  customer_postal_code: '20100',
  total_price: 5000,
  notes: ''
}

console.log('🧪 TESTING ENUM VALUES\n')

// Test contact_preference values
const contactPrefs = ['email', 'telefono', 'whatsapp', 'phone', 'telephone']
console.log('📞 contact_preference:')
for (const pref of contactPrefs) {
  const { data, error } = await supabase
    .from('carport_legno_configurations')
    .insert({ ...baseData, contact_preference: pref, status: 'pending' })
    .select()
  
  if (error) {
    console.log(`   ❌ "${pref}": ${error.message}`)
  } else {
    console.log(`   ✅ "${pref}": OK`)
    await supabase.from('carport_legno_configurations').delete().eq('id', data[0].id)
  }
}

// Test status values
const statuses = ['pending', 'submitted', 'confirmed', 'processing', 'completed', 'cancelled', 'test']
console.log('\n📋 status:')
for (const status of statuses) {
  const { data, error } = await supabase
    .from('carport_legno_configurations')
    .insert({ ...baseData, status, contact_preference: 'email' })
    .select()
  
  if (error) {
    console.log(`   ❌ "${status}": ${error.message}`)
  } else {
    console.log(`   ✅ "${status}": OK`)
    await supabase.from('carport_legno_configurations').delete().eq('id', data[0].id)
  }
}

console.log('\n✅ Test complete!')
