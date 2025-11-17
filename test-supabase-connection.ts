/**
 * Script di Test Connessione Supabase
 * Verifica tabelle LEGNO e ACCIAIO nel database condiviso
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')
  console.log('📍 URL:', supabaseUrl)
  console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...\n')

  try {
    // Test 1: Verifica tabelle LEGNO
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📦 TABELLE CONFIGURATORE LEGNO (carport_legno_*)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const legnoTables = [
      'carport_legno_configurations',
      'carport_legno_models',
      'carport_legno_colors',
      'carport_legno_coverage_types',
      'carport_legno_structure_types',
      'carport_legno_accessories',
      'carport_legno_packages',
      'carport_legno_surfaces'
    ]

    for (const tableName of legnoTables) {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${tableName}: NOT FOUND (${error.message})`)
      } else {
        console.log(`✅ ${tableName}: EXISTS (${count} rows)`)
      }
    }

    // Test 2: Verifica tabelle ACCIAIO
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🏗️  TABELLE CONFIGURATORE ACCIAIO (carport_*)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const acciaioTables = [
      'carport_configurations',
      'carport_models',
      'carport_colors',
      'carport_coverage_types',
      'carport_structure_types',
      'carport_surfaces',
      'carport_pricing_rules'
    ]

    for (const tableName of acciaioTables) {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${tableName}: NOT FOUND (${error.message})`)
      } else {
        console.log(`✅ ${tableName}: EXISTS (${count} rows)`)
      }
    }

    // Test 3: Verifica schema carport_legno_configurations
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 SCHEMA carport_legno_configurations')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const { data: legnoSchema, error: legnoSchemaError } = await supabase
      .from('carport_legno_configurations')
      .select('*')
      .limit(1)

    if (legnoSchemaError) {
      console.log('❌ Cannot fetch schema:', legnoSchemaError.message)
    } else if (legnoSchema && legnoSchema.length > 0) {
      console.log('Columns:', Object.keys(legnoSchema[0]).join(', '))
    } else {
      console.log('ℹ️  Table exists but is empty')
    }

    // Test 4: Verifica configurazioni esistenti
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 STATISTICHE CONFIGURAZIONI')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const { count: legnoCount } = await supabase
      .from('carport_legno_configurations')
      .select('*', { count: 'exact', head: true })

    const { count: acciaioCount } = await supabase
      .from('carport_configurations')
      .select('*', { count: 'exact', head: true })

    console.log(`🌳 LEGNO:   ${legnoCount || 0} configurazioni salvate`)
    console.log(`🏗️  ACCIAIO: ${acciaioCount || 0} configurazioni salvate`)

    // Test 5: Verifica ultima configurazione LEGNO
    const { data: lastLegno, error: lastLegnoError } = await supabase
      .from('carport_legno_configurations')
      .select('id, customer_name, customer_email, created_at, status')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lastLegnoError && lastLegno) {
      console.log('\n📝 Ultima configurazione LEGNO:')
      console.log(`   ID: ${lastLegno.id}`)
      console.log(`   Cliente: ${lastLegno.customer_name}`)
      console.log(`   Email: ${lastLegno.customer_email}`)
      console.log(`   Status: ${lastLegno.status}`)
      console.log(`   Data: ${new Date(lastLegno.created_at).toLocaleString('it-IT')}`)
    }

    console.log('\n✅ Test completato con successo!\n')

  } catch (error) {
    console.error('\n❌ Errore durante il test:', error)
    process.exit(1)
  }
}

testConnection()
