"use client"

import { useState, useCallback, DragEvent } from 'react'
import { UploadIcon, XIcon, ImageIcon } from 'lucide-react'
import { ModernButton } from './ModernButton'

interface ImageUploadDragDropProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  helperText?: string
  accept?: string
}

export function ImageUploadDragDrop({
  value,
  onChange,
  onRemove,
  label = 'Immagine',
  helperText = 'Trascina un\'immagine o inserisci un URL',
  accept = 'image/*'
}: ImageUploadDragDropProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [isUrlMode, setIsUrlMode] = useState(true)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Solo file immagine sono supportati')
      return
    }

    // Per ora: converti in base64 (per deploy senza storage)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
    }
  }

  const handleRemove = () => {
    setUrlInput('')
    onChange('')
    if (onRemove) onRemove()
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {value ? (
        // Preview con immagine
        <div className="relative">
          <div className="w-full h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            type="button"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Upload area
        <div>
          {/* Toggle URL / File */}
          <div className="flex gap-2 mb-3">
            <ModernButton
              size="sm"
              variant={isUrlMode ? 'primary' : 'secondary'}
              onClick={() => setIsUrlMode(true)}
              type="button"
            >
              URL
            </ModernButton>
            <ModernButton
              size="sm"
              variant={!isUrlMode ? 'primary' : 'secondary'}
              onClick={() => setIsUrlMode(false)}
              type="button"
            >
              File Upload
            </ModernButton>
          </div>

          {isUrlMode ? (
            // URL Mode
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ModernButton onClick={handleUrlSubmit} type="button">
                Carica
              </ModernButton>
            </div>
          ) : (
            // File Drop Mode
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {isDragging ? (
                    <UploadIcon className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Clicca per caricare o trascina qui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {helperText && !value && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
