"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import { getTableName } from "@/lib/supabase/tables"
import type { ConfigurationData } from "@/types/configuration"

interface Step6Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Accessory {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category?: string
}

export function Step6Accessories({ configuration, updateConfiguration }: Step6Props) {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccessories = async () => {
      const supabase = createClient()
      const tableName = getTableName('legno', 'accessories')

      console.log("[Legno] Fetching accessories from:", tableName)

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("name")

      if (error) {
        console.error("Error fetching accessories:", error)
      } else {
        console.log("[Legno] Loaded accessories:", data)
        setAccessories(data || [])
      }
      setLoading(false)
    }

    fetchAccessories()
  }, [])

  useEffect(() => {
    updateConfiguration({
      accessories: selectedAccessories,
    })
  }, [selectedAccessories, updateConfiguration])

  const toggleAccessory = (accessoryId: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accessoryId) ? prev.filter((id) => id !== accessoryId) : [...prev, accessoryId],
    )
  }

  const getTotalAccessoriesPrice = () => {
    return accessories
      .filter((acc) => selectedAccessories.includes(acc.id))
      .reduce((sum, acc) => sum + acc.price, 0)
  }

  const groupedAccessories = accessories.reduce(
    (acc, accessory) => {
      const category = accessory.category || "generale"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(accessory)
      return acc
    },
    {} as Record<string, Accessory[]>,
  )

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      illuminazione: "💡 Illuminazione",
      protezione: "🛡️ Protezione",
      comfort: "🌟 Comfort",
      decorazione: "🎨 Decorazione",
      generale: "🔧 Accessori Generali",
    }
    return titles[category] || category
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
        <p className="text-gray-800 text-lg">Aggiungi accessori alla tua pergola (opzionale)</p>
        <p className="text-gray-600 text-sm mt-2">Seleziona uno o più accessori per personalizzare la tua struttura</p>
      </div>

      {selectedAccessories.length > 0 && (
        <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-semibold">
                ✓ {selectedAccessories.length} accessori{" "}
                {selectedAccessories.length === 1 ? "selezionato" : "selezionati"}
              </p>
              <p className="text-green-700 text-sm mt-1">
                Totale accessori: €{getTotalAccessoriesPrice().toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => setSelectedAccessories([])}
              className="text-green-700 hover:text-green-900 text-sm underline"
            >
              Rimuovi tutti
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedAccessories).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{getCategoryTitle(category)}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((accessory) => {
                const isSelected = selectedAccessories.includes(accessory.id)
                return (
                  <Card
                    key={accessory.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      isSelected
                        ? "ring-2 ring-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                        : "hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
                    }`}
                    onClick={() => toggleAccessory(accessory.id)}
                  >
                    <CardContent className="p-6">
                      {accessory.image && (
                        <div className="relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={getImageUrl(accessory.image) || "/placeholder.svg"}
                            alt={accessory.name}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = getFallbackImageUrl("accessory")
                            }}
                          />
                          {isSelected && (
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
                      )}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={accessory.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleAccessory(accessory.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={accessory.id}
                            className="text-base font-bold text-gray-900 cursor-pointer"
                          >
                            {accessory.name}
                          </Label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">{accessory.description}</p>
                          <p className="text-lg font-semibold text-green-700 mt-2">€{accessory.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {accessories.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessun accessorio disponibile al momento.</p>
          <p className="text-sm mt-2">Puoi continuare senza selezionare accessori.</p>
        </div>
      )}

      {accessories.length > 0 && selectedAccessories.length === 0 && (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
          <p className="text-sm">
            💡 Gli accessori sono opzionali. Puoi continuare senza selezionarne o scegliere quelli che preferisci.
          </p>
        </div>
      )}
    </div>
  )
}
