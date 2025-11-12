"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"
import Image from "next/image"

interface Step2Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Model {
  id: string
  name: string
  description: string
  base_price: number
  image: string
  structure_type_id?: string
}

export function Step2Model({ configuration, updateConfiguration }: Step2Props) {
  const [allModels, setAllModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState(configuration.modelId || "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      const supabase = createClient()
      const tableName = getTableName('acciaio', 'models')
      const { data, error } = await supabase.from(tableName).select("*").order("name")

      if (error) {
        console.error("Error fetching models:", error)
      } else {
        setAllModels(data || [])
      }
      setLoading(false)
    }

    fetchModels()
  }, [])

  useEffect(() => {
    if (!configuration.structureTypeId) {
      // If no structure type selected, show all models
      setFilteredModels(allModels)
    } else {
      // Filter models that match the selected structure type
      const filtered = allModels.filter((model) => model.structure_type_id === configuration.structureTypeId)
      setFilteredModels(filtered)

      // If current selected model is not compatible with new structure type, clear selection
      if (selectedModel && !filtered.find((model) => model.id === selectedModel)) {
        setSelectedModel("")
        updateConfiguration({ modelId: "" })
      }
    }
  }, [allModels, configuration.structureTypeId, selectedModel, updateConfiguration])

  const handleModelSelect = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId)
      updateConfiguration({ modelId })
    },
    [updateConfiguration],
  )

  if (loading) {
    return <div className="text-center py-8 text-green-600">Caricamento modelli...</div>
  }

  if (filteredModels.length === 0 && configuration.structureTypeId) {
    return (
      <div className="text-center py-8">
        <p className="text-orange-600 mb-4">Nessun modello disponibile per il tipo di struttura selezionato.</p>
        <p className="text-gray-600 text-sm">Torna al passo precedente per selezionare un altro tipo di struttura.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-green-700">Scegli il modello del tuo carport</p>
        {configuration.structureTypeId && (
          <p className="text-sm text-gray-600 mt-2">
            Modelli compatibili con il tipo di struttura selezionato ({filteredModels.length} disponibili)
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-green-50"
            }`}
            onClick={() => handleModelSelect(model.id)}
          >
            <CardContent className="p-6">
              <Image
                src={getImageUrl(model.image) || "/placeholder.svg"}
                alt={model.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = getFallbackImageUrl("model")
                }}
              />
              <h3 className="text-xl font-semibold text-green-800 mb-2">{model.name}</h3>
              <p className="text-green-600 mb-3">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
