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

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export function Step7Package({ configuration, updateConfiguration, onValidationError }: Step7Props) {
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
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
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

    if (!configuration.modelId || !configuration.coverageId || !configuration.structureColor) {
      onValidationError?.("⚠️ Configurazione incompleta. Torna indietro e completa tutti i passaggi")
      return
    }

    setIsSubmitting(true)

    try {
      const configurationData = {
        configurator_type: 'legno' as const,
        structure_type: configuration.structureType || configuration.structureTypeId || "",
        model_id: configuration.modelId,
        width: configuration.width || 0,
        depth: configuration.depth || 0,
        height: configuration.height || 0,
        coverage_id: configuration.coverageId,
        structure_color: configuration.structureColor,
        coverage_color: configuration.coverageColor,
        surface_id: configuration.surfaceId,
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

      const result = await saveConfiguration(configurationData)

      if (!result.success) {
        console.error("Error saving configuration:", result.error)
        onValidationError?.("❌ Errore nel salvare la configurazione. Riprova.")
        return
      }

      trackConfiguratorSubmit({
        package_type: selectedPackage,
        contact_preference: contactPreference,
        customer_city: customerData.city,
        customer_province: "",
        structure_type: configuration.structureType || configuration.structureTypeId,
        has_dimensions: !!(configuration.width && configuration.depth && configuration.height),
      })

      if (result.data) {
        try {
          await fetch("/api/send-configuration-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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
      <div className="text-center py-16">
        <CheckCircleIcon />
        <h2 className="text-3xl font-bold text-primary mb-4 mt-6">Configurazione Inviata!</h2>
        <p className="text-secondary text-lg max-w-xl mx-auto">
          Grazie per aver configurato il tuo carport. Ti contatteremo presto per finalizzare il progetto e fornirti un preventivo personalizzato.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* INTESTAZIONE */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold text-primary">Dati di Contatto</h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Scegli il tipo di servizio e inserisci i tuoi dati per ricevere il preventivo personalizzato
        </p>
      </div>

      {/* BLOCCO 1: SCELTA TIPO SERVIZIO */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Tipo di Servizio</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* CARD A: CHIAVI IN MANO */}
          <div
            onClick={() => setSelectedPackage("chiavi-in-mano")}
            className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
              selectedPackage === "chiavi-in-mano"
                ? "border-primary bg-surface-beige shadow-md"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            {/* Radio Button */}
            <div className="absolute top-6 right-6">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPackage === "chiavi-in-mano" ? "border-primary bg-primary" : "border-gray-400"
              }`}>
                {selectedPackage === "chiavi-in-mano" && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* Contenuto */}
            <div className="pr-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔑</span>
                <div>
                  <h3 className="text-xl font-bold text-primary">Chiavi in Mano</h3>
                  <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                    COMPLETO
                  </span>
                </div>
              </div>
              
              <p className="text-sm font-semibold text-primary mb-3">Con Trasporto e Montaggio</p>
              
              <p className="text-sm text-secondary mb-4">
                Servizio completo: progettazione, fornitura, trasporto e installazione professionale
              </p>

              <ul className="space-y-2">
                {[
                  "Sopralluogo gratuito",
                  "Montaggio professionale",
                  "Garanzia completa",
                  "Assistenza post-vendita"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CARD B: SOLO FORNITURA */}
          <div
            onClick={() => setSelectedPackage("fai-da-te")}
            className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
              selectedPackage === "fai-da-te"
                ? "border-primary bg-surface-beige shadow-md"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            {/* Radio Button */}
            <div className="absolute top-6 right-6">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPackage === "fai-da-te" ? "border-primary bg-primary" : "border-gray-400"
              }`}>
                {selectedPackage === "fai-da-te" && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* Contenuto */}
            <div className="pr-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📦</span>
                <div>
                  <h3 className="text-xl font-bold text-primary">Solo Fornitura</h3>
                  <span className="inline-block bg-orange-400 text-orange-900 text-xs font-semibold px-2 py-1 rounded">
                    ECONOMICO
                  </span>
                </div>
              </div>
              
              <p className="text-sm font-semibold text-primary mb-3">Fai da Te</p>
              
              <p className="text-sm text-secondary mb-4">
                Solo materiali con istruzioni dettagliate per il montaggio autonomo
              </p>

              <ul className="space-y-2">
                {[
                  "Prezzo più conveniente",
                  "Istruzioni dettagliate",
                  "Supporto telefonico",
                  "Video tutorial inclusi"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCCO 2: FORM DATI PERSONALI + PREFERENZE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">I Tuoi Dati</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* COLONNA SINISTRA: FORM */}
          <div className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Mario"
              />
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Cognome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.surname}
                onChange={(e) => setCustomerData({ ...customerData, surname: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Rossi"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="mario.rossi@email.com"
              />
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Telefono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+39 333 123 4567"
              />
            </div>

            {/* Città */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Città <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Milano"
              />
            </div>

            {/* Indirizzo */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Indirizzo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Via Roma 123"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Note
              </label>
              <textarea
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Eventuali richieste o informazioni aggiuntive..."
              />
            </div>

            {/* GDPR Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="privacy" className="text-sm text-secondary leading-relaxed">
                Acconsento al trattamento dei miei dati personali secondo la{" "}
                <a href="https://www.martello1930.net/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Privacy Policy
                </a>{" "}
                in conformità al GDPR.
              </label>
            </div>
          </div>

          {/* COLONNA DESTRA: PREFERENZE CONTATTO */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Preferenza di Contatto</h3>
            <p className="text-sm text-secondary mb-6">Come preferisci essere ricontattato?</p>

            <div className="space-y-4">
              {/* Email */}
              <div
                onClick={() => setContactPreference("email")}
                className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex items-center gap-4 ${
                  contactPreference === "email"
                    ? "border-primary bg-surface-beige shadow-md"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <span className="text-4xl">📧</span>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">Email</h4>
                  <p className="text-sm text-secondary">Ricevi il preventivo via email</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  contactPreference === "email" ? "border-primary bg-primary" : "border-gray-400"
                }`}>
                  {contactPreference === "email" && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Telefono */}
              <div
                onClick={() => setContactPreference("phone")}
                className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex items-center gap-4 ${
                  contactPreference === "phone"
                    ? "border-primary bg-surface-beige shadow-md"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <span className="text-4xl">📞</span>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">Telefono</h4>
                  <p className="text-sm text-secondary">Chiamata diretta per discutere il preventivo</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  contactPreference === "phone" ? "border-primary bg-primary" : "border-gray-400"
                }`}>
                  {contactPreference === "phone" && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* WhatsApp */}
              <div
                onClick={() => setContactPreference("whatsapp")}
                className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex items-center gap-4 ${
                  contactPreference === "whatsapp"
                    ? "border-primary bg-surface-beige shadow-md"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <span className="text-4xl">💬</span>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">WhatsApp</h4>
                  <p className="text-sm text-secondary">Chat veloce e comoda su WhatsApp</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  contactPreference === "whatsapp" ? "border-primary bg-primary" : "border-gray-400"
                }`}>
                  {contactPreference === "whatsapp" && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTONE SUBMIT */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full md:w-auto md:min-w-[300px] mx-auto block bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
          </button>
        </div>
      </div>
    </div>
  )
}
