"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ConfiguratorType = 'FERRO' | 'LEGNO'

interface ConfiguratorContextType {
  configuratorType: ConfiguratorType
  setConfiguratorType: (type: ConfiguratorType) => void
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined)

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [configuratorType, setConfiguratorType] = useState<ConfiguratorType>('LEGNO')

  // Persisti la scelta in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_configurator_type')
    if (saved === 'FERRO' || saved === 'LEGNO') {
      setConfiguratorType(saved)
    }
  }, [])

  const handleSetType = (type: ConfiguratorType) => {
    setConfiguratorType(type)
    localStorage.setItem('admin_configurator_type', type)
  }

  return (
    <ConfiguratorContext.Provider value={{ configuratorType, setConfiguratorType: handleSetType }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext)
  if (context === undefined) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider')
  }
  return context
}
