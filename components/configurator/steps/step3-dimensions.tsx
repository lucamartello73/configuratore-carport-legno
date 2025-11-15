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
  { spots: 1, width: 300, depth: 500, height: 220, label: "1 Posto Auto" },
  { spots: 2, width: 550, depth: 500, height: 220, label: "2 Posti Auto" },
  { spots: 3, width: 800, depth: 500, height: 220, label: "3 Posti Auto" },
  { spots: 4, width: 1050, depth: 500, height: 220, label: "4 Posti Auto" },
  { spots: 5, width: 1300, depth: 500, height: 220, label: "5+ Posti Auto" },
]

// Componente SVG Auto Realistica (vista dall'alto)
const CarIcon = ({ x = 0, y = 0, scale = 1, color = "#3b82f6" }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Carrozzeria principale */}
    <path
      d="M 15 5 L 60 5 Q 65 5 65 10 L 65 45 Q 65 50 60 50 L 15 50 Q 10 50 10 45 L 10 10 Q 10 5 15 5 Z"
      fill={color}
      stroke="#1e40af"
      strokeWidth="1.5"
    />
    
    {/* Tetto/abitacolo */}
    <rect x="20" y="15" width="35" height="20" rx="3" fill="#1e3a8a" opacity="0.7"/>
    
    {/* Finestrini */}
    <rect x="22" y="17" width="14" height="7" rx="1" fill="#93c5fd" opacity="0.5"/>
    <rect x="39" y="17" width="14" height="7" rx="1" fill="#93c5fd" opacity="0.5"/>
    <rect x="22" y="26" width="14" height="7" rx="1" fill="#93c5fd" opacity="0.5"/>
    <rect x="39" y="26" width="14" height="7" rx="1" fill="#93c5fd" opacity="0.5"/>
    
    {/* Ruote */}
    <ellipse cx="18" cy="5" rx="4" ry="6" fill="#1f2937"/>
    <ellipse cx="57" cy="5" rx="4" ry="6" fill="#1f2937"/>
    <ellipse cx="18" cy="50" rx="4" ry="6" fill="#1f2937"/>
    <ellipse cx="57" cy="50" rx="4" ry="6" fill="#1f2937"/>
    
    {/* Dettagli cerchi */}
    <ellipse cx="18" cy="5" rx="2" ry="3" fill="#6b7280"/>
    <ellipse cx="57" cy="5" rx="2" ry="3" fill="#6b7280"/>
    <ellipse cx="18" cy="50" rx="2" ry="3" fill="#6b7280"/>
    <ellipse cx="57" cy="50" rx="2" ry="3" fill="#6b7280"/>
    
    {/* Fari anteriori */}
    <ellipse cx="63" cy="15" rx="2" ry="3" fill="#fef3c7" opacity="0.8"/>
    <ellipse cx="63" cy="40" rx="2" ry="3" fill="#fef3c7" opacity="0.8"/>
    
    {/* Fari posteriori */}
    <ellipse cx="12" cy="15" rx="1.5" ry="2.5" fill="#fca5a5" opacity="0.8"/>
    <ellipse cx="12" cy="40" rx="1.5" ry="2.5" fill="#fca5a5" opacity="0.8"/>
  </g>
)

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

              {/* Schema Visuale Posti Auto - Vista dall'alto */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <svg viewBox="0 0 200 140" className="w-full h-auto">
                  {/* Sfondo Carport (rettangolo) */}
                  <rect x="5" y="5" width="190" height="130" fill="#f9fafb" stroke="#8B4513" strokeWidth="2.5" strokeDasharray="8,4" rx="6"/>
                  
                  {/* Linee di parcheggio */}
                  {Array.from({ length: data.spots }, (_, i) => {
                    const sectionWidth = 180 / data.spots
                    const lineX = 10 + (i * sectionWidth) + sectionWidth
                    if (i < data.spots - 1) {
                      return (
                        <line 
                          key={`divider-${i}`}
                          x1={lineX} 
                          y1="10" 
                          x2={lineX} 
                          y2="130" 
                          stroke="#d1d5db" 
                          strokeWidth="1.5" 
                          strokeDasharray="4,4"
                        />
                      )
                    }
                    return null
                  })}
                  
                  {/* Auto realistiche */}
                  {Array.from({ length: Math.min(data.spots, 5) }, (_, i) => {
                    const sectionWidth = 180 / data.spots
                    const carX = 10 + (i * sectionWidth) + (sectionWidth / 2) - 37.5
                    const carY = 42.5
                    const carScale = Math.min(0.85, sectionWidth / 85)
                    
                    return (
                      <CarIcon 
                        key={i} 
                        x={carX} 
                        y={carY} 
                        scale={carScale}
                        color="#3b82f6"
                      />
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
          <svg viewBox="0 0 400 280" className="w-full h-auto">
            {/* Vista isometrica carport */}
            {/* Base terra */}
            <polygon 
              points="50,220 350,220 380,190 80,190" 
              fill="#e5e7eb" 
              stroke="#9ca3af" 
              strokeWidth="2"
            />
            
            {/* Parete frontale */}
            <polygon 
              points="50,90 350,90 350,220 50,220" 
              fill="#f3f4f6" 
              stroke="#8B4513" 
              strokeWidth="3"
            />
            
            {/* Parete laterale */}
            <polygon 
              points="350,90 380,60 380,190 350,220" 
              fill="#e5e7eb" 
              stroke="#8B4513" 
              strokeWidth="3"
            />
            
            {/* Tetto */}
            <polygon 
              points="50,90 350,90 380,60 80,60" 
              fill="#8B4513" 
              opacity="0.8"
              stroke="#6B4423" 
              strokeWidth="3"
            />

            {/* Auto dentro carport - Vista laterale realistica */}
            <g opacity="0.7">
              {/* Carrozzeria */}
              <path
                d="M 110 180 L 130 170 L 170 165 L 240 165 L 280 170 L 300 180 L 300 200 L 290 205 L 120 205 L 110 200 Z"
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="2"
              />
              {/* Tetto */}
              <path
                d="M 140 170 L 150 160 L 200 158 L 250 160 L 260 170"
                fill="#1e3a8a"
                stroke="#1e40af"
                strokeWidth="1.5"
              />
              {/* Finestrini */}
              <polygon points="155,165 180,162 180,170 160,170" fill="#93c5fd" opacity="0.6"/>
              <polygon points="230,162 255,165 250,170 230,170" fill="#93c5fd" opacity="0.6"/>
              {/* Ruote */}
              <ellipse cx="140" cy="205" rx="12" ry="8" fill="#1f2937"/>
              <ellipse cx="270" cy="205" rx="12" ry="8" fill="#1f2937"/>
              <ellipse cx="140" cy="205" rx="7" ry="5" fill="#6b7280"/>
              <ellipse cx="270" cy="205" rx="7" ry="5" fill="#6b7280"/>
            </g>

            {/* Quote dimensionali */}
            {/* Larghezza */}
            <line x1="50" y1="235" x2="350" y2="235" stroke="#ef4444" strokeWidth="2.5"/>
            <line x1="50" y1="230" x2="50" y2="240" stroke="#ef4444" strokeWidth="2.5"/>
            <line x1="350" y1="230" x2="350" y2="240" stroke="#ef4444" strokeWidth="2.5"/>
            <text x="200" y="260" textAnchor="middle" fill="#ef4444" fontSize="20" fontWeight="bold">
              ↔ {width} cm
            </text>

            {/* Profondità */}
            <line x1="360" y1="220" x2="390" y2="190" stroke="#3b82f6" strokeWidth="2.5"/>
            <line x1="355" y1="220" x2="365" y2="220" stroke="#3b82f6" strokeWidth="2.5"/>
            <line x1="385" y1="190" x2="395" y2="190" stroke="#3b82f6" strokeWidth="2.5"/>
            <text x="420" y="208" textAnchor="start" fill="#3b82f6" fontSize="18" fontWeight="bold">
              {depth} cm
            </text>

            {/* Altezza */}
            <line x1="30" y1="90" x2="30" y2="220" stroke="#10b981" strokeWidth="2.5"/>
            <line x1="25" y1="90" x2="35" y2="90" stroke="#10b981" strokeWidth="2.5"/>
            <line x1="25" y1="220" x2="35" y2="220" stroke="#10b981" strokeWidth="2.5"/>
            <text x="15" y="160" textAnchor="end" fill="#10b981" fontSize="18" fontWeight="bold">
              ↕ {height} cm
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
