import { ReactNode } from 'react'

interface ModernCardProps {
  children?: ReactNode
  className?: string
  onClick?: () => void
  title?: string
  description?: string
  image?: string
  badge?: ReactNode
  metadata?: Array<{ label: string; value: string }>
  actions?: ReactNode
}

export function ModernCard({ 
  children, 
  className = '', 
  onClick,
  title,
  description,
  image,
  badge,
  metadata,
  actions
}: ModernCardProps) {
  // Se viene passato children, usa il layout semplice
  if (children) {
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

  // Altrimenti usa il layout con props
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      {image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={title || 'Image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title and Badge */}
        <div className="flex items-start justify-between mb-2">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {title}
            </h3>
          )}
          {badge && <div className="ml-2">{badge}</div>}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="space-y-2 mb-4">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}:</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
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
