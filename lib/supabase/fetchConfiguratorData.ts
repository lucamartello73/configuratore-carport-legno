/**
 * Helper centralizzato per fetch dati configuratori da Supabase
 * Gestisce automaticamente filtri per materiale e stato attivo
 */

import * as React from 'react'
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
): Promise<{ data: T[]; error: any }> {
  const { material, table, filters = {}, orderBy, ascending = true } = options

  try {
    const supabase = createClient()
    
    // Ottieni nome tabella fisica
    const physicalTableName = getTableName(material, table as any)
    
    console.log(`[fetchConfiguratorData] Fetching from ${physicalTableName} for ${material}`)

    // Query base: seleziona tutto da tabella
    let query = supabase.from(physicalTableName).select("*")

    // Filtro stato attivo - prova entrambe le convenzioni
    // Usa OR per compatibilità con diverse strutture tabelle
    const activeFilters = []
    if (await hasColumn(physicalTableName, 'is_active')) {
      activeFilters.push('is_active.eq.true')
    }
    if (await hasColumn(physicalTableName, 'attivo')) {
      activeFilters.push('attivo.eq.true')
    }
    
    // Applica filtro attivo solo se almeno una colonna esiste
    if (activeFilters.length > 0) {
      query = query.or(activeFilters.join(','))
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
      return { data: [], error }
    }

    console.log(`[fetchConfiguratorData] Loaded ${data?.length || 0} records from ${physicalTableName}`)
    return { data: (data as T[]) || [], error: null }
    
  } catch (error) {
    console.error("[fetchConfiguratorData] Unexpected error:", error)
    return { data: [], error }
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

  // Query schema Supabase per ottenere struttura tabella
  try {
    const supabase = createClient()
    // Fetch 1 record per vedere struttura colonne
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (!error && data && data.length > 0) {
      // Estrai nomi colonne dal primo record
      const columns = new Set(Object.keys(data[0]))
      columnCache.set(tableName, columns)
      return columns.has(columnName)
    } else if (!error && data && data.length === 0) {
      // Tabella vuota: assume colonne standard esistano
      const defaultColumns = new Set(['id', 'name', 'is_active', 'attivo', 'ordine', 'display_order'])
      columnCache.set(tableName, defaultColumns)
      return defaultColumns.has(columnName)
    }
  } catch (e) {
    console.warn(`[hasColumn] Could not check column ${columnName} in ${tableName}`, e)
  }
  
  // Default: assume colonna esiste per evitare blocchi
  return true
}

/**
 * Ottiene URL immagine valido o placeholder
 */
export function getImageUrlOrPlaceholder(imageUrl?: string | null, type: string = 'general'): string | null {
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
  
  // Ritorna null per gestire placeholder in UI con ImageOff icon
  return null
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
  const [data, setData] = React.useState<T[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<any>(null)

  React.useEffect(() => {
    let isMounted = true

    async function load() {
      setIsLoading(true)
      const result = await fetchConfiguratorData<T>(options)
      
      if (isMounted) {
        setData(result.data || [])
        setError(result.error)
        setIsLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [options.material, options.table, JSON.stringify(options.filters)])

  return { data, isLoading, error }
}
