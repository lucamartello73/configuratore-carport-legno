'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Step3DimensionsProps {
  selectedSpaces: number
  onSpacesChange: (spaces: number) => void
  customWidth: string
  customDepth: string
  customHeight: string
  onCustomWidthChange: (width: string) => void
  onCustomDepthChange: (depth: string) => void
  onCustomHeightChange: (height: string) => void
  onNext: () => void
}

// Dimensioni suggerite per numero posti auto
const SUGGESTED_DIMENSIONS = {
  1: { width: 300, depth: 500, height: 220 },
  2: { width: 550, depth: 500, height: 220 },
  3: { width: 800, depth: 500, height: 220 },
  4: { width: 1050, depth: 500, height: 220 },
  5: { width: 1300, depth: 500, height: 220 },
}

// Componente SVG per auto vista dall'alto (BLU per LEGNO)
const CarTopView = () => (
  <g>
    {/* Carrozzeria principale con gradient */}
    <defs>
      <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* Ombra */}
    <ellipse cx="40" cy="72" rx="28" ry="8" fill="black" opacity="0.2"/>
    
    {/* Corpo auto */}
    <rect x="12" y="10" width="56" height="110" rx="8" fill="url(#carBodyGradient)" stroke="#1e40af" strokeWidth="1"/>
    
    {/* Tetto/abitacolo */}
    <rect x="18" y="35" width="44" height="50" rx="4" fill="#1d4ed8" opacity="0.7"/>
    
    {/* Finestrini */}
    <rect x="22" y="40" width="16" height="18" rx="2" fill="#93c5fd" opacity="0.6"/>
    <rect x="42" y="40" width="16" height="18" rx="2" fill="#93c5fd" opacity="0.6"/>
    <rect x="22" y="67" width="16" height="18" rx="2" fill="#93c5fd" opacity="0.6"/>
    <rect x="42" y="67" width="16" height="18" rx="2" fill="#93c5fd" opacity="0.6"/>
    
    {/* Cofano anteriore */}
    <rect x="20" y="12" width="40" height="18" rx="3" fill="#1e40af" opacity="0.5"/>
    
    {/* Bagagliaio posteriore */}
    <rect x="20" y="100" width="40" height="18" rx="3" fill="#1e40af" opacity="0.5"/>
    
    {/* Specchietti */}
    <rect x="8" y="55" width="4" height="8" rx="1" fill="#1e3a8a"/>
    <rect x="68" y="55" width="4" height="8" rx="1" fill="#1e3a8a"/>
    
    {/* Ruote */}
    <circle cx="18" cy="25" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
    <circle cx="62" cy="25" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
    <circle cx="18" cy="105" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
    <circle cx="62" cy="105" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
  </g>
)

