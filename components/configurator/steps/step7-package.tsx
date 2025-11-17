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

// Icona Check Verde
const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

// Icona Check Circle (success)
const CheckCircleIcon = () => (
  <svg className="w-20 h-20 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// Configurazione servizi dinamica
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

const getServiceOptions = (configuratorType: string): ServiceOption[] => {
  const commonService1: ServiceOption = {
    id: "chiavi-in-mano",
    emoji: "🔑",
    title: "Chiavi in Mano",
    badge: "COMPLETO",
    badgeColor: "bg-[#FCD34D] text-amber-900",
    subtitle: "Con Trasporto e Montaggio",
    description: "Servizio completo: progettazione, fornitura, trasporto e installazione professionale",
    features: [
      "Sopralluogo gratuito",
      "Montaggio professionale",
      "Garanzia completa",
      "Assistenza post-vendita"
    ]
  }

  const service2Features = configuratorType === 'legno'
    ? [
        "Prezzo più conveniente",
        "Istruzioni dettagliate",
        "Supporto telefonico",
        "Video tutorial inclusi"
      ]
    : [
        "Prezzo più conveniente",
        "Istruzioni dettagliate",
        "Supporto telefonico",
        "Materiali certificati"
      ]

  const commonService2: ServiceOption = {
    id: "fai-da-te",
    emoji: "📦",
    title: "Solo Fornitura",
    badge: "ECONOMICO",
    badgeColor: "bg-[#FB923C] text-orange-900",
    subtitle: "Fai da Te",
    description: "Solo materiali con istruzioni dettagliate per il montaggio autonomo",
    features: service2Features
  }

  return [commonService1, commonService2]
}

export function Step7Package({ configuration, updateConfiguration, onValidationError }: Step7Props) {
  const configuratorType = configuration.configuratorType || 'acciaio'
  const brandColor = configuratorType === 'legno' ? '#5A3A1A' : '#525252'
  const brandColorDark = configuratorType === 'legno' ? '#3E2914' : '#3A3A3A'
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
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Configurazione Inviata!</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Grazie per aver configurato il tuo {configuratorType === 'legno' ? 'pergola' : 'carport'}. Ti contatteremo presto per finalizzare il progetto e fornirti un preventivo personalizzato.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* TITOLO CENTRALE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dati di Contatto</h1>
          <p className="text-gray-600">
            Scegli il tipo di servizio e inserisci i tuoi dati per ricevere il preventivo personalizzato
          </p>
        </div>

        {/* BOX SERVIZI */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scegli il Tipo di Servizio</h2>
            <p className="text-gray-600">Seleziona la modalità di fornitura che preferisci</p>
          </div>

          {/* GRID 2 CARD SERVIZI */}
          <div className="grid md:grid-cols-2 gap-6">
            {serviceOptions.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedPackage(service.id)}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPackage === service.id
                    ? `bg-[#F5F5F0]`
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{
                  borderColor: selectedPackage === service.id ? brandColor : undefined
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{service.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-900 mb-2">{service.subtitle}</p>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckIcon />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* GRID 2 COLONNE: FORM + PREFERENZE */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* COLONNA SINISTRA: DATI PERSONALI */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dati Personali</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nome *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                  placeholder="Nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Cognome *</label>
                <input
                  type="text"
                  value={customerData.surname}
                  onChange={(e) => setCustomerData({ ...customerData, surname: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                  placeholder="Cognome"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                placeholder="tuaemail@esempio.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Telefono *</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                placeholder="+39 123 456 7890"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Città *</label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                placeholder="Es. Milano"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Indirizzo *</label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                placeholder="Via, Numero Civico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Note (opzionali)</label>
              <textarea
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ "--tw-ring-color": brandColor } as React.CSSProperties}
                placeholder="Eventuali richieste specifiche..."
              />
            </div>
          </div>

          {/* COLONNA DESTRA: PREFERENZE CONTATTO */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preferenze di Contatto</h2>
            <p className="text-sm text-gray-600 mb-6">
              Scegli come preferisci essere contattato per il preventivo
            </p>

            <div className="space-y-4">
              {/* OPZIONE EMAIL */}
              <div
                onClick={() => setContactPreference("email")}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  contactPreference === "email"
                    ? "bg-[#F5F5F0]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{
                  borderColor: contactPreference === "email" ? brandColor : undefined
                }}
              >
                <input
                  type="radio"
                  checked={contactPreference === "email"}
                  onChange={() => setContactPreference("email")}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  style={{ accentColor: brandColor }}
                />
                <span className="text-2xl">📧</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">Ricevi il preventivo via email</p>
                </div>
              </div>

              {/* OPZIONE TELEFONO */}
              <div
                onClick={() => setContactPreference("telefono")}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  contactPreference === "telefono"
                    ? "bg-[#F5F5F0]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{
                  borderColor: contactPreference === "telefono" ? brandColor : undefined
                }}
              >
                <input
                  type="radio"
                  checked={contactPreference === "telefono"}
                  onChange={() => setContactPreference("telefono")}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  style={{ accentColor: brandColor }}
                />
                <span className="text-2xl">📞</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Telefono</h3>
                  <p className="text-sm text-gray-600">Chiamata diretta per discutere il preventivo</p>
                </div>
              </div>

              {/* OPZIONE WHATSAPP */}
              <div
                onClick={() => setContactPreference("whatsapp")}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  contactPreference === "whatsapp"
                    ? "bg-[#F5F5F0]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{
                  borderColor: contactPreference === "whatsapp" ? brandColor : undefined
                }}
              >
                <input
                  type="radio"
                  checked={contactPreference === "whatsapp"}
                  onChange={() => setContactPreference("whatsapp")}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  style={{ accentColor: brandColor }}
                />
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Chat veloce e comoda su WhatsApp</p>
                </div>
              </div>
            </div>

            {/* PRIVACY CHECKBOX */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  style={{ accentColor: brandColor }}
                />
                <span className="text-sm text-gray-600">
                  Acconsento al trattamento dei miei dati personali *
                  <br />
                  <span className="text-xs">
                    Accetto l'informativa sulla privacy e autorizzo il trattamento per l'invio del preventivo. 
                    Dati trattati in conformità al GDPR (UE 2016/679).
                  </span>
                </span>
              </label>
            </div>

            {/* PULSANTE INVIO */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSubmitting ? brandColorDark : brandColor
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = brandColorDark)}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = brandColor)}
            >
              {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Riceverai un preventivo personalizzato entro 24 ore
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
