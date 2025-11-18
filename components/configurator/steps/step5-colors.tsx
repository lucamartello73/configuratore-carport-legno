"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/types/configuration"
import { trackColorSelected, trackStepCompleted } from "@/lib/analytics/events"

interface Step5Props {
  onAutoAdvance?: () => void
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

interface Color {
  id: string
  name: string
  code: string | null
  hex_color: string | null
  price_modifier: number
  category: 'ral_standard' | 'ral_custom'
  image_url?: string | null
}

export function Step5Colors({ configuration, updateConfiguration, onAutoAdvance }: Step5Props) {
  const [selectedColor, setSelectedColor] = useState(configuration.colorId || "")
  const [customRal, setCustomRal] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [colors, setColors] = useState<Color[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch colori da Supabase
  useEffect(() => {
    const fetchColors = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('[Step5] Caricamento colori da carport_colors...')
        
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('carport_colors')
          .select('*')
          .order('price_modifier', { ascending: true })
          .order('name', { ascending: true })

        if (fetchError) {
          console.error('[Step5] ❌ Errore Supabase:', fetchError)
          throw new Error(`Errore caricamento colori: ${fetchError.message}`)
        }

        if (!data || data.length === 0) {
          console.warn('[Step5] ⚠️ Nessun colore trovato')
          setColors([])
          setError('Nessun colore disponibile. Contatta l\'amministratore.')
          return
        }

        console.log('[Step5] ✅ Caricati', data.length, 'colori')
        setColors(data)
        setError(null)
        
      } catch (err) {
        console.error('[Step5] ❌ Errore catch:', err)
        const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
        setError(errorMessage)
        setColors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchColors()
  }, [])

  // Aggiorna configurazione quando cambia selezione
  useEffect(() => {
    if (selectedColor && colors.length > 0) {
      setIsUpdating(true)
      
      const selectedColorData = colors.find((color) => color.id === selectedColor)
      
      if (selectedColorData) {
        console.log('[Step5] ✅ Colore selezionato:', selectedColorData.name)
        
        updateConfiguration({
          colorId: selectedColor,
          colorName: selectedColorData.name,
          colorPrice: selectedColorData.price_modifier || 0,
        })
        
        // Track selection
        trackColorSelected(selectedColor, selectedColorData.name)
        trackStepCompleted(5, 'Colori')
        
        setIsUpdating(false)
        
        // Auto-avanzamento
        if (onAutoAdvance) {
          setTimeout(() => {
            onAutoAdvance()
          }, 800)
        }
      } else {
        setIsUpdating(false)
      }
    }
  }, [selectedColor, colors, updateConfiguration, onAutoAdvance])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-secondary">Caricamento colori metallo RAL...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Errore Caricamento Colori
          </h3>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Ricarica Pagina
          </button>
        </div>
      </div>
    )
  }

  if (colors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-yellow-600 text-4xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Nessun Colore Disponibile
          </h3>
          <p className="text-sm text-yellow-700">
            I colori non sono configurati nel database.
          </p>
        </div>
      </div>
    )
  }

  const coloriStandard = colors.filter(c => c.category === 'ral_standard')
  const coloreRalPersonalizzato = colors.find(c => c.category === 'ral_custom')

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Scegli la finitura del metallo</h2>
        <p className="text-secondary">
          Seleziona un colore RAL standard o inserisci un codice personalizzato
        </p>
      </div>

      {isUpdating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* SEZIONE 1: Colori RAL Standard */}
      {coloriStandard.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🎨</div>
            <h3 className="text-2xl font-bold text-primary">Colori RAL Standard</h3>
            <span className="text-sm text-secondary">({coloriStandard.length} opzioni)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {coloriStandard.map((color) => {
              const hexColor = color.hex_color || '#CCCCCC'
              
              return (
                <div
                  key={color.id}
                  className={`product-card cursor-pointer transition-all ${
                    selectedColor === color.id ? 'product-card-selected' : ''
                  }`}
                  onClick={() => {
                    console.log('[Step5] Click su:', color.name)
                    setSelectedColor(color.id)
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    {color.image_url ? (
                      <img
                        src={color.image_url}
                        alt={color.name}
                        className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.style.backgroundColor = hexColor
                            parent.style.height = '6rem'
                          }
                        }}
                      />
                    ) : (
                      <div 
                        className="w-full h-24 rounded transition-transform duration-300 hover:scale-105 border-2 border-gray-200"
                        style={{ backgroundColor: hexColor }}
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
                  {color.code && (
                    <p className="text-xs text-secondary mb-2">{color.code}</p>
                  )}

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
      )}

      {/* SEZIONE 2: Codice RAL Personalizzato */}
      {coloreRalPersonalizzato && (
        <>
          <div className="my-8 border-t border-gray-300" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🔢</div>
              <h3 className="text-2xl font-bold text-primary">Codice RAL Personalizzato</h3>
            </div>

            <div 
              className={`product-card cursor-pointer transition-all ${
                selectedColor === coloreRalPersonalizzato.id ? 'product-card-selected' : ''
              }`}
              onClick={() => {
                console.log('[Step5] Click su RAL personalizzato')
                setSelectedColor(coloreRalPersonalizzato.id)
              }}
            >
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <div 
                    className="w-full h-24 rounded border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-xs text-gray-500">Anteprima RAL</p>
                    </div>
                  </div>
                  
                  {selectedColor === coloreRalPersonalizzato.id && (
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary">
                    Inserisci Codice RAL
                  </label>
                  <input
                    type="text"
                    placeholder="es. RAL 7016"
                    value={customRal}
                    onChange={(e) => setCustomRal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-secondary">
                    Specifica il codice RAL desiderato (es. RAL 7016, RAL 9005, ecc.)
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-semibold text-primary mb-1">Supplemento</p>
                  <p className="text-xs text-accent-pink font-bold">
                    +€{coloreRalPersonalizzato.price_modifier.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
