"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageOff } from "lucide-react"
import { useConfiguratorData, getImageUrlOrPlaceholder, getDescriptionOrFallback } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step6Props {
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

export function Step6Surface({ configuration, updateConfiguration }: Step6Props) {
  const [selectedSurface, setSelectedSurface] = useState(configuration.surfaceId || "")

  const surfaceArea =
    configuration.width && configuration.depth ? (configuration.width * configuration.depth) / 10000 : 0

  // Fetch dinamico da Supabase con filtro 'legno'
  const { data: surfaces, isLoading, error } = useConfiguratorData<Surface>({
    material: 'legno',
    table: 'surfaces',
  })

  useEffect(() => {
    if (selectedSurface) {
      updateConfiguration({ surfaceId: selectedSurface })
    }
  }, [selectedSurface])

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
        <p className="text-gray-600">Nessuna superficie disponibile al momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Scegli il tipo di superficie per la tua struttura in legno</p>
        {surfaceArea > 0 && (
          <p className="text-green-700 font-semibold mt-2 text-xl">
            Superficie da coprire: {surfaceArea.toFixed(1)} m²
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surfaces.map((surface) => {
          const imageUrl = getImageUrlOrPlaceholder(surface.image_url)
          const description = getDescriptionOrFallback(surface.description)
          const totalPrice = surface.price_per_sqm * surfaceArea

          return (
            <Card
              key={surface.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSurface === surface.id 
                  ? "ring-2 ring-green-600 bg-green-50 shadow-xl" 
                  : "hover:bg-green-50 hover:border-green-300"
              }`}
              onClick={() => setSelectedSurface(surface.id)}
            >
              <CardContent className="p-6">
                {surface.image_url && (
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={surface.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            const placeholder = document.createElement('div')
                            placeholder.className = 'flex items-center justify-center w-full h-40 bg-gray-100'
                            parent.appendChild(placeholder)
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-40 bg-gray-100">
                        <ImageOff className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{surface.name}</h3>
                <p className="text-gray-700 mb-3 text-sm">{description}</p>
                
                {surfaceArea > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">€{surface.price_per_sqm}/m²</span>
                      <span className="text-lg font-bold text-green-700">
                        €{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
