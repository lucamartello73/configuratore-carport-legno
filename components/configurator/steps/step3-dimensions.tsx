"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ConfigurationData } from "@/types/configuration"

interface Step3Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const carSpotsData = [
  { spots: 1, width: 300, depth: 500, height: 220, label: "1 Posto Auto", icon: "🚗" },
  { spots: 2, width: 550, depth: 500, height: 220, label: "2 Posti Auto", icon: "🚗🚗" },
  { spots: 3, width: 800, depth: 500, height: 220, label: "3 Posti Auto", icon: "🚗🚗🚗" },
  { spots: 4, width: 1050, depth: 500, height: 220, label: "4 Posti Auto", icon: "🚗🚗🚗🚗" },
  { spots: 5, width: 1300, depth: 500, height: 220, label: "5+ Posti Auto", icon: "🚗🚗🚗🚗🚗" },
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Dimensioni e Posti Auto</h2>
        <p className="text-secondary">
          Seleziona il numero di posti auto e personalizza le dimensioni
        </p>
      </div>

      {/* Selezione Posti Auto con Card Visuali */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-primary text-center">Quanti posti auto ti servono?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {carSpotsData.map((data) => (
            <div
              key={data.spots}
              onClick={() => handleCarSpotsChange(data.spots)}
              className={`product-card cursor-pointer transition-all duration-300 ${
                carSpots === data.spots ? 'product-card-selected' : ''
              }`}
            >
              {/* Icona Badge Selezionato */}
              {carSpots === data.spots && (
                <div className="badge-selected">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Schema Visuale Posti Auto */}
              <div className="mb-4">
                <svg viewBox="0 0 200 120" className="w-full h-auto">
                  {/* Sfondo Carport */}
                  <rect x="10" y="10" width="180" height="100" fill="#f3f4f6" stroke="#8B4513" strokeWidth="3" rx="8"/>
                  
                  {/* Icone Auto */}
                  {Array.from({ length: Math.min(data.spots, 5) }, (_, i) => {
                    const carWidth = 160 / data.spots
                    const carX = 20 + (i * carWidth)
                    return (
                      <g key={i}>
                        {/* Auto semplificata */}
                        <rect 
                          x={carX} 
                          y="35" 
                          width={carWidth - 8} 
                          height="50" 
                          fill="#8B4513" 
                          rx="4"
                          opacity="0.8"
                        />
                        {/* Ruote */}
                        <circle cx={carX + 10} cy="85" r="5" fill="#333"/>
                        <circle cx={carX + carWidth - 18} cy="85" r="5" fill="#333"/>
                        {/* Finestrini */}
                        <rect 
                          x={carX + 5} 
                          y="42" 
                          width={(carWidth - 8) * 0.4} 
                          height="18" 
                          fill="#87CEEB" 
                          opacity="0.6"
                          rx="2"
                        />
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Numero Posti */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {data.spots}{data.spots === 5 ? "+" : ""}
                </div>
                <div className="text-sm font-medium text-secondary mb-2">{data.label}</div>
                
                {/* Dimensioni Suggerite */}
                <div className="text-xs text-secondary space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <div>📏 <span className="font-semibold">{data.width}cm</span> larghezza</div>
                  <div>📐 <span className="font-semibold">{data.depth}cm</span> profondità</div>
                  <div>📊 <span className="font-semibold">{data.height}cm</span> altezza</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Riquadro Info Dimensioni Selezionate */}
      <div className="product-card bg-surface-beige border-accent-pink">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl">📐</div>
          <div>
            <h4 className="font-semibold text-primary text-lg mb-1">
              Dimensioni per {carSpots} posto{carSpots > 1 ? "i" : ""} auto
            </h4>
            <p className="text-sm text-secondary">
              Dimensioni ottimali suggerite dal nostro sistema. Puoi personalizzarle qui sotto.
            </p>
          </div>
        </div>

        {/* Schema Dimensionale 3D */}
        <div className="bg-white rounded-lg p-6 border-2 border-accent-pink/30">
          <svg viewBox="0 0 400 250" className="w-full h-auto">
            {/* Vista isometrica carport */}
            {/* Base terra */}
            <polygon 
              points="50,200 350,200 380,170 80,170" 
              fill="#e5e7eb" 
              stroke="#9ca3af" 
              strokeWidth="2"
            />
            
            {/* Parete frontale */}
            <polygon 
              points="50,80 350,80 350,200 50,200" 
              fill="#f3f4f6" 
              stroke="#8B4513" 
              strokeWidth="3"
            />
            
            {/* Parete laterale */}
            <polygon 
              points="350,80 380,50 380,170 350,200" 
              fill="#e5e7eb" 
              stroke="#8B4513" 
              strokeWidth="3"
            />
            
            {/* Tetto */}
            <polygon 
              points="50,80 350,80 380,50 80,50" 
              fill="#8B4513" 
              opacity="0.8"
              stroke="#6B4423" 
              strokeWidth="3"
            />

            {/* Auto dentro carport */}
            <g opacity="0.6">
              <rect x="120" y="150" width="180" height="40" fill="#4B5563" rx="4"/>
              <circle cx="135" cy="190" r="8" fill="#1f2937"/>
              <circle cx="285" cy="190" r="8" fill="#1f2937"/>
            </g>

            {/* Quote dimensionali */}
            {/* Larghezza */}
            <line x1="50" y1="215" x2="350" y2="215" stroke="#ef4444" strokeWidth="2"/>
            <line x1="50" y1="210" x2="50" y2="220" stroke="#ef4444" strokeWidth="2"/>
            <line x1="350" y1="210" x2="350" y2="220" stroke="#ef4444" strokeWidth="2"/>
            <text x="200" y="240" textAnchor="middle" fill="#ef4444" fontSize="18" fontWeight="bold">
              {width} cm
            </text>

            {/* Profondità */}
            <line x1="360" y1="200" x2="390" y2="170" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="355" y1="200" x2="365" y2="200" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="385" y1="170" x2="395" y2="170" stroke="#3b82f6" strokeWidth="2"/>
            <text x="420" y="185" textAnchor="start" fill="#3b82f6" fontSize="16" fontWeight="bold">
              {depth} cm
            </text>

            {/* Altezza */}
            <line x1="30" y1="80" x2="30" y2="200" stroke="#10b981" strokeWidth="2"/>
            <line x1="25" y1="80" x2="35" y2="80" stroke="#10b981" strokeWidth="2"/>
            <line x1="25" y1="200" x2="35" y2="200" stroke="#10b981" strokeWidth="2"/>
            <text x="15" y="145" textAnchor="end" fill="#10b981" fontSize="16" fontWeight="bold">
              {height} cm
            </text>
          </svg>
        </div>
      </div>

      {/* Input Personalizzati */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="product-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">↔️</span>
            <Label className="text-primary font-semibold">Larghezza</Label>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={200}
              max={2000}
              step={10}
              className="text-lg font-semibold"
            />
            <span className="text-secondary font-medium">cm</span>
          </div>
          <p className="text-xs text-secondary mt-2">Min: 200cm - Max: 2000cm</p>
        </div>

        <div className="product-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⬆️</span>
            <Label className="text-primary font-semibold">Profondità</Label>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={300}
              max={1000}
              step={10}
              className="text-lg font-semibold"
            />
            <span className="text-secondary font-medium">cm</span>
          </div>
          <p className="text-xs text-secondary mt-2">Min: 300cm - Max: 1000cm</p>
        </div>

        <div className="product-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📏</span>
            <Label className="text-primary font-semibold">Altezza</Label>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={180}
              max={350}
              step={5}
              className="text-lg font-semibold"
            />
            <span className="text-secondary font-medium">cm</span>
          </div>
          <p className="text-xs text-secondary mt-2">Min: 180cm - Max: 350cm</p>
        </div>
      </div>

      {/* Warning Dimensioni Personalizzabili */}
      <div className="product-card bg-amber-50 border-2 border-amber-300">
        <div className="flex items-start gap-3">
          <svg className="w-8 h-8 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="font-bold text-amber-800 text-lg mb-2">💡 Nota Importante</div>
            <div className="text-amber-700 leading-relaxed space-y-2">
              <p>
                Le dimensioni suggerite sono <strong>indicative</strong> e basate su misure standard per veicoli normali.
              </p>
              <p>
                <strong>Puoi personalizzarle</strong> usando i campi di input sopra per adattarle perfettamente al tuo spazio e alle tue esigenze.
              </p>
              <p className="text-sm">
                🚗 <strong>Suggerimento:</strong> Lascia almeno 50cm di margine per agevolare entrata/uscita dall'auto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
