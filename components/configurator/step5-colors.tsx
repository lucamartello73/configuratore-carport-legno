"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/app/configuratore/page"

interface Step5Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Color {
  id: string
  name: string
  hex_value: string
  category: string
  price_modifier: number
}

export function Step5Colors({ configuration, updateConfiguration }: Step5Props) {
  const [colors, setColors] = useState<Color[]>([])
  const [selectedStructureColor, setSelectedStructureColor] = useState(configuration.structureColorId || "")
  const [selectedCoverageColor, setSelectedCoverageColor] = useState(configuration.coverageColorId || "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchColors = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("carport_colors").select("*").order("category, name")

      if (error) {
        console.error("Error fetching colors:", error)
      } else {
        console.log("[v0] All colors loaded:", data)
        setColors(data || [])
      }
      setLoading(false)
    }

    fetchColors()
  }, [])

  useEffect(() => {
    if (colors.length > 0 && !selectedCoverageColor) {
      const coverageColors = colors.filter((color) => color.category === "coverage")
      if (coverageColors.length > 0) {
        console.log("[v0] Auto-selecting default coverage color:", coverageColors[0].name)
        setSelectedCoverageColor(coverageColors[0].id)
      }
    }
  }, [colors, selectedCoverageColor])

  useEffect(() => {
    console.log("[v0] Color selection update:", {
      selectedStructureColor,
      selectedCoverageColor,
      structureColorId: selectedStructureColor || undefined,
      coverageColorId: selectedCoverageColor || undefined,
    })

    updateConfiguration({
      structureColorId: selectedStructureColor || undefined,
      coverageColorId: selectedCoverageColor || undefined,
    })
  }, [selectedStructureColor, selectedCoverageColor, updateConfiguration])

  const structureColors = colors.filter((color) => color.category === "structure")
  const coverageColors = colors.filter((color) => color.category === "coverage")

  console.log(
    "[v0] Structure colors:",
    structureColors.length,
    structureColors.map((c) => c.name),
  )
  console.log(
    "[v0] Coverage colors:",
    coverageColors.length,
    coverageColors.map((c) => c.name),
  )

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Caricamento colori...</div>
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-800 text-center">Seleziona i colori per struttura e copertura</p>

      {/* Structure Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Colore Struttura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {structureColors.map((color) => (
              <div
                key={color.id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  selectedStructureColor === color.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setSelectedStructureColor(color.id)}
              >
                <div className="w-full h-16 rounded-lg mb-2 border" style={{ backgroundColor: color.hex_value }} />
                <p className="text-sm font-medium text-gray-900">{color.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coverage Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Colore Copertura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {coverageColors.map((color) => (
              <div
                key={color.id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  selectedCoverageColor === color.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => {
                  console.log("[v0] Coverage color selected:", color.id, color.name)
                  setSelectedCoverageColor(color.id)
                }}
              >
                <div className="w-full h-16 rounded-lg mb-2 border" style={{ backgroundColor: color.hex_value }} />
                <p className="text-sm font-medium text-gray-900">{color.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
