"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step1Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface StructureType {
  id: string
  name: string
  description: string
  image_url: string
  features: string[]
  attivo: boolean
  base_price?: number
}

export function Step1StructureType({ configuration, updateConfiguration }: Step1Props) {
  const [selectedType, setSelectedType] = useState(configuration.structureTypeId || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: structureTypes, isLoading, error } = useConfiguratorData<StructureType>({
    material: 'legno',
    table: 'structure_types',
  })

  useEffect(() => {
    if (selectedType) {
      setIsUpdating(true)
      setTimeout(() => {
        const selectedStructure = structureTypes.find((type) => type.id === selectedType)
        updateConfiguration({
          structureTypeId: selectedType,
          structureType: selectedStructure?.name || selectedType,
        })
        setIsUpdating(false)
      }, 300)
    }
  }, [selectedType, structureTypes])

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
        <p>Errore nel caricamento dei tipi di struttura: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Seleziona il tipo di copertura in legno</h2>
        <p className="text-secondary">Scegli tra le diverse soluzioni naturali disponibili</p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="product-grid">
        {structureTypes.map((type) => {
          const imageUrl = getImageUrlOrPlaceholder(type.image_url)
          const description = getDescriptionOrFallback(type.description)
          
          return (
            <div
              key={type.id}
              className={`product-card ${selectedType === type.id ? 'product-card-selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="product-image-container">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={type.name}
                    className="product-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const placeholder = document.createElement('div')
                        placeholder.className = 'flex items-center justify-center w-full h-full bg-gray-100'
                        placeholder.innerHTML = '<svg class="w-12 h-12 text-gray-400"><use href="#icon-image-off"/></svg>'
                        parent.appendChild(placeholder)
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {selectedType === type.id && (
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
                <h3 className="product-title">{type.name}</h3>
                <p className="product-description">{description}</p>

                {type.features && type.features.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-800">
                        <svg className="w-4 h-4 text-accent-pink mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {type.base_price && (
                  <div className="product-price-container">
                    <p className="text-sm text-secondary">Prezzo base da:</p>
                    <p className="product-price">€{type.base_price.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {structureTypes.length === 0 && !isLoading && (
        <div className="text-center py-12 text-secondary">
          <p>Nessun tipo di pergola disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
