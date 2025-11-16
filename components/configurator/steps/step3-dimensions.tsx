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

// SVG icona macchinina inline (riutilizzabile)
const CarIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M5 13h14M5 13c0-.55.45-1 1-1h2l2-4h4l2 4h2c.55 0 1 .45 1 1M5 13v5c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-5M7 15.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm10 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

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
  // Default 1 posto auto selezionato
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

  // Funzione per renderizzare icone auto nel pulsante
  const renderCarIcons = (count: number, isSelected: boolean) => {
    const iconColor = isSelected ? 'white' : BRAND_COLOR
    const iconSize = count >= 3 ? 'w-4 h-4' : 'w-5 h-5'
    
    if (count === 1) {
      return <CarIcon className={iconSize} color={iconColor} />
    } else if (count === 2) {
      return (
        <div className="flex gap-1">
          <CarIcon className={iconSize} color={iconColor} />
          <CarIcon className={iconSize} color={iconColor} />
        </div>
      )
    } else if (count === 3) {
      return (
        <div className="flex gap-0.5">
          <CarIcon className={iconSize} color={iconColor} />
          <CarIcon className={iconSize} color={iconColor} />
          <CarIcon className={iconSize} color={iconColor} />
        </div>
      )
    } else if (count === 4) {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <CarIcon className="w-4 h-4" color={iconColor} />
            <CarIcon className="w-4 h-4" color={iconColor} />
          </div>
          <div className="flex gap-0.5">
            <CarIcon className="w-4 h-4" color={iconColor} />
            <CarIcon className="w-4 h-4" color={iconColor} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1">
          <CarIcon className={iconSize} color={iconColor} />
          <span className="text-sm font-bold">5+</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Quanti posti auto ti servono?</h2>
        <p className="text-gray-600 text-lg">Seleziona il numero di posti auto per il tuo carport</p>
      </div>

      {/* PULSANTI MODERNI PILL CON ICONE AUTO */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        {spaceOptions.map((option) => {
          const isSelected = localSelectedSpaces === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSpaceSelection(option.value)}
              className="relative flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105 min-h-[54px]"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: BRAND_COLOR,
                backgroundColor: isSelected ? BRAND_COLOR : BRAND_BEIGE,
                color: isSelected ? 'white' : BRAND_COLOR,
                boxShadow: isSelected 
                  ? '0 4px 16px rgba(90, 58, 26, 0.35)' 
                  : '0 2px 6px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Icone auto */}
              <div className="flex items-center justify-center">
                {renderCarIcons(option.value, isSelected)}
              </div>
              
              {/* Label */}
              <span className="text-sm font-semibold">{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* BOX DIMENSIONI MINIME EVIDENZIATO */}
      <div 
        className="rounded-xl p-6 text-center max-w-2xl mx-auto shadow-sm"
        style={{ 
          backgroundColor: BRAND_BEIGE,
          border: `2px solid ${BRAND_COLOR}`
        }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ color: BRAND_COLOR }}>
          📐 Dimensioni Minime Consigliate
        </h3>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Larghezza</p>
            <p className="text-2xl font-bold" style={{ color: BRAND_COLOR }}>
              {minDims.width} <span className="text-base">cm</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Profondità</p>
            <p className="text-2xl font-bold" style={{ color: BRAND_COLOR }}>
              {minDims.depth} <span className="text-base">cm</span>
            </p>
          </div>
        </div>
      </div>

      {/* RETTANGOLO TECNICO con spacing migliorato */}
      <div className="my-10">
        <DynamicSizePreview 
          count={localSelectedSpaces}
          customWidth={parseInt(localWidth) || minDims.width}
          customDepth={parseInt(localDepth) || minDims.depth}
        />
      </div>

      {/* FORM PERSONALIZZAZIONE con icona matita e spacing armonioso */}
      <div className="bg-white border-2 rounded-xl p-8 max-w-3xl mx-auto space-y-6 shadow-sm" style={{ borderColor: BRAND_COLOR }}>
        <div className="flex items-center gap-3">
          {/* Icona matita inline SVG */}
          <svg className="w-6 h-6" style={{ color: BRAND_COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">
            Personalizza le Dimensioni
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Larghezza */}
          <div className="space-y-3">
            <Label htmlFor="width" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
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
                borderColor: widthError ? '#ef4444' : BRAND_COLOR,
                backgroundColor: widthError ? '#fee2e2' : 'white'
              }}
            />
            {widthError && (
              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                ⚠️ {widthError}
              </p>
            )}
          </div>

          {/* Profondità */}
          <div className="space-y-3">
            <Label htmlFor="depth" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
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
                borderColor: depthError ? '#ef4444' : BRAND_COLOR,
                backgroundColor: depthError ? '#fee2e2' : 'white'
              }}
            />
            {depthError && (
              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                ⚠️ {depthError}
              </p>
            )}
          </div>
        </div>

        {/* Altezza */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
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
            style={{ borderColor: BRAND_COLOR }}
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
      <div className="flex justify-center pt-8 pb-4">
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
