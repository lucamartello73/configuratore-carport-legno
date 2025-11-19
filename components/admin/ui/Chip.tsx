import React from 'react'
import { adminColors, adminRadius } from '@/lib/admin/colors'

interface ChipProps {
  children: React.ReactNode
  onRemove?: () => void
  className?: string
}

export function Chip({ children, onRemove, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-sm ${className}`}
      style={{
        backgroundColor: adminColors.background,
        color: adminColors.textPrimary,
        borderRadius: adminRadius.full,
        border: `1px solid ${adminColors.border}`,
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
          style={{ color: adminColors.textSecondary }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
