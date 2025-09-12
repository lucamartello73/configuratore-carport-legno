"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Phone, MessageCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  getStoredStructureType,
  getStoredDimensions,
  getStoredColor,
  getStoredCoverage,
  getStoredAccessories,
  getStoredServiceType,
  getStoredCustomerData,
  clearConfiguratorData,
} from "@/lib/localStorage"
import { saveConfiguration } from "@/lib/database"

export default function ConfirmationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [configurationId, setConfigurationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Auto-submit configuration on page load
    submitConfiguration()
  }, [])

  const submitConfiguration = async () => {
    if (isSubmitted || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Gather all configuration data
      const structureType = getStoredStructureType()
      const dimensions = getStoredDimensions()
      const color = getStoredColor()
      const coverage = getStoredCoverage()
      const accessories = getStoredAccessories()
      const serviceType = getStoredServiceType()
      const customerData = getStoredCustomerData()

      if (!structureType || !dimensions || !color || !coverage || !serviceType || !customerData) {
        throw new Error("Configurazione incompleta")
      }

      // Prepare configuration data
      const configData = {
        type_id: structureType,
        width: dimensions.width,
        depth: dimensions.depth,
        height: dimensions.height,
        color_name: color.name,
        color_value: color.value,
        coverage_id: coverage,
        accessories: accessories,
        service_type: serviceType,
        contact_data: customerData,
        contact_preference: "email" as const, // Default to email
      }

      // Save to database
      const id = await saveConfiguration(configData)
      setConfigurationId(id)

      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerData,
            configuration: configData,
            configurationId: id,
          }),
        })

        const emailResult = await emailResponse.json()

        if (emailResult.success) {
          setEmailSent(true)
        } else {
          console.error("Email sending failed:", emailResult.error)
          // Don't throw error - configuration was saved successfully
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError)
        // Don't throw error - configuration was saved successfully
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting configuration:", err)
      setError(err instanceof Error ? err.message : "Errore durante l'invio")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewConfiguration = () => {
    clearConfiguratorData()
    // Redirect to start
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
              <h1 className="text-3xl font-bold mb-4">Invio Configurazione...</h1>
              <p className="text-xl text-white/90">Stiamo elaborando la tua richiesta</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="configurator-bg">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Errore</h1>
              <p className="text-xl text-gray-700 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={submitConfiguration} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Riprova
                </Button>
                <Button asChild variant="outline">
                  <Link href="/configurator/customer-data">Torna Indietro</Link>
                </Button>
              </div>
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
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Configurazione Inviata!</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              La tua richiesta è stata ricevuta con successo. Ti contatteremo entro 24 ore con il preventivo
              personalizzato.
            </p>
          </div>

          {/* Configuration ID */}
          {configurationId && (
            <div className="glass-card rounded-xl p-6 mb-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ID Richiesta</h3>
              <p className="text-2xl font-mono text-emerald-600 font-bold">
                {configurationId.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-sm text-gray-600 mt-2">Conserva questo codice per future comunicazioni</p>
            </div>
          )}

          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stato Invio</h3>
            <div className="flex items-center gap-3">
              {emailSent ? (
                <>
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-700">Email di conferma inviata</p>
                    <p className="text-sm text-gray-600">Controlla la tua casella di posta elettronica</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-700">Configurazione salvata</p>
                    <p className="text-sm text-gray-600">Ti contatteremo direttamente per confermare i dettagli</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Prossimi Passi</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Elaborazione Preventivo</h3>
                  <p className="text-gray-700">
                    Il nostro team tecnico analizzerà la tua configurazione e preparerà un preventivo dettagliato.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contatto Entro 24h</h3>
                  <p className="text-gray-700">
                    Ti contatteremo tramite la modalità che hai scelto per discutere i dettagli e rispondere alle tue
                    domande.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sopralluogo (se necessario)</h3>
                  <p className="text-gray-700">
                    Per installazioni complesse, organizzeremo un sopralluogo gratuito per confermare tutti i dettagli.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Hai Domande?</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-700">info@martello1930.it</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Telefono</h4>
                <p className="text-gray-700">+39 0123 456 789</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                <p className="text-gray-700">+39 333 123 4567</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link href="/">Torna alla Home</Link>
            </Button>

            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              <Link href="/configurator/structure-type" onClick={handleNewConfiguration}>
                Nuova Configurazione
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
