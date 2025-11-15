"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step2Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
  onAutoAdvance?: () => void
}

interface Model {
  id: string
  name: string
  description: string
  image: string
  base_price: number
  structure_type_id: string
  attivo: boolean
}

export function Step2Model({ configuration, updateConfiguration, onAutoAdvance }: Step2Props) {
  const [selectedModel, setSelectedModel] = useState(configuration.modelId || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: allModels, isLoading, error } = useConfiguratorData<Model>({
    material: 'legno',
    table: 'models',
  })

  const models = allModels.filter(
    (model) => model.structure_type_id === configuration.structureTypeId
  )

  useEffect(() => {
    if (selectedModel) {
      setIsUpdating(true)
      setTimeout(() => {
        const selectedModelData = models.find((model) => model.id === selectedModel)
        updateConfiguration({
          modelId: selectedModel,
          modelName: selectedModelData?.name || selectedModel,
        })
        setIsUpdating(false)
        
        // Auto-avanzamento dopo selezione (con delay per feedback visivo)
        if (onAutoAdvance) {
          setTimeout(() => {
            onAutoAdvance()
          }, 800)
        }
      }, 300)
    }
  }, [selectedModel, models, updateConfiguration, onAutoAdvance])

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
        <p>Errore nel caricamento dei modelli: {error}</p>
      </div>
    )
  }

  if (!configuration.structureTypeId) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Seleziona prima il tipo di struttura</h3>
        <p className="text-secondary">Torna allo step precedente per scegliere il tipo di struttura.</p>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Nessun modello disponibile</h3>
        <p className="text-secondary">
          Non ci sono modelli disponibili per il tipo di struttura selezionato.
        </p>
        <p className="text-sm text-secondary mt-2">
          Torna indietro e seleziona un altro tipo di struttura.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Scegli il modello di copertura</h2>
        <p className="text-secondary">
          Seleziona il design che meglio si adatta al tuo stile
        </p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="product-grid">
        {models.map((model) => {
          const imageUrl = getImageUrlOrPlaceholder(model.image)
          const description = getDescriptionOrFallback(model.description)
          
          return (
            <div
              key={model.id}
              className={`product-card ${selectedModel === model.id ? 'product-card-selected' : ''}`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="product-image-container">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={model.name}
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
                {selectedModel === model.id && (
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
                <h3 className="product-title">{model.name}</h3>
                <p className="product-description">{description}</p>

                {model.base_price > 0 && (
                  <div className="product-price-container">
                    <p className="text-sm text-secondary">Supplemento modello:</p>
                    <p className="product-price">+€{model.base_price.toFixed(2)}</p>
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
