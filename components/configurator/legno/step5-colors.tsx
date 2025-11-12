"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase/client"
import { getImageUrl, getFallbackImageUrl } from "@/lib/utils/image-utils"
import type { ConfigurationData } from "@/types/configuration"

interface Step5Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Color {
  id: string
  name: string
  code: string
  hex_color: string
  price_modifier: number
  category: string
  image: string
  is_active: boolean
}

export function Step5Colors({ configuration, updateConfiguration }: Step5Props) {
  const [colors, setColors] = useState<Color[]>([])
  const [selectedColor, setSelectedColor] = useState(configuration.colorId || "")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadColors = async () => {
      try {
        const supabase = createClient()
        const tableName = 'carport_legno_colors'

        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("is_active", true)
          .order("category")
          .order("name")

        if (error) {
          console.error("Error loading colors:", error)
          return
        }

        console.log("[Legno] Loaded colors from database:", data)
        setColors(data || [])
      } catch (error) {
        console.error("Error loading colors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadColors()
  }, [])

  useEffect(() => {
    if (selectedColor) {
      setIsUpdating(true)
      setTimeout(() => {
        const selectedColorData = colors.find((color) => color.id === selectedColor)
        updateConfiguration({
          colorId: selectedColor,
          colorName: selectedColorData?.name || selectedColor,
        })
        setIsUpdating(false)
      }, 300)
    }
  }, [selectedColor, colors, updateConfiguration])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Raggruppa colori per categoria
  const impregnanti_legno = colors.filter(c => c.category === 'impregnanti_legno')
  const impregnanti_pastello = colors.filter(c => c.category === 'impregnanti_pastello')

  const renderColorSection = (title: string, colorsList: Color[], icon: string) => {
    if (colorsList.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({colorsList.length} opzioni)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colorsList.map((color) => (
            <Card
              key={color.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                selectedColor === color.id
                  ? "ring-2 ring-[#008f4c] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                  : "hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100"
              }`}
              onClick={() => setSelectedColor(color.id)}
            >
              <CardContent className="p-4">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  {color.image ? (
                    <img
                      src={getImageUrl(color.image) || "/placeholder.svg"}
                      alt={color.name}
                      className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        // Fallback to hex color
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.style.backgroundColor = color.hex_color || '#cccccc'
                        }
                      }}
                    />
                  ) : (
                    <div 
                      className="w-full h-24 rounded transition-transform duration-300 hover:scale-105"
                      style={{ backgroundColor: color.hex_color || '#cccccc' }}
                    />
                  )}
                  
                  {selectedColor === color.id && (
                    <div className="absolute top-1 right-1 bg-[#008f4c] text-white rounded-full p-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <h4 className="font-semibold text-gray-900 text-sm mb-1">{color.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{color.code}</p>

                {color.price_modifier > 0 && (
                  <p className="text-xs font-bold text-[#008f4c]">
                    +€{color.price_modifier.toFixed(2)}
                  </p>
                )}
                {color.price_modifier === 0 && (
                  <p className="text-xs text-gray-500">Incluso</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Scegli la finitura del legno</p>
        <p className="text-gray-600 text-sm mt-2">
          Seleziona tra impregnanti naturali o tinte pastello
        </p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Impregnanti Legno */}
      {renderColorSection("Impregnanti Legno", impregnanti_legno, "🌲")}

      {/* Separatore */}
      {impregnanti_legno.length > 0 && impregnanti_pastello.length > 0 && (
        <div className="my-8 border-t border-gray-300" />
      )}

      {/* Impregnanti Pastello */}
      {renderColorSection("Impregnanti Pastello", impregnanti_pastello, "🎨")}

      {colors.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun colore disponibile</h3>
          <p className="text-gray-600">
            Non ci sono colori configurati nel sistema.
          </p>
        </div>
      )}
    </div>
  )
}
