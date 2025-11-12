"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"

interface Step2Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Model {
  id: string
  name: string
  description: string
  image: string
  base_price: number
  structure_type_id: string
  is_active: boolean
}

export function Step2Model({ configuration, updateConfiguration }: Step2Props) {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState(configuration.modelId || "")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      if (!configuration.structureTypeId) {
        console.warn("[Legno] Nessun tipo struttura selezionato")
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const tableName = 'carport_legno_models'

        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("is_active", true)
          .eq("structure_type_id", configuration.structureTypeId)
          .order("name")

        if (error) {
          console.error("Error loading models:", error)
          return
        }

        console.log("[Legno] Loaded models from database:", data)
        setModels(data || [])
      } catch (error) {
        console.error("Error loading models:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [configuration.structureTypeId])

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
      }, 300)
    }
  }, [selectedModel, models, updateConfiguration])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun modello disponibile</h3>
        <p className="text-gray-600">
          Non ci sono modelli disponibili per il tipo di struttura selezionato.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Torna indietro e seleziona un altro tipo di struttura.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Scegli il modello di copertura</p>
        <p className="text-gray-600 text-sm mt-2">
          Seleziona il design che meglio si adatta al tuo stile
        </p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              selectedModel === model.id
                ? "ring-2 ring-[#008f4c] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                : "hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardContent className="p-6">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={getImageUrl(model.image) || "/placeholder.svg"}
                  alt={model.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = getFallbackImageUrl("model")
                  }}
                />
                {selectedModel === model.id && (
                  <div className="absolute top-2 right-2 bg-[#008f4c] text-white rounded-full p-2">
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

              <h3 className="text-xl font-bold text-gray-900 mb-3">{model.name}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{model.description}</p>

              {model.base_price > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Supplemento modello:</p>
                  <p className="text-lg font-bold text-[#008f4c]">
                    +€{model.base_price.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
