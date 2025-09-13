"use server"

import { createClient } from "@/lib/supabase/server"

export interface ConfigurationData {
  structure_type: string
  model_id: string
  width: number
  depth: number
  height: number
  coverage_id: string
  structure_color: string
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

    let structure_color_id = null
    if (configData.structure_color) {
      const { data: colorData, error: colorError } = await supabase
        .from("carport_colors")
        .select("id")
        .ilike("name", `%${configData.structure_color}%`)
        .maybeSingle()

      if (colorError) {
        console.error("Color lookup error:", colorError)
      } else if (colorData) {
        structure_color_id = colorData.id
      } else {
        console.log("[v0] Color not found, creating custom color:", configData.structure_color)
        const { data: newColorData, error: insertError } = await supabase
          .from("carport_colors")
          .insert({
            name: configData.structure_color,
            hex_value: "#000000", // Default hex for custom colors
            category: "custom",
            price_modifier: 0,
          })
          .select("id")
          .single()

        if (!insertError && newColorData) {
          structure_color_id = newColorData.id
          console.log("[v0] Created custom color with ID:", structure_color_id)
        } else {
          console.error("Error creating custom color:", insertError)
        }
      }
    }

    const { structure_color, ...restConfigData } = configData
    const dbData = {
      ...restConfigData,
      structure_color_id,
    }

    const { data, error } = await supabase.from("carport_configurations").insert(dbData).select().single()

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
