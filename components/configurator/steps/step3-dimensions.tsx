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
  { spots: 1, width: 300, depth: 500, height: 220, label: "1 Posto" },
  { spots: 2, width: 550, depth: 500, height: 220, label: "2 Posti" },
  { spots: 3, width: 800, depth: 500, height: 220, label: "3 Posti" },
  { spots: 4, width: 1050, depth: 500, height: 220, label: "4 Posti" },
  { spots: 5, width: 1300, depth: 500, height: 220, label: "5+ Posti" },
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

      {/* Layout: Pulsanti + Immagine Grande */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Colonna Sinistra: Pulsanti Selezione */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary text-center">Quanti posti auto ti servono?</h3>

          {/* Pulsanti Grandi Numerici */}
          <div className="grid grid-cols-3 gap-4">
            {carSpotsData.map((data) => (
              <button
                key={data.spots}
                onClick={() => handleCarSpotsChange(data.spots)}
                className={`relative p-6 rounded-xl border-3 transition-all duration-300 ${
                  carSpots === data.spots
                    ? "bg-primary text-white border-primary shadow-2xl scale-105"
                    : "bg-white text-primary border-gray-300 hover:border-accent-pink hover:shadow-lg"
                }`}
              >
                {/* Badge Selezionato */}
                {carSpots === data.spots && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Numero Grande */}
                <div className="text-5xl font-bold mb-2">
                  {data.spots}{data.spots === 5 ? "+" : ""}
                </div>
                
                {/* Label */}
                <div className="text-sm font-medium">
                  {data.label}
                </div>
              </button>
            ))}
          </div>

          {/* Info Dimensioni Suggerite */}
          <div className="product-card bg-surface-beige border-2 border-accent-pink">
            <h4 className="font-semibold text-primary text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">📐</span>
              Dimensioni Suggerite
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Larghezza:</span>
                <span className="font-bold text-primary text-lg">{carSpotsData.find(d => d.spots === carSpots)?.width} cm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Profondità:</span>
                <span className="font-bold text-primary text-lg">{carSpotsData.find(d => d.spots === carSpots)?.depth} cm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Altezza:</span>
                <span className="font-bold text-primary text-lg">{carSpotsData.find(d => d.spots === carSpots)?.height} cm</span>
              </div>
            </div>
            <p className="text-xs text-secondary mt-3 italic">
              💡 Puoi personalizzare le misure nei campi qui sotto
            </p>
          </div>
        </div>

        {/* Colonna Destra: Immagine Dinamica Grande */}
        <div className="flex items-center justify-center">
          <div className="product-card bg-gradient-to-b from-sky-50 to-gray-100 border-2 border-accent-pink w-full">
            <h4 className="font-semibold text-primary text-lg mb-4 text-center">
              🚗 Anteprima: {carSpots} Auto Parcheggiate
            </h4>
            
            {/* SVG Immagine Carport con Auto */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Sfondo cielo */}
                <rect x="0" y="0" width="400" height="150" fill="#e0f2fe"/>
                
                {/* Tetto Carport */}
                <rect x="20" y="40" width="360" height="20" fill="#8B4513" rx="4"/>
                <rect x="20" y="55" width="360" height="8" fill="#6B4423" opacity="0.7"/>
                
                {/* Pilastri laterali */}
                <rect x="20" y="60" width="15" height="140" fill="#8B4513"/>
                <rect x="365" y="60" width="15" height="140" fill="#8B4513"/>
                
                {/* Pavimento */}
                <rect x="0" y="200" width="400" height="100" fill="#9ca3af"/>
                
                {/* Linee stradali */}
                <rect x="0" y="195" width="400" height="5" fill="#fbbf24"/>
                
                {/* Linee divisorie parcheggio */}
                {Array.from({ length: carSpots - 1 }, (_, i) => {
                  const spacing = 340 / carSpots
                  const x = 40 + (i + 1) * spacing
                  return (
                    <line 
                      key={i}
                      x1={x} 
                      y1="65" 
                      x2={x} 
                      y2="200" 
                      stroke="#fbbf24" 
                      strokeWidth="3" 
                      strokeDasharray="10,8"
                    />
                  )
                })}
                
                {/* Auto parcheggiate - EMOJI REALI */}
                {Array.from({ length: Math.min(carSpots, 5) }, (_, i) => {
                  const spacing = 340 / carSpots
                  const x = 40 + (i * spacing) + (spacing / 2)
                  const carWidth = Math.min(60, spacing * 0.8)
                  
                  return (
                    <g key={i}>
                      {/* Carrozzeria auto stile foto reale */}
                      <defs>
                        <linearGradient id={`carGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      
                      {/* Corpo auto */}
                      <rect 
                        x={x - carWidth/2} 
                        y="130" 
                        width={carWidth} 
                        height="50" 
                        fill={`url(#carGradient${i})`}
                        rx="8"
                        stroke="#1e40af"
                        strokeWidth="2"
                      />
                      
                      {/* Tetto auto */}
                      <path
                        d={`M ${x - carWidth/2 + 8} 130 Q ${x} 115 ${x + carWidth/2 - 8} 130`}
                        fill="#1e3a8a"
                        stroke="#1e40af"
                        strokeWidth="1.5"
                      />
                      
                      {/* Parabrezza */}
                      <path
                        d={`M ${x - carWidth/2 + 12} 130 Q ${x} 120 ${x + carWidth/2 - 12} 130`}
                        fill="#93c5fd"
                        opacity="0.6"
                      />
                      
                      {/* Fari anteriori */}
                      <ellipse cx={x - carWidth/2 + 8} cy="175" rx="5" ry="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/>
                      <ellipse cx={x + carWidth/2 - 8} cy="175" rx="5" ry="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/>
                      
                      {/* Ruote */}
                      <ellipse cx={x - carWidth/2 + 12} cy="182" rx="8" ry="6" fill="#1f2937"/>
                      <ellipse cx={x + carWidth/2 - 12} cy="182" rx="8" ry="6" fill="#1f2937"/>
                      <ellipse cx={x - carWidth/2 + 12} cy="182" rx="5" ry="4" fill="#6b7280"/>
                      <ellipse cx={x + carWidth/2 - 12} cy="182" rx="5" ry="4" fill="#6b7280"/>
                      
                      {/* Ombra */}
                      <ellipse 
                        cx={x} 
                        cy="195" 
                        rx={carWidth * 0.6} 
                        ry="8" 
                        fill="#000000" 
                        opacity="0.2"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Label descrittiva */}
            <p className="text-center text-sm text-secondary mt-3">
              Vista frontale del carport con <strong className="text-primary">{carSpots} auto</strong> parcheggiate
            </p>
          </div>
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
