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

      if (configuration.structureTypeId) {
        console.log("[v0] Fetching coverage types for structure type:", configuration.structureTypeId)

        // Get coverage types linked to the selected structure type
        const tableName = getTableName('acciaio', 'coverage_types')
        const { data, error } = await supabase
          .from(tableName)
          .select(`
            *,
            carport_coverage_structure_types!inner(
              structure_type_id
            )
          `)
          .eq("carport_coverage_structure_types.structure_type_id", configuration.structureTypeId)
          .order("name")

        if (error) {
          console.error("Error fetching filtered coverage types:", error)
          // Fallback to all coverage types if filtering fails
          const tableName = getTableName('acciaio', 'coverage_types')
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(tableName)
            .select("*")
            .order("name")

          if (fallbackError) {
            console.error("Error fetching fallback coverage types:", fallbackError)
          } else {
            setCoverageTypes(fallbackData || [])
          }
        } else {
          console.log("[v0] Loaded filtered coverage types:", data)
          setCoverageTypes(data || [])
        }
      } else {
        // If no structure type selected, show all coverage types
        console.log("[v0] No structure type selected, showing all coverage types")
        const { data, error } = await supabase.from("carport_coverage_types").select("*").order("name")

        if (error) {
          console.error("Error fetching coverage types:", error)
        } else {
          setCoverageTypes(data || [])
        }
      }

      setLoading(false)
    }

    fetchCoverageTypes()
  }, [configuration.structureTypeId]) // Re-fetch when structure type changes

  useEffect(() => {
    if (selectedCoverage) {
      updateConfiguration({ coverageId: selectedCoverage })
    }
  }, [selectedCoverage, updateConfiguration])

  useEffect(() => {
    if (selectedCoverage && coverageTypes.length > 0) {
      const isSelectedCoverageAvailable = coverageTypes.some((ct) => ct.id === selectedCoverage)
      if (!isSelectedCoverageAvailable) {
        console.log("[v0] Selected coverage not available for current structure type, resetting")
        setSelectedCoverage("")
        updateConfiguration({ coverageId: "" })
      }
    }
  }, [coverageTypes, selectedCoverage, updateConfiguration])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Caricamento tipi di copertura...</div>
  }

  if (coverageTypes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Nessun tipo di copertura disponibile per il tipo di struttura selezionato.</p>
        <p className="text-sm mt-2">Contatta l'amministratore per configurare i collegamenti.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-800 text-center">
        Seleziona il tipo di copertura per il tuo carport
        {configuration.structureType && (
          <span className="block text-sm text-gray-600 mt-1">Compatibile con: {configuration.structureType}</span>
        )}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverageTypes.map((coverage) => (
          <Card
            key={coverage.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCoverage === coverage.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-green-50"
            }`}
            onClick={() => setSelectedCoverage(coverage.id)}
          >
            <CardContent className="p-6">
              <img
                src={getImageUrl(coverage.image) || "/placeholder.svg"}
                alt={coverage.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = getFallbackImageUrl("coverage")
                }}
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{coverage.name}</h3>
              <p className="text-gray-700 mb-3">{coverage.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
