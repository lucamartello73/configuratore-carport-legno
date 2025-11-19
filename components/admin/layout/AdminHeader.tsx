'use client'

import React from 'react'
import Link from 'next/link'
import { adminColors, adminRadius, adminSpacing } from '@/lib/admin/colors'
import { AdminButton } from '../ui/AdminButton'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  configuratorType: 'ferro' | 'legno'
  showConfiguratorLink?: boolean
}

export function AdminHeader({ 
  title, 
  subtitle, 
  configuratorType,
  showConfiguratorLink = true 
}: AdminHeaderProps) {
  const configuratorUrl = configuratorType === 'ferro' 
    ? 'https://configuratore-carport-ferro.vercel.app/configura'
    : 'https://configuratore-carport-legno.vercel.app/configura'
  
  return (
    <header
      className="flex items-center justify-between"
      style={{
        padding: adminSpacing.lg,
        backgroundColor: adminColors.background,
      }}
    >
      {/* Title Section */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: adminColors.textPrimary }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm"
            style={{ color: adminColors.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Actions Section */}
      <div className="flex items-center gap-4">
        {showConfiguratorLink && (
          <Link href={configuratorUrl} target="_blank">
            <AdminButton
              variant="secondary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              }
            >
              Vedi Configuratore
            </AdminButton>
          </Link>
        )}
        
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-white"
          style={{
            backgroundColor: adminColors.primary,
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}
