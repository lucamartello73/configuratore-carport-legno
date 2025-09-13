"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { ConfigurationData } from "@/app/configuratore/page"

interface Step1Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const structureTypes = [
  {
    id: "addossato",
    name: "Addossato",
    description: "Carport appoggiato alla parete esistente, ideale per ottimizzare lo spazio",
    image: "/carport-addossato-parete.jpg",
    features: ["Meno costoso", "Facile installazione", "Ottimizza lo spazio"],
  },
  {
    id: "autoportante",
    name: "Autoportante",
    description: "Carport indipendente con struttura completa, massima flessibilità di posizionamento",
    image: "/carport-autoportante-indipendente.jpg",
    features: ["Massima flessibilità", "Struttura robusta", "Posizionamento libero"],
  },
]

export function Step1StructureType({ configuration, updateConfiguration }: Step1Props) {
  const [selectedType, setSelectedType] = useState(configuration.structureType || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedType) {
      setIsLoading(true)
      // Simulate loading for better UX
      setTimeout(() => {
        updateConfiguration({ structureType: selectedType })
        setIsLoading(false)
      }, 300)
    }
  }, [selectedType, updateConfiguration])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-800 text-lg">Seleziona il tipo di struttura per il tuo carport</p>
        <p className="text-gray-600 text-sm mt-2">Scegli tra una soluzione addossata o autoportante</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {structureTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              selectedType === type.id
                ? "ring-2 ring-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg"
                : "hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100"
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-6">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={type.image || "/placeholder.svg"}
                  alt={type.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                {selectedType === type.id && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{type.name}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{type.description}</p>
              <div className="space-y-2">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-800">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
