'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ConfigurationData } from '@/types/configuration'

interface Step3DimensionsProps {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
  onAutoAdvance?: () => void
}

// Dimensioni minime consigliate per numero posti auto (facilmente modificabili)
const MINIMUM_DIMENSIONS = {
  1: { width: 300, depth: 500, height: 220 },
  2: { width: 550, depth: 500, height: 220 },
  3: { width: 800, depth: 500, height: 220 },
  4: { width: 1050, depth: 500, height: 220 },
  5: { width: 1300, depth: 500, height: 220 },
}

// Colore brand (marrone legno)
const BRAND_COLOR = '#5A3A1A'
const BRAND_BEIGE = '#F5E6D3'

// Componente per visualizzazione rettangolo tecnico dinamico
interface DynamicSizePreviewProps {
  count: number
  customWidth: number
  customDepth: number
}

const DynamicSizePreview = ({ count, customWidth, customDepth }: DynamicSizePreviewProps) => {
  const minDimensions = MINIMUM_DIMENSIONS[count as keyof typeof MINIMUM_DIMENSIONS]
  
  // Calcola dimensioni rettangolo in proporzione (scala da dimensioni reali a px)
  const baseScale = 0.5 // 1cm = 0.5px per la visualizzazione
  const rectWidth = Math.max(customWidth * baseScale, minDimensions.width * baseScale)
  const rectDepth = Math.min(customDepth * baseScale, 400) // Max 400px altezza per evitare gigantismo
  
  return (
    <div className="space-y-6">
      {/* Etichetta tecnica sopra */}
      <div className="text-center space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Dimensioni Minime Consigliate
        </h3>
        <div className="flex items-center justify-center gap-6 text-lg font-bold" style={{ color: BRAND_COLOR }}>
          <div>
            <span className="text-gray-600 text-sm font-normal">Larghezza:</span>{' '}
            <span className="text-2xl">{minDimensions.width}</span> <span className="text-sm">cm</span>
          </div>
          <div className="text-gray-400">—</div>
          <div>
            <span className="text-gray-600 text-sm font-normal">Profondità:</span>{' '}
            <span className="text-2xl">{minDimensions.depth}</span> <span className="text-sm">cm</span>
          </div>
        </div>
      </div>
      
      {/* Rettangolo dinamico centrato */}
      <div className="flex items-center justify-center py-12" style={{ backgroundColor: BRAND_BEIGE }}>
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            width: `${rectWidth}px`,
            height: `${rectDepth}px`,
            border: `2px solid ${BRAND_COLOR}`,
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(90, 58, 26, 0.12)',
          }}
        >
          {/* Label dimensioni nel rettangolo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-1">
              <div className="text-sm font-medium text-gray-500">Area Copertura</div>
              <div className="font-bold text-lg" style={{ color: BRAND_COLOR }}>
                {customWidth} × {customDepth} cm
              </div>
              <div className="text-xs text-gray-400">
                {count} {count === 1 ? 'Posto' : 'Posti'} Auto
              </div>
            </div>
          </div>
          
          {/* Indicatori angolari */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: BRAND_COLOR }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: BRAND_COLOR }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: BRAND_COLOR }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: BRAND_COLOR }} />
        </div>
      </div>
    </div>
  )
}

