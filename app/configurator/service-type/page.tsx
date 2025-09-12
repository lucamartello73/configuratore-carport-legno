"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Check, Wrench, Hammer } from "lucide-react"
import { getStoredServiceType, setStoredServiceType } from "@/lib/localStorage"

export default function ServiceTypePage() {
  const [selectedService, setSelectedService] = useState<"chiavi-in-mano" | "fai-da-te" | null>(null)

  useEffect(() => {
    // Load stored selection
    const stored = getStoredServiceType()
    if (stored) {
      setSelectedService(stored)
    }
  }, [])

  const handleSelection = (serviceType: "chiavi-in-mano" | "fai-da-te") => {
    setSelectedService(serviceType)
    setStoredServiceType(serviceType)
  }

  const services = [
    {
      id: "chiavi-in-mano" as const,
      title: "Chiavi in Mano",
      icon: <Hammer className="w-8 h-8" />,
      description: "Servizio completo con installazione professionale",
      features: [
        "Progettazione personalizzata",
        "Installazione professionale",
        "Garanzia completa 10 anni",
        "Assistenza post-vendita",
        "Permessi e pratiche incluse",
      ],
      deliveryTime: "4-6 settimane",
      price: "Preventivo personalizzato",
    },
    {
      id: "fai-da-te" as const,
      title: "Fai da Te",
      icon: <Wrench className="w-8 h-8" />,
      description: "Kit completo per l'autoinstallazione",
      features: [
        "Kit pre-assemblato",
        "Istruzioni dettagliate",
        "Video tutorial inclusi",
        "Supporto telefonico",
        "Garanzia materiali 5 anni",
      ],
      deliveryTime: "2-3 settimane",
      price: "Sconto del 30%",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="configurator-bg">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Scegli il Tipo di Servizio</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Seleziona se preferisci l'installazione professionale o il kit fai-da-te
            </p>
          </div>

          {/* Service Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`glass-card rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                  selectedService === service.id ? "ring-4 ring-amber-500 bg-sky-300/90" : "hover:bg-sky-300/90"
                }`}
                onClick={() => handleSelection(service.id)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  {selectedService === service.id && (
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Cosa include:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Tempi di consegna</p>
                    <p className="font-semibold text-gray-900">{service.deliveryTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prezzo</p>
                    <p className="font-semibold text-gray-900">{service.price}</p>
                  </div>
                </div>

                {/* Selection Button */}
                <Button
                  variant={selectedService === service.id ? "default" : "outline"}
                  className={
                    selectedService === service.id
                      ? "w-full bg-amber-500 hover:bg-amber-600 text-white"
                      : "w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelection(service.id)
                  }}
                >
                  {selectedService === service.id ? "Selezionato" : "Seleziona"}
                </Button>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={7}
            totalSteps={9}
            prevHref="/configurator/summary"
            nextHref={selectedService ? "/configurator/customer-data" : undefined}
            nextDisabled={!selectedService}
          />
        </div>
      </main>
    </div>
  )
}
