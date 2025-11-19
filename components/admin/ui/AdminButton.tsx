import React from 'react'
import { adminColors, adminRadius } from '@/lib/admin/colors'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  children: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; hover: string; border?: string }> = {
  primary: {
    bg: adminColors.primary,
    text: '#FFFFFF',
    hover: adminColors.primaryHover,
  },
  secondary: {
    bg: adminColors.background,
    text: adminColors.textPrimary,
    hover: adminColors.borderLight,
    border: adminColors.border,
  },
  danger: {
    bg: adminColors.danger,
    text: '#FFFFFF',
    hover: '#B91C1C',
  },
  ghost: {
    bg: 'transparent',
    text: adminColors.textPrimary,
    hover: adminColors.background,
  },
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; height: string }> = {
  sm: {
    padding: '8px 12px',
    fontSize: '0.875rem',
    height: '32px',
  },
  md: {
    padding: '10px 16px',
    fontSize: '0.875rem',
    height: '40px',
  },
  lg: {
    padding: '12px 24px',
    fontSize: '1rem',
    height: '48px',
  },
}

export function AdminButton({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}: AdminButtonProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]
  
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        borderRadius: adminRadius.md,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        height: sizeStyle.height,
        border: variantStyle.border ? `1px solid ${variantStyle.border}` : 'none',
      }}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

// Pill Button (stile arrotondato)
interface PillButtonProps extends AdminButtonProps {
  active?: boolean
}

export function PillButton({ active = false, ...props }: PillButtonProps) {
  return (
    <AdminButton
      {...props}
      variant={active ? 'primary' : 'secondary'}
      style={{
        borderRadius: adminRadius.full,
        ...props.style,
      }}
    />
  )
}
