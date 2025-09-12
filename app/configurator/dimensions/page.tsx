"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car } from "lucide-react"
import { getStoredDimensions, setStoredDimensions, type DimensionsData } from "@/lib/localStorage"

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<DimensionsData>({
    carSpaces: 1,
    width: 300,
    depth: 500,
    height: 250,
    surface: 1.5,
  })

  useEffect(() => {
    // Load stored dimensions
    const stored = getStoredDimensions()
    if (stored) {
      setDimensions(stored)
    }
  }, [])

  useEffect(() => {
    // Calculate surface area
    const surface = (dimensions.width * dimensions.depth) / 10000 // Convert cm² to m²
    setDimensions((prev) => ({ ...prev, surface }))
  }, [dimensions.width, dimensions.depth])

  const handleCarSpaceChange = (spaces: number) => {
    let newWidth = 300
    let newDepth = 500

    switch (spaces) {
      case 1:
        newWidth = 300
        newDepth = 500
        break
      case 2:
        newWidth = 600
        newDepth = 500
        break
      case 3:
        newWidth = 900
        newDepth = 500
        break
      case 4:
        newWidth = 600
        newDepth = 1000
        break
      case 5:
        newWidth = 900
        newDepth = 1000
        break
    }

    const newDimensions = {
      ...dimensions,
      carSpaces: spaces,
      width: newWidth,
      depth: newDepth,
    }
    setDimensions(newDimensions)
    setStoredDimensions(newDimensions)
  }

  const handleDimensionChange = (field: keyof DimensionsData, value: number) => {
    const newDimensions = { ...dimensions, [field]: value }
    setDimensions(newDimensions)
    setStoredDimensions(newDimensions)
  }

  const isValid =
    dimensions.width >= 200 &&
    dimensions.width <= 2000 &&
    dimensions.depth >= 200 &&
    dimensions.depth <= 2000 &&
    dimensions.height >= 200 &&
    dimensions.height <= 400

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="configurator-bg">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Definisci le Dimensioni</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Scegli le dimensioni perfette per la tua pergola</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Car Spaces Selection */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Posti Auto</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3, 4, 5].map((spaces) => (
                  <Button
                    key={spaces}
                    variant={dimensions.carSpaces === spaces ? "default" : "outline"}
                    className={`h-20 flex flex-col items-center justify-center ${
                      dimensions.carSpaces === spaces
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleCarSpaceChange(spaces)}
                  >
                    <Car className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium">
                      {spaces} {spaces === 1 ? "Auto" : "Auto"}
                    </span>
                  </Button>
                ))}
              </div>

              <p className="text-gray-600 text-sm">
                Seleziona il numero di posti auto per ottenere dimensioni suggerite
              </p>
            </div>

            {/* Custom Dimensions */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dimensioni Personalizzate</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="width" className="text-gray-900 font-medium">
                    Larghezza (cm)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="200"
                    max="2000"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange("width", Number.parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">Min: 200cm, Max: 2000cm</p>
                </div>

                <div>
                  <Label htmlFor="depth" className="text-gray-900 font-medium">
                    Profondità (cm)
                  </Label>
                  <Input
                    id="depth"
                    type="number"
                    min="200"
                    max="2000"
                    value={dimensions.depth}
                    onChange={(e) => handleDimensionChange("depth", Number.parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">Min: 200cm, Max: 2000cm</p>
                </div>

                <div>
                  <Label htmlFor="height" className="text-gray-900 font-medium">
                    Altezza (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="200"
                    max="400"
                    value={dimensions.height}
                    onChange={(e) => handleDimensionChange("height", Number.parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">Min: 200cm, Max: 400cm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Riepilogo Dimensioni</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{dimensions.width}cm</p>
                <p className="text-gray-600">Larghezza</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{dimensions.depth}cm</p>
                <p className="text-gray-600">Profondità</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{dimensions.height}cm</p>
                <p className="text-gray-600">Altezza</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{dimensions.surface.toFixed(1)}m²</p>
                <p className="text-gray-600">Superficie</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={2}
            totalSteps={9}
            prevHref="/configurator/structure-type"
            nextHref={isValid ? "/configurator/colors" : undefined}
            nextDisabled={!isValid}
          />
        </div>
      </main>
    </div>
  )
}
