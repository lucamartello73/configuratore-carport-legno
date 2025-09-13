"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ConfigurationData } from "@/app/configuratore/page"
import { saveConfiguration } from "@/app/actions/save-configuration"

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Wrench = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
)

interface Step7Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const packageTypes = [
  {
    id: "chiavi-in-mano",
    name: "Servizio Chiavi in Mano",
    description: "Trasporto, montaggio e installazione completa inclusi",
    icon: Wrench,
    recommended: true,
    features: [
      "Trasporto della pergola al tuo indirizzo",
      "Montaggio professionale da parte dei nostri tecnici",
      "Installazione e messa in opera completa",
    ],
    note: "Risparmia tempo e assicurati un montaggio perfetto",
  },
  {
    id: "fai-da-te",
    name: "Solo Struttura - Fai da Te",
    description: "Ricevi solo la struttura per il montaggio autonomo",
    icon: Package,
    recommended: false,
    features: [
      "Struttura completa con tutti i componenti",
      "Supporto telefonico per il montaggio",
      "Garanzia sui materiali",
    ],
    note: "Richiede competenze di base nel montaggio",
  },
]

export function Step7Package({ configuration, updateConfiguration }: Step7Props) {
  const [selectedPackage, setSelectedPackage] = useState(configuration.packageType || "")
  const [customerData, setCustomerData] = useState({
    name: configuration.customerName || "",
    email: configuration.customerEmail || "",
    phone: configuration.customerPhone || "",
    address: configuration.customerAddress || "",
    city: configuration.customerCity || "",
    cap: configuration.customerCap || "",
    province: configuration.customerProvince || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selectedPackage || !customerData.name || !customerData.email || !customerData.phone) {
      alert("Compila tutti i campi obbligatori")
      return
    }

    console.log("[v0] Configuration validation check:", {
      modelId: configuration.modelId,
      coverageId: configuration.coverageId,
      structureColor: configuration.structureColor,
      structureType: configuration.structureType,
      width: configuration.width,
      depth: configuration.depth,
      height: configuration.height,
    })

    if (
      !configuration.modelId ||
      !configuration.coverageId ||
      !configuration.structureColor ||
      !configuration.structureType
    ) {
      console.log("[v0] Missing required fields:", {
        modelId: !configuration.modelId ? "MISSING" : "OK",
        coverageId: !configuration.coverageId ? "MISSING" : "OK",
        structureColor: !configuration.structureColor ? "MISSING" : "OK",
        structureType: !configuration.structureType ? "MISSING" : "OK",
      })
      alert("Configurazione incompleta. Assicurati di aver completato tutti i passaggi.")
      return
    }

    setIsSubmitting(true)

    try {
      const configurationData = {
        structure_type: configuration.structureType || "",
        model_id: configuration.modelId,
        width: configuration.width || 0,
        depth: configuration.depth || 0,
        height: configuration.height || 0,
        coverage_id: configuration.coverageId,
        structure_color: configuration.structureColor,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_city: customerData.city,
        customer_cap: customerData.cap,
        customer_province: customerData.province,
        package_type: selectedPackage,
        total_price: 0,
        status: "nuovo",
      }

      const result = await saveConfiguration(configurationData)

      if (!result.success) {
        console.error("Error saving configuration:", result.error)
        alert(`Errore nel salvare la configurazione: ${result.error}`)
        return
      }

      if (result.data) {
        try {
          await fetch("/api/send-configuration-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerName: customerData.name,
              customerEmail: customerData.email,
              configurationId: result.data.id,
              totalPrice: 0,
              structureType: configuration.structureType || "Non specificato",
              dimensions: `${configuration.width}×${configuration.depth}×${configuration.height} cm`,
            }),
          })
        } catch (emailError) {
          console.error("Error sending email:", emailError)
          // Don't fail the whole process if email fails
        }
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Errore nel salvare la configurazione")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurazione Inviata!</h2>
        <p className="text-gray-700 mb-6">
          Grazie per aver configurato il tuo carport. Ti contatteremo presto per finalizzare il progetto e fornirti un
          preventivo personalizzato.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Package Selection */}
      <div>
        <h3 className="text-gray-900 font-semibold mb-2">Tipo di Servizio</h3>
        <p className="text-gray-600 mb-6">
          Scegli se vuoi il servizio completo di installazione o preferisci montare la pergola autonomamente
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {packageTypes.map((pkg) => {
            const IconComponent = pkg.icon
            return (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all relative ${
                  selectedPackage === pkg.id
                    ? "ring-2 ring-orange-500 bg-orange-50"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.recommended && (
                  <div className="absolute -top-2 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Consigliato
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{pkg.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-700">Include:</p>
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-sm">💡</span>
                        <p className="text-sm text-gray-600 italic">{pkg.note}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Dati di Contatto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome e Cognome *</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefono *</Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">Città</Label>
              <Input
                id="city"
                value={customerData.city}
                onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cap">CAP</Label>
              <Input
                id="cap"
                value={customerData.cap}
                onChange={(e) => setCustomerData({ ...customerData, cap: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={customerData.province}
                onChange={(e) => setCustomerData({ ...customerData, province: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting || !selectedPackage || !customerData.name || !customerData.email || !customerData.phone
          }
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
        >
          {isSubmitting ? "Invio in corso..." : "Invia Configurazione"}
        </Button>
        <p className="text-gray-600 text-sm mt-2">Riceverai un preventivo personalizzato via email</p>
      </div>
    </div>
  )
}
