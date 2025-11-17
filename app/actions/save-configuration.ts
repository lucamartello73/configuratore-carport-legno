"use server"

import { createClient } from "@/lib/supabase/server"
import { getTableName, type ConfiguratorType } from "@/lib/supabase/tables"

// Interfaccia base comune
interface BaseConfigurationData {
  configurator_type: 'acciaio' | 'legno'
  width: number
  depth: number
  height: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  contact_preference: string
  total_price: number
  status: string
  notes?: string
}

// Interfaccia specifica per ACCIAIO
interface AcciaioConfigurationData extends BaseConfigurationData {
  configurator_type: 'acciaio'
  structure_type: string
  model_id: string
  coverage_id: string
  structure_color: string // Colore struttura acciaio (nome o UUID)
  surface_id?: string
  customer_cap: string // ACCIAIO usa customer_cap
  customer_province?: string // ACCIAIO può avere province
  package_type?: string // ACCIAIO può usare package_type stringa
}

// Interfaccia specifica per LEGNO
interface LegnoConfigurationData extends BaseConfigurationData {
  configurator_type: 'legno'
  structure_type_id: string // UUID tipo struttura
  model_id: string
  coverage_id: string
  color_id: string // UUID colore legno
  surface_id: string // UUID superficie (obbligatorio per legno)
  customer_postal_code: string // LEGNO usa customer_postal_code (non customer_cap!)
  package_id?: string | null // LEGNO usa package_id (FK UUID, non stringa!)
}

export type ConfigurationData = AcciaioConfigurationData | LegnoConfigurationData

/**
 * Prepara dati denormalizzati per email (nomi leggibili invece di UUID)
 */
async function prepareEmailData(
  supabase: any,
  configuratorType: ConfiguratorType,
  configurationId: string,
  originalData: ConfigurationData
) {
  const emailData: any = {
    customerName: originalData.customer_name,
    customerEmail: originalData.customer_email,
    customerPhone: originalData.customer_phone,
    customerAddress: originalData.customer_address,
    customerCity: originalData.customer_city,
    customerCap: configuratorType === 'acciaio' 
      ? (originalData as AcciaioConfigurationData).customer_cap
      : (originalData as LegnoConfigurationData).customer_postal_code,
    customerProvince: configuratorType === 'acciaio' 
      ? (originalData as AcciaioConfigurationData).customer_province
      : '',
    contactPreference: originalData.contact_preference,
    dimensions: {
      width: originalData.width,
      depth: originalData.depth,
      height: originalData.height,
    },
    packageType: configuratorType === 'acciaio'
      ? (originalData as AcciaioConfigurationData).package_type || ''
      : (originalData as LegnoConfigurationData).package_id || '',
    totalPrice: originalData.total_price,
  }

  if (configuratorType === 'legno') {
    const legnoData = originalData as LegnoConfigurationData
    
    // Recupera nomi leggibili dalle tabelle
    const [structureTypeResult, modelResult, coverageResult, colorResult, surfaceResult] = await Promise.all([
      supabase.from(getTableName('legno', 'structure_types')).select('name').eq('id', legnoData.structure_type_id).maybeSingle(),
      supabase.from(getTableName('legno', 'models')).select('name').eq('id', legnoData.model_id).maybeSingle(),
      supabase.from(getTableName('legno', 'coverage_types')).select('name').eq('id', legnoData.coverage_id).maybeSingle(),
      supabase.from(getTableName('legno', 'colors')).select('name').eq('id', legnoData.color_id).maybeSingle(),
      supabase.from(getTableName('legno', 'surfaces')).select('name').eq('id', legnoData.surface_id).maybeSingle(),
    ])
    
    emailData.structureType = structureTypeResult.data?.name || 'N/A'
    emailData.modelName = modelResult.data?.name || 'N/A'
    emailData.coverageType = coverageResult.data?.name || 'N/A'
    emailData.colorName = colorResult.data?.name || 'N/A'
    emailData.surfaceName = surfaceResult.data?.name || 'N/A'
  } else if (configuratorType === 'acciaio') {
    const acciaioData = originalData as AcciaioConfigurationData
    
    // TODO: Implementare per acciaio quando necessario
    emailData.structureType = acciaioData.structure_type
    emailData.modelName = 'N/A'
    emailData.coverageType = 'N/A'
    emailData.colorName = acciaioData.structure_color
    emailData.surfaceName = 'N/A'
  }
  
  return emailData
}

