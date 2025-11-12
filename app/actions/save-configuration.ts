"use server"

import { createClient } from "@/lib/supabase/server"
import { getTableName, type ConfiguratorType } from "@/lib/supabase/tables"

export interface ConfigurationData {
  configurator_type?: 'acciaio' | 'legno' // Tipo di configuratore
  structure_type: string
  model_id: string
  width: number
  depth: number
  height: number
  coverage_id: string
  structure_color: string
  surface_id?: string
  package_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_cap: string
  customer_province: string
  contact_preference: string // Added contact_preference field
  total_price: number
  status: string
}

export async function saveConfiguration(configData: ConfigurationData) {
  try {
    console.log("[v0] Starting saveConfiguration with data:", configData)
    const supabase = await createClient()

    let structure_color_id = null

    if (configData.structure_color) {
      console.log("[v0] Looking up structure color:", configData.structure_color)
      // Check if it's already a valid UUID (direct color ID)
      if (configData.structure_color.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // It's a UUID, use it directly
        structure_color_id = configData.structure_color
        console.log("[v0] Using structure color ID directly:", structure_color_id)
      } else {
        // It's a custom color or name, try to find by name
        // Determina il tipo di configuratore (default: acciaio)
        const configuratorType: ConfiguratorType = (configData as any).configurator_type || 'acciaio'
        const colorsTable = getTableName(configuratorType, 'colors')
        
        const { data: colorData, error: colorError } = await supabase
          .from(colorsTable)
          .select("id")
          .ilike("name", `%${configData.structure_color}%`)
          .maybeSingle()

        if (colorError) {
          console.error("[v0] Structure color lookup error:", colorError)
        } else if (colorData) {
          structure_color_id = colorData.id
          console.log("[v0] Found existing structure color with ID:", structure_color_id)
        }
      }
    }

    const { structure_color, surface_id, ...restConfigData } = configData
    const dbData = {
      ...restConfigData,
      structure_color_id,
      coverage_color_id: null, // Always null since coverage color is not selected by client
      surface_id: surface_id || null,
    }

    // Determina il tipo di configuratore (default: acciaio)
    const configuratorType: ConfiguratorType = (configData as any).configurator_type || 'acciaio'
    const configurationsTable = getTableName(configuratorType, 'configurations')
    
    console.log(`[v0] Attempting to insert configuration data into ${configurationsTable}:`, dbData)
    const { data, error } = await supabase.from(configurationsTable).insert(dbData).select().single()

    if (error) {
      console.error("[v0] Database insert error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("[v0] Configuration saved successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error in saveConfiguration:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
