// LocalStorage utility functions for configurator persistence

export interface DimensionsData {
  carSpaces: number
  width: number
  depth: number
  height: number
  surface: number
}

export interface ColorData {
  category: string
  name: string
  value: string
  isCustom?: boolean
}

export interface CustomerData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}

// Safe JSON parsing with fallback
function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.error(`Error parsing localStorage key ${key}:`, error)
    return fallback
  }
}

// Structure Type
export function getStoredStructureType(): string | null {
  return localStorage.getItem("configurator-structure-type")
}

export function setStoredStructureType(typeId: string): void {
  localStorage.setItem("configurator-structure-type", typeId)
}

// Dimensions
export function getStoredDimensions(): DimensionsData | null {
  return safeJsonParse("configurator-dimensions", null)
}

export function setStoredDimensions(dimensions: DimensionsData): void {
  localStorage.setItem("configurator-dimensions", JSON.stringify(dimensions))
}

// Color
export function getStoredColor(): ColorData | null {
  return safeJsonParse("configurator-color", null)
}

export function setStoredColor(color: ColorData): void {
  localStorage.setItem("configurator-color", JSON.stringify(color))
}

// Coverage
export function getStoredCoverage(): string | null {
  return localStorage.getItem("configurator-coverage")
}

export function setStoredCoverage(coverageId: string): void {
  localStorage.setItem("configurator-coverage", coverageId)
}

// Accessories
export function getStoredAccessories(): string[] {
  return safeJsonParse("configurator-accessories", [])
}

export function setStoredAccessories(accessories: string[]): void {
  localStorage.setItem("configurator-accessories", JSON.stringify(accessories))
}

// Service Type
export function getStoredServiceType(): "chiavi-in-mano" | "fai-da-te" | null {
  return localStorage.getItem("configurator-service-type") as "chiavi-in-mano" | "fai-da-te" | null
}

export function setStoredServiceType(serviceType: "chiavi-in-mano" | "fai-da-te"): void {
  localStorage.setItem("configurator-service-type", serviceType)
}

// Customer Data
export function getStoredCustomerData(): CustomerData | null {
  return safeJsonParse("configurator-customer-data", null)
}

export function setStoredCustomerData(data: CustomerData): void {
  localStorage.setItem("configurator-customer-data", JSON.stringify(data))
}

// Clear all configurator data
export function clearConfiguratorData(): void {
  const keys = [
    "configurator-structure-type",
    "configurator-dimensions",
    "configurator-color",
    "configurator-coverage",
    "configurator-accessories",
    "configurator-service-type",
    "configurator-customer-data",
  ]

  keys.forEach((key) => localStorage.removeItem(key))
}

// Admin authentication
export function getAdminAuthenticated(): boolean {
  return localStorage.getItem("admin-authenticated") === "true"
}

export function setAdminAuthenticated(authenticated: boolean): void {
  localStorage.setItem("admin-authenticated", authenticated.toString())
}