export async function saveConfiguration(configData: ConfigurationData) {
  try {
    const configuratorType = configData.configurator_type
    console.log(`[${configuratorType}] Starting saveConfiguration with data:`, configData)
    
    const supabase = await createClient()
    const configurationsTable = getTableName(configuratorType, 'configurations')

    // Campi comuni base
    let dbData: any = {
      width: configData.width,
      depth: configData.depth,
      height: configData.height,
      model_id: configData.model_id,
      coverage_id: configData.coverage_id,
      surface_id: configData.surface_id || null,
      customer_name: configData.customer_name,
      customer_email: configData.customer_email,
      customer_phone: configData.customer_phone,
      customer_address: configData.customer_address,
      customer_city: configData.customer_city,
      contact_preference: configData.contact_preference,
      total_price: configData.total_price,
      status: configData.status,
      notes: configData.notes || null,
    }

    // Gestione CONFIGURATORE ACCIAIO
    if (configuratorType === 'acciaio') {
      const acciaioData = configData as AcciaioConfigurationData
      
      // Campi specifici ACCIAIO
      dbData.customer_cap = acciaioData.customer_cap
      dbData.customer_province = acciaioData.customer_province || null
      dbData.package_type = acciaioData.package_type || null
      
      let structure_color_id = null
      
      if (acciaioData.structure_color) {
        console.log("[acciaio] Looking up structure color:", acciaioData.structure_color)
        
        // Check if it's already a valid UUID
        if (acciaioData.structure_color.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          structure_color_id = acciaioData.structure_color
          console.log("[acciaio] Using structure color ID directly:", structure_color_id)
        } else {
          // It's a color name, look it up
          const colorsTable = getTableName('acciaio', 'colors')
          const { data: colorData, error: colorError } = await supabase
            .from(colorsTable)
            .select("id")
            .ilike("name", `%${acciaioData.structure_color}%`)
            .maybeSingle()

          if (colorError) {
            console.error("[acciaio] Structure color lookup error:", colorError)
          } else if (colorData) {
            structure_color_id = colorData.id
            console.log("[acciaio] Found existing structure color with ID:", structure_color_id)
          }
        }
      }

      dbData = {
        ...dbData,
        structure_type: acciaioData.structure_type,
        structure_color_id,
        coverage_color_id: null, // Always null since coverage color is not selected
      }
    }
    
    // Gestione CONFIGURATORE LEGNO
    else if (configuratorType === 'legno') {
      const legnoData = configData as LegnoConfigurationData
      
      console.log("[legno] Processing legno configuration with:", {
        structure_type_id: legnoData.structure_type_id,
        color_id: legnoData.color_id,
        surface_id: legnoData.surface_id,
      })

      // Campi specifici LEGNO
      dbData.customer_postal_code = legnoData.customer_postal_code  // ⚠️ NOT customer_cap!
      dbData.package_id = legnoData.package_id || null              // ⚠️ FK UUID, NOT package_type!
      dbData.structure_type_id = legnoData.structure_type_id
      dbData.color_id = legnoData.color_id
      dbData.surface_id = legnoData.surface_id // Obbligatorio per legno
      
      // ❌ NON aggiungere customer_province (non esiste nel DB LEGNO)
      // ❌ NON aggiungere package_type (LEGNO usa package_id FK)
    }

    console.log(`[${configuratorType}] Attempting to insert into ${configurationsTable}:`, dbData)
    
    const { data, error } = await supabase
      .from(configurationsTable)
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error(`[${configuratorType}] Database insert error:`, error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`[${configuratorType}] Configuration saved successfully with ID:`, data.id)
    
    // Invio email notifiche (cliente + admin)
    try {
      console.log(`[${configuratorType}] Tentativo invio email...`)
      
      // Recupera dati denormalizzati per email
      const emailData = await prepareEmailData(supabase, configuratorType, data.id, configData)
      
      // Chiama API email (non blocca il salvataggio se fallisce)
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-configuration-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      })
      
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        console.error(`[${configuratorType}] ⚠️ Errore invio email:`, errorData)
        // Non fallire il salvataggio anche se email fallisce
      } else {
        console.log(`[${configuratorType}] ✅ Email inviate con successo`)
      }
    } catch (emailError) {
      console.error(`[${configuratorType}] ⚠️ Errore invio email (non critico):`, emailError)
      // Email failure non impedisce il salvataggio
    }
    
    return { success: true, data }
    
  } catch (error) {
    console.error("[save-configuration] Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
