import { ReactNode } from 'react'

interface CompactModelCardProps {
  title: string
  description: string
  image?: string
  badge?: ReactNode
  metadata?: Array<{ label: string; value: string }>
  actions?: ReactNode
  onClick?: () => void
}

export function CompactModelCard({ 
  title,
  description,
  image,
  badge,
  metadata,
  actions,
  onClick
}: CompactModelCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {/* Immagine Thumbnail - 100x100px FORZATO */}
        {image && (
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 truncate flex-1">
              {title}
            </h3>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

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
