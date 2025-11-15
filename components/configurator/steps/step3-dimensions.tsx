"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ConfigurationData } from "@/types/configuration"

interface Step3Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const carSpotsData = [
  { spots: 1, width: 300, depth: 500, height: 220 },
  { spots: 2, width: 550, depth: 500, height: 220 },
  { spots: 3, width: 800, depth: 500, height: 220 },
  { spots: 4, width: 1050, depth: 500, height: 220 },
  { spots: 5, width: 1300, depth: 500, height: 220 },
]

export function Step3Dimensions({ configuration, updateConfiguration }: Step3Props) {
  const [carSpots, setCarSpots] = useState(configuration.carSpots || 1)
  const [width, setWidth] = useState(configuration.width || 300)
  const [depth, setDepth] = useState(configuration.depth || 500)
  const [height, setHeight] = useState(configuration.height || 220)

  const handleCarSpotsChange = (spots: number) => {
    const selectedData = carSpotsData.find((data) => data.spots === spots)
    if (selectedData) {
      setCarSpots(spots)
      setWidth(selectedData.width)
      setDepth(selectedData.depth)
      setHeight(selectedData.height)
    }
  }

  useEffect(() => {
    updateConfiguration({ carSpots, width, depth, height })
  }, [carSpots, width, depth, height])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* TITOLO */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Quanti Posti Auto?</h2>
        <p className="text-lg text-secondary">Clicca per scegliere</p>
      </div>

      {/* PULSANTI GRANDI - 5 PULSANTI IN FILA */}
      <div className="flex gap-4 justify-center flex-wrap">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleCarSpotsChange(num)}
            className={`w-24 h-24 rounded-2xl text-4xl font-bold transition-all duration-300 ${
              carSpots === num
                ? "bg-primary text-white shadow-2xl scale-110 ring-4 ring-green-400"
                : "bg-white text-primary border-4 border-gray-300 hover:border-accent-pink hover:scale-105 shadow-lg"
            }`}
          >
            {num}{num === 5 ? "+" : ""}
          </button>
        ))}
      </div>

      {/* IMMAGINE GRANDE CENTRALE */}
      <div className="bg-white rounded-2xl shadow-2xl border-4 border-accent-pink p-6">
        <svg viewBox="0 0 600 300" className="w-full h-auto">
          {/* Cielo */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#e0f2fe'}} />
              <stop offset="100%" style={{stopColor: '#bae6fd'}} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="600" height="180" fill="url(#skyGradient)"/>
          
          {/* Tetto Carport */}
          <rect x="30" y="30" width="540" height="25" fill="#8B4513" rx="5"/>
          <rect x="30" y="50" width="540" height="10" fill="#6B4423" rx="3"/>
          
          {/* Pilastri */}
          <rect x="30" y="60" width="20" height="120" fill="#8B4513" rx="3"/>
          <rect x="550" y="60" width="20" height="120" fill="#8B4513" rx="3"/>
          
          {/* Strada */}
          <rect x="0" y="180" width="600" height="120" fill="#71717a"/>
          <rect x="0" y="175" width="600" height="5" fill="#fbbf24"/>
          
          {/* AUTO - Numero variabile */}
          {Array.from({ length: carSpots }, (_, i) => {
            const totalWidth = 520
            const spacing = totalWidth / carSpots
            const carWidth = Math.min(90, spacing * 0.85)
            const x = 40 + (i * spacing) + (spacing / 2) - (carWidth / 2)
            
            return (
              <g key={i}>
                {/* Ombra */}
                <ellipse 
                  cx={x + carWidth/2} 
                  cy="240" 
                  rx={carWidth * 0.5} 
                  ry="10" 
                  fill="#000" 
                  opacity="0.3"
                />
                
                {/* Corpo auto */}
                <defs>
                  <linearGradient id={`carBody${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#60a5fa'}} />
                    <stop offset="100%" style={{stopColor: '#2563eb'}} />
                  </linearGradient>
                </defs>
                <rect 
                  x={x} 
                  y="150" 
                  width={carWidth} 
                  height="70" 
                  fill={`url(#carBody${i})`}
                  rx="12"
                  stroke="#1e40af"
                  strokeWidth="3"
                />
                
                {/* Tetto */}
                <path
                  d={`M ${x + carWidth * 0.15} 150 Q ${x + carWidth/2} 130 ${x + carWidth * 0.85} 150`}
                  fill="#1e3a8a"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Parabrezza */}
                <path
                  d={`M ${x + carWidth * 0.2} 150 Q ${x + carWidth/2} 135 ${x + carWidth * 0.8} 150`}
                  fill="#bfdbfe"
                  opacity="0.7"
                />
                
                {/* Fari */}
                <circle cx={x + carWidth * 0.2} cy="215" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
                <circle cx={x + carWidth * 0.8} cy="215" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
                
                {/* Ruote */}
                <g>
                  <circle cx={x + carWidth * 0.25} cy="225" r="12" fill="#1f2937"/>
                  <circle cx={x + carWidth * 0.25} cy="225" r="7" fill="#6b7280"/>
                  <circle cx={x + carWidth * 0.75} cy="225" r="12" fill="#1f2937"/>
                  <circle cx={x + carWidth * 0.75} cy="225" r="7" fill="#6b7280"/>
                </g>
              </g>
            )
          })}
        </svg>
        
        {/* Label */}
        <p className="text-center text-xl font-bold text-primary mt-4">
          🚗 {carSpots} Auto Parcheggiate
        </p>
      </div>

      {/* DIMENSIONI CONSIGLIATE */}
      <div className="bg-surface-beige rounded-2xl p-6 border-3 border-accent-pink">
        <h3 className="text-xl font-bold text-primary mb-4 text-center">📐 Dimensioni Consigliate</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{width}</div>
            <div className="text-sm text-secondary">cm larghezza</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{depth}</div>
            <div className="text-sm text-secondary">cm profondità</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{height}</div>
            <div className="text-sm text-secondary">cm altezza</div>
          </div>
        </div>
      </div>

      {/* PERSONALIZZA DIMENSIONI */}
      <details className="bg-white rounded-xl p-6 border-2 border-gray-300">
        <summary className="text-lg font-semibold text-primary cursor-pointer hover:text-accent-pink">
          ⚙️ Personalizza Dimensioni (opzionale)
        </summary>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <Label className="text-sm font-medium text-secondary mb-2 block">Larghezza (cm)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={200}
              max={2000}
              step={10}
              className="text-center text-lg font-bold"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-secondary mb-2 block">Profondità (cm)</Label>
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={300}
              max={1000}
              step={10}
              className="text-center text-lg font-bold"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-secondary mb-2 block">Altezza (cm)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={180}
              max={350}
              step={5}
              className="text-center text-lg font-bold"
            />
          </div>
        </div>
      </details>

    </div>
  )
}
