"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/app/configuratore/page"

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
      const { data, error } = await supabase.from("carport_coverage_types").select("*").order("name")

      if (error) {
        console.error("Error fetching coverage types:", error)
      } else {
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
  }, [selectedCoverage, updateConfiguration])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Caricamento tipi di copertura...</div>
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-800 text-center">Seleziona il tipo di copertura per il tuo carport</p>

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
                src={coverage.image || "/placeholder.svg?height=200&width=300&query=carport coverage type"}
                alt={coverage.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
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
