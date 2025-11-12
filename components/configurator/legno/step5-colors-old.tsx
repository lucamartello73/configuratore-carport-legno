"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"

interface Step4Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Color {
  id: string
  name: string
  hex_value: string
  price_modifier: number
  category: string
  is_custom_choice: boolean
  display_order: number
}

export function Step4Colors({ configuration, updateConfiguration }: Step4Props) {
  const [selectedStructureColor, setSelectedStructureColor] = useState(configuration.structureColor || "")
  const [customColor, setCustomColor] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWoodColors()
  }, [])

  useEffect(() => {
    updateConfiguration({
      structureColor: selectedStructureColor || undefined,
    })
  }, [selectedStructureColor, updateConfiguration])

  const fetchWoodColors = async () => {
    try {
      const supabase = createClient()
      const tableName = getTableName('legno', 'colors')

      console.log("[Legno] Fetching wood colors from:", tableName)

      const { data: colorsData, error: colorsError } = await supabase
        .from(tableName)
        .select("*")
        .order("display_order")

      if (colorsError) {
        console.error("[Legno] Error fetching colors:", colorsError)
        throw colorsError
      }

      console.log("[Legno] Loaded wood colors:", colorsData)

      const transformedColors: Color[] = (colorsData || []).map((color, index) => ({
        id: color.id,
        name: color.name,
        hex_value: color.hex_value,
        price_modifier: color.price_modifier || 0,
        category: color.category || "tinte_legno",
        is_custom_choice:
          color.name?.toLowerCase().includes("scelta") || 
          color.name?.toLowerCase().includes("personalizzat") || 
          false,
        display_order: color.display_order || index,
      }))

      setAvailableColors(transformedColors)
    } catch (error) {
      console.error("Error fetching wood colors:", error)
      setAvailableColors([])
    }
    setLoading(false)
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "tinte_legno":
        return "Tinte per Legno"
      case "impregnanti":
        return "Impregnanti"
      case "naturale":
        return "Finitura Naturale"
      default:
        return "Colori Disponibili"
    }
  }

  const groupedColors = availableColors.reduce(
    (acc, color) => {
      const category = color.category || "tinte_legno"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(color)
      return acc
    },
    {} as Record<string, Color[]>,
  )

  const handleColorSelect = (colorName: string, isCustomChoice: boolean) => {
    if (isCustomChoice) {
      setShowCustomInput(true)
      setSelectedStructureColor("")
    } else {
      setSelectedStructureColor(colorName)
      setShowCustomInput(false)
      setCustomColor("")
    }
  }

  const handleCustomColorSubmit = () => {
    if (customColor.trim()) {
      setSelectedStructureColor(customColor.trim())
      setShowCustomInput(false)
    }
  }

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
        <p className="text-gray-800 text-lg">Seleziona la tinta per la struttura in legno</p>
        <p className="text-gray-600 text-sm mt-2">Scegli tra le tinte naturali disponibili</p>
      </div>

      {showCustomInput && (
        <Card className="bg-green-50 border-green-300">
          <CardHeader>
            <CardTitle className="text-green-800">Inserisci Tinta Personalizzata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Es: Noce Scuro, Teak, Mogano..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="border-green-300"
            />
            <div className="flex gap-2">
              <Button onClick={handleCustomColorSubmit} className="bg-green-600 hover:bg-green-700">
                Conferma Tinta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomColor("")
                }}
              >
                Annulla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStructureColor && !showCustomInput && (
        <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4">
          <p className="text-green-800 font-semibold">
            ✓ Tinta selezionata: <span className="text-green-900">{selectedStructureColor}</span>
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedColors).map(([category, colors]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{getCategoryTitle(category)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color.name, color.is_custom_choice)}
                  className={`group relative rounded-lg border-2 transition-all duration-200 ${
                    selectedStructureColor === color.name
                      ? "border-green-600 ring-2 ring-green-600 shadow-lg"
                      : "border-gray-300 hover:border-green-500"
                  }`}
                >
                  <div className="aspect-square p-4 flex flex-col items-center justify-center">
                    {color.is_custom_choice ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 rounded">
                        <span className="text-3xl">✏️</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full rounded shadow-inner"
                        style={{ backgroundColor: color.hex_value }}
                      />
                    )}
                  </div>
                  <div className="p-2 bg-white border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-900 text-center truncate">{color.name}</p>
                    {color.price_modifier > 0 && (
                      <p className="text-xs text-green-700 text-center">+€{color.price_modifier.toFixed(2)}</p>
                    )}
                  </div>
                  {selectedStructureColor === color.name && (
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {availableColors.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessuna tinta disponibile al momento.</p>
        </div>
      )}
    </div>
  )
}
