"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import Link from "next/link"

// Import step components
import { Step1StructureType } from "@/components/configurator/step1-structure-type"
import { Step2Model } from "@/components/configurator/step2-model"
import { Step3Dimensions } from "@/components/configurator/step3-dimensions"
import { Step4Coverage } from "@/components/configurator/step4-coverage"
import { Step5Colors } from "@/components/configurator/step5-colors"
import { Step6Surface } from "@/components/configurator/step6-surface"
import { Step7Package } from "@/components/configurator/step7-package"

export interface ConfigurationData {
  structureType: string
  modelId: string
  width: number
  depth: number
  height: number
  coverageId: string
  structureColorId: string
  coverageColorId: string
  surfaceId: string
  packageType: string
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerCap: string
  customerProvince: string
}

const steps = [
  { id: 1, title: "Tipo Struttura", description: "Scegli il tipo di struttura", icon: "🏗️" },
  { id: 2, title: "Modello", description: "Seleziona il modello", icon: "📐" },
  { id: 3, title: "Dimensioni", description: "Imposta le dimensioni", icon: "📏" },
  { id: 4, title: "Copertura", description: "Scegli la copertura", icon: "🏠" },
  { id: 5, title: "Colori", description: "Seleziona i colori", icon: "🎨" },
  { id: 6, title: "Superficie", description: "Scegli la superficie", icon: "🔲" },
  { id: 7, title: "Pacchetto", description: "Finalizza e invia", icon: "📦" },
]

export default function ConfiguratorePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [configuration, setConfiguration] = useState<Partial<ConfigurationData>>({})

  const updateConfiguration = useCallback((data: Partial<ConfigurationData>) => {
    setConfiguration((prev) => ({ ...prev, ...data }))
  }, [])

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1StructureType configuration={configuration} updateConfiguration={updateConfiguration} />
      case 2:
        return <Step2Model configuration={configuration} updateConfiguration={updateConfiguration} />
      case 3:
        return <Step3Dimensions configuration={configuration} updateConfiguration={updateConfiguration} />
      case 4:
        return <Step4Coverage configuration={configuration} updateConfiguration={updateConfiguration} />
      case 5:
        return <Step5Colors configuration={configuration} updateConfiguration={updateConfiguration} />
      case 6:
        return <Step6Surface configuration={configuration} updateConfiguration={updateConfiguration} />
      case 7:
        return <Step7Package configuration={configuration} updateConfiguration={updateConfiguration} />
      default:
        return null
    }
  }

  const progress = (currentStep / 7) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium">Torna alla Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Configuratore Carport</h1>
            <p className="text-green-700">
              Passaggio {currentStep} di 7: {steps[currentStep - 1].title}
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.id <= currentStep
                      ? "bg-orange-500 text-white shadow-lg border-2 border-orange-600"
                      : "bg-gray-200 text-gray-700 border-2 border-gray-300"
                  }`}
                >
                  {step.id <= currentStep ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-gray-700 font-bold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden md:block ${step.id <= currentStep ? "text-green-800" : "text-gray-600"}`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-3 bg-green-100" />
        </div>

        {/* Step Content */}
        <Card className="max-w-6xl mx-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{steps[currentStep - 1].icon}</span>
              <div>
                <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
                <p className="text-green-100 mt-1">{steps[currentStep - 1].description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-6xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-white border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Indietro
          </Button>

          {currentStep < 7 && (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Avanti
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
