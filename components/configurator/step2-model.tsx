"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/app/configuratore/page"

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
}

export function Step2Model({ configuration, updateConfiguration }: Step2Props) {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState(configuration.modelId || "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("carport_models").select("*").order("name")

      if (error) {
        console.error("Error fetching models:", error)
      } else {
        setModels(data || [])
      }
      setLoading(false)
    }

    fetchModels()
  }, [])

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

  return (
    <div className="space-y-6">
      <p className="text-green-700 text-center">Scegli il modello del tuo carport</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-green-50"
            }`}
            onClick={() => handleModelSelect(model.id)}
          >
            <CardContent className="p-6">
              <img
                src={model.image || "/placeholder.svg?height=200&width=300&query=carport model"}
                alt={model.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=300"
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
