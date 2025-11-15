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

// Componente per sagoma auto SCHEMATICA semplice (per LEGNO = BLU)
const SchematicCar = ({ x, y, color = '#2563eb' }: { x: number; y: number; color?: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Ombra leggera */}
    <ellipse cx="50" cy="105" rx="45" ry="8" fill="black" opacity="0.15"/>
    
    {/* Corpo auto rettangolare semplice */}
    <rect 
      x="5" 
      y="5" 
      width="90" 
      height="180" 
      rx="12" 
      fill={color} 
      stroke="#1e40af" 
      strokeWidth="3"
    />
    
    {/* Parabrezza anteriore */}
    <rect x="15" y="15" width="70" height="40" rx="6" fill="white" opacity="0.3"/>
    
    {/* Parabrezza posteriore */}
    <rect x="15" y="135" width="70" height="40" rx="6" fill="white" opacity="0.3"/>
    
    {/* Finestrini laterali */}
    <rect x="15" y="65" width="30" height="35" rx="4" fill="white" opacity="0.25"/>
    <rect x="55" y="65" width="30" height="35" rx="4" fill="white" opacity="0.25"/>
    
    {/* Ruote */}
    <circle cx="20" cy="35" r="12" fill="#1f2937"/>
    <circle cx="80" cy="35" r="12" fill="#1f2937"/>
    <circle cx="20" cy="155" r="12" fill="#1f2937"/>
    <circle cx="80" cy="155" r="12" fill="#1f2937"/>
    
    {/* Cerchi ruote */}
    <circle cx="20" cy="35" r="6" fill="#6b7280"/>
    <circle cx="80" cy="35" r="6" fill="#6b7280"/>
    <circle cx="20" cy="155" r="6" fill="#6b7280"/>
    <circle cx="80" cy="155" r="6" fill="#6b7280"/>
  </g>
)

// Componente illustrazione schematica carport con N auto
const SchematicCarportView = ({ numCars }: { numCars: number }) => {
  const carColor = '#2563eb' // BLU per LEGNO
  
  // Calcola dimensioni canvas in base al numero auto
  const carWidth = 100
  const carHeight = 190
  const carSpacing = 40 // SPAZIO EVIDENTE tra auto
  
  let canvasWidth: number
  let canvasHeight: number
  let carPositions: { x: number; y: number }[] = []
  
  if (numCars === 1) {
    // 1 auto centrata
    canvasWidth = 250
    canvasHeight = 280
    carPositions = [{ x: 75, y: 45 }]
  } else if (numCars === 2) {
    // 2 auto affiancate ORIZZONTALMENTE
    canvasWidth = 280
    canvasHeight = 280
    carPositions = [
      { x: 30, y: 45 },
      { x: 150, y: 45 }
    ]
  } else if (numCars === 3) {
    // 3 auto in fila ORIZZONTALE
    canvasWidth = 400
    canvasHeight = 280
    carPositions = [
      { x: 20, y: 45 },
      { x: 150, y: 45 },
      { x: 280, y: 45 }
    ]
  } else if (numCars === 4) {
    // 4 auto in GRIGLIA 2x2
    canvasWidth = 280
    canvasHeight = 480
    carPositions = [
      { x: 30, y: 30 },
      { x: 150, y: 30 },
      { x: 30, y: 260 },
      { x: 150, y: 260 }
    ]
  } else {
    // 5+ auto: 3 sopra + 2 sotto
    canvasWidth = 400
    canvasHeight = 480
    carPositions = [
      { x: 20, y: 30 },
      { x: 150, y: 30 },
      { x: 280, y: 30 },
      { x: 85, y: 260 },
      { x: 215, y: 260 }
    ]
  }
  
  return (
    <svg 
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} 
      className="w-full h-auto max-w-4xl mx-auto"
      style={{ maxHeight: '500px' }}
    >
      {/* Struttura rettangolare NEUTRA (bordo carport) */}
      <rect 
        x="10" 
        y="10" 
        width={canvasWidth - 20} 
        height={canvasHeight - 20} 
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="4" 
        strokeDasharray="10,5"
        rx="8"
      />
      
      {/* Tetto semitrasparente marrone chiaro */}
      <rect 
        x="10" 
        y="10" 
        width={canvasWidth - 20} 
        height={canvasHeight - 20} 
        fill="#D2691E" 
        opacity="0.08"
        rx="8"
      />
      
      {/* Linee divisorie verticali tra posti (solo per 2-3 auto in fila) */}
      {(numCars === 2 || numCars === 3) && carPositions.map((_, index) => {
        if (index < carPositions.length - 1) {
          const nextPos = carPositions[index + 1]
          const dividerX = (carPositions[index].x + nextPos.x) / 2 + carWidth / 2
          return (
            <line
              key={`divider-${index}`}
              x1={dividerX}
              y1="20"
              x2={dividerX}
              y2={canvasHeight - 20}
              stroke="#8B4513"
              strokeWidth="2"
              strokeDasharray="8,4"
              opacity="0.3"
            />
          )
        }
        return null
      })}
      
      {/* Sagome auto BEN SEPARATE */}
      {carPositions.map((pos, index) => (
        <SchematicCar key={index} x={pos.x} y={pos.y} color={carColor} />
      ))}
      
      {/* Pilastri agli angoli (piccoli cerchi) */}
      <circle cx="20" cy="20" r="8" fill="#654321" opacity="0.6"/>
      <circle cx={canvasWidth - 20} cy="20" r="8" fill="#654321" opacity="0.6"/>
      <circle cx="20" cy={canvasHeight - 20} r="8" fill="#654321" opacity="0.6"/>
      <circle cx={canvasWidth - 20} cy={canvasHeight - 20} r="8" fill="#654321" opacity="0.6"/>
    </svg>
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

      {/* FASE 1: Pulsanti SEMPLICI - Solo numero e label */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {spaceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSpaceSelection(option.value)}
            className={`
              relative p-8 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center justify-center gap-3
              ${
                localSelectedSpaces === option.value
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              }
            `}
          >
            {/* Badge checkmark se selezionato */}
            {localSelectedSpaces === option.value && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Numero grande */}
            <div className="text-6xl font-bold text-gray-900">
              {option.value === 5 ? '5+' : option.value}
            </div>
            
            {/* Label */}
            <div className="text-sm font-medium text-gray-700 text-center">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* FASE 2: Illustrazione SCHEMATICA + Dimensioni (appaiono solo dopo selezione) */}
      {localSelectedSpaces && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Illustrazione schematica carport */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-200 shadow-sm">
            <SchematicCarportView numCars={localSelectedSpaces} />
          </div>

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
