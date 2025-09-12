"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { getCoverageTypes, type CoverageType } from "@/lib/database"
import { getStoredCoverage, setStoredCoverage } from "@/lib/localStorage"
import Image from "next/image"

export default function CoveragePage() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load stored selection
    const stored = getStoredCoverage()
    if (stored) {
      setSelectedCoverage(stored)
    }

    // Load coverage types
    async function loadData() {
      try {
        const types = await getCoverageTypes()
        setCoverageTypes(types)
      } catch (error) {
        console.error("Error loading coverage types:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelection = (coverageId: string) => {
    setSelectedCoverage(coverageId)
    setStoredCoverage(coverageId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Caricamento coperture...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Scegli la Copertura</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Seleziona il tipo di copertura più adatto alle tue esigenze
            </p>
          </div>

          {/* Coverage Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {coverageTypes.map((coverage) => (
              <div
                key={coverage.id}
                className={`glass-card rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedCoverage === coverage.id ? "ring-4 ring-amber-500 bg-sky-300/90" : "hover:bg-sky-300/90"
                }`}
                onClick={() => handleSelection(coverage.id)}
              >
                {/* Image */}
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={coverage.image || "/placeholder.svg?height=160&width=200"}
                    alt={coverage.name}
                    fill
                    className="object-cover"
                  />
                  {selectedCoverage === coverage.id && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{coverage.name}</h3>
                <p className="text-gray-700 text-sm mb-4">{coverage.description}</p>

                <Button
                  variant={selectedCoverage === coverage.id ? "default" : "outline"}
                  className={
                    selectedCoverage === coverage.id
                      ? "w-full bg-amber-500 hover:bg-amber-600 text-white"
                      : "w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelection(coverage.id)
                  }}
                >
                  {selectedCoverage === coverage.id ? "Selezionato" : "Seleziona"}
                </Button>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={4}
            totalSteps={9}
            prevHref="/configurator/colors"
            nextHref={selectedCoverage ? "/configurator/accessories" : undefined}
            nextDisabled={!selectedCoverage}
          />
        </div>
      </main>
    </div>
  )
}
