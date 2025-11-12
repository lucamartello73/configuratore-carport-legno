"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Import step components per configuratore Legno
import { Step1StructureType } from "@/components/configurator/legno/step1-structure-type"
import { Step2Model } from "@/components/configurator/legno/step2-model"
import { Step3Dimensions } from "@/components/configurator/legno/step3-dimensions"
import { Step4Coverage } from "@/components/configurator/legno/step4-coverage"
import { Step5Colors } from "@/components/configurator/legno/step5-colors"
import { Step6Accessories } from "@/components/configurator/legno/step6-accessories"
import { Step7Package } from "@/components/configurator/legno/step7-package"

import type { ConfigurationData } from "@/types/configuration"
import { FooterMartello1930 } from "@/components/footer-martello1930"

import { initializeGoogleAnalytics, trackConfiguratorStep, setupAbandonTracking } from "@/lib/analytics/gtag"

export type { ConfigurationData }

const steps = [
  { id: 1, title: "Tipo Struttura", description: "Scegli il tipo di struttura", icon: "🌳" },
  { id: 2, title: "Modello", description: "Seleziona il modello", icon: "🏗️" },
  { id: 3, title: "Dimensioni", description: "Imposta le dimensioni", icon: "📏" },
  { id: 4, title: "Copertura", description: "Scegli la copertura", icon: "🏡" },
  { id: 5, title: "Colori", description: "Seleziona le tinte legno", icon: "🎨" },
  { id: 6, title: "Accessori", description: "Aggiungi accessori", icon: "✨" },
  { id: 7, title: "Riepilogo", description: "Finalizza e invia", icon: "📦" },
]

export default function ConfiguratoreLegnoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [configuration, setConfiguration] = useState<Partial<ConfigurationData>>({
    configuratorType: 'legno', // Imposta il tipo di configuratore
  })
  const [validationError, setValidationError] = useState<string>("")
  const [showValidationError, setShowValidationError] = useState(false)

  useEffect(() => {
    initializeGoogleAnalytics("G-8BW6WP9PR1")

    trackConfiguratorStep(`legno_step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`)

    const cleanup = setupAbandonTracking(
      () => `legno_step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`,
    )

    return cleanup
  }, [])

  useEffect(() => {
    if (currentStep > 1) {
      const stepName = `legno_step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`
      trackConfiguratorStep(stepName, {
        previous_step: currentStep - 1,
        configuration_progress: Math.round((currentStep / 7) * 100),
        configurator_type: 'legno',
      })
    }
  }, [currentStep])

  const validateCurrentStep = (): { valid: boolean; error: string } => {
    switch (currentStep) {
      case 1: // Structure type
        if (!configuration.structureTypeId) {
          return { valid: false, error: "⚠️ Seleziona un tipo di struttura per proseguire" }
        }
        break
      case 2: // Model
        if (!configuration.modelId) {
          return { valid: false, error: "⚠️ Seleziona un modello per proseguire" }
        }
        break
      case 3: // Dimensions
        if (!configuration.width || !configuration.depth || !configuration.height) {
          return { valid: false, error: "⚠️ Inserisci tutte le dimensioni (larghezza, profondità, altezza)" }
        }
        if (configuration.width < 230 || configuration.depth < 300 || configuration.height < 180) {
          return { valid: false, error: "⚠️ Le dimensioni inserite sono troppo piccole. Minimi: Larghezza 2.30m, Profondità 3.00m" }
        }
        break
      case 4: // Coverage
        if (!configuration.coverageId) {
          return { valid: false, error: "⚠️ Seleziona un tipo di copertura per proseguire" }
        }
        break
      case 5: // Colors
        if (!configuration.colorId) {
          return { valid: false, error: "⚠️ Seleziona una tinta per il legno" }
        }
        break
      case 6: // Accessories (optional)
        // Accessories are optional, always valid
        break
    }
    return { valid: true, error: "" }
  }

  const updateConfiguration = useCallback((data: Partial<ConfigurationData>) => {
    setConfiguration((prev) => ({ ...prev, ...data }))
    setShowValidationError(false)
    setValidationError("")
  }, [])

  const nextStep = () => {
    const validation = validateCurrentStep()
    if (!validation.valid) {
      setValidationError(validation.error)
      setShowValidationError(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
      setShowValidationError(false)
      setValidationError("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setShowValidationError(false)
      setValidationError("")
      window.scrollTo({ top: 0, behavior: "smooth" })
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
        return <Step6Accessories configuration={configuration} updateConfiguration={updateConfiguration} />
      case 7:
        return (
          <Step7Package
            configuration={configuration}
            updateConfiguration={updateConfiguration}
            onValidationError={(error) => {
              setValidationError(error)
              setShowValidationError(true)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        )
      default:
        return null
    }
  }

  const progress = (currentStep / 7) * 100

  const headerStyle = {
    background: "linear-gradient(to right, #008f4c, #00703c)",
    backgroundColor: "#008f4c",
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
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Torna alla Home
            </Button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-[#008f4c] mb-2">Configuratore Coperture Auto in Legno</h1>
            <p className="text-gray-700">
              Passaggio {currentStep} di 7: {steps[currentStep - 1].title}
            </p>
          </div>
          <div className="w-32"></div>
        </div>

        {showValidationError && validationError && (
          <div className="max-w-4xl mx-auto mb-6 animate-shake">
            <Alert variant="destructive" className="bg-red-50 border-red-300 border-2">
              <AlertDescription className="text-red-800 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.id <= currentStep
                      ? "bg-[#008f4c] text-white shadow-lg border-2 border-green-700"
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
                  className={`text-xs mt-2 font-medium hidden md:block ${step.id <= currentStep ? "text-[#008f4c]" : "text-gray-600"}`}
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
        <div className="flex justify-between max-w-6xl mx-auto mt-8 sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-white border-green-300 text-gray-700 hover:bg-green-50 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Indietro
          </Button>

          {currentStep < 6 && (
            <button
              onClick={nextStep}
              style={{
                background: "#16a34a",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "2px solid #059669",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#059669"
                e.currentTarget.style.background = "#059669"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#16a34a"
                e.currentTarget.style.background = "#16a34a"
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
      <FooterMartello1930 />
    </div>
  )
}
