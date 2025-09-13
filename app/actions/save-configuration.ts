"use server"

import { createClient } from "@/lib/supabase/server"

export interface ConfigurationData {
  structure_type: string
  model_id: string
  width: number
  depth: number
  height: number
  coverage_id: string
  structure_color_id: string
  coverage_color_id: string
  surface_id: string
  package_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_cap: string
  customer_province: string
  total_price: number
  status: string
}

export async function saveConfiguration(configData: ConfigurationData) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("carport_configurations").insert(configData).select().single()

    if (error) {
      console.error("Database error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error saving configuration:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
