import { ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import { ModernCard, ModernCardHeader, ModernCardContent, ModernCardTitle } from './ModernCard'

interface ModernModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ModernModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}: ModernModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <ModernCard>
          <ModernCardHeader>
            <div className="flex items-center justify-between">
              <ModernCardTitle>{title}</ModernCardTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            {children}
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>
  )
}