// Componente per carport vista dall'alto con numero variabile di auto
const CarportTopView = ({ numCars }: { numCars: number }) => {
  const carportWidth = 400
  const carportHeight = 300
  
  // Calcola posizioni auto in base al numero
  const getCarPositions = () => {
    const positions: { x: number; y: number }[] = []
    const carWidth = 80
    const carHeight = 130
    const spacing = 20
    
    if (numCars === 1) {
      positions.push({ x: carportWidth / 2 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 })
    } else if (numCars === 2) {
      positions.push(
        { x: carportWidth / 3 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 },
        { x: (2 * carportWidth) / 3 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 }
      )
    } else if (numCars === 3) {
      positions.push(
        { x: carportWidth / 4 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 },
        { x: carportWidth / 2 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 },
        { x: (3 * carportWidth) / 4 - carWidth / 2, y: carportHeight / 2 - carHeight / 2 }
      )
    } else if (numCars === 4) {
      positions.push(
        { x: carportWidth / 3 - carWidth / 2, y: carportHeight / 3 - carHeight / 2 },
        { x: (2 * carportWidth) / 3 - carWidth / 2, y: carportHeight / 3 - carHeight / 2 },
        { x: carportWidth / 3 - carWidth / 2, y: (2 * carportHeight) / 3 - carHeight / 2 },
        { x: (2 * carportWidth) / 3 - carWidth / 2, y: (2 * carportHeight) / 3 - carHeight / 2 }
      )
    } else {
      // 5+ auto
      positions.push(
        { x: carportWidth / 4 - carWidth / 2, y: carportHeight / 3 - carHeight / 2 },
        { x: carportWidth / 2 - carWidth / 2, y: carportHeight / 3 - carHeight / 2 },
        { x: (3 * carportWidth) / 4 - carWidth / 2, y: carportHeight / 3 - carHeight / 2 },
        { x: carportWidth / 3 - carWidth / 2, y: (2 * carportHeight) / 3 - carHeight / 2 },
        { x: (2 * carportWidth) / 3 - carWidth / 2, y: (2 * carportHeight) / 3 - carHeight / 2 }
      )
    }
    
    return positions
  }
  
  const carPositions = getCarPositions()
  
  return (
    <svg viewBox={`0 0 ${carportWidth} ${carportHeight}`} className="w-full h-auto max-w-2xl mx-auto">
      {/* Tetto carport marrone per LEGNO */}
      <rect x="10" y="10" width={carportWidth - 20} height={carportHeight - 20} fill="#8B4513" opacity="0.3" rx="4"/>
      
      {/* Pilastri agli angoli */}
      <circle cx="20" cy="20" r="8" fill="#654321" stroke="#4a3216" strokeWidth="2"/>
      <circle cx={carportWidth - 20} cy="20" r="8" fill="#654321" stroke="#4a3216" strokeWidth="2"/>
      <circle cx="20" cy={carportHeight - 20} r="8" fill="#654321" stroke="#4a3216" strokeWidth="2"/>
      <circle cx={carportWidth - 20} cy={carportHeight - 20} r="8" fill="#654321" stroke="#4a3216" strokeWidth="2"/>
      
      {/* Linee divisorie posti (se più di 1 auto) */}
      {numCars > 1 && (
        <>
          {Array.from({ length: numCars - 1 }).map((_, i) => (
            <line
              key={i}
              x1={(carportWidth / numCars) * (i + 1)}
              y1="15"
              x2={(carportWidth / numCars) * (i + 1)}
              y2={carportHeight - 15}
              stroke="#654321"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.4"
            />
          ))}
        </>
      )}
      
      {/* Auto parcheggiate */}
      {carPositions.map((pos, index) => (
        <g key={index} transform={`translate(${pos.x}, ${pos.y})`}>
          <CarTopView />
        </g>
      ))}
    </svg>
  )
}

export default function Step3Dimensions({
  selectedSpaces,
  onSpacesChange,
  customWidth,
  customDepth,
  customHeight,
  onCustomWidthChange,
  onCustomDepthChange,
  onCustomHeightChange,
  onNext,
}: Step3DimensionsProps) {
  const [localSelectedSpaces, setLocalSelectedSpaces] = useState<number | null>(selectedSpaces || null)

  const handleSpaceSelection = (spaces: number) => {
    setLocalSelectedSpaces(spaces)
    onSpacesChange(spaces)
    
    // Imposta dimensioni suggerite
    const suggested = SUGGESTED_DIMENSIONS[spaces as keyof typeof SUGGESTED_DIMENSIONS]
    onCustomWidthChange(suggested.width.toString())
    onCustomDepthChange(suggested.depth.toString())
    onCustomHeightChange(suggested.height.toString())
  }

  const handleConfirm = () => {
    if (localSelectedSpaces) {
      onNext()
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

      {/* FASE 1: Pulsanti selezione posti */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {spaceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSpaceSelection(option.value)}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200
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
            <div className="text-5xl font-bold text-gray-900">
              {option.value === 5 ? '5+' : option.value}
            </div>
            
            {/* Label */}
            <div className="text-sm font-medium text-gray-700 text-center">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* FASE 2 & 3: Immagine auto + Dimensioni (appaiono solo dopo selezione) */}
      {localSelectedSpaces && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Immagine carport con auto */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <CarportTopView numCars={localSelectedSpaces} />
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
                  value={customWidth}
                  onChange={(e) => onCustomWidthChange(e.target.value)}
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
                  value={customDepth}
                  onChange={(e) => onCustomDepthChange(e.target.value)}
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
                  value={customHeight}
                  onChange={(e) => onCustomHeightChange(e.target.value)}
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
