"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step6Props {
  onAutoAdvance?: () => void

  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Surface {
  id: string
  name: string
  description: string
  price_per_sqm: number
  image_url?: string
  attivo: boolean
  display_order?: number
}

export function Step6Surface({ configuration, updateConfiguration, onAutoAdvance }: Step6Props) {
  const [selectedSurface, setSelectedSurface] = useState(configuration.surfaceId || "")

  const surfaceArea =
    configuration.width && configuration.depth ? (configuration.width * configuration.depth) / 10000 : 0

  const { data: surfaces, isLoading, error } = useConfiguratorData<Surface>({
    material: 'legno',
    table: 'surfaces',
  })

  useEffect(() => {
    if (selectedSurface) {
      updateConfiguration({ surfaceId: selectedSurface })
      
      // Auto-avanzamento dopo selezione
      if (onAutoAdvance) {
        setTimeout(() => {
          onAutoAdvance()
        }, 800)
      }
    }
  }, [selectedSurface, updateConfiguration, onAutoAdvance])

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
        <p>Errore nel caricamento delle superfici: {error}</p>
      </div>
    )
  }

  if (surfaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary">Nessuna superficie disponibile al momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Scegli il tipo di superficie</h2>
        {surfaceArea > 0 && (
          <p className="text-accent-pink font-semibold mt-2 text-xl">
            Superficie da coprire: {surfaceArea.toFixed(1)} m²
          </p>
        )}
      </div>

      <div className="product-grid">
        {surfaces.map((surface) => {
          const imageUrl = getImageUrlOrPlaceholder(surface.image_url)
          const description = getDescriptionOrFallback(surface.description)
          const totalPrice = surface.price_per_sqm * surfaceArea

          return (
            <div
              key={surface.id}
              className={`product-card ${selectedSurface === surface.id ? 'product-card-selected' : ''}`}
              onClick={() => setSelectedSurface(surface.id)}
            >
              {surface.image_url && (
                <div className="product-image-container">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={surface.name}
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
                </div>
              )}
              
              <div className="product-content">
                <h3 className="product-title">{surface.name}</h3>
                <p className="product-description">{description}</p>
                
                {surfaceArea > 0 && (
                  <div className="product-price-container">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">€{surface.price_per_sqm}/m²</span>
                      <span className="product-price">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
