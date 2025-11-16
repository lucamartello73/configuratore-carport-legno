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

// Componente per visualizzazione rettangolo tecnico dinamico proporzionato
interface DynamicSizePreviewProps {
  count: number
  customWidth: number
  customDepth: number
}

const DynamicSizePreview = ({ count, customWidth, customDepth }: DynamicSizePreviewProps) => {
  // Calcola dimensioni rettangolo in proporzione (scala ridotta per evitare gigantismo)
  const baseScale = 0.35 // Ridotto da 0.5 a 0.35 per rettangolo più proporzionato
  const rectWidth = Math.max(customWidth * baseScale, 150) // Min 150px
  const rectDepth = Math.min(customDepth * baseScale, 250) // Max 250px altezza
  
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="relative transition-all duration-300 ease-out"
        style={{
          width: `${rectWidth}px`,
          height: `${rectDepth}px`,
          border: `2px solid ${BRAND_COLOR}`,
          borderRadius: '8px',
          backgroundColor: BRAND_BEIGE,
          boxShadow: '0 2px 8px rgba(90, 58, 26, 0.15)',
        }}
      >
        {/* Label dimensioni centrata nel rettangolo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-1">Area Copertura</div>
            <div className="font-bold text-base" style={{ color: BRAND_COLOR }}>
              {customWidth} × {customDepth} cm
            </div>
          </div>
        </div>
        
        {/* Indicatori angolari */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: BRAND_COLOR }} />
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: BRAND_COLOR }} />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: BRAND_COLOR }} />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: BRAND_COLOR }} />
      </div>
    </div>
  )
}

export function Step3Dimensions({
  configuration,
  updateConfiguration,
  onAutoAdvance,
}: Step3DimensionsProps) {
  // MODIFICA 1: Default 1 posto auto selezionato
  const [localSelectedSpaces, setLocalSelectedSpaces] = useState<number>(
    configuration.spaces || 1
  )
  const [localWidth, setLocalWidth] = useState(configuration.width?.toString() || '300')
  const [localDepth, setLocalDepth] = useState(configuration.depth?.toString() || '500')
  const [localHeight, setLocalHeight] = useState(configuration.height?.toString() || '220')
  
  // Validation errors
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')

  // Inizializza default 1 posto auto al primo caricamento
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

  const minDims = MINIMUM_DIMENSIONS[localSelectedSpaces as keyof typeof MINIMUM_DIMENSIONS]

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quanti posti auto ti servono?</h2>
        <p className="text-gray-600">Seleziona il numero di posti auto per il tuo carport</p>
      </div>

      {/* MODIFICA 2: Pulsanti pill moderni sistemati */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {spaceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSpaceSelection(option.value)}
            className="relative px-5 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:scale-105"
            style={{
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: BRAND_COLOR,
              backgroundColor: localSelectedSpaces === option.value ? BRAND_COLOR : 'white',
              color: localSelectedSpaces === option.value ? 'white' : BRAND_COLOR,
              boxShadow: localSelectedSpaces === option.value 
                ? '0 4px 12px rgba(90, 58, 26, 0.3)' 
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* MODIFICA 5: Box Dimensioni Minime Consigliate subito dopo pulsanti */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <h3 className="text-base font-bold text-gray-900 mb-3">Dimensioni Minime Consigliate</h3>
        <div className="space-y-1 text-gray-700">
          <p className="text-lg">
            <span className="font-semibold">Larghezza:</span> {minDims.width} cm
          </p>
          <p className="text-lg">
            <span className="font-semibold">Profondità:</span> {minDims.depth} cm
          </p>
        </div>
      </div>

      {/* MODIFICA 7: Rettangolo tecnico proporzionato e centrato */}
      <div className="my-8">
        <DynamicSizePreview 
          count={localSelectedSpaces}
          customWidth={parseInt(localWidth) || minDims.width}
          customDepth={parseInt(localDepth) || minDims.depth}
        />
      </div>

      {/* MODIFICA 6: Form personalizzazione vicino a rettangolo */}
      <div className="bg-white border-2 rounded-lg p-6 max-w-3xl mx-auto space-y-5" style={{ borderColor: BRAND_COLOR }}>
        <h3 className="text-lg font-bold text-gray-900">
          📏 Personalizza le Dimensioni
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
              className="text-base font-medium border-2 rounded-lg px-4 py-2.5"
              style={{ 
                borderColor: widthError ? '#ef4444' : '#d1d5db',
                backgroundColor: widthError ? '#fee2e2' : 'white'
              }}
            />
            {widthError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                ⚠️ {widthError}
              </p>
            )}
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
              className="text-base font-medium border-2 rounded-lg px-4 py-2.5"
              style={{ 
                borderColor: depthError ? '#ef4444' : '#d1d5db',
                backgroundColor: depthError ? '#fee2e2' : 'white'
              }}
            />
            {depthError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                ⚠️ {depthError}
              </p>
            )}
          </div>
        </div>

        {/* Altezza */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div className="text-blue-900">
            <p className="font-semibold">Note:</p>
            <p>Le dimensioni indicate sono i minimi consigliati. Puoi aumentarle in base alle tue esigenze.</p>
          </div>
        </div>
      </div>

      {/* Bottone conferma */}
      <div className="flex justify-center pt-6 pb-4">
        <Button
          onClick={handleConfirm}
          disabled={!!widthError || !!depthError}
          size="lg"
          className="px-8 py-3 text-base font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
