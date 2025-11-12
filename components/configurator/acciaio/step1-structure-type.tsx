"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"

interface Step1Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface StructureType {
  id: string
  name: string
  description: string
  image: string
  structure_category: string
  features: string[]
  is_active: boolean
  model_id?: string
}

export function Step1StructureType({ configuration, updateConfiguration }: Step1Props) {
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [selectedType, setSelectedType] = useState(configuration.structureType || "")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadStructureTypes = async () => {
      try {
        const supabase = createClient()
        const tableName = getTableName('acciaio', 'structure_types')

        let query = supabase.from(tableName).select("*").eq("is_active", true).order("name")

        // If a model is selected, filter structure types by model_id
        if (configuration.modelId) {
          query = query.eq("model_id", configuration.modelId)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error loading structure types:", error)
          return
        }

        console.log("[Acciaio] Loaded structure types from database:", data)
        console.log("[Acciaio] Filtered by model ID:", configuration.modelId)
        setStructureTypes(data || [])
      } catch (error) {
        console.error("Error loading structure types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStructureTypes()
  }, [configuration.modelId])

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
  }, [selectedType, structureTypes, updateConfiguration])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Seleziona il tipo di struttura in acciaio/alluminio</p>
        <p className="text-gray-600 text-sm mt-2">Scegli tra le diverse soluzioni metalliche disponibili</p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structureTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              selectedType === type.id
                ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                : "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100"
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-6">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={getImageUrl(type.image) || "/placeholder.svg"}
                  alt={type.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = getFallbackImageUrl("structure")
                  }}
                />
                {selectedType === type.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">{type.name}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{type.description}</p>

              {type.features && type.features.length > 0 && (
                <div className="space-y-2">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-800">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {structureTypes.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessun tipo di struttura disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
