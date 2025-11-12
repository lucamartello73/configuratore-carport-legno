"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import { getTableName } from "@/lib/supabase/tables"
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
  image: string
}

export function Step4Coverage({ configuration, updateConfiguration }: Step4Props) {
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [selectedCoverage, setSelectedCoverage] = useState(configuration.coverageId || "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoverageTypes = async () => {
      const supabase = createClient()
      const tableName = getTableName('legno', 'coverage_types')

      console.log("[Legno] Fetching coverage types from:", tableName)

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("name")

      if (error) {
        console.error("Error fetching coverage types:", error)
      } else {
        console.log("[Legno] Loaded coverage types:", data)
        setCoverageTypes(data || [])
      }
      setLoading(false)
    }

    fetchCoverageTypes()
  }, [])

  useEffect(() => {
    if (selectedCoverage) {
      updateConfiguration({ coverageId: selectedCoverage })
    }
  }, [selectedCoverage])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
        {coverageTypes.map((coverage) => (
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
                <img
                  src={getImageUrl(coverage.image) || "/placeholder.svg"}
                  alt={coverage.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = getFallbackImageUrl("coverage")
                  }}
                />
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
              <p className="text-gray-700 mb-4 leading-relaxed">{coverage.description}</p>
              {coverage.price_modifier > 0 && (
                <p className="text-sm text-green-700 font-semibold">
                  +€{coverage.price_modifier.toFixed(2)} al mq
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {coverageTypes.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessun tipo di copertura disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
