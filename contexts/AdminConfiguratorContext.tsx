"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type ConfiguratorType = 'legno' | 'ferro'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  bgGradient: string
  lightBg: string
}

interface AdminConfiguratorContextType {
  configuratorType: ConfiguratorType
  configuratorTypeUpper: 'LEGNO' | 'FERRO'
  setConfiguratorType: (type: ConfiguratorType) => void
  theme: ThemeColors
  tablePrefix: string
}

const themes: Record<ConfiguratorType, ThemeColors> = {
  legno: {
    primary: '#8B4513',      // Marrone scuro
    secondary: '#A0522D',    // Marrone medio
    accent: '#D2691E',       // Terracotta
    bgGradient: 'linear-gradient(135deg, #F5E6D3 0%, #E8D4BA 100%)',
    lightBg: '#FBF8F3',
  },
  ferro: {
    primary: '#404040',      // Grigio scuro
    secondary: '#606060',    // Grigio medio
    accent: '#808080',       // Grigio chiaro
    bgGradient: 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 100%)',
    lightBg: '#F5F5F5',
  },
}

const tablePrefixes: Record<ConfiguratorType, string> = {
  legno: 'carport_legno_',
  ferro: 'carport_ferro_',
}

const AdminConfiguratorContext = createContext<AdminConfiguratorContextType | undefined>(undefined)

export function AdminConfiguratorProvider({ children }: { children: ReactNode }) {
  const [configuratorType, setConfiguratorTypeState] = useState<ConfiguratorType>('ferro')

  // Carica il tipo dal localStorage all'avvio
  useEffect(() => {
    const saved = localStorage.getItem('admin-configurator-type')
    if (saved === 'legno' || saved === 'ferro') {
      setConfiguratorTypeState(saved)
    }
  }, [])

  // Salva il tipo nel localStorage quando cambia
  const setConfiguratorType = (type: ConfiguratorType) => {
    setConfiguratorTypeState(type)
    localStorage.setItem('admin-configurator-type', type)
  }

  // Applica le variabili CSS del tema
  useEffect(() => {
    const theme = themes[configuratorType]
    const root = document.documentElement
    root.style.setProperty('--admin-primary', theme.primary)
    root.style.setProperty('--admin-secondary', theme.secondary)
    root.style.setProperty('--admin-accent', theme.accent)
    root.style.setProperty('--admin-bg-gradient', theme.bgGradient)
    root.style.setProperty('--admin-light-bg', theme.lightBg)
  }, [configuratorType])

  const value: AdminConfiguratorContextType = {
    configuratorType,
    configuratorTypeUpper: configuratorType.toUpperCase() as 'LEGNO' | 'FERRO',
    setConfiguratorType,
    theme: themes[configuratorType],
    tablePrefix: tablePrefixes[configuratorType],
  }

  return (
    <AdminConfiguratorContext.Provider value={value}>
      {children}
    </AdminConfiguratorContext.Provider>
  )
}

export function useAdminConfigurator() {
  const context = useContext(AdminConfiguratorContext)
  if (context === undefined) {
    throw new Error('useAdminConfigurator must be used within AdminConfiguratorProvider')
  }
  return context
}
