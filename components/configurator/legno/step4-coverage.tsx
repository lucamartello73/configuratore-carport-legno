"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step4Props {
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

export function Step4Coverage({ configuration, updateConfiguration }: Step4Props) {
  const [selectedCoverage, setSelectedCoverage] = useState(configuration.coverageId || "")

  // Fetch dinamico da Supabase con filtro 'legno'
  const { data: coverageTypes, isLoading, error } = useConfiguratorData<CoverageType>({
    material: 'legno',
    table: 'coverage_types',
  })

  useEffect(() => {
    if (selectedCoverage) {
      updateConfiguration({ coverageId: selectedCoverage })
    }
  }, [selectedCoverage])

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
        <p className="text-gray-800 text-lg">Seleziona il tipo di copertura per la tua pergola</p>
        <p className="text-gray-600 text-sm mt-2">Scegli tra le diverse soluzioni disponibili</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverageTypes.map((coverage) => {
          const imageUrl = getImageUrlOrPlaceholder(coverage.image_url)
          const description = getDescriptionOrFallback(coverage.description)
          
          return (
            <Card
              key={coverage.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedCoverage === coverage.id
                  ? "ring-2 ring-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                  : "hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
              }`}
              onClick={() => setSelectedCoverage(coverage.id)}
            >
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={coverage.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          const placeholder = document.createElement('div')
                          placeholder.className = 'flex items-center justify-center w-full h-48 bg-gray-100'
                          parent.appendChild(placeholder)
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-100">
                      <ImageOff className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {selectedCoverage === coverage.id && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-2">
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">{coverage.name}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
                {coverage.price_modifier > 0 && (
                  <p className="text-sm text-green-700 font-semibold">
                    +€{coverage.price_modifier.toFixed(2)} al mq
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {coverageTypes.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessun tipo di copertura disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
