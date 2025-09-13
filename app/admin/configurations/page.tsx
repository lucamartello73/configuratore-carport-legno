"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin/admin-layout"
import { createClient } from "@/lib/supabase/client"
import { Eye, Mail, Search } from "lucide-react"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  structure_type: string
  width: number
  depth: number
  height: number
  total_price: number
  status: string
  created_at: string
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
      const { data, error } = await supabase
        .from("carport_configurations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching configurations:", error)
      } else {
        setConfigurations(data || [])
        setFilteredConfigurations(data || [])
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
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-green-800">{config.customer_name}</h3>
                        {getStatusBadge(config.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-600">
                        <div>
                          <span className="font-medium">Email:</span> {config.customer_email}
                        </div>
                        <div>
                          <span className="font-medium">Telefono:</span> {config.customer_phone}
                        </div>
                        <div>
                          <span className="font-medium">Dimensioni:</span> {config.width}×{config.depth}×{config.height}
                          cm
                        </div>
                        <div>
                          <span className="font-medium">Prezzo:</span> €{config.total_price?.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-green-500 mt-2">
                        Creato il: {new Date(config.created_at).toLocaleDateString("it-IT")}
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
