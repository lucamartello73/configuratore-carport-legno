'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { adminColors, adminRadius } from '@/lib/admin/colors'
import { PillButton } from '../ui/AdminButton'

interface ConfiguratorSwitchProps {
  current: 'ferro' | 'legno'
}

export function ConfiguratorSwitch({ current }: ConfiguratorSwitchProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleSwitch = (type: 'ferro' | 'legno') => {
    if (type === current) return
    
    // Mantieni lo stesso path ma cambia progetto
    // Es: da /admin/dashboard (ferro) a /admin/dashboard (legno)
    // In realtà i progetti sono separati, quindi redirect completo
    const baseUrl = type === 'ferro'
      ? 'https://configuratore-carport-ferro.vercel.app'
      : 'https://configuratore-carport-legno.vercel.app'
    
    window.location.href = `${baseUrl}${pathname}`
  }
  
  return (
    <div
      className="inline-flex p-1 gap-1"
      style={{
        backgroundColor: adminColors.background,
        borderRadius: adminRadius.full,
        border: `1px solid ${adminColors.border}`,
      }}
    >
      <button
        onClick={() => handleSwitch('ferro')}
        className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full"
        style={{
          backgroundColor: current === 'ferro' ? adminColors.switchActive : 'transparent',
          color: current === 'ferro' ? '#FFFFFF' : adminColors.textPrimary,
        }}
      >
        Carport Ferro
      </button>
      <button
        onClick={() => handleSwitch('legno')}
        className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full"
        style={{
          backgroundColor: current === 'legno' ? adminColors.switchActive : 'transparent',
          color: current === 'legno' ? '#FFFFFF' : adminColors.textPrimary,
        }}
      >
        Pergola Legno
      </button>
    </div>
  )
}
