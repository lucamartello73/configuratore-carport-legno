"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Import step components
import { Step1StructureType } from "@/components/configurator/step1-structure-type"
import { Step2Model } from "@/components/configurator/step2-model"
import { Step3Dimensions } from "@/components/configurator/step3-dimensions"
import { Step4Coverage } from "@/components/configurator/step4-coverage"
import { Step5Colors } from "@/components/configurator/step5-colors"
import { Step6Surface } from "@/components/configurator/step6-surface"
import { Step7Package } from "@/components/configurator/step7-package"

import type { ConfigurationData } from "@/types/configuration"

import { initializeGoogleAnalytics, trackConfiguratorStep, setupAbandonTracking } from "@/lib/analytics/gtag"

export type { ConfigurationData }

const steps = [
  { id: 1, title: "Modello", description: "Seleziona il modello", icon: "📐" },
  { id: 2, title: "Tipo Struttura", description: "Scegli il tipo di struttura", icon: "🏗️" },
  { id: 3, title: "Dimensioni", description: "Imposta le dimensioni", icon: "📏" },
  { id: 4, title: "Copertura", description: "Scegli la copertura", icon: "🏠" },
  { id: 5, title: "Colori", description: "Seleziona i colori", icon: "🎨" },
  { id: 6, title: "Superficie", description: "Scegli la superficie", icon: "🔲" },
  { id: 7, title: "Pacchetto", description: "Finalizza e invia", icon: "📦" },
]

export default function ConfiguratorePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [configuration, setConfiguration] = useState<Partial<ConfigurationData>>({})

  useEffect(() => {
    initializeGoogleAnalytics("G-8BW6WP9PR1")

    // Traccia il primo step
    trackConfiguratorStep(`step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`)

    // Configura tracking abbandono
    const cleanup = setupAbandonTracking(
      () => `step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`,
    )

    return cleanup
  }, [])

  useEffect(() => {
    if (currentStep > 1) {
      // Non tracciare il primo step due volte
      const stepName = `step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`
      trackConfiguratorStep(stepName, {
        previous_step: currentStep - 1,
        configuration_progress: Math.round((currentStep / 7) * 100),
      })
    }
  }, [currentStep])

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
        return <Step2Model configuration={configuration} updateConfiguration={updateConfiguration} />
      case 2:
        return <Step1StructureType configuration={configuration} updateConfiguration={updateConfiguration} />
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

  const headerStyle = {
    background: "linear-gradient(to right, #16a34a, #059669)",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const iconStyle = {
    color: "#ffffff",
    fontSize: "32px",
    lineHeight: "1",
  }

  const titleStyle = {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
    lineHeight: "1.2",
  }

  const descriptionStyle = {
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: "4px",
    fontWeight: "500",
    margin: "0",
    fontSize: "16px",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-24"></div> {/* Spacer for centering */}
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
        <div className="max-w-6xl mx-auto shadow-xl rounded-lg overflow-hidden bg-white">
          <div style={headerStyle}>
            <span style={iconStyle}>{steps[currentStep - 1].icon}</span>
            <div>
              <h2 style={titleStyle}>{steps[currentStep - 1].title}</h2>
              <p style={descriptionStyle}>{steps[currentStep - 1].description}</p>
            </div>
          </div>
          <div className="p-8 bg-white">{renderStep()}</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-6xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-white border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Indietro
          </Button>

          {currentStep < 7 && (
            <button
              onClick={nextStep}
              style={{
                background: "#dc2626",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "2px solid #991b1b",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c"
                e.currentTarget.style.background = "#b91c1c"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626"
                e.currentTarget.style.background = "#dc2626"
              }}
            >
              Avanti
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
