"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { getStructureTypes, type StructureType } from "@/lib/database"
import { getStoredStructureType, setStoredStructureType } from "@/lib/localStorage"
import Image from "next/image"

export default function StructureTypePage() {
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load stored selection
    const stored = getStoredStructureType()
    if (stored) {
      setSelectedType(stored)
    }

    // Load structure types
    async function loadData() {
      try {
        const types = await getStructureTypes()
        setStructureTypes(types)
      } catch (error) {
        console.error("Error loading structure types:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelection = (typeId: string) => {
    setSelectedType(typeId)
    setStoredStructureType(typeId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Caricamento tipi di struttura...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Scegli il Tipo di Struttura</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Seleziona il tipo di pergola più adatto alle tue esigenze e al tuo spazio
            </p>
          </div>

          {/* Structure Types Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {structureTypes.map((type) => (
              <div
                key={type.id}
                className={`glass-card rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedType === type.id ? "ring-4 ring-amber-500 bg-sky-300/90" : "hover:bg-sky-300/90"
                }`}
                onClick={() => handleSelection(type.id)}
              >
                {/* Image */}
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={type.image || "/placeholder.svg?height=200&width=300"}
                    alt={type.name}
                    fill
                    className="object-cover"
                  />
                  {selectedType === type.id && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.name}</h3>
                <p className="text-gray-700 mb-4">{type.description}</p>

                <Button
                  variant={selectedType === type.id ? "default" : "outline"}
                  className={
                    selectedType === type.id
                      ? "w-full bg-amber-500 hover:bg-amber-600 text-white"
                      : "w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelection(type.id)
                  }}
                >
                  {selectedType === type.id ? "Selezionato" : "Seleziona"}
                </Button>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={1}
            totalSteps={9}
            nextHref={selectedType ? "/configurator/dimensions" : undefined}
            nextDisabled={!selectedType}
          />
        </div>
      </main>
    </div>
  )
}
