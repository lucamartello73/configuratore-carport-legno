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
  }, [carSpots, width, depth, height])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Dimensioni e Posti Auto</h2>
        <p className="text-secondary">
          Seleziona il numero di posti auto e personalizza le dimensioni
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-primary text-center">Quanti posti auto?</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {carSpotsData.map((data) => (
            <button
              key={data.spots}
              onClick={() => handleCarSpotsChange(data.spots)}
              className={`h-auto p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all duration-300 ${
                carSpots === data.spots
                  ? "bg-primary text-white border-primary shadow-lg"
                  : "bg-white text-primary border-gray-300 hover:border-accent-pink hover:shadow-md"
              }`}
            >
              <span className="text-2xl font-bold">
                {data.spots}
                {data.spots === 5 ? "+" : ""}
              </span>
              <span className="text-sm text-center">{data.label}</span>
            </button>
          ))}
        </div>

        <div className="product-card bg-surface-beige border-accent-pink">
          <h4 className="font-semibold text-primary mb-3">
            Dimensioni suggerite per {carSpots} posto{carSpots > 1 ? "i" : ""} auto:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-secondary">Larghezza frontale</div>
              <div className="text-lg font-bold text-primary">
                {carSpotsData.find((d) => d.spots === carSpots)?.width} cm
              </div>
              <div className="text-xs text-secondary">dove entra l'auto</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-secondary">Profondità minima</div>
              <div className="text-lg font-bold text-primary">
                {carSpotsData.find((d) => d.spots === carSpots)?.depth} cm
              </div>
              <div className="text-xs text-secondary">lunghezza auto</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-secondary">Altezza suggerita</div>
              <div className="text-lg font-bold text-primary">
                {carSpotsData.find((d) => d.spots === carSpots)?.height} cm
              </div>
              <div className="text-xs text-secondary">clearance minima</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="product-card">
            <Label className="text-primary font-semibold mb-4 block">Larghezza: {width} cm</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={200}
              max={1500}
              className="w-full"
            />
          </div>

          <div className="product-card">
            <Label className="text-primary font-semibold mb-4 block">Profondità: {depth} cm</Label>
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={300}
              max={1000}
              className="w-full"
            />
          </div>

          <div className="product-card">
            <Label className="text-primary font-semibold mb-4 block">Altezza: {height} cm</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={180}
              max={350}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="product-card bg-surface-beige w-full">
            <h3 className="text-primary font-semibold mb-4 text-center">Riepilogo Dimensioni</h3>
            <div className="text-center space-y-4">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div
                    className="border-2 border-accent-pink bg-white relative transition-all duration-300"
                    style={{
                      width: Math.max(78, Math.min(260, (width / depth) * 156)),
                      height: 156,
                    }}
                  >
                    <div className="absolute -top-16 left-0 right-0 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 bg-surface-beige px-3 py-1 rounded-full border border-accent-pink">
                        <svg className="w-4 h-4 text-accent-pink" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L16.586 11H5a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-primary">
                          {carSpots} auto entrano da questo lato
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-accent-pink" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 10l3.293 3.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {Array.from({ length: Math.min(carSpots, 5) }, (_, i) => (
                          <div key={i} className="w-2 h-8 bg-accent-pink mx-1 rounded-sm"></div>
                        ))}
                        {carSpots > 5 && <span className="text-sm text-accent-pink font-bold mx-1">+</span>}
                        <svg className="w-5 h-5 text-accent-pink" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L16.586 11H5a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute -top-6 left-0 right-0 h-px bg-accent-pink"></div>
                    <div className="absolute -top-6 left-0 w-px h-3 bg-accent-pink"></div>
                    <div className="absolute -top-6 right-0 w-px h-3 bg-accent-pink"></div>

                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-accent-pink"></div>
                    <div className="absolute -left-8 top-0 h-px w-3 bg-accent-pink"></div>
                    <div className="absolute -left-8 bottom-0 h-px w-3 bg-accent-pink"></div>

                    <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-accent-pink font-medium whitespace-nowrap">
                      {depth}cm
                    </div>
                  </div>

                  <div className="text-sm text-accent-pink font-medium mt-3">{width}cm</div>
                </div>
              </div>

              <div className="text-sm text-primary bg-amber-50 p-4 rounded-lg border-2 border-amber-300 shadow-sm">
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
          </div>
        </div>
      </div>
    </div>
  )
}
