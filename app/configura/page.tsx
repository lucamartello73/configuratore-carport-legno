"use client"

import { useState, useCallback, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import componenti design system
import { ConfiguratorHeader } from "@/components/configurator/shared/ConfiguratorHeader"
import { ConfiguratorProgress } from "@/components/configurator/shared/ConfiguratorProgress"
import { ConfiguratorNavigation } from "@/components/configurator/shared/ConfiguratorNavigation"
import { FooterMartello1930 } from "@/components/footer-martello1930"

// Import step components per configuratore Legno
import { Step1StructureType } from "@/components/configurator/steps/step1-structure-type"
import { Step2Model } from "@/components/configurator/steps/step2-model"
import { Step3Dimensions } from "@/components/configurator/steps/step3-dimensions"
import { Step4Coverage } from "@/components/configurator/steps/step4-coverage"
import { Step5Colors } from "@/components/configurator/steps/step5-colors"
import { Step6Surface } from "@/components/configurator/steps/step6-surface"
import { Step7Package } from "@/components/configurator/steps/step7-package"

import type { ConfigurationData } from "@/types/configuration"
import { initializeGoogleAnalytics, trackConfiguratorStep, setupAbandonTracking } from "@/lib/analytics/gtag"
import { trackConfigurationStarted } from "@/lib/analytics/events"

export type { ConfigurationData }

const steps = [
  { id: 1, title: "Tipo Struttura" },
  { id: 2, title: "Modello" },
  { id: 3, title: "Dimensioni" },
  { id: 4, title: "Copertura" },
  { id: 5, title: "Colori" },
  { id: 6, title: "Superficie" },
  { id: 7, title: "Riepilogo" },
]

export default function ConfiguratoreLegnoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [configuration, setConfiguration] = useState<Partial<ConfigurationData>>({
    configuratorType: 'acciaio',
  })
  const [validationError, setValidationError] = useState<string>("")
  const [showValidationError, setShowValidationError] = useState(false)

  useEffect(() => {
    initializeGoogleAnalytics("G-8BW6WP9PR1")
    trackConfiguratorStep(`legno_step_${currentStep}_${steps[currentStep - 1].title.toLowerCase().replace(/ /g, "_")}`)
    
    // Track configuration started
    trackConfigurationStarted('LEGNO')
    
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
      case 1:
        if (!configuration.structureTypeId) {
          return { valid: false, error: "⚠️ Seleziona un tipo di struttura per proseguire" }
        }
        break
      case 2:
        if (!configuration.modelId) {
          return { valid: false, error: "⚠️ Seleziona un modello per proseguire" }
        }
        break
      case 3:
        if (!configuration.width || !configuration.depth || !configuration.height) {
          return { valid: false, error: "⚠️ Inserisci tutte le dimensioni (larghezza, profondità, altezza)" }
        }
        if (configuration.width < 230 || configuration.depth < 300 || configuration.height < 180) {
          return { valid: false, error: "⚠️ Le dimensioni inserite sono troppo piccole. Minimi: Larghezza 2.30m, Profondità 3.00m" }
        }
        break
      case 4:
        if (!configuration.coverageId) {
          return { valid: false, error: "⚠️ Seleziona un tipo di copertura per proseguire" }
        }
        break
      case 5:
        if (!configuration.colorId) {
          return { valid: false, error: "⚠️ Seleziona una tinta per il legno" }
        }
        break
      case 6:
        if (!configuration.surfaceId) {
          return { valid: false, error: "⚠️ Seleziona un tipo di superficie per proseguire" }
        }
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
        return <Step1StructureType configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
      case 2:
        return <Step2Model configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
      case 3:
        return <Step3Dimensions configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
      case 4:
        return <Step4Coverage configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
      case 5:
        return <Step5Colors configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
      case 6:
        return <Step6Surface configuration={configuration} updateConfiguration={updateConfiguration} onAutoAdvance={nextStep} />
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

  return (
    <>
      <ConfiguratorHeader 
        title="Configuratore Coperture Auto in Ferro"
        configuratorType="legno"
      />

      <main className="main-content">
        <ConfiguratorProgress 
          currentStep={currentStep}
          totalSteps={7}
          stepTitle={steps[currentStep - 1].title}
        />

        {showValidationError && validationError && (
          <div className="mb-6 fade-in">
            <Alert variant="destructive" className="bg-red-50 border-red-300 border-2">
              <AlertDescription className="text-red-800 font-medium flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        <section className="products-section fade-in">
          <div className="section-header">
            <h2>{steps[currentStep - 1].title}</h2>
          </div>
          
          {renderStep()}
        </section>

        {currentStep < 7 && (
          <ConfiguratorNavigation
            currentStep={currentStep}
            totalSteps={7}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        )}
      </main>

      <FooterMartello1930 />
    </>
  )
}
