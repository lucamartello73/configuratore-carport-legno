"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"
import { trackCoverageSelected, trackStepCompleted } from "@/lib/analytics/events"

interface Step4Props {
  onAutoAdvance?: () => void

  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface CoverageType {
  id: string
  name: string
  description: string
  price_modifier: number
  image_url: string
  attivo: boolean
}

export function Step4Coverage({ configuration, updateConfiguration, onAutoAdvance }: Step4Props) {
  const [selectedCoverage, setSelectedCoverage] = useState(configuration.coverageId || "")

  const { data: coverageTypes, isLoading, error } = useConfiguratorData<CoverageType>({
    material: 'acciaio',
    table: 'coverage_types',
  })

  useEffect(() => {
    if (selectedCoverage) {
      const selectedCoverageData = coverageTypes.find((c) => c.id === selectedCoverage)
      updateConfiguration({ coverageId: selectedCoverage })
      
      // Track selection
      if (selectedCoverageData) {
        trackCoverageSelected(selectedCoverage, selectedCoverageData.name)
        trackStepCompleted(4, 'Copertura')
      }
      
      // Auto-avanzamento dopo selezione
      if (onAutoAdvance) {
        setTimeout(() => {
          onAutoAdvance()
        }, 800)
      }
    }
  }, [selectedCoverage, updateConfiguration, onAutoAdvance])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Errore nel caricamento delle coperture: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Seleziona il tipo di copertura</h2>
        <p className="text-secondary">Scegli tra le diverse soluzioni disponibili</p>
      </div>

      <div className="product-grid">
        {coverageTypes.map((coverage) => {
          const imageUrl = getImageUrlOrPlaceholder(coverage.image_url)
          const description = getDescriptionOrFallback(coverage.description)
          
          return (
            <div
              key={coverage.id}
              className={`product-card ${selectedCoverage === coverage.id ? 'product-card-selected' : ''}`}
              onClick={() => setSelectedCoverage(coverage.id)}
            >
              <div className="product-image-container">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={coverage.name}
                    className="product-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const placeholder = document.createElement('div')
                        placeholder.className = 'flex items-center justify-center w-full h-full bg-gray-100'
                        parent.appendChild(placeholder)
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {selectedCoverage === coverage.id && (
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
              </div>

              <div className="product-content">
                <h3 className="product-title">{coverage.name}</h3>
                <p className="product-description">{description}</p>

                {coverage.price_modifier > 0 && (
                  <div className="product-price-container">
                    <p className="text-sm text-secondary">Supplemento:</p>
                    <p className="product-price">+€{coverage.price_modifier.toFixed(2)} al mq</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {coverageTypes.length === 0 && !isLoading && (
        <div className="text-center py-12 text-secondary">
          <p>Nessun tipo di copertura disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
