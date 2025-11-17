"use client"

import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface ImageUploadDragDropProps {
  currentImage?: string
  onImageUploaded: (url: string | null) => void
  onImageRemoved?: () => void
  bucket?: string
  folder?: string
  label?: string
}

type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

export function ImageUploadDragDrop({
  currentImage,
  onImageUploaded,
  onImageRemoved = () => {},
  bucket = 'images',
  folder = 'carport',
  label = 'Immagine',
}: ImageUploadDragDropProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [previewUrl, setPreviewUrl] = useState(currentImage || '')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'uploading') {
      setStatus('dragging')
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (status === 'dragging') {
      setStatus('idle')
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setStatus('idle')

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    // Validazione tipo file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato file non supportato. Usa JPG, PNG o WebP.')
      setStatus('error')
      return
    }

    // Validazione dimensione (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File troppo grande. Dimensione massima: 5MB.')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setUploadError(null)
    setUploadProgress(0)

    try {
      // Comprimi l'immagine
      const compressedFile = await compressImage(file)
      setUploadProgress(30)

      const supabase = createClient()

      // Crea nome file univoco
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      setUploadProgress(50)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedFile)

      if (error) {
        console.error('Error uploading file:', error)
        
        if (error.message?.includes('Bucket not found') || error.statusCode === '404') {
          setUploadError('Bucket di storage non configurato. Usa l\'URL manuale.')
        } else if (error.message?.includes('not authenticated')) {
          setUploadError('Autenticazione richiesta. Usa l\'URL manuale.')
        } else {
          setUploadError(`Errore: ${error.message || 'Errore sconosciuto'}`)
        }
        setStatus('error')
        return
      }

      setUploadProgress(80)

      // Ottieni URL pubblico
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName)

      setUploadProgress(100)
      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
      setStatus('success')
      
      // Reset a idle dopo 2 secondi
      setTimeout(() => {
        if (status === 'success') setStatus('idle')
      }, 2000)
    } catch (error: any) {
      console.error('Error:', error)
      setUploadError(error?.message || 'Errore durante il caricamento')
      setStatus('error')
    }
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()

      img.onload = () => {
        // Calcola nuove dimensioni (max 1200px)
        const maxSize = 1200
        let { width, height } = img

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    onImageUploaded(null)
    onImageRemoved()
    setUploadError(null)
    setStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const getStatusColor = () => {
    switch (status) {
      case 'dragging':
        return 'var(--admin-primary)'
      case 'uploading':
        return '#3B82F6'
      case 'success':
        return '#10B981'
      case 'error':
        return '#EF4444'
      default:
        return '#E0E0E0'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />
      default:
        return <Upload className="w-8 h-8 text-gray-400" />
    }
  }

  return (
    <div className="image-upload-container">
      <Label className="text-sm font-medium text-gray-700 mb-2 block">{label}</Label>

      {/* Drag & Drop Area */}
      <div
        className="drag-drop-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        style={{
          borderColor: getStatusColor(),
          backgroundColor: status === 'dragging' ? 'var(--admin-light-bg)' : 'white',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="drag-drop-content">
          {getStatusIcon()}
          
          {status === 'uploading' ? (
            <>
              <p className="text-sm font-medium text-gray-700">Caricamento in corso...</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : status === 'success' ? (
            <p className="text-sm font-medium text-green-600">Caricamento completato!</p>
          ) : status === 'error' ? (
            <p className="text-sm font-medium text-red-600">Errore nel caricamento</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">
                Trascina qui un'immagine
              </p>
              <p className="text-xs text-gray-500">
                o clicca per selezionare (JPG, PNG, WebP - max 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* URL Input Manuale */}
      <div className="mt-4">
        <Label className="text-xs text-gray-600 mb-2 block">Oppure inserisci URL manuale</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://..."
            value={previewUrl}
            onChange={(e) => {
              setPreviewUrl(e.target.value)
              onImageUploaded(e.target.value)
              setUploadError(null)
              setStatus('idle')
            }}
            className="flex-1"
          />
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemoveImage}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}

      {/* Preview */}
      {previewUrl && status !== 'uploading' && (
        <div className="mt-4">
          <Label className="text-xs text-gray-600 mb-2 block">Anteprima</Label>
          <div className="preview-container">
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={150}
              className="preview-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.svg?height=150&width=200'
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
        }

        .drag-drop-area {
          border: 2px dashed;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .drag-drop-area:hover {
          border-color: var(--admin-primary);
          background-color: var(--admin-light-bg);
        }

        .drag-drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          width: 100%;
          max-width: 200px;
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--admin-primary);
          transition: width 0.3s ease;
        }

        .preview-container {
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #E0E0E0;
        }

        .preview-image {
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  )
}
