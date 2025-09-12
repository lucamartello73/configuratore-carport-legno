"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Phone, MessageCircle } from "lucide-react"
import { getStoredCustomerData, setStoredCustomerData, type CustomerData } from "@/lib/localStorage"

export default function CustomerDataPage() {
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const [contactPreference, setContactPreference] = useState<"email" | "whatsapp" | "phone">("email")
  const [errors, setErrors] = useState<Partial<CustomerData>>({})

  useEffect(() => {
    // Load stored data
    const stored = getStoredCustomerData()
    if (stored) {
      setCustomerData(stored)
    }
  }, [])

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {}

    if (!customerData.firstName.trim()) {
      newErrors.firstName = "Nome richiesto"
    }
    if (!customerData.lastName.trim()) {
      newErrors.lastName = "Cognome richiesto"
    }
    if (!customerData.email.trim()) {
      newErrors.email = "Email richiesta"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = "Email non valida"
    }
    if (!customerData.phone.trim()) {
      newErrors.phone = "Telefono richiesto"
    }
    if (!customerData.address.trim()) {
      newErrors.address = "Indirizzo richiesto"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      setStoredCustomerData(customerData)
      // Navigation will be handled by the Navigation component
    }
  }

  const isValid = useMemo(() => {
    const newErrors: Partial<CustomerData> = {}

    if (!customerData.firstName.trim()) {
      newErrors.firstName = "Nome richiesto"
    }
    if (!customerData.lastName.trim()) {
      newErrors.lastName = "Cognome richiesto"
    }
    if (!customerData.email.trim()) {
      newErrors.email = "Email richiesta"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = "Email non valida"
    }
    if (!customerData.phone.trim()) {
      newErrors.phone = "Telefono richiesto"
    }
    if (!customerData.address.trim()) {
      newErrors.address = "Indirizzo richiesto"
    }

    return Object.keys(newErrors).length === 0
  }, [customerData])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="configurator-bg">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">I Tuoi Dati</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Inserisci i tuoi dati per ricevere il preventivo personalizzato
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Customer Form */}
            <div className="glass-card rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dati Personali</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-900 font-medium">
                    Nome *
                  </Label>
                  <Input
                    id="firstName"
                    value={customerData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`mt-2 ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="Il tuo nome"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-900 font-medium">
                    Cognome *
                  </Label>
                  <Input
                    id="lastName"
                    value={customerData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`mt-2 ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Il tuo cognome"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="la-tua-email@esempio.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="phone" className="text-gray-900 font-medium">
                  Telefono *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`mt-2 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="+39 123 456 7890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="address" className="text-gray-900 font-medium">
                  Indirizzo di Installazione *
                </Label>
                <Input
                  id="address"
                  value={customerData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={`mt-2 ${errors.address ? "border-red-500" : ""}`}
                  placeholder="Via, Città, CAP, Provincia"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Contact Preference */}
            <div className="glass-card rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferenza di Contatto</h3>

              <RadioGroup value={contactPreference} onValueChange={(value) => setContactPreference(value as any)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RadioGroupItem value="email" id="email-pref" />
                    <Mail className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="email-pref" className="flex-1 cursor-pointer">
                      <span className="font-medium text-gray-900">Email</span>
                      <p className="text-sm text-gray-600">Ricevi il preventivo via email</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RadioGroupItem value="whatsapp" id="whatsapp-pref" />
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="whatsapp-pref" className="flex-1 cursor-pointer">
                      <span className="font-medium text-gray-900">WhatsApp</span>
                      <p className="text-sm text-gray-600">Contatto rapido via WhatsApp</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RadioGroupItem value="phone" id="phone-pref" />
                    <Phone className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="phone-pref" className="flex-1 cursor-pointer">
                      <span className="font-medium text-gray-900">Chiamata Telefonica</span>
                      <p className="text-sm text-gray-600">Ti chiamiamo per discutere il progetto</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Privacy Notice */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-700">
                <strong>Privacy:</strong> I tuoi dati saranno utilizzati esclusivamente per elaborare il preventivo e
                contattarti. Non verranno condivisi con terze parti. Puoi richiedere la cancellazione in qualsiasi
                momento.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <Navigation
            currentStep={8}
            totalSteps={9}
            prevHref="/configurator/service-type"
            nextHref={isValid ? "/configurator/confirmation" : undefined}
            nextDisabled={!isValid}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  )
}
