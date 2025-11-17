"use client"

import { useState } from "react"
import type { ConfigurationData } from "@/types/configuration"
import { saveConfiguration } from "@/app/actions/save-configuration"
import { trackConfiguratorSubmit } from "@/lib/analytics/gtag"

interface Step7Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
  onValidationError?: (error: string) => void
}

// ICONE SVG IDENTICHE AL MODELLO
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-8 h-8 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-8 h-8 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-8 h-8 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

// CONFIGURAZIONE SERVIZI (diversa per LEGNO vs FERRO)
interface ServiceOption {
  id: string
  emoji: string
  title: string
  badge: string
  badgeColor: string
  subtitle: string
  description: string
  features: string[]
}

// Funzione per ottenere i servizi in base al tipo di configuratore
const getServiceOptions = (configuratorType: string): ServiceOption[] => {
  if (configuratorType === 'legno') {
    return [
      {
        id: "chiavi-in-mano",
        emoji: "🔑",
        title: "Chiavi in Mano",
        badge: "COMPLETO",
        badgeColor: "bg-yellow-400 text-yellow-900",
        subtitle: "Con Trasporto e Montaggio",
        description: "Servizio completo: progettazione, fornitura, trasporto e installazione professionale",
        features: [
          "Sopralluogo gratuito",
          "Montaggio professionale",
          "Garanzia completa",
          "Assistenza post-vendita"
        ]
      },
      {
        id: "fai-da-te",
        emoji: "📦",
        title: "Solo Fornitura",
        badge: "ECONOMICO",
        badgeColor: "bg-orange-400 text-orange-900",
        subtitle: "Fai da Te",
        description: "Solo materiali con istruzioni dettagliate per il montaggio autonomo",
        features: [
          "Prezzo più conveniente",
          "Istruzioni dettagliate",
          "Supporto telefonico",
          "Video tutorial inclusi"
        ]
      }
    ]
  } else {
    // FERRO - stessi servizi ma testi adattati
    return [
      {
        id: "chiavi-in-mano",
        emoji: "🔑",
        title: "Chiavi in Mano",
        badge: "COMPLETO",
        badgeColor: "bg-yellow-400 text-yellow-900",
        subtitle: "Con Trasporto e Montaggio",
        description: "Servizio completo: progettazione, fornitura, trasporto e installazione professionale",
        features: [
          "Sopralluogo gratuito",
          "Montaggio professionale",
          "Garanzia completa",
          "Assistenza post-vendita"
        ]
      },
      {
        id: "fai-da-te",
        emoji: "📦",
        title: "Solo Fornitura",
        badge: "ECONOMICO",
        badgeColor: "bg-orange-400 text-orange-900",
        subtitle: "Fai da Te",
        description: "Solo materiali con istruzioni dettagliate per il montaggio autonomo",
        features: [
          "Prezzo più conveniente",
          "Istruzioni dettagliate",
          "Supporto telefonico",
          "Materiali certificati"
        ]
      }
    ]
  }
}

