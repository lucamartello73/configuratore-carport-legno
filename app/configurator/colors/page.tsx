"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Palette } from "lucide-react"
import { getColors, type ColorType } from "@/lib/database"
import { getStoredColor, setStoredColor, type ColorData } from "@/lib/localStorage"

export default function ColorsPage() {
  const [colors, setColors] = useState<ColorType[]>([])
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null)
  const [customColor, setCustomColor] = useState("")
  const [activeCategory, setActiveCategory] = useState<"smalto" | "impregnante-legno" | "impregnante-pastello">(
    "smalto",
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load stored selection
    const stored = getStoredColor()
    if (stored) {
      setSelectedColor(stored)
      if (stored.isCustom) {
        setCustomColor(stored.name)
      }
    }

    // Load colors
    async function loadData() {
      try {
        const colorData = await getColors()
        setColors(colorData)
      } catch (error) {
        console.error("Error loading colors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleColorSelection = (color: ColorType) => {
    const colorData: ColorData = {
      category: color.category,
      name: color.name,
      value: color.hex_value,
      isCustom: false,
    }
    setSelectedColor(colorData)
    setStoredColor(colorData)
    setCustomColor("")
  }

  const handleCustomColor = () => {
    if (customColor.trim()) {
      const colorData: ColorData = {
        category: activeCategory,
        name: customColor.trim(),
        value: "#CCCCCC", // Default hex for custom colors
        isCustom: true,
      }
      setSelectedColor(colorData)
      setStoredColor(colorData)
    }
  }

  const categories = [
    { key: "smalto" as const, label: "Smalto", description: "Finitura opaca resistente" },
    { key: "impregnante-legno" as const, label: "Impregnante Legno", description: "Effetto naturale del legno" },
    { key: "impregnante-pastello" as const, label: "Impregnante Pastello", description: "Colori delicati e moderni" },
  ]

  const getColorsByCategory = (category: string) => {
    return colors.filter((color) => color.category === category)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Caricamento colori...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="configurator-bg">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Scegli il Colore</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Seleziona la finitura e il colore per la tua pergola
            </p>
          </div>

          {/* Category Tabs */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={activeCategory === category.key ? "default" : "outline"}
                  className={
                    activeCategory === category.key
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                  onClick={() => setActiveCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {categories.find((c) => c.key === activeCategory)?.label}
              </h3>
              <p className="text-gray-600">{categories.find((c) => c.key === activeCategory)?.description}</p>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {getColorsByCategory(activeCategory).map((color) => (
                <div
                  key={color.id}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    selectedColor?.name === color.name && selectedColor?.category === color.category
                      ? "border-amber-500 ring-4 ring-amber-500/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleColorSelection(color)}
                >
                  <div
                    className="w-full h-20 rounded-t-lg"
                    style={{
                      backgroundColor: color.hex_value,
                      backgroundImage:
                        activeCategory === "impregnante-legno"
                          ? "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)"
                          : undefined,
                    }}
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{color.name}</p>
                    <p className="text-xs text-gray-500">{color.hex_value}</p>
                  </div>
                  {selectedColor?.name === color.name && selectedColor?.category === color.category && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Color */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Colore Personalizzato
              </h4>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="custom-color" className="text-gray-900">
                    Descrivi il colore desiderato
                  </Label>
                  <Input
                    id="custom-color"
                    placeholder="es. Verde militare opaco, Blu petrolio..."
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleCustomColor}
                    disabled={!customColor.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Seleziona
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Color Preview */}
          {selectedColor && (
            <div className="glass-card rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Colore Selezionato</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-200"
                  style={{
                    backgroundColor: selectedColor.isCustom ? "#CCCCCC" : selectedColor.value,
                    backgroundImage:
                      selectedColor.category === "impregnante-legno"
                        ? "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)"
                        : undefined,
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{selectedColor.name}</p>
                  <p className="text-gray-600 capitalize">{selectedColor.category.replace("-", " ")}</p>
                  {selectedColor.isCustom && (
                    <p className="text-sm text-amber-600">
                      Colore personalizzato - sarà confermato in fase di preventivo
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <Navigation
            currentStep={3}
            totalSteps={9}
            prevHref="/configurator/dimensions"
            nextHref={selectedColor ? "/configurator/coverage" : undefined}
            nextDisabled={!selectedColor}
          />
        </div>
      </main>
    </div>
  )
}
