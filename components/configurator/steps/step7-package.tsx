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

        {/* BOX GRANDE "SCEGLI IL TIPO DI SERVIZIO" */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-8 mb-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-[20px] font-bold text-[#333333] mb-1">Scegli il Tipo di Servizio</h2>
            <p className="text-[14px] text-[#666666]">Seleziona la modalità di fornitura che preferisci</p>
          </div>

          {/* GRID 2 CARD SERVIZI - Spacing identico allo screenshot */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* CARD 1: CHIAVI IN MANO */}
            <div
              onClick={() => setSelectedPackage("chiavi-in-mano")}
              className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                selectedPackage === "chiavi-in-mano"
                  ? "border-[#3E2723] bg-[#FAFAFA]"
                  : "border-[#E0E0E0] hover:border-[#999999] bg-white"
              }`}
            >
              {/* Header con emoji e titolo */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-[32px] leading-none">🔧</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[18px] font-bold text-[#333333]">Chiavi in Mano</h3>
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded bg-[#FFBA00] text-[#6B4500]">
                      COMPLETO
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[14px] font-semibold text-[#333333] mb-1">Con Trasporto e Montaggio</p>
              <p className="text-[13px] text-[#666666] mb-4 leading-relaxed">
                Servizio completo: progettazione, fornitura, trasporto e installazione professionale
              </p>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Sopralluogo gratuito</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Montaggio professionale</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Garanzia completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Assistenza post-vendita</span>
                </li>
              </ul>
            </div>

            {/* CARD 2: SOLO FORNITURA */}
            <div
              onClick={() => setSelectedPackage("fai-da-te")}
              className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                selectedPackage === "fai-da-te"
                  ? "border-[#3E2723] bg-[#FAFAFA]"
                  : "border-[#E0E0E0] hover:border-[#999999] bg-white"
              }`}
            >
              {/* Header con emoji e titolo */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-[32px] leading-none">💡</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[18px] font-bold text-[#333333]">Solo Fornitura</h3>
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded bg-[#FFA500] text-[#6B3500]">
                      ECONOMICO
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[14px] font-semibold text-[#333333] mb-1">Fai da Te</p>
              <p className="text-[13px] text-[#666666] mb-4 leading-relaxed">
                Solo materiali con istruzioni dettagliate per il montaggio autonomo
              </p>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Prezzo più conveniente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Istruzioni dettagliate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Supporto telefonico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-[13px] text-[#333333]">Video tutorial inclusi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* GRID 2 COLONNE: FORM + PREFERENZE */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* COLONNA SINISTRA: DATI PERSONALI */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6 shadow-sm">
            <h2 className="text-[20px] font-bold text-[#333333] mb-5">Dati Personali</h2>

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
            <h2 className="text-[20px] font-bold text-[#333333] mb-2">Preferenze di Contatto</h2>
            <p className="text-[13px] text-[#666666] mb-5">
              Scegli come preferisci essere contattato per il preventivo
            </p>

            <div className="space-y-3">
              {/* OPZIONE EMAIL */}
              <div
                onClick={() => setContactPreference("email")}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  contactPreference === "email"
                    ? "border-[#3E2723] bg-[#FAFAFA]"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white"
                }`}
              >
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
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  contactPreference === "telefono"
                    ? "border-[#3E2723] bg-[#FAFAFA]"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white"
                }`}
              >
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
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  contactPreference === "whatsapp"
                    ? "border-[#3E2723] bg-[#FAFAFA]"
                    : "border-[#E0E0E0] hover:border-[#999999] bg-white"
                }`}
              >
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
