export interface ConfigurationData {
  configuratorType?: 'acciaio' | 'legno' // Tipo di configuratore
  structureType: string
  structureTypeId: string
  material: string
  modelId: string
  carSpots: number
  width: number
  depth: number
  height: number
  coverageId: string
  structureColor: string
  surfaceId?: string
  packageType: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerCap: string
  customerProvince: string
  contactPreference: string // Added contact preference field
  privacyAccepted?: boolean // Privacy acceptance for GDPR compliance
  accessories?: string[] // Array di ID accessori selezionati (solo per legno)
}
