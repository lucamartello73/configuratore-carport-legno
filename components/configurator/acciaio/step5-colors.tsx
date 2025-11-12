"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"

interface Step5Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Color {
  id: string
  name: string
  hex_value: string
  price_modifier: number
  macro_category: string
  is_custom_choice: boolean
  display_order: number
}

export function Step5Colors({ configuration, updateConfiguration }: Step5Props) {
  const [selectedStructureColor, setSelectedStructureColor] = useState(configuration.structureColor || "")
  const [customColor, setCustomColor] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchColorsForModel() // Changed from fetchColorsForStructureType to fetchColorsForModel
  }, [configuration.modelId]) // Changed dependency from structureType to modelId

  useEffect(() => {
    updateConfiguration({
      structureColor: selectedStructureColor || undefined,
    })
  }, [selectedStructureColor, updateConfiguration])

  const fetchColorsForModel = async () => {
    // Renamed function and updated logic to use model instead of structure type
    if (!configuration.modelId) {
      console.log("[v0] No model selected, showing all colors")
      setLoading(false)
      return
    }

    try {
      console.log("[v0] Fetching colors for model ID:", configuration.modelId)
      const supabase = createClient()

      // Get all colors from database
      const tableName = getTableName('acciaio', 'colors')
      const { data: colorsData, error: colorsError } = await supabase.from(tableName).select("*").order("name")

      if (colorsError) {
        console.error("[v0] Error fetching colors:", colorsError)
        throw colorsError
      }

      console.log("[v0] All colors fetched:", colorsData)

      // Transform colors to include macro_category mapping
      const transformedColors: Color[] = (colorsData || []).map((color, index) => ({
        id: color.id,
        name: color.name,
        hex_value: color.hex_value,
        price_modifier: color.price_modifier || 0,
        macro_category:
          color.category === "smalti_ral"
            ? "COLORI_RAL"
            : color.category === "impregnanti_legno"
              ? "IMPREGNANTI_LEGNO"
              : color.category === "impregnanti_pastello"
                ? "IMPREGNANTI_PASTELLO"
                : color.category === "structure"
                  ? "COLORI_RAL"
                  : color.category === "coverage"
                    ? "IMPREGNANTI_LEGNO"
                    : "COLORI_RAL", // fallback
        is_custom_choice:
          color.name?.toLowerCase().includes("scelta") || color.name?.toLowerCase().includes("personalizzat") || false,
        display_order: color.display_order || index,
      }))

      // For now, show all colors regardless of model
      // TODO: Implement proper filtering based on model-macrocategory links from admin
      console.log("[v0] Transformed colors:", transformedColors)
      setAvailableColors(transformedColors)
    } catch (error) {
      console.error("Error fetching colors:", error)
      setAvailableColors([])
    }
    setLoading(false)
  }

  const getMacroCategoryTitle = (macroCategory: string) => {
    switch (macroCategory) {
      case "COLORI_RAL":
        return "COLORI RAL 5+1"
      case "IMPREGNANTI_LEGNO":
        return "IMPREGNANTI LEGNO 5+1"
      case "IMPREGNANTI_PASTELLO":
        return "IMPREGNANTI PASTELLO 5+1"
      default:
        return "Colori Struttura"
    }
  }

  const groupedColors = availableColors.reduce(
    (acc, color) => {
      const macroCategory = color.macro_category || "SENZA_CATEGORIA"
      if (!acc[macroCategory]) acc[macroCategory] = []
      acc[macroCategory].push(color)
      return acc
    },
    {} as Record<string, Color[]>,
  )

  const handleCustomColorSubmit = () => {
    if (customColor.trim()) {
      setSelectedStructureColor(`custom-${customColor}`)
      setShowCustomInput(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Caricamento colori disponibili...</p>
      </div>
    )
  }

  if (!configuration.modelId) {
    // Changed condition from structureType to modelId
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Seleziona prima il modello per vedere i colori disponibili.</p>{" "}
        {/* Updated message */}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Seleziona il colore per la struttura</p>
        <p className="text-gray-600 text-sm mt-2">Colori disponibili per il modello selezionato</p>{" "}
        {/* Updated message */}
      </div>

      {Object.entries(groupedColors).map(([macroCategory, colors]) => (
        <Card key={macroCategory}>
          <CardHeader>
            <CardTitle className="text-gray-900">{getMacroCategoryTitle(macroCategory)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colors
                .filter((color) => !color.is_custom_choice)
                .map((color) => (
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
                    <p className="text-sm font-medium text-gray-900 text-center mb-1">{color.name}</p>
                  </div>
                ))}
            </div>

            {colors.some((color) => color.is_custom_choice) && (
              <div className="border-t pt-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {colors.find((color) => color.is_custom_choice)?.name || "Scelta Personalizzata"}
                </h4>
                {!showCustomInput ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomInput(true)}
                    className="border-dashed border-2 border-gray-300 hover:border-green-400 text-gray-600 hover:text-green-700"
                  >
                    + Scegli colore personalizzato
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Inserisci il codice o nome del colore desiderato"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleCustomColorSubmit} className="bg-green-600 hover:bg-green-700">
                      Conferma
                    </Button>
                    <Button variant="outline" onClick={() => setShowCustomInput(false)}>
                      Annulla
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {availableColors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Nessun colore disponibile per il modello selezionato.</p>{" "}
            {/* Updated message */}
            <p className="text-sm text-gray-500 mt-2">
              Contatta l'amministratore per configurare i colori per questo modello. {/* Updated message */}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
