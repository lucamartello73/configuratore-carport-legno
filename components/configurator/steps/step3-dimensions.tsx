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

// Componente SVG Auto Realistica - VISTA FRONTALE
const CarFrontIcon = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Carrozzeria principale */}
    <path
      d="M 15 45 Q 10 40 10 30 L 10 25 Q 10 20 15 18 L 20 15 Q 25 12 30 12 L 50 12 Q 55 12 60 15 L 65 18 Q 70 20 70 25 L 70 30 Q 70 40 65 45 L 60 50 L 20 50 Z"
      fill="#3b82f6"
      stroke="#1e40af"
      strokeWidth="2"
    />
    
    {/* Parabrezza */}
    <path
      d="M 20 18 Q 25 14 40 14 Q 55 14 60 18 L 58 22 Q 55 20 40 20 Q 25 20 22 22 Z"
      fill="#93c5fd"
      opacity="0.7"
    />
    
    {/* Tetto */}
    <rect x="22" y="12" width="36" height="8" rx="3" fill="#1e3a8a"/>
    
    {/* Fari */}
    <ellipse cx="20" cy="48" rx="5" ry="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
    <ellipse cx="60" cy="48" rx="5" ry="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
    
    {/* Griglia anteriore */}
    <rect x="32" y="44" width="16" height="6" rx="1" fill="#1f2937" opacity="0.6"/>
    <line x1="35" y1="44" x2="35" y2="50" stroke="#6b7280" strokeWidth="0.5"/>
    <line x1="40" y1="44" x2="40" y2="50" stroke="#6b7280" strokeWidth="0.5"/>
    <line x1="45" y1="44" x2="45" y2="50" stroke="#6b7280" strokeWidth="0.5"/>
    
    {/* Ruote anteriori */}
    <g>
      {/* Ruota sinistra */}
      <ellipse cx="18" cy="52" rx="8" ry="6" fill="#1f2937"/>
      <ellipse cx="18" cy="52" rx="5" ry="4" fill="#6b7280"/>
      <ellipse cx="18" cy="52" rx="2.5" ry="2" fill="#9ca3af"/>
      
      {/* Ruota destra */}
      <ellipse cx="62" cy="52" rx="8" ry="6" fill="#1f2937"/>
      <ellipse cx="62" cy="52" rx="5" ry="4" fill="#6b7280"/>
      <ellipse cx="62" cy="52" rx="2.5" ry="2" fill="#9ca3af"/>
    </g>
    
    {/* Specchietti */}
    <ellipse cx="8" cy="28" rx="3" ry="4" fill="#1e40af" opacity="0.8"/>
    <ellipse cx="72" cy="28" rx="3" ry="4" fill="#1e40af" opacity="0.8"/>
    
    {/* Dettagli cofano */}
    <line x1="25" y1="38" x2="55" y2="38" stroke="#1e40af" strokeWidth="1" opacity="0.5"/>
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

              {/* Schema Visuale Posti Auto - VISTA FRONTALE */}
              <div className="mb-4 bg-gradient-to-b from-sky-50 to-gray-100 rounded-lg p-4 border-2 border-gray-300">
                <svg viewBox="0 0 220 90" className="w-full h-auto">
                  {/* Linea orizzonte/strada */}
                  <line x1="0" y1="65" x2="220" y2="65" stroke="#9ca3af" strokeWidth="2"/>
                  
                  {/* Sfondo carport (tetto) */}
                  <rect x="5" y="0" width="210" height="12" fill="#8B4513" opacity="0.7" rx="2"/>
                  <rect x="5" y="10" width="210" height="3" fill="#6B4423" opacity="0.5"/>
                  
                  {/* Linee divisorie parcheggi */}
                  {Array.from({ length: data.spots }, (_, i) => {
                    const sectionWidth = 200 / data.spots
                    const lineX = 10 + (i * sectionWidth) + sectionWidth
                    if (i < data.spots - 1) {
                      return (
                        <line 
                          key={`divider-${i}`}
                          x1={lineX} 
                          y1="15" 
                          x2={lineX} 
                          y2="65" 
                          stroke="#d1d5db" 
                          strokeWidth="2" 
                          strokeDasharray="6,4"
                        />
                      )
                    }
                    return null
                  })}
                  
                  {/* Auto vista frontale affiancate */}
                  {Array.from({ length: Math.min(data.spots, 5) }, (_, i) => {
                    const sectionWidth = 200 / data.spots
                    const carX = 10 + (i * sectionWidth) + (sectionWidth / 2) - 40
                    const carScale = Math.min(1, sectionWidth / 85)
                    
                    return (
                      <CarFrontIcon 
                        key={i} 
                        x={carX} 
                        y={8}
                        scale={carScale}
                      />
                    )
                  })}
                  
                  {/* Linee strada (strisce parcheggio) */}
                  <line x1="10" y1="65" x2="10" y2="85" stroke="#fbbf24" strokeWidth="3"/>
                  <line x1="210" y1="65" x2="210" y2="85" stroke="#fbbf24" strokeWidth="3"/>
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
