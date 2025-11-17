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

// Type per errors
type FormErrors = {
  name?: string
  surname?: string
  email?: string
  phone?: string
  city?: string
  address?: string
  privacy_consent?: string
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validazione Email
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  
  // Validazione Telefono (NUOVO - dallo spec)
  const validatePhone = (phone: string) => /^[+]?[\d\s-()]{8,}$/.test(phone)

  // Handle Input Change con Clear Error (NUOVO - dallo spec)
  const handleInputChange = (field: keyof typeof customerData, value: string) => {
    const newCustomerData = { ...customerData, [field]: value }
    setCustomerData(newCustomerData)
    
    // Clear error quando user digita (SPEC requirement)
    const errorKey = field as keyof FormErrors
    if (errors[errorKey]) {
      const newErrors = { ...errors }
      delete newErrors[errorKey]
      setErrors(newErrors)
    }
  }

  // Validazione Form Completa
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Required fields
    if (!customerData.name.trim()) newErrors.name = "Nome richiesto"
    if (!customerData.surname.trim()) newErrors.surname = "Cognome richiesto"
    
    // Email validation
    if (!customerData.email.trim()) {
      newErrors.email = "Email richiesta"
    } else if (!validateEmail(customerData.email)) {
      newErrors.email = "Email non valida"
    }
    
    // Phone validation (NUOVO - dallo spec)
    if (!customerData.phone.trim()) {
      newErrors.phone = "Telefono richiesto"
    } else if (!validatePhone(customerData.phone)) {
      newErrors.phone = "Telefono non valido (es: +39 123 456 7890)"
    }
    
    // Other required fields
    if (!customerData.city.trim()) newErrors.city = "Città richiesta"
    if (!customerData.address.trim()) newErrors.address = "Indirizzo richiesto"
    
    // Privacy consent
    if (!privacyAccepted) {
      newErrors.privacy_consent = "Consenso privacy richiesto"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check se form è valido (per messaggio condizionale)
  const isFormValid = () => {
    return selectedPackage && 
           customerData.name && 
           customerData.surname && 
           customerData.email && 
           validateEmail(customerData.email) &&
           customerData.phone && 
           validatePhone(customerData.phone) &&
           customerData.city && 
           customerData.address && 
           privacyAccepted
  }

  const handleSubmit = async () => {
    if (!selectedPackage) {
      onValidationError?.("⚠️ Seleziona un tipo di servizio")
      return
    }

    // Validazione completa con inline errors
    if (!validateForm()) {
      onValidationError?.("⚠️ Correggi gli errori nel form prima di inviare")
      window.scrollTo({ top: 0, behavior: "smooth" })
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
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Dati di Contatto</h1>
          <p className="text-lg text-[#666666]">
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
              {/* Badge Checkmark Assoluto (NUOVO - dallo spec) */}
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

              {/* Box Vantaggi con Background Colorato (NUOVO - dallo spec) */}
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
              {/* Badge Checkmark Assoluto (NUOVO - dallo spec) */}
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

              {/* Box Vantaggi con Background Colorato (NUOVO - dallo spec) */}
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* COLONNA SINISTRA: DATI PERSONALI */}
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Dati Personali</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="block text-sm font-medium text-[#333333]">
                  Nome *
                </label>
                <input
                  id="nome"
                  type="text"
                  value={customerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                    errors.name ? "border-red-500" : "border-[#D0D0D0]"
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "nome-error" : undefined}
                />
                {errors.name && (
                  <p id="nome-error" className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cognome" className="block text-sm font-medium text-[#333333]">
                  Cognome *
                </label>
                <input
                  id="cognome"
                  type="text"
                  value={customerData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                    errors.surname ? "border-red-500" : "border-[#D0D0D0]"
                  }`}
                  aria-invalid={errors.surname ? "true" : "false"}
                  aria-describedby={errors.surname ? "cognome-error" : undefined}
                />
                {errors.surname && (
                  <p id="cognome-error" className="text-xs text-red-600">{errors.surname}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#333333]">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-[#D0D0D0]"
                }`}
                placeholder="tuaemail@esempio.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="telefono" className="block text-sm font-medium text-[#333333]">
                Telefono *
              </label>
              <input
                id="telefono"
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                  errors.phone ? "border-red-500" : "border-[#D0D0D0]"
                }`}
                placeholder="+39 123 456 7890"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "telefono-error" : undefined}
              />
              {errors.phone && (
                <p id="telefono-error" className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="citta" className="block text-sm font-medium text-[#333333]">
                Città *
              </label>
              <input
                id="citta"
                type="text"
                value={customerData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                  errors.city ? "border-red-500" : "border-[#D0D0D0]"
                }`}
                placeholder="Es. Milano"
                aria-invalid={errors.city ? "true" : "false"}
                aria-describedby={errors.city ? "citta-error" : undefined}
              />
              {errors.city && (
                <p id="citta-error" className="text-xs text-red-600">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="indirizzo" className="block text-sm font-medium text-[#333333]">
                Indirizzo *
              </label>
              <input
                id="indirizzo"
                type="text"
                value={customerData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all ${
                  errors.address ? "border-red-500" : "border-[#D0D0D0]"
                }`}
                placeholder="Via, Numero Civico"
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "indirizzo-error" : undefined}
              />
              {errors.address && (
                <p id="indirizzo-error" className="text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="block text-sm font-medium text-[#333333]">
                Note (opzionali)
              </label>
              <textarea
                id="note"
                value={customerData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-[14px] border border-[#D0D0D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E2723] focus:border-transparent transition-all resize-none"
                placeholder="Eventuali richieste specifiche..."
              />
            </div>
          </div>

          {/* COLONNA DESTRA: PREFERENZE CONTATTO */}
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#333333] mb-2">Preferenze di Contatto</h2>
            <p className="text-[#666666] mb-6">
              Scegli come preferisci essere contattato per il preventivo
            </p>

            <div className="space-y-4">
              {/* OPZIONE EMAIL */}
              <div
                onClick={() => setContactPreference("email")}
                className={`relative flex items-center space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  contactPreference === "email"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/15 to-[#3E2723]/25 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#D0D0D0] bg-white hover:border-[#3E2723]/60 hover:shadow-md hover:scale-105"
                }`}
              >
                {contactPreference === "email" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "email"}
                  onChange={() => setContactPreference("email")}
                  className="w-5 h-5 flex-shrink-0 accent-[#3E2723] scale-125"
                />
                <label className="cursor-pointer flex-1 flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333]">Email</h3>
                    <p className="text-sm text-[#666666]">Ricevi il preventivo via email</p>
                  </div>
                </label>
              </div>

              {/* OPZIONE TELEFONO */}
              <div
                onClick={() => setContactPreference("telefono")}
                className={`relative flex items-center space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  contactPreference === "telefono"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/15 to-[#3E2723]/25 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#D0D0D0] bg-white hover:border-[#3E2723]/60 hover:shadow-md hover:scale-105"
                }`}
              >
                {contactPreference === "telefono" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "telefono"}
                  onChange={() => setContactPreference("telefono")}
                  className="w-5 h-5 flex-shrink-0 accent-[#3E2723] scale-125"
                />
                <label className="cursor-pointer flex-1 flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333]">Telefono</h3>
                    <p className="text-sm text-[#666666]">Chiamata diretta per discutere il preventivo</p>
                  </div>
                </label>
              </div>

              {/* OPZIONE WHATSAPP */}
              <div
                onClick={() => setContactPreference("whatsapp")}
                className={`relative flex items-center space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  contactPreference === "whatsapp"
                    ? "border-[#3E2723] bg-gradient-to-br from-[#3E2723]/15 to-[#3E2723]/25 ring-2 ring-[#3E2723]/30 shadow-lg scale-105"
                    : "border-[#D0D0D0] bg-white hover:border-[#3E2723]/60 hover:shadow-md hover:scale-105"
                }`}
              >
                {contactPreference === "whatsapp" && (
                  <div className="absolute -top-2 -right-2 bg-[#3E2723] text-white rounded-full p-1.5 shadow-lg">
                    <BadgeCheckIcon />
                  </div>
                )}
                <input
                  type="radio"
                  checked={contactPreference === "whatsapp"}
                  onChange={() => setContactPreference("whatsapp")}
                  className="w-5 h-5 flex-shrink-0 accent-[#3E2723] scale-125"
                />
                <label className="cursor-pointer flex-1 flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333]">WhatsApp</h3>
                    <p className="text-sm text-[#666666]">Chat veloce e comoda su WhatsApp</p>
                  </div>
                </label>
              </div>
            </div>

            {/* PRIVACY CHECKBOX */}
            <div className="mt-6 pt-6 border-t border-[#E8E8E8] space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy_consent"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked)
                    if (errors.privacy_consent && e.target.checked) {
                      setErrors({ ...errors, privacy_consent: undefined })
                    }
                  }}
                  className={`mt-1 w-5 h-5 flex-shrink-0 accent-[#3E2723] ${
                    errors.privacy_consent ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.privacy_consent ? "true" : "false"}
                  aria-describedby={errors.privacy_consent ? "privacy-error" : undefined}
                />
                <div className="space-y-1">
                  <label htmlFor="privacy_consent" className="text-sm cursor-pointer text-[#333333]">
                    Acconsento al trattamento dei miei dati personali *
                  </label>
                  <p className="text-xs text-[#666666]">
                    Accetto che i miei dati vengano utilizzati per l'invio del preventivo e per eventuali comunicazioni commerciali. 
                    I dati saranno trattati secondo la{" "}
                    <a href="/privacy-policy" target="_blank" className="text-[#3E2723] hover:underline">
                      Privacy Policy
                    </a>{" "}
                    in conformità al GDPR (UE 2016/679).
                  </p>
                </div>
              </div>
              {errors.privacy_consent && (
                <p id="privacy-error" className="text-xs text-red-600 ml-8">{errors.privacy_consent}</p>
              )}
            </div>

            {/* PULSANTE INVIO */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 bg-[#3E2723] hover:bg-[#2C1810] text-white py-4 rounded-xl text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
            </button>
            <p className="text-center text-sm text-[#666666] mt-3">
              Riceverai un preventivo personalizzato entro 24 ore
            </p>
          </div>
        </div>

        {/* MESSAGGIO VALIDAZIONE CONDIZIONALE (NUOVO - dallo spec) */}
        {!isFormValid() && (
          <div className="text-center mt-6">
            <p className="text-[#666666] text-lg">
              ℹ️ Completa tutti i campi obbligatori e accetta il consenso privacy per continuare
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
