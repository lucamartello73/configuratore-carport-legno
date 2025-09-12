import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Server-side Supabase client for admin operations
export function createAdminClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Admin server functions
export async function getConfigurationsServer() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("configuratorelegno_configurations")
    .select(`
      *,
      configuratorelegno_pergola_types(name),
      configuratorelegno_coverage_types(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching configurations:", error)
    throw new Error("Failed to fetch configurations")
  }

  return data || []
}

export async function deleteConfigurationServer(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_configurations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting configuration:", error)
    throw new Error("Failed to delete configuration")
  }
}

export async function updateStructureTypeServer(
  id: string,
  data: { name: string; description: string; image?: string },
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("configuratorelegno_pergola_types")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating structure type:", error)
    throw new Error("Failed to update structure type")
  }
}

export async function createStructureTypeServer(data: { name: string; description: string; image?: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_pergola_types").insert([data])

  if (error) {
    console.error("Error creating structure type:", error)
    throw new Error("Failed to create structure type")
  }
}

export async function deleteStructureTypeServer(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_pergola_types").delete().eq("id", id)

  if (error) {
    console.error("Error deleting structure type:", error)
    throw new Error("Failed to delete structure type")
  }
}

export async function updateCoverageTypeServer(
  id: string,
  data: { name: string; description: string; image?: string },
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("configuratorelegno_coverage_types")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating coverage type:", error)
    throw new Error("Failed to update coverage type")
  }
}

export async function createCoverageTypeServer(data: { name: string; description: string; image?: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_coverage_types").insert([data])

  if (error) {
    console.error("Error creating coverage type:", error)
    throw new Error("Failed to create coverage type")
  }
}

export async function deleteCoverageTypeServer(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_coverage_types").delete().eq("id", id)

  if (error) {
    console.error("Error deleting coverage type:", error)
    throw new Error("Failed to delete coverage type")
  }
}

export async function updateAccessoryServer(id: string, data: { name: string; icon: string; image?: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("configuratorelegno_accessories")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating accessory:", error)
    throw new Error("Failed to update accessory")
  }
}

export async function createAccessoryServer(data: { name: string; icon: string; image?: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_accessories").insert([data])

  if (error) {
    console.error("Error creating accessory:", error)
    throw new Error("Failed to create accessory")
  }
}

export async function deleteAccessoryServer(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_accessories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting accessory:", error)
    throw new Error("Failed to delete accessory")
  }
}

export async function updateColorServer(id: string, data: { name: string; hex_value: string; category: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("configuratorelegno_colors")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating color:", error)
    throw new Error("Failed to update color")
  }
}

export async function createColorServer(data: { name: string; hex_value: string; category: string }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_colors").insert([data])

  if (error) {
    console.error("Error creating color:", error)
    throw new Error("Failed to create color")
  }
}

export async function deleteColorServer(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("configuratorelegno_colors").delete().eq("id", id)

  if (error) {
    console.error("Error deleting color:", error)
    throw new Error("Failed to delete color")
  }
}

export async function getAdminStatsServer() {
  const supabase = createAdminClient()

  const [structures, coverages, accessories, colors, configurations] = await Promise.all([
    supabase.from("configuratorelegno_pergola_types").select("id", { count: "exact" }),
    supabase.from("configuratorelegno_coverage_types").select("id", { count: "exact" }),
    supabase.from("configuratorelegno_accessories").select("id", { count: "exact" }),
    supabase.from("configuratorelegno_colors").select("id", { count: "exact" }),
    supabase.from("configuratorelegno_configurations").select("id", { count: "exact" }),
  ])

  return {
    structures: structures.count || 0,
    coverages: coverages.count || 0,
    accessories: accessories.count || 0,
    colors: colors.count || 0,
    configurations: configurations.count || 0,
  }
}
