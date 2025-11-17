import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaafkjoxtzbimacimkrw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// Get real IDs
const { data: model } = await supabase.from('carport_legno_models').select('id').limit(1).single()
const { data: coverage } = await supabase.from('carport_legno_coverage_types').select('id').limit(1).single()
const { data: color } = await supabase.from('carport_legno_colors').select('id').limit(1).single()
const { data: surface } = await supabase.from('carport_legno_surfaces').select('id').limit(1).single()
const { data: structure } = await supabase.from('carport_legno_structure_types').select('id').limit(1).single()

console.log('🧪 TESTING CUSTOMER FIELDS\n')

const baseData = {
  model_id: model.id,
  coverage_id: coverage.id,
  color_id: color.id,
  surface_id: surface.id,
  structure_type_id: structure.id,
  width: 300,
  depth: 500,
  height: 250,
}

const fieldsToTest = [
  'customer_name',
  'customer_email',
  'customer_phone',
  'customer_address',
  'customer_city',
  'customer_postal_code',
  'customer_province',
  'customer_cap',
  'package_type',
  'contact_preference',
  'total_price',
  'status',
  'notes',
]

for (const field of fieldsToTest) {
  const testData = {
    ...baseData,
    [field]: field === 'total_price' ? 5000 : (field === 'width' ? 300 : 'test')
  }
  
  const { data, error } = await supabase
    .from('carport_legno_configurations')
    .insert(testData)
    .select()
  
  if (error) {
    if (error.message.includes('Could not find')) {
      console.log(`❌ ${field}: COLUMN NOT EXISTS`)
    } else {
      console.log(`⚠️ ${field}: ${error.message}`)
    }
  } else {
    console.log(`✅ ${field}: OK`)
    await supabase.from('carport_legno_configurations').delete().eq('id', data[0].id)
  }
}

console.log('\n✅ Test complete!')
