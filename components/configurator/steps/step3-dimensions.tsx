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
  { spots: 1, width: 300, depth: 500, height: 220, label: "1 Posto Auto" },
  { spots: 2, width: 550, depth: 500, height: 220, label: "2 Posti Auto" },
  { spots: 3, width: 800, depth: 500, height: 220, label: "3 Posti Auto" },
  { spots: 4, width: 1050, depth: 500, height: 220, label: "4 Posti Auto" },
  { spots: 5, width: 1300, depth: 500, height: 220, label: "5+ Posti Auto" },
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
      
      {/* TITOLO */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Quanti Posti Auto?</h2>
        <p className="text-lg text-secondary">Clicca sulla card per scegliere</p>
      </div>

      {/* 5 CARD AFFIANCATE CON IMMAGINI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {carSpotsData.map((data) => (
          <div
            key={data.spots}
            onClick={() => handleCarSpotsChange(data.spots)}
            className={`product-card cursor-pointer transition-all duration-300 ${
              carSpots === data.spots ? 'product-card-selected ring-4 ring-green-400' : ''
            }`}
          >
            {/* Badge Selezionato */}
            {carSpots === data.spots && (
              <div className="badge-selected">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* NUMERO GRANDE IN ALTO */}
            <div className="text-center mb-3">
              <div className="text-5xl font-bold text-primary mb-1">
                {data.spots}{data.spots === 5 ? "+" : ""}
              </div>
              <div className="text-sm font-medium text-secondary">{data.label}</div>
            </div>

            {/* IMMAGINE VISTA DALL'ALTO CON AUTO PARCHEGGIATE */}
            <div className="bg-gradient-to-b from-sky-100 to-gray-200 rounded-lg p-3 border-2 border-gray-300">
              <svg viewBox="0 0 200 280" className="w-full h-auto">
                {/* Sfondo parcheggio */}
                <rect x="5" y="5" width="190" height="270" fill="#e5e7eb" rx="8"/>
                
                {/* Tetto carport superiore */}
                <rect x="10" y="10" width="180" height="15" fill="#8B4513" rx="3"/>
                <rect x="10" y="22" width="180" height="6" fill="#6B4423" rx="2"/>
                
                {/* Pilastri laterali */}
                <rect x="10" y="28" width="8" height="240" fill="#8B4513" rx="2"/>
                <rect x="182" y="28" width="8" height="240" fill="#8B4513" rx="2"/>
                
                {/* Linee delimitazione posti */}
                {data.spots > 1 && Array.from({ length: data.spots - 1 }, (_, i) => {
                  const spacing = 160 / data.spots
                  const x = 20 + (i + 1) * spacing
                  return (
                    <line 
                      key={i}
                      x1={x} 
                      y1="35" 
                      x2={x} 
                      y2="265" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                      strokeDasharray="8,6"
                    />
                  )
                })}
                
                {/* AUTO PARCHEGGIATE - VISTA DALL'ALTO REALISTICA */}
                {Array.from({ length: data.spots }, (_, i) => {
                  const spacing = 160 / data.spots
                  const x = 20 + (i * spacing) + (spacing / 2)
                  const carWidth = Math.min(35, spacing * 0.8)
                  const carHeight = Math.min(60, spacing * 1.4)
                  
                  return (
                    <g key={i}>
                      {/* Ombra auto */}
                      <ellipse 
                        cx={x} 
                        cy={155} 
                        rx={carWidth * 0.5} 
                        ry={carHeight * 0.5} 
                        fill="#000000" 
                        opacity="0.15"
                      />
                      
                      {/* Carrozzeria principale */}
                      <defs>
                        <linearGradient id={`carGrad${data.spots}-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 0.8}} />
                          <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#2563eb', stopOpacity: 0.8}} />
                        </linearGradient>
                      </defs>
                      
                      {/* Corpo auto arrotondato */}
                      <rect 
                        x={x - carWidth/2} 
                        y={140} 
                        width={carWidth} 
                        height={carHeight} 
                        rx={carWidth * 0.3}
                        fill={`url(#carGrad${data.spots}-${i})`}
                        stroke="#1e40af"
                        strokeWidth="1.5"
                      />
                      
                      {/* Tetto/abitacolo */}
                      <rect 
                        x={x - carWidth/2 + 4} 
                        y={155} 
                        width={carWidth - 8} 
                        height={carHeight * 0.5} 
                        rx={carWidth * 0.2}
                        fill="#1e3a8a"
                        opacity="0.7"
                      />
                      
                      {/* Finestrini */}
                      <rect 
                        x={x - carWidth/2 + 6} 
                        y={160} 
                        width={carWidth - 12} 
                        height={carHeight * 0.2} 
                        rx={carWidth * 0.15}
                        fill="#bfdbfe"
                        opacity="0.6"
                      />
                      
                      {/* Cofano anteriore */}
                      <ellipse 
                        cx={x} 
                        cy={145} 
                        rx={carWidth * 0.3} 
                        ry={8} 
                        fill="#1e40af"
                        opacity="0.4"
                      />
                      
                      {/* Bagagliaio posteriore */}
                      <ellipse 
                        cx={x} 
                        cy={195} 
                        rx={carWidth * 0.3} 
                        ry={8} 
                        fill="#1e40af"
                        opacity="0.4"
                      />
                      
                      {/* Specchietti laterali */}
                      <ellipse cx={x - carWidth/2 - 2} cy={170} rx="2.5" ry="3" fill="#1e3a8a"/>
                      <ellipse cx={x + carWidth/2 + 2} cy={170} rx="2.5" ry="3" fill="#1e3a8a"/>
                      
                      {/* Ruote */}
                      <ellipse cx={x - carWidth/2 + 5} cy={150} rx="3" ry="4" fill="#1f2937"/>
                      <ellipse cx={x + carWidth/2 - 5} cy={150} rx="3" ry="4" fill="#1f2937"/>
                      <ellipse cx={x - carWidth/2 + 5} cy={190} rx="3" ry="4" fill="#1f2937"/>
                      <ellipse cx={x + carWidth/2 - 5} cy={190} rx="3" ry="4" fill="#1f2937"/>
                    </g>
                  )
                })}
                
                {/* Linea strada inferiore */}
                <rect x="10" y="268" width="180" height="4" fill="#fbbf24" rx="1"/>
              </svg>
            </div>

            {/* Dimensioni in piccolo */}
            <div className="text-xs text-secondary text-center mt-2 space-y-0.5">
              <div>📏 {data.width}cm</div>
              <div>📐 {data.depth}cm</div>
            </div>
          </div>
        ))}
      </div>

      {/* DIMENSIONI CONSIGLIATE GRANDE */}
      <div className="product-card bg-surface-beige border-2 border-accent-pink">
        <h3 className="text-xl font-bold text-primary mb-4 text-center">
          📐 Dimensioni per {carSpots} Posto{carSpots > 1 ? "i" : ""} Auto
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">{width}</div>
            <div className="text-sm text-secondary">cm larghezza</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">{depth}</div>
            <div className="text-sm text-secondary">cm profondità</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">{height}</div>
            <div className="text-sm text-secondary">cm altezza</div>
          </div>
        </div>
      </div>

      {/* PERSONALIZZA DIMENSIONI (CHIUSO) */}
      <details className="product-card">
        <summary className="text-lg font-semibold text-primary cursor-pointer hover:text-accent-pink flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Personalizza Dimensioni (facoltativo)
        </summary>
        
        <div className="grid md:grid-cols-3 gap-4 mt-4">
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
