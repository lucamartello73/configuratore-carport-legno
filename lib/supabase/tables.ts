/**
 * Supabase Table Mapping Helper
 * 
 * Questo file mappa i nomi logici delle tabelle ai nomi fisici nel database.
 * Utilizzato per separare i configuratori Acciaio e Legno.
 * 
 * Database Structure:
 * - Tabelle Acciaio: prefisso "carport_*"
 * - Tabelle Legno: prefisso "configuratorelegno_*"
 */

export type ConfiguratorType = 'acciaio' | 'legno'

export interface TableMapping {
  configurations: string
  models: string
  colors: string
  coverage_types: string
  structure_types?: string
  surfaces?: string
  pricing_rules?: string
  pergola_types?: string
  accessories?: string
}

/**
 * Mappatura completa delle tabelle per ogni tipo di configuratore
 */
export const TABLES: Record<ConfiguratorType, TableMapping> = {
  acciaio: {
    configurations: 'carport_configurations',
    models: 'carport_models',
    colors: 'carport_colors',
    coverage_types: 'carport_coverage_types',
    structure_types: 'carport_structure_types',
    surfaces: 'carport_surfaces',
    pricing_rules: 'carport_pricing_rules',
  },
  legno: {
    configurations: 'configuratorelegno_configurations',
    models: 'configuratorelegno_pergola_types', // In legno, i "modelli" sono i tipi di pergola
    colors: 'configuratorelegno_colors',
    coverage_types: 'configuratorelegno_coverage_types',
    pergola_types: 'configuratorelegno_pergola_types',
    accessories: 'configuratorelegno_accessories',
  },
}

/**
 * Ottiene il nome della tabella fisica dato il tipo di configuratore e il nome logico
 * 
 * @param configuratorType - Tipo di configuratore ('acciaio' | 'legno')
 * @param tableName - Nome logico della tabella (es: 'models', 'colors', etc.)
 * @returns Nome fisico della tabella in Supabase
 * 
 * @example
 * ```typescript
 * const tableName = getTableName('acciaio', 'models') // Returns: 'carport_models'
 * const tableName = getTableName('legno', 'colors')   // Returns: 'configuratorelegno_colors'
 * ```
 */
export function getTableName(
  configuratorType: ConfiguratorType,
  tableName: keyof TableMapping
): string {
  const mapping = TABLES[configuratorType]
  const physicalName = mapping[tableName]
  
  if (!physicalName) {
    throw new Error(
      `Table "${tableName}" not found for configurator type "${configuratorType}". ` +
      `Available tables: ${Object.keys(mapping).join(', ')}`
    )
  }
  
  return physicalName
}

/**
 * Ottiene tutte le tabelle per un tipo di configuratore
 * 
 * @param configuratorType - Tipo di configuratore ('acciaio' | 'legno')
 * @returns Oggetto con tutte le mappature delle tabelle
 * 
 * @example
 * ```typescript
 * const tables = getAllTables('acciaio')
 * console.log(tables.models) // 'carport_models'
 * console.log(tables.colors) // 'carport_colors'
 * ```
 */
export function getAllTables(configuratorType: ConfiguratorType): TableMapping {
  return TABLES[configuratorType]
}

/**
 * Verifica se una tabella esiste per un dato configuratore
 * 
 * @param configuratorType - Tipo di configuratore ('acciaio' | 'legno')
 * @param tableName - Nome logico della tabella
 * @returns true se la tabella esiste, false altrimenti
 * 
 * @example
 * ```typescript
 * hasTable('acciaio', 'surfaces')    // true
 * hasTable('legno', 'surfaces')      // false
 * hasTable('legno', 'accessories')   // true
 * ```
 */
export function hasTable(
  configuratorType: ConfiguratorType,
  tableName: keyof TableMapping
): boolean {
  return tableName in TABLES[configuratorType]
}

/**
 * Ottiene il prefisso delle tabelle per un tipo di configuratore
 * 
 * @param configuratorType - Tipo di configuratore ('acciaio' | 'legno')
 * @returns Prefisso delle tabelle
 * 
 * @example
 * ```typescript
 * getTablePrefix('acciaio') // 'carport_'
 * getTablePrefix('legno')   // 'configuratorelegno_'
 * ```
 */
export function getTablePrefix(configuratorType: ConfiguratorType): string {
  return configuratorType === 'acciaio' ? 'carport_' : 'configuratorelegno_'
}
