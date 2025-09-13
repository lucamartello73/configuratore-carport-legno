"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getColors() {
  const supabase = createClient()

  const { data, error } = await supabase.from("carport_colors").select("*").order("name")

  if (error) {
    console.error("Error fetching colors:", error)
    throw new Error("Failed to fetch colors")
  }

  return data
}

export async function createColor(colorData: {
  name: string
  hex_value: string // Changed from hex_code to hex_value to match database schema
  price_modifier: number
}) {
  const supabase = createClient()

  const { data, error } = await supabase.from("carport_colors").insert([colorData]).select().single()

  if (error) {
    console.error("Error creating color:", error)
    throw new Error("Failed to create color")
  }

  revalidatePath("/admin/colors")
  return data
}

export async function updateColor(
  id: string, // Changed from number to string since id is uuid
  colorData: {
    name: string
    hex_value: string // Changed from hex_code to hex_value to match database schema
    price_modifier: number
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("carport_colors").update(colorData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating color:", error)
    throw new Error("Failed to update color")
  }

  revalidatePath("/admin/colors")
  return data
}

export async function deleteColor(id: string) {
  // Changed from number to string since id is uuid
  const supabase = createClient()

  const { error } = await supabase.from("carport_colors").delete().eq("id", id)

  if (error) {
    console.error("Error deleting color:", error)
    throw new Error("Failed to delete color")
  }

  revalidatePath("/admin/colors")
}
