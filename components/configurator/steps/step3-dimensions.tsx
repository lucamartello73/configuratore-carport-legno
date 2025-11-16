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

// Dimensioni minime consigliate per numero posti auto
const MINIMUM_DIMENSIONS = {
  1: { width: 300, depth: 500, height: 220 },
  2: { width: 550, depth: 500, height: 220 },
  3: { width: 800, depth: 500, height: 220 },
  4: { width: 1050, depth: 500, height: 220 },
  5: { width: 1300, depth: 500, height: 220 },
}

// Colore brand (marrone legno)
const BRAND_COLOR = '#5A3A1A'
const BRAND_DARK = '#3E2914'

// Icona auto più piccola (max-width: 38px) per pulsanti
const CarIcon = ({ isSelected }: { isSelected: boolean }) => (
  <svg 
    style={{ maxWidth: '38px', width: '38px', height: 'auto' }} 
    viewBox="0 0 24 24" 
    fill={isSelected ? '#FFFFFF' : '#5A3A1A'} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-11 0A1.5 1.5 0 015 14.5 1.5 1.5 0 016.5 13 1.5 1.5 0 018 14.5 1.5 1.5 0 016.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6z" />
  </svg>
)

// Icona auto PREMIUM (vista dall'alto dettagliata)
const CarPremiumIcon = () => (
  <svg
    width="100"
    height="200"
    viewBox="0 0 100 200"
    fill="none"
    stroke="#3A3A3A"
    strokeWidth="5"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* carrozzeria */}
    <rect x="20" y="10" width="60" height="180" rx="18" fill="white" />
    {/* ruote sinistra */}
    <rect x="8" y="60" width="20" height="40" rx="6" fill="#3A3A3A" />
    <rect x="8" y="110" width="20" height="40" rx="6" fill="#3A3A3A" />
    {/* ruote destra */}
    <rect x="72" y="60" width="20" height="40" rx="6" fill="#3A3A3A" />
    <rect x="72" y="110" width="20" height="40" rx="6" fill="#3A3A3A" />
    {/* vetri / abitacolo */}
    <rect x="30" y="20" width="40" height="40" fill="#E8E8E8" />
    <rect x="30" y="70" width="40" height="60" fill="#E8E8E8" />
    <rect x="30" y="140" width="40" height="40" fill="#E8E8E8" />
  </svg>
)

