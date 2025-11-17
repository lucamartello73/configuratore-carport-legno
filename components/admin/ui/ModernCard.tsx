import { ReactNode } from 'react'

interface ModernCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function ModernCard({ children, className = '', onClick }: ModernCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface ModernCardHeaderProps {
  children: ReactNode
  className?: string
}

export function ModernCardHeader({ children, className = '' }: ModernCardHeaderProps) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>
}

interface ModernCardContentProps {
  children: ReactNode
  className?: string
}

export function ModernCardContent({ children, className = '' }: ModernCardContentProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

interface ModernCardTitleProps {
  children: ReactNode
  className?: string
}

export function ModernCardTitle({ children, className = '' }: ModernCardTitleProps) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
}
