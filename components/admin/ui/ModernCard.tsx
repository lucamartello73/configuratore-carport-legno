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
  compact?: boolean
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
  actions,
  compact = true  // Default to compact layout
}: ModernCardProps) {
  // Se viene passato children, usa il layout semplice
  if (children) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
          onClick ? 'cursor-pointer hover:border-blue-300' : ''
        } ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }

  // Layout compatto (default) - immagine piccola a sinistra
  if (compact) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={onClick}
      >
        <div className="flex gap-4 p-4">
          {/* Immagine Thumbnail - 100x100px */}
          {image && (
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={title || 'Image'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              {title && (
                <h3 className="text-base font-semibold text-gray-900 truncate flex-1">
                  {title}
                </h3>
              )}
              {badge && <div className="flex-shrink-0">{badge}</div>}
            </div>

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Metadata */}
            {metadata && metadata.length > 0 && (
              <div className="space-y-1 mb-3">
                {metadata.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-500">{item.label}:</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {actions && (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Layout tradizionale (non compatto) - immagine grande sopra
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      {image && (
        <div className="w-full h-40 bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={title || 'Image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and Badge */}
        <div className="flex items-start justify-between mb-2">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 flex-1">
              {title}
            </h3>
          )}
          {badge && <div className="ml-2">{badge}</div>}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="space-y-1 mb-3">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{item.label}:</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
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
  return <div className={`p-4 pb-3 ${className}`}>{children}</div>
}

interface ModernCardContentProps {
  children: ReactNode
  className?: string
}

export function ModernCardContent({ children, className = '' }: ModernCardContentProps) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>
}

interface ModernCardTitleProps {
  children: ReactNode
  className?: string
}

export function ModernCardTitle({ children, className = '' }: ModernCardTitleProps) {
  return <h3 className={`text-base font-semibold text-gray-900 ${className}`}>{children}</h3>
}
