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

// Icona Badge Checkmark (per card selezionata)
const BadgeCheckIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

export function Step7Package({ configuration, updateConfiguration, onValidationError }: Step7Props) {
  const configuratorType = configuration.configuratorType || 'legno'
  
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
      // Mappa contact_preference: 'telefono' → 'phone' per DB
      const contactPreferenceMap: Record<string, string> = {
        'email': 'email',
        'telefono': 'phone',    // ⚠️ DB usa 'phone', non 'telefono'
        'whatsapp': 'whatsapp'
      }
      const dbContactPreference = contactPreferenceMap[contactPreference] || 'email'

      // Campi comuni base
      let configurationData: any = {
        configurator_type: configuratorType,
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
        contact_preference: dbContactPreference,  // ✅ Mapped value
        total_price: 0,
        status: "submitted",
        notes: customerData.notes || "",
      }

      if (configuratorType === 'acciaio') {
        // ACCIAIO-specific fields
        configurationData.structure_type = configuration.structureType || ""
        configurationData.structure_color = configuration.structureColor
        configurationData.coverage_color = configuration.coverageColor
        configurationData.surface_id = configuration.surfaceId
        configurationData.customer_cap = ""        // ACCIAIO usa customer_cap
        configurationData.customer_province = ""   // ACCIAIO ha province
        configurationData.package_type = selectedPackage  // ACCIAIO usa package_type stringa
      } else if (configuratorType === 'legno') {
        // LEGNO-specific fields
        configurationData.structure_type_id = configuration.structureTypeId || ""
        configurationData.color_id = configuration.colorId
        configurationData.surface_id = configuration.surfaceId
        configurationData.customer_postal_code = ""  // ✅ LEGNO usa customer_postal_code
        configurationData.package_id = null           // ✅ LEGNO usa package_id (FK UUID)
        // ❌ NO customer_province per LEGNO
        // ❌ NO package_type per LEGNO (usa package_id)
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
      <div className="min-h-screen bg-[#F9F5ED] flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon />
          </div>
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Configurazione Inviata!</h2>
          <p className="text-[#666666] text-lg max-w-xl mx-auto">
            Grazie per aver configurato il tuo {configuratorType === 'legno' ? 'pergola' : 'carport'}. Ti contatteremo presto per finalizzare il progetto e fornirti un preventivo personalizzato.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F9F5ED] py-8">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* TITOLO CENTRALE */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-bold text-[#333333] mb-2">Dati di Contatto</h1>
          <p className="text-[15px] text-[#666666]">
            Scegli il tipo di servizio e inserisci i tuoi dati per ricevere il preventivo personalizzato
          </p>
        </div>

        {/* BOX GRANDE "SCEGLI IL TIPO DI SERVIZIO" - Con Gradient Background (SPEC) */}
        <div className="bg-gradient-to-br from-[#3E2723]/5 to-[#3E2723]/10 border-2 border-[#3E2723]/20 rounded-2xl p-8 mb-6 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#3E2723] mb-2">Scegli il Tipo di Servizio</h2>
            <p className="text-lg text-[#666666]">Seleziona la modalità di fornitura che preferisci</p>
          </div>

          {/* GRID 2 CARD SERVIZI */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* CARD 1: CHIAVI IN MANO */}
            <div
              onClick={() => setSelectedPackage("chiavi-in-mano")}
              className={`relative p-8 rounded-xl border-[3px] cursor-pointer transition-all duration-300 transform ${
                selectedPackage === "chiavi-in-mano"
                  ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/15 to-[#3E2723]/25 ring-4 ring-[#3E2723]/30 shadow-xl scale-105"
                  : "border-[#D0D0D0] bg-white hover:border-[#3E2723]/60 hover:shadow-lg hover:scale-105"
              }`}
            >
              {/* Badge Checkmark Assoluto */}
              {selectedPackage === "chiavi-in-mano" && (
                <div className="absolute -top-3 -right-3 bg-[#3E2723] text-white rounded-full p-2 shadow-lg">
                  <BadgeCheckIcon />
                </div>
              )}
              {/* Header con emoji e titolo */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🔧</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-2xl font-bold text-[#333333]">Chiavi in Mano</h3>
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#3E2723]/20 text-[#3E2723]">
                      COMPLETO
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg font-semibold text-[#333333] mb-2">Con Trasporto e Montaggio</p>
              <p className="text-[#666666] mb-4 leading-relaxed">
                Servizio completo: progettazione, fornitura, trasporto e installazione professionale
              </p>

              {/* Box Vantaggi con Background Colorato */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-green-800">Sopralluogo gratuito</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-green-800">Montaggio professionale</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-green-800">Garanzia completa</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-green-800">Assistenza post-vendita</span>
                </div>
              </div>
            </div>

            {/* CARD 2: SOLO FORNITURA */}
            <div
              onClick={() => setSelectedPackage("fai-da-te")}
              className={`relative p-8 rounded-xl border-[3px] cursor-pointer transition-all duration-300 transform ${
                selectedPackage === "fai-da-te"
                  ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/15 to-[#3E2723]/25 ring-4 ring-[#3E2723]/30 shadow-xl scale-105"
                  : "border-[#D0D0D0] bg-white hover:border-[#3E2723]/60 hover:shadow-lg hover:scale-105"
              }`}
            >
              {/* Badge Checkmark Assoluto */}
              {selectedPackage === "fai-da-te" && (
                <div className="absolute -top-3 -right-3 bg-[#3E2723] text-white rounded-full p-2 shadow-lg">
                  <BadgeCheckIcon />
                </div>
              )}
              {/* Header con emoji e titolo */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">💡</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-2xl font-bold text-[#333333]">Solo Fornitura</h3>
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                      ECONOMICO
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg font-semibold text-[#333333] mb-2">Fai da Te</p>
              <p className="text-[#666666] mb-4 leading-relaxed">
                Solo materiali con istruzioni dettagliate per il montaggio autonomo
              </p>

              {/* Box Vantaggi con Background Colorato */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-blue-800">Prezzo più conveniente</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-blue-800">Istruzioni dettagliate</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-blue-800">Supporto telefonico</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm font-medium text-blue-800">Video tutorial inclusi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID 2 COLONNE: FORM + PREFERENZE */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* COLONNA SINISTRA: DATI PERSONALI */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-5">Dati Personali</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Cognome *</label>
                <input
                  type="text"
                  value={customerData.surname}
                  onChange={(e) => setCustomerData({ ...customerData, surname: e.target.value })}
                  className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                  placeholder=""
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Email *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                placeholder=""
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Telefono *</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                placeholder=""
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Città *</label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                placeholder=""
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Indirizzo *</label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Note (opzionali)</label>
              <textarea
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 text-[14px] border border-[#D0D0D0] rounded focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all resize-none"
                placeholder="Eventuali richieste specifiche..."
              />
            </div>
          </div>

          {/* COLONNA DESTRA: PREFERENZE CONTATTO */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-2">Preferenze di Contatto</h2>
            <p className="text-base text-[#666666] mb-5">
              Scegli come preferisci essere contattato per il preventivo
            </p>

            <div className="space-y-3">
              {/* OPZIONE EMAIL */}
              <div
                onClick={() => setContactPreference("email")}
                className={`relative flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform ${
                  contactPreference === "email"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/10 to-[#3E2723]/20 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white hover:shadow-md hover:scale-105"
                }`}
              >
                {/* Badge Checkmark */}
                {contactPreference === "email" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "email"}
                  onChange={() => setContactPreference("email")}
                  className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 accent-[#3E2723]"
                />
                <span className="text-[24px] leading-none">📧</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#333333] mb-0.5">Email</h3>
                  <p className="text-[13px] text-[#666666]">Ricevi il preventivo via email</p>
                </div>
              </div>

              {/* OPZIONE TELEFONO */}
              <div
                onClick={() => setContactPreference("telefono")}
                className={`relative flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform ${
                  contactPreference === "telefono"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/10 to-[#3E2723]/20 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white hover:shadow-md hover:scale-105"
                }`}
              >
                {/* Badge Checkmark */}
                {contactPreference === "telefono" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "telefono"}
                  onChange={() => setContactPreference("telefono")}
                  className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 accent-[#3E2723]"
                />
                <span className="text-[24px] leading-none">📞</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#333333] mb-0.5">Telefono</h3>
                  <p className="text-[13px] text-[#666666]">Chiamata diretta per discutere il preventivo</p>
                </div>
              </div>

              {/* OPZIONE WHATSAPP */}
              <div
                onClick={() => setContactPreference("whatsapp")}
                className={`relative flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform ${
                  contactPreference === "whatsapp"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/10 to-[#3E2723]/20 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white hover:shadow-md hover:scale-105"
                }`}
              >
                {/* Badge Checkmark */}
                {contactPreference === "whatsapp" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "whatsapp"}
                  onChange={() => setContactPreference("whatsapp")}
                  className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 accent-[#3E2723]"
                />
                <span className="text-[24px] leading-none">💬</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#333333] mb-0.5">WhatsApp</h3>
                  <p className="text-[13px] text-[#666666]">Chat veloce e comoda su WhatsApp</p>
                </div>
              </div>
            </div>

            {/* PRIVACY CHECKBOX */}
            <div className="mt-5 pt-5 border-t border-[#E8E8E8]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 accent-[#3E2723]"
                />
                <span className="text-[13px] text-[#666666] leading-relaxed">
                  Acconsento al trattamento dei miei dati personali *
                  <br />
                  <span className="text-[12px]">
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
              className="w-full mt-5 bg-[#3E2723] hover:bg-[#2C1810] text-white py-3.5 rounded-lg text-[15px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
            </button>
            <p className="text-center text-[12px] text-[#666666] mt-2.5">
              Riceverai un preventivo personalizzato entro 24 ore
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
