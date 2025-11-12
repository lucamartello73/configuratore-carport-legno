/**
 * Helper centralizzato per fetch dati configuratori da Supabase
 * Gestisce automaticamente filtri per materiale e stato attivo
 */

import { createClient } from "@/lib/supabase/client"
import { getTableName, type ConfiguratorType } from "@/lib/supabase/tables"

export interface ConfiguratorDataOptions {
  /** Tipo di configuratore (acciaio o legno) */
  material: ConfiguratorType
  /** Nome logico tabella (es: 'structure_types', 'models', etc.) */
  table: string
  /** Filtri aggiuntivi opzionali */
  filters?: Record<string, any>
  /** Campo per ordinamento (default: 'ordine' o 'display_order' o 'name') */
  orderBy?: string
  /** Ordine ascendente (default: true) */
  ascending?: boolean
}

/**
 * Fetch dati configuratore con filtri automatici per materiale e stato attivo
 * 
 * @example
 * ```typescript
 * // Fetch modelli legno
 * const models = await fetchConfiguratorData({
 *   material: 'legno',
 *   table: 'models'
 * })
 * 
 * // Fetch colori acciaio con filtro aggiuntivo
 * const colors = await fetchConfiguratorData({
 *   material: 'acciaio',
 *   table: 'colors',
 *   filters: { category: 'smalti_ral' }
 * })
 * ```
 */
export async function fetchConfiguratorData<T = any>(
  options: ConfiguratorDataOptions
): Promise<{ data: T[] | null; error: any }> {
  const { material, table, filters = {}, orderBy, ascending = true } = options

  try {
    const supabase = createClient()
    
    // Ottieni nome tabella fisica
    const physicalTableName = getTableName(material, table as any)
    
    console.log(`[fetchConfiguratorData] Fetching from ${physicalTableName} for ${material}`)

    // Query base: seleziona tutto da tabella
    let query = supabase.from(physicalTableName).select("*")

    // Filtro stato attivo (se colonna esiste)
    // Alcune tabelle usano 'is_active', altre 'attivo'
    if (await hasColumn(physicalTableName, 'is_active')) {
      query = query.eq('is_active', true)
    } else if (await hasColumn(physicalTableName, 'attivo')) {
      query = query.eq('attivo', true)
    }

    // Filtri aggiuntivi personalizzati
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    // Ordinamento
    const orderField = orderBy || (await hasColumn(physicalTableName, 'ordine') ? 'ordine' : 
                                    await hasColumn(physicalTableName, 'display_order') ? 'display_order' : 
                                    'name')
    query = query.order(orderField, { ascending })

    const { data, error } = await query

    if (error) {
      console.error(`[fetchConfiguratorData] Error fetching from ${physicalTableName}:`, error)
      return { data: null, error }
    }

    console.log(`[fetchConfiguratorData] Loaded ${data?.length || 0} records from ${physicalTableName}`)
    return { data: data as T[], error: null }
    
  } catch (error) {
    console.error("[fetchConfiguratorData] Unexpected error:", error)
    return { data: null, error }
  }
}

/**
 * Verifica se una colonna esiste in una tabella (cache in-memory per performance)
 */
const columnCache = new Map<string, Set<string>>()

async function hasColumn(tableName: string, columnName: string): Promise<boolean> {
  // Controlla cache
  if (columnCache.has(tableName)) {
    return columnCache.get(tableName)!.has(columnName)
  }

  // Query schema Supabase (da fare solo una volta per tabella)
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0) // Solo metadata, nessun dato
    
    if (!error && data !== null) {
      // Estrai nomi colonne (Supabase restituisce oggetto vuoto ma con chiavi)
      const columns = new Set(Object.keys(data[0] || {}))
      columnCache.set(tableName, columns)
      return columns.has(columnName)
    }
  } catch (e) {
    console.warn(`[hasColumn] Could not check column ${columnName} in ${tableName}`)
  }
  
  // Default: assume colonna non esiste
  return false
}

/**
 * Ottiene URL immagine valido o placeholder
 */
export function getImageUrlOrPlaceholder(imageUrl?: string | null, type: string = 'general'): string {
  if (imageUrl && imageUrl.trim() !== '') {
    // Se è URL completo, usa direttamente
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // Se è path relativo, costruisci URL Supabase storage
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public${imageUrl}`
    }
    return imageUrl
  }
  
  // Placeholder basato su tipo
  const placeholders: Record<string, string> = {
    structure: '/placeholder-structure.svg',
    model: '/placeholder-model.svg',
    coverage: '/placeholder-coverage.svg',
    color: '/placeholder-color.svg',
    surface: '/placeholder-surface.svg',
    general: '/placeholder.svg'
  }
  
  return placeholders[type] || placeholders.general
}

/**
 * Ottiene descrizione valida o fallback
 */
export function getDescriptionOrFallback(description?: string | null): string {
  if (description && description.trim() !== '') {
    return description
  }
  return "Descrizione in aggiornamento"
}

/**
 * Hook React per fetch dati configuratore (con loading state)
 */
export function useConfiguratorData<T = any>(options: ConfiguratorDataOptions) {
  const [data, setData] = React.useState<T[] | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<any>(null)

  React.useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      const result = await fetchConfiguratorData<T>(options)
      
      if (isMounted) {
        setData(result.data)
        setError(result.error)
        setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [options.material, options.table, JSON.stringify(options.filters)])

  return { data, loading, error }
}

// Import React per hook (solo se usato)
import * as React from 'react'