export function Step3Dimensions({
  configuration,
  updateConfiguration,
  onAutoAdvance,
}: Step3DimensionsProps) {
  const [localSelectedSpaces, setLocalSelectedSpaces] = useState<number | null>(
    configuration.spaces || null
  )
  const [localWidth, setLocalWidth] = useState(configuration.width?.toString() || '')
  const [localDepth, setLocalDepth] = useState(configuration.depth?.toString() || '')
  const [localHeight, setLocalHeight] = useState(configuration.height?.toString() || '')
  
  // Validation errors
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')

  const handleSpaceSelection = (spaces: number) => {
    setLocalSelectedSpaces(spaces)
    
    // Imposta dimensioni minime
    const minDims = MINIMUM_DIMENSIONS[spaces as keyof typeof MINIMUM_DIMENSIONS]
    setLocalWidth(minDims.width.toString())
    setLocalDepth(minDims.depth.toString())
    setLocalHeight(minDims.height.toString())
    
    // Reset errori
    setWidthError('')
    setDepthError('')
    
    // Aggiorna configurazione
    updateConfiguration({
      spaces,
      width: minDims.width,
      depth: minDims.depth,
      height: minDims.height,
    })
  }

  const handleWidthChange = (value: string) => {
    setLocalWidth(value)
    const numValue = parseInt(value) || 0
    
    if (localSelectedSpaces) {
      const minWidth = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].width
      
      if (numValue < minWidth) {
        setWidthError(`La larghezza minima è ${minWidth} cm`)
      } else {
        setWidthError('')
        updateConfiguration({ width: numValue })
      }
    }
  }

  const handleDepthChange = (value: string) => {
    setLocalDepth(value)
    const numValue = parseInt(value) || 0
    
    if (localSelectedSpaces) {
      const minDepth = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].depth
      
      if (numValue < minDepth) {
        setDepthError(`La profondità minima è ${minDepth} cm`)
      } else {
        setDepthError('')
        updateConfiguration({ depth: numValue })
      }
    }
  }

  const handleConfirm = () => {
    if (localSelectedSpaces && !widthError && !depthError) {
      // Assicura che i valori siano salvati
      updateConfiguration({
        spaces: localSelectedSpaces,
        width: parseInt(localWidth) || 0,
        depth: parseInt(localDepth) || 0,
        height: parseInt(localHeight) || 0,
      })
      
      // Avanza allo step successivo se la callback è fornita
      if (onAutoAdvance) {
        onAutoAdvance()
      }
    }
  }

  const spaceOptions = [
    { value: 1, label: '1 Posto Auto' },
    { value: 2, label: '2 Posti Auto' },
    { value: 3, label: '3 Posti Auto' },
    { value: 4, label: '4 Posti Auto' },
    { value: 5, label: '5+ Posti Auto' },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Quanti posti auto ti servono?</h2>
        <p className="text-gray-600">Seleziona il numero di posti auto per il tuo carport</p>
      </div>

      {/* PULSANTI MODERNI PILL SHAPE */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
        {spaceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSpaceSelection(option.value)}
            className="relative px-6 py-3.5 rounded-full font-medium text-sm transition-all duration-200"
            style={{
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: BRAND_COLOR,
              backgroundColor: localSelectedSpaces === option.value ? BRAND_COLOR : 'white',
              color: localSelectedSpaces === option.value ? 'white' : BRAND_COLOR,
              boxShadow: localSelectedSpaces === option.value 
                ? '0 4px 12px rgba(90, 58, 26, 0.25)' 
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (localSelectedSpaces !== option.value) {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(90, 58, 26, 0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (localSelectedSpaces !== option.value) {
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {option.label}
            
            {/* Badge checkmark se selezionato */}
            {localSelectedSpaces === option.value && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-white rounded-full">
                <svg className="w-3 h-3" style={{ color: BRAND_COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* VISUALIZZAZIONE TECNICA (appaiono solo dopo selezione) */}
      {localSelectedSpaces && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Rettangolo dinamico tecnico */}
          <DynamicSizePreview 
            count={localSelectedSpaces}
            customWidth={parseInt(localWidth) || MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].width}
            customDepth={parseInt(localDepth) || MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].depth}
          />

          {/* Form personalizzazione dimensioni */}
          <div className="bg-white border-2 rounded-xl p-8 max-w-3xl mx-auto space-y-6" style={{ borderColor: BRAND_COLOR }}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Personalizza le Dimensioni
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Larghezza desiderata */}
              <div className="space-y-2">
                <Label htmlFor="width" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Larghezza Desiderata (cm)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={localWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  placeholder="es. 800"
                  className="text-lg font-medium border-2 rounded-lg px-4 py-3"
                  style={{ 
                    borderColor: widthError ? '#ef4444' : BRAND_COLOR,
                    backgroundColor: widthError ? '#fee2e2' : 'white'
                  }}
                />
                {widthError && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {widthError}
                  </p>
                )}
              </div>

              {/* Profondità desiderata */}
              <div className="space-y-2">
                <Label htmlFor="depth" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Profondità Desiderata (cm)
                </Label>
                <Input
                  id="depth"
                  type="number"
                  value={localDepth}
                  onChange={(e) => handleDepthChange(e.target.value)}
                  placeholder="es. 500"
                  className="text-lg font-medium border-2 rounded-lg px-4 py-3"
                  style={{ 
                    borderColor: depthError ? '#ef4444' : BRAND_COLOR,
                    backgroundColor: depthError ? '#fee2e2' : 'white'
                  }}
                />
                {depthError && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {depthError}
                  </p>
                )}
              </div>
            </div>

            {/* Altezza (meno prominente) */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <Label htmlFor="height" className="text-sm font-medium text-gray-600">
                Altezza (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={localHeight}
                onChange={(e) => {
                  setLocalHeight(e.target.value)
                  updateConfiguration({ height: parseInt(e.target.value) || 0 })
                }}
                placeholder="es. 220"
                className="max-w-xs border-2 rounded-lg px-4 py-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            {/* Info tecnica */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Note Tecniche</p>
                <p>Le dimensioni indicate sono i minimi consigliati. Puoi aumentarle in base alle tue esigenze specifiche.</p>
              </div>
            </div>
          </div>

          {/* Bottone conferma */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!!widthError || !!depthError}
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: (widthError || depthError) ? '#9ca3af' : '#16a34a',
                color: 'white'
              }}
            >
              Conferma e Continua →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step3Dimensions
