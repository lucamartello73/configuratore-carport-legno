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

// Dimensioni minime consigliate per numero posti auto
const MINIMUM_DIMENSIONS = {
  1: { width: 300, depth: 500, height: 220 },
  2: { width: 550, depth: 500, height: 220 },
  3: { width: 800, depth: 500, height: 220 },
  4: { width: 1050, depth: 500, height: 220 },
  5: { width: 1300, depth: 500, height: 220 },
}

// Colore brand (marrone legno)
const BRAND_COLOR = '#5A3A1A'

// UNA SOLA icona auto minimal
const CarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-11 0A1.5 1.5 0 015 14.5 1.5 1.5 0 016.5 13 1.5 1.5 0 018 14.5 1.5 1.5 0 016.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6z" />
  </svg>
)

export function Step3Dimensions({
  configuration,
  updateConfiguration,
  onAutoAdvance,
}: Step3DimensionsProps) {
  const [localSelectedSpaces, setLocalSelectedSpaces] = useState<number>(
    configuration.spaces || 1
  )
  const [localWidth, setLocalWidth] = useState(configuration.width?.toString() || '300')
  const [localDepth, setLocalDepth] = useState(configuration.depth?.toString() || '500')
  const [localHeight, setLocalHeight] = useState(configuration.height?.toString() || '220')
  
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')

  // Inizializza default 1 posto auto
  useEffect(() => {
    if (!configuration.spaces) {
      const minDims = MINIMUM_DIMENSIONS[1]
      updateConfiguration({
        spaces: 1,
        width: minDims.width,
        depth: minDims.depth,
        height: minDims.height,
      })
      setLocalWidth(minDims.width.toString())
      setLocalDepth(minDims.depth.toString())
      setLocalHeight(minDims.height.toString())
    }
  }, [])

  const handleSpaceSelection = (spaces: number) => {
    setLocalSelectedSpaces(spaces)
    
    const minDims = MINIMUM_DIMENSIONS[spaces as keyof typeof MINIMUM_DIMENSIONS]
    setLocalWidth(minDims.width.toString())
    setLocalDepth(minDims.depth.toString())
    setLocalHeight(minDims.height.toString())
    
    setWidthError('')
    setDepthError('')
    
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
    
    const minWidth = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].width
    
    if (numValue < minWidth) {
      setWidthError(`La larghezza minima è ${minWidth} cm`)
    } else {
      setWidthError('')
      updateConfiguration({ width: numValue })
    }
  }

  const handleDepthChange = (value: string) => {
    setLocalDepth(value)
    const numValue = parseInt(value) || 0
    
    const minDepth = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS].depth
    
    if (numValue < minDepth) {
      setDepthError(`La profondità minima è ${minDepth} cm`)
    } else {
      setDepthError('')
      updateConfiguration({ depth: numValue })
    }
  }

  const handleConfirm = () => {
    if (!widthError && !depthError) {
      updateConfiguration({
        spaces: localSelectedSpaces,
        width: parseInt(localWidth) || 0,
        depth: parseInt(localDepth) || 0,
        height: parseInt(localHeight) || 0,
      })
      
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

  const minDims = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS]

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Quanti posti auto ti servono?</h2>
        <p className="text-gray-600">Seleziona il numero di posti auto per il tuo carport</p>
      </div>

      {/* PULSANTI PILL ORIZZONTALI - LAYOUT MINIMAL */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {spaceOptions.map((option) => {
          const isSelected = localSelectedSpaces === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSpaceSelection(option.value)}
              className="flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105"
              style={{
                padding: '12px 20px',
                borderRadius: '999px',
                border: '2px solid #5A3A1A',
                backgroundColor: isSelected ? '#5A3A1A' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#5A3A1A',
              }}
            >
              {/* UNA SOLA icona auto */}
              <CarIcon className="w-5 h-5" />
              {/* Testo */}
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* RETTANGOLO TECNICO MINIMAL - max 600-700px */}
      <div className="flex justify-center mb-6">
        <div 
          className="rounded-lg p-6 text-center"
          style={{ 
            maxWidth: '650px',
            border: '2px solid #5A3A1A',
            backgroundColor: '#F5F5F5'
          }}
        >
          <div className="text-sm font-medium text-gray-600 mb-2">Area Copertura</div>
          <div className="text-3xl font-bold mb-2" style={{ color: '#5A3A1A' }}>
            {parseInt(localWidth) || minDims.width} × {parseInt(localDepth) || minDims.depth} cm
          </div>
          <div className="text-sm text-gray-600">{localSelectedSpaces} {localSelectedSpaces === 1 ? 'Posto Auto' : 'Posti Auto'}</div>
        </div>
      </div>

      {/* FORM PERSONALIZZAZIONE - subito sotto, senza distanze esagerate */}
      <div className="bg-white border-2 rounded-xl p-6 max-w-3xl mx-auto space-y-5" style={{ borderColor: '#5A3A1A' }}>
        <h3 className="text-xl font-bold text-gray-900">
          Personalizza le Dimensioni
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Larghezza */}
          <div className="space-y-2">
            <Label htmlFor="width" className="text-sm font-semibold text-gray-700">
              Larghezza (cm)
            </Label>
            <Input
              id="width"
              type="number"
              value={localWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              placeholder="es. 300"
              className="text-lg font-medium border-2 rounded-lg px-4 py-3"
              style={{ 
                borderColor: widthError ? '#ef4444' : '#5A3A1A',
                backgroundColor: widthError ? '#fee2e2' : 'white'
              }}
            />
            {widthError && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ {widthError}
              </p>
            )}
            <p className="text-xs text-gray-500">Minimo: {minDims.width} cm</p>
          </div>

          {/* Profondità */}
          <div className="space-y-2">
            <Label htmlFor="depth" className="text-sm font-semibold text-gray-700">
              Profondità (cm)
            </Label>
            <Input
              id="depth"
              type="number"
              value={localDepth}
              onChange={(e) => handleDepthChange(e.target.value)}
              placeholder="es. 500"
              className="text-lg font-medium border-2 rounded-lg px-4 py-3"
              style={{ 
                borderColor: depthError ? '#ef4444' : '#5A3A1A',
                backgroundColor: depthError ? '#fee2e2' : 'white'
              }}
            />
            {depthError && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ {depthError}
              </p>
            )}
            <p className="text-xs text-gray-500">Minimo: {minDims.depth} cm</p>
          </div>
        </div>

        {/* Altezza */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <Label htmlFor="height" className="text-sm font-semibold text-gray-700">
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
            className="max-w-xs border-2 rounded-lg px-4 py-3 text-lg font-medium"
            style={{ borderColor: '#5A3A1A' }}
          />
          <p className="text-xs text-gray-500">Standard: 220 cm</p>
        </div>
      </div>

      {/* Bottone conferma */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleConfirm}
          disabled={!!widthError || !!depthError}
          size="lg"
          className="px-10 py-4 text-lg font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          style={{
            backgroundColor: (widthError || depthError) ? '#9ca3af' : '#16a34a',
            color: 'white'
          }}
        >
          Conferma e Continua →
        </Button>
      </div>
    </div>
  )
}

export default Step3Dimensions
