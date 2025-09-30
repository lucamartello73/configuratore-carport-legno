"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AdminLayout } from "@/components/admin/admin-layout"
import { createClient } from "@/lib/supabase/client"
import { deleteConfiguration } from "@/app/actions/delete-configuration"
import { Eye, Mail, Search, Trash2 } from "lucide-react"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_cap: string
  customer_province: string
  structure_type: string // Added structure_type field
  model_id: string // Added model_id field
  width: number
  depth: number
  height: number
  package_type: string
  contact_preference: string
  total_price: number
  status: string
  created_at: string
  // Related data from JOINs
  model_name: string
  structure_type_name: string
  structure_color_name: string
  coverage_name: string
  surface_name: string
}

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [filteredConfigurations, setFilteredConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchConfigurations = async () => {
      const supabase = createClient()

      try {
        const { data: configurationsData, error } = await supabase
          .from("carport_configurations")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching configurations:", error)
          throw error
        }

        // Fetch related data separately
        const [modelsData, structureTypesData, colorsData, coveragesData, surfacesData] = await Promise.all([
          supabase.from("carport_models").select("id, name"),
          supabase.from("carport_structure_types").select("id, name"),
          supabase.from("carport_colors").select("id, name"),
          supabase.from("carport_coverage_types").select("id, name"),
          supabase.from("carport_surfaces").select("id, name"),
        ])

        // Create lookup maps
        const modelsMap = new Map(modelsData.data?.map((m) => [m.id, m.name]) || [])
        const structureTypesMap = new Map(structureTypesData.data?.map((s) => [s.id, s.name]) || [])
        const colorsMap = new Map(colorsData.data?.map((c) => [c.id, c.name]) || [])
        const coveragesMap = new Map(coveragesData.data?.map((c) => [c.id, c.name]) || [])
        const surfacesMap = new Map(surfacesData.data?.map((s) => [s.id, s.name]) || [])

        // Transform configurations with related data
        const transformedConfigurations =
          configurationsData?.map((config) => ({
            ...config,
            model_name: modelsMap.get(config.model_id) || "N/A",
            structure_type_name: config.structure_type || "N/A",
            structure_color_name: colorsMap.get(config.structure_color_id) || "N/A",
            coverage_name: coveragesMap.get(config.coverage_id) || "N/A",
            surface_name: surfacesMap.get(config.surface_id) || "N/A",
          })) || []

        setConfigurations(transformedConfigurations)
        setFilteredConfigurations(transformedConfigurations)
      } catch (error) {
        console.error("Error in fetchConfigurations:", error)
      }

      setLoading(false)
    }

    fetchConfigurations()
  }, [])

  useEffect(() => {
    let filtered = configurations

    if (searchTerm) {
      filtered = filtered.filter(
        (config) =>
          config.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          config.customer_email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((config) => config.status === statusFilter)
    }

    setFilteredConfigurations(filtered)
  }, [configurations, searchTerm, statusFilter])

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("carport_configurations").update({ status: newStatus }).eq("id", id)

    if (error) {
      console.error("Error updating status:", error)
    } else {
      setConfigurations((prev) => prev.map((config) => (config.id === id ? { ...config, status: newStatus } : config)))
    }
  }

  const handleDelete = async (configurationId: string, customerName: string) => {
    const result = await deleteConfiguration(configurationId)

    if (result.success) {
      // Remove from local state
      setConfigurations((prev) => prev.filter((config) => config.id !== configurationId))
      console.log(`Configurazione di ${customerName} eliminata con successo`)
    } else {
      console.error("Errore durante l'eliminazione:", result.error)
      alert("Errore durante l'eliminazione della configurazione")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nuovo":
        return <Badge className="bg-orange-500 text-white">Nuovo</Badge>
      case "in_lavorazione":
        return <Badge className="bg-blue-500 text-white">In Lavorazione</Badge>
      case "completato":
        return <Badge className="bg-green-500 text-white">Completato</Badge>
      case "annullato":
        return <Badge className="bg-red-500 text-white">Annullato</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-green-600">Caricamento configurazioni...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Filtri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    placeholder="Cerca per nome o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtra per stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="nuovo">Nuovo</SelectItem>
                  <SelectItem value="in_lavorazione">In Lavorazione</SelectItem>
                  <SelectItem value="completato">Completato</SelectItem>
                  <SelectItem value="annullato">Annullato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Configurazioni ({filteredConfigurations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConfigurations.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold text-green-800">{config.customer_name}</h3>
                        {getStatusBadge(config.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-600 mb-3">
                        <div>
                          <span className="font-medium">Email:</span> {config.customer_email}
                        </div>
                        <div>
                          <span className="font-medium">Telefono:</span> {config.customer_phone}
                        </div>
                        <div>
                          <span className="font-medium">Indirizzo:</span> {config.customer_address}
                        </div>
                        <div>
                          <span className="font-medium">Città:</span> {config.customer_city} ({config.customer_cap}) -{" "}
                          {config.customer_province}
                        </div>
                        <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-400">
                          <span className="font-medium text-purple-800">Preferenza Contatto:</span>
                          <span className="font-semibold text-purple-900 ml-1 capitalize">
                            {config.contact_preference === "whatsapp"
                              ? "WhatsApp"
                              : config.contact_preference === "telefono"
                                ? "Telefono"
                                : config.contact_preference === "email"
                                  ? "Email"
                                  : config.contact_preference || "Non specificata"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border mb-3">
                        <h4 className="font-medium text-green-800 mb-2">Dettagli Configurazione:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-green-700">
                          <div>
                            <span className="font-medium">Modello:</span> {config.model_name}
                          </div>
                          <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                            <span className="font-medium text-blue-800">Tipo Struttura:</span>
                            <span className="font-semibold text-blue-900 ml-1">{config.structure_type_name}</span>
                          </div>
                          <div className="bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                            <span className="font-medium text-orange-800">Colore Struttura:</span>
                            <span className="font-semibold text-orange-900 ml-1">{config.structure_color_name}</span>
                          </div>
                          <div>
                            <span className="font-medium">Copertura:</span> {config.coverage_name}
                          </div>
                          <div>
                            <span className="font-medium">Superficie:</span> {config.surface_name}
                          </div>
                          <div>
                            <span className="font-medium">Pacchetto:</span> {config.package_type}
                          </div>
                          <div>
                            <span className="font-medium">Dimensioni:</span> {config.width}×{config.depth}×
                            {config.height}cm
                          </div>
                          <div>
                            <span className="font-medium">Prezzo:</span> €{config.total_price?.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Data:</span>{" "}
                            {new Date(config.created_at).toLocaleDateString("it-IT")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select value={config.status} onValueChange={(value) => updateStatus(config.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nuovo">Nuovo</SelectItem>
                          <SelectItem value="in_lavorazione">In Lavorazione</SelectItem>
                          <SelectItem value="completato">Completato</SelectItem>
                          <SelectItem value="annullato">Annullato</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sei sicuro di voler eliminare la configurazione di <strong>{config.customer_name}</strong>
                              ? Questa azione non può essere annullata.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(config.id, config.customer_name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Elimina
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
