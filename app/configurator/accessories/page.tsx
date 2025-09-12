"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { getAccessories, type AccessoryType } from "@/lib/database"
import { getStoredAccessories, setStoredAccessories } from "@/lib/localStorage"
import Image from "next/image"

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<AccessoryType[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load stored selection
    const stored = getStoredAccessories()
    if (stored) {
      setSelectedAccessories(stored)
    }

    // Load accessories
    async function loadData() {
      try {
        const accessoryData = await getAccessories()
        setAccessories(accessoryData)
      } catch (error) {
        console.error("Error loading accessories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelection = (accessoryId: string) => {
    const newSelection = selectedAccessories.includes(accessoryId)
      ? selectedAccessories.filter((id) => id !== accessoryId)
      : [...selectedAccessories, accessoryId]

    setSelectedAccessories(newSelection)
    setStoredAccessories(newSelection)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Caricamento accessori...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Scegli gli Accessori</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Aggiungi accessori per personalizzare ulteriormente la tua pergola (opzionale)
            </p>
          </div>

          {/* Accessories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {accessories.map((accessory) => (
              <div
                key={accessory.id}
                className={`glass-card rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedAccessories.includes(accessory.id)
                    ? "ring-4 ring-amber-500 bg-sky-300/90"
                    : "hover:bg-sky-300/90"
                }`}
                onClick={() => handleSelection(accessory.id)}
              >
                {/* Image */}
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={accessory.image || "/placeholder.svg?height=128&width=200"}
                    alt={accessory.name}
                    fill
                    className="object-cover"
                  />
                  {selectedAccessories.includes(accessory.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{accessory.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{accessory.name}</h3>
                </div>

                <Button
                  variant={selectedAccessories.includes(accessory.id) ? "default" : "outline"}
                  className={
                    selectedAccessories.includes(accessory.id)
                      ? "w-full bg-amber-500 hover:bg-amber-600 text-white"
                      : "w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelection(accessory.id)
                  }}
                >
                  {selectedAccessories.includes(accessory.id) ? "Selezionato" : "Aggiungi"}
                </Button>
              </div>
            ))}
          </div>

          {/* Selected Summary */}
          {selectedAccessories.length > 0 && (
            <div className="glass-card rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Accessori Selezionati ({selectedAccessories.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAccessories.map((accessoryId) => {
                  const accessory = accessories.find((a) => a.id === accessoryId)
                  return accessory ? (
                    <div key={accessoryId} className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full">
                      <span>{accessory.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{accessory.name}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <Navigation
            currentStep={5}
            totalSteps={9}
            prevHref="/configurator/coverage"
            nextHref="/configurator/summary"
          />
        </div>
      </main>
    </div>
  )
}
