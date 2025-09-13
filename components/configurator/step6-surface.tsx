"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/app/configuratore/page"

interface Step6Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Surface {
  id: string
  name: string
  description: string
  price_per_sqm: number
}

export function Step6Surface({ configuration, updateConfiguration }: Step6Props) {
  const [surfaces, setSurfaces] = useState<Surface[]>([])
  const [selectedSurface, setSelectedSurface] = useState(configuration.surfaceId || "")
  const [loading, setLoading] = useState(true)

  const surfaceArea =
    configuration.width && configuration.depth ? (configuration.width * configuration.depth) / 10000 : 0

  useEffect(() => {
    const fetchSurfaces = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("carport_surfaces").select("*").order("name")

      if (error) {
        console.error("Error fetching surfaces:", error)
      } else {
        setSurfaces(data || [])
      }
      setLoading(false)
    }

    fetchSurfaces()
  }, [])

  useEffect(() => {
    if (selectedSurface) {
      updateConfiguration({ surfaceId: selectedSurface })
    }
  }, [selectedSurface, updateConfiguration])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Caricamento superfici...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-800">Scegli il tipo di superficie per il tuo carport</p>
        {surfaceArea > 0 && <p className="text-gray-700 mt-2">Superficie da coprire: {surfaceArea.toFixed(1)} m²</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surfaces.map((surface) => {
          const totalPrice = surfaceArea * surface.price_per_sqm

          return (
            <Card
              key={surface.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSurface === surface.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-green-50"
              }`}
              onClick={() => setSelectedSurface(surface.id)}
            >
              <CardContent className="p-6">
                <img
                  src="/carport-surface-flooring.jpg"
                  alt={surface.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{surface.name}</h3>
                <p className="text-gray-700 mb-3">{surface.description}</p>
                <div className="space-y-2">
                  <Badge className="bg-green-500 text-white">€{surface.price_per_sqm}/m²</Badge>
                  {surfaceArea > 0 && (
                    <Badge className="bg-orange-500 text-white ml-2">Totale: €{totalPrice.toFixed(0)}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
