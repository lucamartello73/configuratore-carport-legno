import { createBrowserClient } from "@supabase/ssr"

// Types
export interface StructureType {
  id: string
  name: string
  description: string
  image: string | null
  created_at: string
  updated_at: string
}

export interface CoverageType {
  id: string
  name: string
  description: string
  image: string | null
  created_at: string
  updated_at: string
}

export interface AccessoryType {
  id: string
  name: string
  icon: string
  image: string | null
  created_at: string
  updated_at: string
}

export interface ColorType {
  id: string
  category: "smalto" | "impregnante-legno" | "impregnante-pastello"
  name: string
  hex_value: string
  created_at: string
  updated_at: string
}

export interface ConfigurationData {
  type_id: string
  width: number
  depth: number
  height: number
  color_name: string
  color_value: string
  coverage_id: string
  accessories: AccessoryType[]
  service_type: "chiavi-in-mano" | "fai-da-te"
  contact_data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
  }
  contact_preference: "email" | "whatsapp" | "phone"
}

// Create Supabase client
const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Client-side functions
export async function getStructureTypes(): Promise<StructureType[]> {
  try {
    const { data, error } = await supabase.from("configuratorelegno_pergola_types").select("*").order("created_at")

    if (error) {
      console.error("Error fetching structure types:", error)
      // Fallback data
      return [
        {
          id: "1",
          name: "Pergola Addossata",
          description: "Perfetta per terrazzi e spazi adiacenti alla casa",
          image: "/pergola-addossata-terrazzo-casa.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Pergola Libera",
          description: "Struttura indipendente ideale per giardini",
          image: "/pergola-libera-giardino-indipendente.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Pergola Bioclimatica",
          description: "Tecnologia avanzata con lamelle orientabili",
          image: "/pergola-bioclimatica-lamelle-orientabili.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }

    return data || []
  } catch (error) {
    console.error("Network error:", error)
    return []
  }
}

export async function getCoverageTypes(): Promise<CoverageType[]> {
  try {
    const { data, error } = await supabase.from("configuratorelegno_coverage_types").select("*").order("created_at")

    if (error) {
      console.error("Error fetching coverage types:", error)
      // Fallback data
      return [
        {
          id: "1",
          name: "Tenda da Sole",
          description: "Tessuto tecnico resistente agli agenti atmosferici",
          image: "/tenda-da-sole-tessuto-pergola.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Policarbonato",
          description: "Pannelli trasparenti resistenti",
          image: "/copertura-policarbonato-trasparente-pergola.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }

    return data || []
  } catch (error) {
    console.error("Network error:", error)
    return []
  }
}

export async function getAccessories(): Promise<AccessoryType[]> {
  try {
    const { data, error } = await supabase.from("configuratorelegno_accessories").select("*").order("created_at")

    if (error) {
      console.error("Error fetching accessories:", error)
      // Fallback data
      return [
        {
          id: "1",
          name: "Illuminazione LED",
          icon: "💡",
          image: "/illuminazione-led-pergola.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Sensore Vento",
          icon: "🌪️",
          image: "/sensore-vento-pergola-automatico.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }

    return data || []
  } catch (error) {
    console.error("Network error:", error)
    return []
  }
}

export async function getColors(): Promise<ColorType[]> {
  try {
    const { data, error } = await supabase
      .from("configuratorelegno_colors")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching colors:", error)
      // Fallback data
      return [
        {
          id: "1",
          category: "smalto",
          name: "Bianco Puro",
          hex_value: "#FFFFFF",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          category: "smalto",
          name: "Nero Elegante",
          hex_value: "#1A1A1A",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }

    return data || []
  } catch (error) {
    console.error("Network error:", error)
    return []
  }
}

export async function saveConfiguration(config: ConfigurationData): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("configuratorelegno_configurations")
      .insert([config])
      .select("id")
      .single()

    if (error) {
      console.error("Error saving configuration:", error)
      throw new Error("Errore nel salvataggio della configurazione")
    }

    return data.id
  } catch (error) {
    console.error("Network error:", error)
    throw new Error("Errore di connessione")
  }
}
