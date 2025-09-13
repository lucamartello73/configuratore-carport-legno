"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { ConfigurationData } from "@/app/configuratore/page"
import { CheckCircle } from "lucide-react"
import { saveConfiguration } from "@/app/actions/save-configuration"

interface Step7Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

const packageTypes = [
  {
    id: "base",
    name: "Pacchetto Base",
    description: "Solo struttura e copertura",
    priceModifier: 0,
  },
  {
    id: "completo",
    name: "Pacchetto Completo",
    description: "Include installazione e superficie",
    priceModifier: 500,
  },
  {
    id: "premium",
    name: "Pacchetto Premium",
    description: "Include tutto + garanzia estesa",
    priceModifier: 1000,
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
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    calculateTotalPrice()
  }, [configuration, selectedPackage])

  const calculateTotalPrice = async () => {
    if (!configuration.modelId) return

    const supabase = createClient()
    let price = 0

    // Get base model price
    if (configuration.modelId) {
      const { data: model } = await supabase
        .from("carport_models")
        .select("base_price")
        .eq("id", configuration.modelId)
        .single()

      if (model) price += model.base_price
    }

    // Add coverage price modifier
    if (configuration.coverageId) {
      const { data: coverage } = await supabase
        .from("carport_coverage_types")
        .select("price_modifier")
        .eq("id", configuration.coverageId)
        .single()

      if (coverage) price += coverage.price_modifier
    }

    // Add color price modifiers
    if (configuration.structureColorId) {
      const { data: color } = await supabase
        .from("carport_colors")
        .select("price_modifier")
        .eq("id", configuration.structureColorId)
        .single()

      if (color) price += color.price_modifier
    }

    if (configuration.coverageColorId) {
      const { data: color } = await supabase
        .from("carport_colors")
        .select("price_modifier")
        .eq("id", configuration.coverageColorId)
        .single()

      if (color) price += color.price_modifier
    }

    // Add surface price
    if (configuration.surfaceId && configuration.width && configuration.depth) {
      const { data: surface } = await supabase
        .from("carport_surfaces")
        .select("price_per_sqm")
        .eq("id", configuration.surfaceId)
        .single()

      if (surface) {
        const surfaceArea = (configuration.width * configuration.depth) / 10000
        price += surface.price_per_sqm * surfaceArea
      }
    }

    // Add package modifier
    const packageData = packageTypes.find((p) => p.id === selectedPackage)
    if (packageData) {
      price += packageData.priceModifier
    }

    setTotalPrice(price)
    updateConfiguration({ totalPrice: price, packageType: selectedPackage, ...customerData })
  }

  const handleSubmit = async () => {
    if (!selectedPackage || !customerData.name || !customerData.email || !customerData.phone) {
      alert("Compila tutti i campi obbligatori")
      return
    }

    console.log("[v0] Configuration validation check:", {
      modelId: configuration.modelId,
      coverageId: configuration.coverageId,
      structureColorId: configuration.structureColorId,
      coverageColorId: configuration.coverageColorId,
      surfaceId: configuration.surfaceId,
      structureType: configuration.structureType,
      width: configuration.width,
      depth: configuration.depth,
      height: configuration.height,
    })

    if (
      !configuration.modelId ||
      !configuration.coverageId ||
      !configuration.structureColorId ||
      !configuration.coverageColorId ||
      !configuration.surfaceId
    ) {
      console.log("[v0] Missing required fields:", {
        modelId: !configuration.modelId ? "MISSING" : "OK",
        coverageId: !configuration.coverageId ? "MISSING" : "OK",
        structureColorId: !configuration.structureColorId ? "MISSING" : "OK",
        coverageColorId: !configuration.coverageColorId ? "MISSING" : "OK",
        surfaceId: !configuration.surfaceId ? "MISSING" : "OK",
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
        structure_color_id: configuration.structureColorId,
        coverage_color_id: configuration.coverageColorId,
        surface_id: configuration.surfaceId,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_city: customerData.city,
        customer_cap: customerData.cap,
        customer_province: customerData.province,
        package_type: selectedPackage,
        total_price: totalPrice,
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
              totalPrice,
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
          Grazie per aver configurato il tuo carport. Ti contatteremo presto per finalizzare il progetto.
        </p>
        <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
          Prezzo Totale: €{totalPrice.toLocaleString()}
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Package Selection */}
      <div>
        <h3 className="text-gray-900 font-semibold mb-4">Seleziona il pacchetto</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {packageTypes.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-green-50"
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                <p className="text-sm text-gray-700 mb-2">{pkg.description}</p>
                <Badge className="bg-orange-500 text-white">
                  {pkg.priceModifier > 0 ? `+€${pkg.priceModifier}` : "Incluso"}
                </Badge>
              </CardContent>
            </Card>
          ))}
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

      {/* Price Summary */}
      <Card className="bg-green-50">
        <CardHeader>
          <CardTitle className="text-gray-900">Riepilogo Prezzo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">€{totalPrice.toLocaleString()}</div>
            <p className="text-gray-700">Prezzo totale IVA inclusa</p>
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
      </div>
    </div>
  )
}