export function Step7Package({ configuration, updateConfiguration, onValidationError }: Step7Props) {
  const configuratorType = configuration.configuratorType || 'acciaio'
  const serviceOptions = getServiceOptions(configuratorType)
  
  const [selectedPackage, setSelectedPackage] = useState(configuration.packageType || "")
  const [contactPreference, setContactPreference] = useState(configuration.contactPreference || "email")
  const [customerData, setCustomerData] = useState({
    name: configuration.customerName || "",
    surname: configuration.customerSurname || "",
    email: configuration.customerEmail || "",
    phone: configuration.customerPhone || "",
    city: configuration.customerCity || "",
    address: configuration.customerAddress || "",
    notes: configuration.customerNotes || "",
  })
  const [privacyAccepted, setPrivacyAccepted] = useState(configuration.privacyAccepted || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    // Validation
    if (!selectedPackage) {
      onValidationError?.("⚠️ Seleziona un tipo di servizio")
      return
    }

    if (!customerData.name || !customerData.surname || !customerData.email || !customerData.phone || !customerData.city) {
      onValidationError?.("⚠️ Compila tutti i campi obbligatori (Nome, Cognome, Email, Telefono, Città)")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      onValidationError?.("⚠️ Inserisci un indirizzo email valido")
      return
    }

    if (!privacyAccepted) {
      onValidationError?.("⚠️ Devi accettare l'informativa sulla privacy")
      return
    }

    // Validazione campi specifici per tipo configuratore
    if (configuratorType === 'acciaio') {
      if (!configuration.modelId || !configuration.coverageId || !configuration.structureColor) {
        onValidationError?.("⚠️ Configurazione incompleta. Torna indietro e completa tutti i passaggi")
        return
      }
    } else {
      if (!configuration.modelId || !configuration.coverageId || !configuration.colorId || !configuration.surfaceId) {
        onValidationError?.("⚠️ Configurazione incompleta. Torna indietro e completa tutti i passaggi")
        return
      }
    }

    setIsSubmitting(true)

    try {
      let configurationData: any = {
        configurator_type: configuratorType,
        structure_type: configuration.structureType || configuration.structureTypeId || "",
        model_id: configuration.modelId,
        width: configuration.width || 0,
        depth: configuration.depth || 0,
        height: configuration.height || 0,
        coverage_id: configuration.coverageId,
        customer_name: `${customerData.name} ${customerData.surname}`,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_city: customerData.city,
        customer_cap: "",
        customer_province: "",
        package_type: selectedPackage,
        contact_preference: contactPreference,
        total_price: 0,
        status: "submitted",
      }

      // Campi specifici per tipo
      if (configuratorType === 'acciaio') {
        configurationData.structure_color = configuration.structureColor
        configurationData.coverage_color = configuration.coverageColor
        configurationData.surface_id = configuration.surfaceId
      } else {
        configurationData.color_id = configuration.colorId
        configurationData.surface_id = configuration.surfaceId
      }

      const result = await saveConfiguration(configurationData)

      if (!result.success) {
        console.error("Error saving configuration:", result.error)
        onValidationError?.("❌ Errore nel salvare la configurazione. Riprova.")
        return
      }

      updateConfiguration({
        packageType: selectedPackage,
        customerName: customerData.name,
        customerSurname: customerData.surname,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        customerCity: customerData.city,
        customerNotes: customerData.notes,
        contactPreference: contactPreference,
        privacyAccepted: privacyAccepted,
      })

      trackConfiguratorSubmit({
        configuratorType: configuratorType,
        modelId: configuration.modelId || "",
        coverageId: configuration.coverageId || "",
        dimensions: `${configuration.width}×${configuration.depth}×${configuration.height}`,
        packageType: selectedPackage,
      })

      // Send email notification
      if (result.data?.id) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: "info@martello1930.net",
              subject: `Nuova Configurazione ${configuratorType === 'legno' ? 'Pergola' : 'Carport'} - ${customerData.name} ${customerData.surname}`,
              customerName: `${customerData.name} ${customerData.surname}`,
              customerEmail: customerData.email,
              configurationId: result.data.id,
              totalPrice: 0,
              structureType: configuration.structureType || configuration.structureTypeId || "Non specificato",
              dimensions: `${configuration.width}×${configuration.depth}×${configuration.height} cm`,
              contactPreference: contactPreference,
            }),
          })
        } catch (emailError) {
          console.error("Error sending email:", emailError)
        }
      }

      setIsSubmitted(true)
      setTimeout(() => {
        window.location.href = "https://www.martello1930.net"
      }, 3000)
    } catch (error) {
      console.error("Error:", error)
      onValidationError?.("❌ Errore nel salvare la configurazione. Riprova.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-16 px-4">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Configurazione Inviata!</h2>
        <p className="text-secondary text-lg max-w-xl mx-auto">
          Grazie per aver configurato il tuo {configuratorType === 'legno' ? 'pergola' : 'carport'}. Ti contatteremo presto per finalizzare il progetto e fornirti un preventivo personalizzato.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      {/* ============================================ */}
      {/* BLOCCO 1: RIEPILOGO - IDENTICO AL MODELLO   */}
      {/* ============================================ */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dati di Contatto</h1>
        <p className="text-lg text-secondary">
          Scegli il tipo di servizio e inserisci i tuoi dati per ricevere il preventivo personalizzato
        </p>
      </div>

      {/* SEZIONE: Scegli il Tipo di Servizio */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Scegli il Tipo di Servizio</h2>
          <p className="text-secondary">
            Seleziona la modalità di fornitura che preferisci
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {serviceOptions.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedPackage(service.id)}
              className={`bg-white rounded-xl p-6 cursor-pointer transition-all border-2 ${
                selectedPackage === service.id
                  ? "border-primary shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{service.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">{service.title}</h3>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-primary mb-2">{service.subtitle}</p>
              <p className="text-sm text-secondary mb-4">{service.description}</p>

              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-sm text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* BLOCCO 2: MODULO CONTATTI - 2 COLONNE       */}
      {/* ============================================ */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* COLONNA SINISTRA: Dati Personali */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Dati Personali</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Nome *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Cognome *</label>
                <input
                  type="text"
                  value={customerData.surname}
                  onChange={(e) => setCustomerData({ ...customerData, surname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Cognome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Email *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tuaemail@esempio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Telefono *</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Città *</label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Es. Milano"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Indirizzo *</label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Via, Numero Civico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Note (opzionali)</label>
              <textarea
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Eventuali richieste specifiche..."
              />
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: Preferenze di Contatto */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Preferenze di Contatto</h2>
          <p className="text-sm text-secondary mb-6">
            Scegli come preferisci essere contattato per il preventivo
          </p>

          <div className="space-y-4">
            {/* OPZIONE: Email */}
            <div
              onClick={() => setContactPreference("email")}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                contactPreference === "email"
                  ? "border-primary bg-surface-beige"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                contactPreference === "email" ? "border-primary bg-primary" : "border-gray-400"
              }`}>
                {contactPreference === "email" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <MailIcon />
              <div className="flex-1">
                <h3 className="font-semibold text-primary">Email</h3>
                <p className="text-sm text-secondary">Ricevi il preventivo via email</p>
              </div>
            </div>

            {/* OPZIONE: Telefono */}
            <div
              onClick={() => setContactPreference("telefono")}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                contactPreference === "telefono"
                  ? "border-primary bg-surface-beige"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                contactPreference === "telefono" ? "border-primary bg-primary" : "border-gray-400"
              }`}>
                {contactPreference === "telefono" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <PhoneIcon />
              <div className="flex-1">
                <h3 className="font-semibold text-primary">Telefono</h3>
                <p className="text-sm text-secondary">Chiamata diretta per discutere il preventivo</p>
              </div>
            </div>

            {/* OPZIONE: WhatsApp */}
            <div
              onClick={() => setContactPreference("whatsapp")}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                contactPreference === "whatsapp"
                  ? "border-primary bg-surface-beige"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                contactPreference === "whatsapp" ? "border-primary bg-primary" : "border-gray-400"
              }`}>
                {contactPreference === "whatsapp" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <WhatsAppIcon />
              <div className="flex-1">
                <h3 className="font-semibold text-primary">WhatsApp</h3>
                <p className="text-sm text-secondary">Chat veloce e comoda su WhatsApp</p>
              </div>
            </div>
          </div>

          {/* PRIVACY CHECKBOX */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
              />
              <label htmlFor="privacy" className="text-sm text-secondary cursor-pointer">
                Acconsento al trattamento dei miei dati personali *
                <br />
                <span className="text-xs">
                  Accetto l'informativa sulla privacy e autorizzo il trattamento per l'invio del preventivo. 
                  Dati trattati in conformità al GDPR (UE 2016/679).
                </span>
              </label>
            </div>
          </div>

          {/* PULSANTE INVIO */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full button-primary py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
            </button>
            <p className="text-center text-sm text-secondary mt-3">
              Riceverai un preventivo personalizzato entro 24 ore
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
