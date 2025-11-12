"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ConfigurationData } from "@/types/configuration"

interface Step3Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const carSpotsData = [
  { spots: 1, width: 230, depth: 400, height: 200, label: "1 Posto Auto" },
  { spots: 2, width: 460, depth: 400, height: 200, label: "2 Posti Auto" },
  { spots: 3, width: 690, depth: 400, height: 200, label: "3 Posti Auto" },
  { spots: 4, width: 920, depth: 400, height: 200, label: "4 Posti Auto" },
  { spots: 5, width: 1150, depth: 400, height: 200, label: "5+ Posti Auto" },
]

export function Step3Dimensions({ configuration, updateConfiguration }: Step3Props) {
  const [carSpots, setCarSpots] = useState(configuration.carSpots || 1)
  const [width, setWidth] = useState(configuration.width || 230)
  const [depth, setDepth] = useState(configuration.depth || 400)
  const [height, setHeight] = useState(configuration.height || 200)

  const handleCarSpotsChange = (spots: number) => {
    const selectedData = carSpotsData.find((data) => data.spots === spots)
    if (selectedData) {
      setCarSpots(spots)
      setWidth(selectedData.width)
      setDepth(selectedData.depth)
      setHeight(selectedData.height)
    }
  }

  useEffect(() => {
    updateConfiguration({ carSpots, width, depth, height })
  }, [carSpots, width, depth, height, updateConfiguration])

  return (
    <div className="space-y-8">
      <p className="text-gray-800 text-center text-lg">
        Seleziona il numero di posti auto e personalizza le dimensioni
      </p>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 text-center">Quanti posti auto?</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {carSpotsData.map((data) => (
            <Button
              key={data.spots}
              variant={carSpots === data.spots ? "default" : "outline"}
              onClick={() => handleCarSpotsChange(data.spots)}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                carSpots === data.spots
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-300 text-green-700 hover:bg-green-50"
              }`}
            >
              <span className="text-2xl font-bold">
                {data.spots}
                {data.spots === 5 ? "+" : ""}
              </span>
              <span className="text-sm text-center">{data.label}</span>
            </Button>
          ))}
        </div>

        <Card className="p-6 bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">
            Dimensioni suggerite per {carSpots} posto{carSpots > 1 ? "i" : ""} auto:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-700">Larghezza frontale</div>
              <div className="text-lg font-bold text-green-700">
                {carSpotsData.find((d) => d.spots === carSpots)?.width} cm
              </div>
              <div className="text-xs text-gray-600">dove entra l'auto</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-700">Profondità minima</div>
              <div className="text-lg font-bold text-green-700">
                {carSpotsData.find((d) => d.spots === carSpots)?.depth} cm
              </div>
              <div className="text-xs text-gray-600">lunghezza auto</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-700">Altezza suggerita</div>
              <div className="text-lg font-bold text-green-700">
                {carSpotsData.find((d) => d.spots === carSpots)?.height} cm
              </div>
              <div className="text-xs text-gray-600">clearance minima</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Larghezza: {width} cm</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={200}
              max={1500}
              className="w-full"
            />
          </Card>

          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Profondità: {depth} cm</Label>
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={300}
              max={1000}
              className="w-full"
            />
          </Card>

          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Altezza: {height} cm</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={180}
              max={350}
              className="w-full"
            />
          </Card>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center">
          <Card className="p-6 bg-green-50">
            <h3 className="text-gray-900 font-semibold mb-4 text-center">Riepilogo Dimensioni</h3>
            <div className="text-center space-y-4">
              {/* Visual representation */}
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  {/* Rectangle representing the carport */}
                  <div
                    className="border-2 border-green-600 bg-green-100 relative transition-all duration-300"
                    style={{
                      width: Math.max(78, Math.min(260, (width / depth) * 156)), // Real proportions, 30% larger
                      height: 156, // Base height 30% larger (was 120)
                    }}
                  >
                    <div className="absolute -top-16 left-0 right-0 flex flex-col items-center gap-2">
                      {/* Parking direction arrow pointing to width side */}
                      <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L16.586 11H5a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-blue-700">
                          {carSpots} auto entrano da questo lato
                        </span>
                      </div>

                      {/* Car spot visual indicators */}
                      <div className="flex items-center gap-1">
                        {/* Left outward arrow */}
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 10l3.293 3.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {/* Car spot indicators with better spacing */}
                        {Array.from({ length: Math.min(carSpots, 5) }, (_, i) => (
                          <div key={i} className="w-2 h-8 bg-green-600 mx-1 rounded-sm"></div>
                        ))}
                        {carSpots > 5 && <span className="text-sm text-green-600 font-bold mx-1">+</span>}
                        {/* Right outward arrow */}
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L16.586 11H5a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Width dimension line */}
                    <div className="absolute -top-6 left-0 right-0 h-px bg-green-600"></div>
                    <div className="absolute -top-6 left-0 w-px h-3 bg-green-600"></div>
                    <div className="absolute -top-6 right-0 w-px h-3 bg-green-600"></div>

                    {/* Depth dimension line */}
                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-green-600"></div>
                    <div className="absolute -left-8 top-0 h-px w-3 bg-green-600"></div>
                    <div className="absolute -left-8 bottom-0 h-px w-3 bg-green-600"></div>

                    {/* Depth label */}
                    <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-green-600 font-medium whitespace-nowrap">
                      {depth}cm
                    </div>
                  </div>

                  {/* Width label */}
                  <div className="text-sm text-green-600 font-medium mt-3">{width}cm</div>
                </div>
              </div>

              <div className="text-sm text-gray-700 bg-amber-50 p-4 rounded-lg border-2 border-amber-300 shadow-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-bold text-amber-800 mb-1">⚠️ IMPORTANTE</div>
                    <div className="text-amber-700 leading-relaxed">
                      Le dimensioni suggerite selezionando i tasti posti auto sono <strong>solo indicative</strong>.
                      Puoi inserire a tuo piacimento altre dimensioni personalizzate utilizzando i campi di input.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
