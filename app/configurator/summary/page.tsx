"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import Link from "next/link"
import {
  getStoredStructureType,
  getStoredDimensions,
  getStoredColor,
  getStoredCoverage,
  getStoredAccessories,
  type DimensionsData,
  type ColorData,
} from "@/lib/localStorage"
import { getStructureTypes, getCoverageTypes, getAccessories } from "@/lib/database"

export default function SummaryPage() {
  const [configData, setConfigData] = useState<{
    structureType: string | null
    dimensions: DimensionsData | null
    color: ColorData | null
    coverage: string | null
    accessories: string[]
  }>({
    structureType: null,
    dimensions: null,
    color: null,
    coverage: null,
    accessories: [],
  })

  const [lookupData, setLookupData] = useState<{
    structureTypes: any[]
    coverageTypes: any[]
    accessoryTypes: any[]
  }>({
    structureTypes: [],
    coverageTypes: [],
    accessoryTypes: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load stored configuration
        const structureType = getStoredStructureType()
        const dimensions = getStoredDimensions()
        const color = getStoredColor()
        const coverage = getStoredCoverage()
        const accessories = getStoredAccessories()

        setConfigData({
          structureType,
          dimensions,
          color,
          coverage,
          accessories,
        })

        // Load lookup data
        const [structures, coverages, accessoryData] = await Promise.all([
          getStructureTypes(),
          getCoverageTypes(),
          getAccessories(),
        ])

        setLookupData({
          structureTypes: structures,
          coverageTypes: coverages,
          accessoryTypes: accessoryData,
        })
      } catch (error) {
        console.error("Error loading summary data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getStructureName = () => {
    const structure = lookupData.structureTypes.find((s) => s.id === configData.structureType)
    return structure?.name || "Non selezionato"
  }

  const getCoverageName = () => {
    const coverage = lookupData.coverageTypes.find((c) => c.id === configData.coverage)
    return coverage?.name || "Non selezionato"
  }

  const getAccessoryNames = () => {
    return configData.accessories
      .map((accessoryId) => {
        const accessory = lookupData.accessoryTypes.find((a) => a.id === accessoryId)
        return accessory?.name
      })
      .filter(Boolean)
  }

  const isComplete = configData.structureType && configData.dimensions && configData.color && configData.coverage

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Caricamento riepilogo...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Riepilogo Configurazione</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Controlla tutti i dettagli della tua pergola personalizzata
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Details */}
            <div className="space-y-6">
              {/* Structure Type */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tipo di Struttura</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/configurator/structure-type">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifica
                    </Link>
                  </Button>
                </div>
                <p className="text-gray-700">{getStructureName()}</p>
              </div>

              {/* Dimensions */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dimensioni</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/configurator/dimensions">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifica
                    </Link>
                  </Button>
                </div>
                {configData.dimensions ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Larghezza</p>
                      <p className="font-medium text-gray-900">{configData.dimensions.width} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profondità</p>
                      <p className="font-medium text-gray-900">{configData.dimensions.depth} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Altezza</p>
                      <p className="font-medium text-gray-900">{configData.dimensions.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Superficie</p>
                      <p className="font-medium text-gray-900">{configData.dimensions.surface.toFixed(1)} m²</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">Non configurato</p>
                )}
              </div>

              {/* Color */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Colore</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/configurator/colors">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifica
                    </Link>
                  </Button>
                </div>
                {configData.color ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200"
                      style={{
                        backgroundColor: configData.color.isCustom ? "#CCCCCC" : configData.color.value,
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{configData.color.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{configData.color.category.replace("-", " ")}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">Non selezionato</p>
                )}
              </div>
            </div>

            {/* Coverage and Accessories */}
            <div className="space-y-6">
              {/* Coverage */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Copertura</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/configurator/coverage">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifica
                    </Link>
                  </Button>
                </div>
                <p className="text-gray-700">{getCoverageName()}</p>
              </div>

              {/* Accessories */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Accessori</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/configurator/accessories">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifica
                    </Link>
                  </Button>
                </div>
                {configData.accessories.length > 0 ? (
                  <div className="space-y-2">
                    {getAccessoryNames().map((name, index) => (
                      <p key={index} className="text-gray-700">
                        • {name}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">Nessun accessorio selezionato</p>
                )}
              </div>

              {/* Configuration Status */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stato Configurazione</h3>
                {isComplete ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="font-medium">Configurazione completa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="font-medium">Configurazione incompleta</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={6}
            totalSteps={9}
            prevHref="/configurator/accessories"
            nextHref={isComplete ? "/configurator/service-type" : undefined}
            nextDisabled={!isComplete}
          />
        </div>
      </main>
    </div>
  )
}
