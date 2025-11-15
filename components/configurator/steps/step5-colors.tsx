"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useConfiguratorData, getImageUrlOrPlaceholder } from "@/lib/supabase/fetchConfiguratorData"
import type { ConfigurationData } from "@/types/configuration"

interface Step5Props {
  onAutoAdvance?: () => void

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
  attivo: boolean
}

export function Step5Colors({ configuration, updateConfiguration, onAutoAdvance }: Step5Props) {
  const [selectedColor, setSelectedColor] = useState(configuration.colorId || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: colors, isLoading, error } = useConfiguratorData<Color>({
    material: 'legno',
    table: 'colors',
  })

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
        
        // Auto-avanzamento dopo selezione
        if (onAutoAdvance) {
          setTimeout(() => {
            onAutoAdvance()
          }, 800)
        }
      }, 300)
    }
  }, [selectedColor, colors, updateConfiguration, onAutoAdvance])

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
        <p>Errore nel caricamento dei colori: {error}</p>
      </div>
    )
  }

  const impregnanti_legno = colors.filter(c => c.category === 'impregnanti_legno')
  const impregnanti_pastello = colors.filter(c => c.category === 'impregnanti_pastello')

  const renderColorSection = (title: string, colorsList: Color[], icon: string) => {
    if (colorsList.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{icon}</div>
          <h3 className="text-2xl font-bold text-primary">{title}</h3>
          <span className="text-sm text-secondary">({colorsList.length} opzioni)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colorsList.map((color) => {
            const imageUrl = getImageUrlOrPlaceholder(color.image)
            
            return (
              <div
                key={color.id}
                className={`product-card cursor-pointer transition-all ${
                  selectedColor === color.id ? 'product-card-selected' : ''
                }`}
                onClick={() => setSelectedColor(color.id)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={color.name}
                      className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.style.backgroundColor = color.hex_color || '#cccccc'
                          parent.style.height = '6rem'
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
                    <div className="badge-selected">
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

                <h4 className="font-semibold text-primary text-sm mb-1">{color.name}</h4>
                <p className="text-xs text-secondary mb-2">{color.code}</p>

                {color.price_modifier > 0 && (
                  <p className="text-xs font-bold text-accent-pink">
                    +€{color.price_modifier.toFixed(2)}
                  </p>
                )}
                {color.price_modifier === 0 && (
                  <p className="text-xs text-secondary">Incluso</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Scegli la finitura del legno</h2>
        <p className="text-secondary">
          Seleziona tra impregnanti naturali o tinte pastello
        </p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {renderColorSection("Impregnanti Legno", impregnanti_legno, "🌲")}

      {impregnanti_legno.length > 0 && impregnanti_pastello.length > 0 && (
        <div className="my-8 border-t border-gray-300" />
      )}

      {renderColorSection("Impregnanti Pastello", impregnanti_pastello, "🎨")}

      {colors.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Nessun colore disponibile</h3>
          <p className="text-secondary">
            Non ci sono colori configurati nel sistema.
          </p>
        </div>
      )}
    </div>
  )
}