export function Step3Dimensions({
  configuration,
  updateConfiguration,
  onAutoAdvance,
}: Step3DimensionsProps) {
  const [localSelectedSpaces, setLocalSelectedSpaces] = useState<number>(
    configuration.spaces || 1
  )
  const [localWidth, setLocalWidth] = useState(configuration.width?.toString() || '300')
  const [localDepth, setLocalDepth] = useState(configuration.depth?.toString() || '500')
  const [localHeight, setLocalHeight] = useState(configuration.height?.toString() || '220')
  
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')

  // Inizializza default 1 posto auto
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
    
    const minDims = MINIMUM_DIMENSIONS[spaces as keyof typeof MINIMUM_DIMENSIONS]
    setLocalWidth(minDims.width.toString())
    setLocalDepth(minDims.depth.toString())
    setLocalHeight(minDims.height.toString())
    
    setWidthError('')
    setDepthError('')
    
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
      updateConfiguration({
        spaces: localSelectedSpaces,
        width: parseInt(localWidth) || 0,
        depth: parseInt(localDepth) || 0,
        height: parseInt(localHeight) || 0,
      })
      
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
  const currentWidth = parseInt(localWidth) || minDims.width
  const currentDepth = parseInt(localDepth) || minDims.depth

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* LOGO MARTELLO1930 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img 
          src="https://www.genspark.ai/api/files/s/AAO1wRaO" 
          alt="Martello1930" 
          style={{ height: '70px', width: 'auto' }}
        />
      </div>

      {/* Header - ridotto spazio sopra del 30% */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Quanti posti auto ti servono?
        </h2>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Seleziona il numero di posti auto per il tuo carport
        </p>
      </div>

      {/* PULSANTI POSTI AUTO */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '20px', 
        marginTop: '20px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {spaceOptions.map((option) => {
          const isSelected = localSelectedSpaces === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSpaceSelection(option.value)}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '999px',
                background: isSelected ? '#5A3A1A' : '#FFFFFF',
                border: isSelected ? '3px solid #3E2914' : '3px solid #5A3A1A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: isSelected ? '#FFFFFF' : '#5A3A1A',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 14px rgba(0,0,0,0.35)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <CarIcon isSelected={isSelected} />
              <span style={{ textAlign: 'center', lineHeight: '1.2' }}>{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* RETTANGOLO TECNICO MIGLIORATO */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', marginBottom: '25px', position: 'relative' }}>
        <div 
          style={{ 
            maxWidth: '650px',
            width: '100%',
            height: '180px', // Aumentato di 30px come richiesto
            border: '2px solid #5A3A1A',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* DIVISIONE VISIVA INTERNA - 5 COLONNE */}
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            top: 0, 
            left: 0 
          }}>
            {[1, 2, 3, 4, 5].map((colIndex) => {
              const isActive = colIndex <= localSelectedSpaces
              return (
                <div 
                  key={colIndex}
                  style={{ 
                    flex: 1, 
                    borderRight: colIndex < 5 ? '1px solid #dcdcdc' : 'none',
                    position: 'relative',
                    background: isActive ? 'rgba(0, 160, 0, 0.25)' : 'rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease'
                  }}
                >
                </div>
              )
            })}
          </div>

          {/* GRUPPO AUTO PREMIUM - SOLO NELLA FASCIA VERDE SELEZIONATA */}
          <div className="auto-group" style={{
            position: 'absolute',
            top: '50%',
            left: `${(localSelectedSpaces / 10) * 100}%`, // Centra nella fascia verde attiva
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 15,
            pointerEvents: 'none'
          }}>
            {Array.from({ length: localSelectedSpaces }).map((_, index) => (
              <div key={index} className="auto-item" style={{ height: '85px', opacity: 0.95 }}>
                <CarPremiumIcon />
              </div>
            ))}
          </div>

          {/* TESTO CENTRALE (sopra le colonne) */}
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            textAlign: 'center', 
            paddingTop: '20px' 
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px' }}>
              Area Copertura
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#5A3A1A', marginBottom: '8px' }}>
              {currentWidth} × {currentDepth} cm
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>
              {localSelectedSpaces} {localSelectedSpaces === 1 ? 'Posto Auto' : 'Posti Auto'}
            </div>
          </div>

          {/* MISURE LATERALI - SINISTRA (Larghezza) */}
          <div className="dimension-label left-label" style={{ 
            position: 'absolute', 
            left: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#333'
          }}>
            <div style={{ marginBottom: '2px' }}>
              <strong>Cons:</strong> {minDims.width}cm
            </div>
            <div style={{ color: '#00A000' }}>
              <strong>Scelta:</strong> {currentWidth}cm
            </div>
          </div>

          {/* MISURE LATERALI - DESTRA (Profondità) */}
          <div className="dimension-label right-label" style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#333',
            textAlign: 'right'
          }}>
            <div style={{ marginBottom: '2px' }}>
              <strong>Cons:</strong> {minDims.depth}cm
            </div>
            <div style={{ color: '#00A000' }}>
              <strong>Scelta:</strong> {currentDepth}cm
            </div>
          </div>
        </div>
      </div>

      {/* SEZIONE "PERSONALIZZA LE DIMENSIONI" */}
      <div style={{ 
        background: '#F7F4ED',
        padding: '22px',
        borderRadius: '12px',
        border: '1px solid #D8D2C6',
        maxWidth: '420px',
        margin: '25px auto 30px auto'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '18px' }}>
          Personalizza le Dimensioni
        </h3>
        
        {/* Larghezza */}
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="width" 
            style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#3E2914',
              display: 'block',
              marginBottom: '5px'
            }}
          >
            Larghezza (cm)
          </label>
          <input
            id="width"
            type="number"
            value={localWidth}
            onChange={(e) => handleWidthChange(e.target.value)}
            placeholder="es. 300"
            style={{ 
              width: '100%',
              maxWidth: '240px',
              border: '2px solid #5A3A1A',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '15px',
              marginTop: '5px',
              marginBottom: '12px',
              backgroundColor: widthError ? '#fee2e2' : 'white',
              borderColor: widthError ? '#ef4444' : '#5A3A1A'
            }}
          />
          {widthError && (
            <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '4px' }}>
              ⚠️ {widthError}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#6B7280' }}>Minimo: {minDims.width} cm</p>
        </div>

        {/* Profondità */}
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="depth" 
            style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#3E2914',
              display: 'block',
              marginBottom: '5px'
            }}
          >
            Profondità (cm)
          </label>
          <input
            id="depth"
            type="number"
            value={localDepth}
            onChange={(e) => handleDepthChange(e.target.value)}
            placeholder="es. 500"
            style={{ 
              width: '100%',
              maxWidth: '240px',
              border: '2px solid #5A3A1A',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '15px',
              marginTop: '5px',
              marginBottom: '12px',
              backgroundColor: depthError ? '#fee2e2' : 'white',
              borderColor: depthError ? '#ef4444' : '#5A3A1A'
            }}
          />
          {depthError && (
            <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '4px' }}>
              ⚠️ {depthError}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#6B7280' }}>Minimo: {minDims.depth} cm</p>
        </div>

        {/* Altezza */}
        <div style={{ marginBottom: '8px', paddingTop: '12px', borderTop: '1px solid #D8D2C6' }}>
          <label 
            htmlFor="height" 
            style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#3E2914',
              display: 'block',
              marginBottom: '5px'
            }}
          >
            Altezza (cm)
          </label>
          <input
            id="height"
            type="number"
            value={localHeight}
            onChange={(e) => {
              setLocalHeight(e.target.value)
              updateConfiguration({ height: parseInt(e.target.value) || 0 })
            }}
            placeholder="es. 220"
            style={{ 
              width: '100%',
              maxWidth: '240px',
              border: '2px solid #5A3A1A',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '15px',
              marginTop: '5px',
              marginBottom: '12px'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6B7280' }}>Standard: 220 cm</p>
        </div>
      </div>

      {/* PULSANTE CONFERMA */}
      <button
        onClick={handleConfirm}
        disabled={!!widthError || !!depthError}
        style={{
          background: (widthError || depthError) ? '#9ca3af' : '#5A3A1A',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          padding: '12px 26px',
          borderRadius: '8px',
          border: 'none',
          cursor: (widthError || depthError) ? 'not-allowed' : 'pointer',
          display: 'block',
          margin: '18px auto 0 auto',
          transition: 'all 0.2s ease',
          opacity: (widthError || depthError) ? '0.5' : '1'
        }}
        onMouseEnter={(e) => {
          if (!widthError && !depthError) {
            e.currentTarget.style.background = '#4A2C14'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!widthError && !depthError) {
            e.currentTarget.style.background = '#5A3A1A'
            e.currentTarget.style.transform = 'translateY(0)'
          }
        }}
      >
        Conferma e Continua →
      </button>
    </div>
  )
}

export default Step3Dimensions
