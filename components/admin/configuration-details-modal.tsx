"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Shield, Palette, Settings, User, Phone, Mail, MapPin } from "lucide-react"

interface ConfigurationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  configuration: any
}

export function ConfigurationDetailsModal({ isOpen, onClose, configuration }: ConfigurationDetailsModalProps) {
  if (!configuration) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  // Calculate estimated price based on dimensions and service type
  const calculateEstimatedPrice = () => {
    const basePrice = 150 // €/m²
    const surface = (configuration.width * configuration.depth) / 10000 // Convert cm² to m²
    const structureMultiplier = configuration.configuratorelegno_pergola_types?.name?.includes("Bioclimatica") ? 1.5 : 1
    const serviceMultiplier = configuration.service_type === "chiavi-in-mano" ? 1.3 : 1

    return Math.round(surface * basePrice * structureMultiplier * serviceMultiplier)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Dettagli Configurazione
          </DialogTitle>
          <DialogDescription>Richiesta del {formatDate(configuration.created_at)}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Informazioni Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Nome Completo</p>
                  <p className="text-gray-600">
                    {configuration.contact_data?.firstName} {configuration.contact_data?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Preferenza Contatto</p>
                  <Badge variant="outline" className="mt-1">
                    {configuration.contact_preference === "email" && <Mail className="w-3 h-3 mr-1" />}
                    {configuration.contact_preference === "phone" && <Phone className="w-3 h-3 mr-1" />}
                    {configuration.contact_preference === "whatsapp" && <Phone className="w-3 h-3 mr-1" />}
                    {configuration.contact_preference}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">{configuration.contact_data?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Telefono</p>
                  <p className="text-gray-600">{configuration.contact_data?.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Indirizzo
                </p>
                <p className="text-gray-600">{configuration.contact_data?.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Structure & Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Struttura e Dimensioni
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tipo Struttura</p>
                  <p className="text-gray-600">{configuration.configuratorelegno_pergola_types?.name}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Larghezza</p>
                    <p className="text-gray-600">{configuration.width} cm</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profondità</p>
                    <p className="text-gray-600">{configuration.depth} cm</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Altezza</p>
                    <p className="text-gray-600">{configuration.height} cm</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Superficie</p>
                  <p className="text-gray-600">{((configuration.width * configuration.depth) / 10000).toFixed(2)} m²</p>
                </div>
              </CardContent>
            </Card>

            {/* Coverage & Color */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Copertura e Colore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tipo Copertura</p>
                  <p className="text-gray-600">{configuration.configuratorelegno_coverage_types?.name}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    Colore Struttura
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: configuration.color_value }} />
                    <span className="text-gray-600">{configuration.color_name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accessories */}
          {configuration.accessories && configuration.accessories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Accessori Selezionati
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {configuration.accessories.map((accessory: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <span className="text-lg">{accessory.icon}</span>
                      <span className="text-sm text-gray-600">{accessory.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Servizio e Preventivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tipo Servizio</p>
                  <Badge variant={configuration.service_type === "chiavi-in-mano" ? "default" : "secondary"}>
                    {configuration.service_type === "chiavi-in-mano" ? "Chiavi in Mano" : "Fai da Te"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Preventivo Stimato</p>
                  <p className="text-lg font-semibold text-emerald-600">{formatCurrency(calculateEstimatedPrice())}</p>
                </div>
              </div>

              <Separator />

              <div className="text-xs text-gray-500">
                <p>* Il preventivo è indicativo e basato su dimensioni, tipo di struttura e servizio selezionato.</p>
                <p>* Per un preventivo definitivo è necessario un sopralluogo tecnico.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
