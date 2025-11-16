'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ConfigurationData } from '@/types/configuration'

interface Step3DimensionsProps {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
  onAutoAdvance?: () => void
}

// Dimensioni suggerite per numero posti auto
const SUGGESTED_DIMENSIONS = {
  1: { width: 300, depth: 500, height: 220 },
  2: { width: 550, depth: 500, height: 220 },
  3: { width: 800, depth: 500, height: 220 },
  4: { width: 1050, depth: 500, height: 220 },
  5: { width: 1300, depth: 500, height: 220 },
}

// Colore brand (marrone legno)
const BRAND_COLOR = '#5A3A1A'

// Componente per singola auto vista dall'alto (BLU per LEGNO)
const SingleCar = () => (
  <svg width="90" height="180" viewBox="0 0 90 180" className="flex-shrink-0">
    <defs>
      <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* Ombra leggera */}
    <ellipse cx="45" cy="165" rx="40" ry="6" fill="black" opacity="0.12"/>
    
    {/* Corpo auto */}
    <rect 
      x="5" 
      y="5" 
      width="80" 
      height="160" 
      rx="10" 
      fill="url(#carBodyGradient)" 
      stroke="#1e40af" 
      strokeWidth="2"
    />
    
    {/* Parabrezza anteriore */}
    <rect x="12" y="12" width="66" height="35" rx="5" fill="white" opacity="0.3"/>
    
    {/* Parabrezza posteriore */}
    <rect x="12" y="123" width="66" height="35" rx="5" fill="white" opacity="0.3"/>
    
    {/* Finestrini laterali */}
    <rect x="12" y="58" width="28" height="32" rx="3" fill="white" opacity="0.25"/>
    <rect x="50" y="58" width="28" height="32" rx="3" fill="white" opacity="0.25"/>
    
    {/* Ruote */}
    <circle cx="18" cy="32" r="10" fill="#1f2937"/>
    <circle cx="72" cy="32" r="10" fill="#1f2937"/>
    <circle cx="18" cy="148" r="10" fill="#1f2937"/>
    <circle cx="72" cy="148" r="10" fill="#1f2937"/>
    
    {/* Cerchi ruote */}
    <circle cx="18" cy="32" r="5" fill="#6b7280"/>
    <circle cx="72" cy="32" r="5" fill="#6b7280"/>
    <circle cx="18" cy="148" r="5" fill="#6b7280"/>
    <circle cx="72" cy="148" r="5" fill="#6b7280"/>
  </svg>
)

// Componente dedicato per anteprima auto in FILA SINGOLA
interface CarPreviewProps {
  count: number
}

const CarPreview = ({ count }: CarPreviewProps) => {
  const carSpacing = 25 // Distanza uniforme tra auto (25px)
  
  return (
    <div 
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 border"
      style={{ 
        borderWidth: '1.5px',
        borderColor: BRAND_COLOR,
        borderStyle: 'dashed',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Tetto semitrasparente */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          backgroundColor: '#D2691E',
          opacity: 0.05
        }}
      />
      
      {/* Auto in FILA SINGOLA con flexbox orizzontale */}
      <div 
        className="flex items-center justify-center relative z-10"
        style={{ gap: `${carSpacing}px` }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <SingleCar key={index} />
        ))}
      </div>
      
      {/* Pilastri agli angoli (piccoli cerchi) */}
      <div className="absolute top-4 left-4 w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLOR, opacity: 0.4 }} />
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLOR, opacity: 0.4 }} />
      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLOR, opacity: 0.4 }} />
      <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLOR, opacity: 0.4 }} />
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

  const handleSpaceSelection = (spaces: number) => {
    setLocalSelectedSpaces(spaces)
    
    // Imposta dimensioni suggerite
    const suggested = SUGGESTED_DIMENSIONS[spaces as keyof typeof SUGGESTED_DIMENSIONS]
    setLocalWidth(suggested.width.toString())
    setLocalDepth(suggested.depth.toString())
    setLocalHeight(suggested.height.toString())
    
    // Aggiorna configurazione
    updateConfiguration({
      spaces,
      width: suggested.width,
      depth: suggested.depth,
      height: suggested.height,
    })
  }

  const handleConfirm = () => {
    if (localSelectedSpaces) {
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

      {/* ANTEPRIMA AUTO + DIMENSIONI (appaiono solo dopo selezione) */}
      {localSelectedSpaces && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Anteprima auto in FILA SINGOLA */}
          <CarPreview count={localSelectedSpaces} />

          {/* Dimensioni consigliate */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">📏 Dimensioni Consigliate</h3>
                <p className="text-blue-800">
                  <span className="font-bold">
                    {SUGGESTED_DIMENSIONS[localSelectedSpaces as keyof typeof SUGGESTED_DIMENSIONS].width} cm
                  </span>
                  {' × '}
                  <span className="font-bold">
                    {SUGGESTED_DIMENSIONS[localSelectedSpaces as keyof typeof SUGGESTED_DIMENSIONS].depth} cm
                  </span>
                  {' × '}
                  <span className="font-bold">
                    {SUGGESTED_DIMENSIONS[localSelectedSpaces as keyof typeof SUGGESTED_DIMENSIONS].height} cm
                  </span>
                  {' '}
                  (Larghezza × Profondità × Altezza)
                </p>
              </div>
            </div>
          </div>

          {/* Form personalizzazione dimensioni */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vuoi personalizzare le dimensioni?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                  Larghezza (cm)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={localWidth}
                  onChange={(e) => {
                    setLocalWidth(e.target.value)
                    updateConfiguration({ width: parseInt(e.target.value) || 0 })
                  }}
                  placeholder="es. 800"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth" className="text-sm font-medium text-gray-700">
                  Profondità (cm)
                </Label>
                <Input
                  id="depth"
                  type="number"
                  value={localDepth}
                  onChange={(e) => {
                    setLocalDepth(e.target.value)
                    updateConfiguration({ depth: parseInt(e.target.value) || 0 })
                  }}
                  placeholder="es. 500"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium text-gray-700">
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
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Bottone conferma */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg"
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
