import React from 'react'
import { adminColors, adminRadius } from '@/lib/admin/colors'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: {
    bg: adminColors.success,
    text: adminColors.successText,
  },
  warning: {
    bg: adminColors.warning,
    text: adminColors.warningText,
  },
  danger: {
    bg: adminColors.danger,
    text: adminColors.dangerText,
  },
  info: {
    bg: adminColors.info,
    text: adminColors.infoText,
  },
  default: {
    bg: adminColors.borderLight,
    text: adminColors.textPrimary,
  },
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles = variantStyles[variant]
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderRadius: adminRadius.sm,
      }}
    >
      {children}
    </span>
  )
}

// Status Badge specifico per attivo/inattivo
interface StatusBadgeProps {
  active: boolean
  activeText?: string
  inactiveText?: string
}

export function StatusBadge({ 
  active, 
  activeText = 'Attivo', 
  inactiveText = 'Inattivo' 
}: StatusBadgeProps) {
  return (
    <Badge variant={active ? 'success' : 'default'}>
      {active ? activeText : inactiveText}
    </Badge>
  )
}
