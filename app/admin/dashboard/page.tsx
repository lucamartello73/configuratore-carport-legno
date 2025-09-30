"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/admin-layout"
import { FileText, Users, Package, TrendingUp } from "lucide-react"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_cap: string
  customer_province: string
  structure_type: string // Added structure_type field to use the text value directly
  width: number
  depth: number
  height: number
  package_type: string
  total_price: number
  status: string
  created_at: string
  // Related data from JOINs
  carport_models: { name: string; carport_structure_types: { name: string } } | null
  structure_color: { name: string } | null
  coverage_color: { name: string } | null
  carport_coverage_types: { name: string } | null
  carport_surfaces: { name: string } | null
}

interface Stats {
  totalConfigurations: number
  newConfigurations: number
  totalModels: number
  totalColors: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalConfigurations: 0,
    newConfigurations: 0,
    totalModels: 0,
    totalColors: 0,
  })
  const [recentConfigurations, setRecentConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      console.log("[v0] Starting dashboard data fetch")

      try {
        console.log("[v0] Fetching configurations")
        const { data: configurations, error: configError } = await supabase
          .from("carport_configurations")
          .select(`
            *,
            carport_models!model_id(name, carport_structure_types!structure_type_id(name)),
            structure_color:carport_colors!structure_color_id(name),
            coverage_color:carport_colors!coverage_color_id(name),
            carport_coverage_types!coverage_id(name),
            carport_surfaces!surface_id(name)
          `)
          .order("created_at", { ascending: false })

        console.log("[v0] Configurations query result:", { configurations, configError })

        if (configError) {
          console.error("Error fetching configurations:", configError)
          throw configError
        }

        const transformedConfigurations =
          configurations?.map((config) => ({
            ...config,
            model_name: config.carport_models?.name || "N/A",
            structure_type_name: config.structure_type || "N/A",
            structure_color_name: config.structure_color?.name || "N/A",
            coverage_color_name: config.coverage_color?.name || "N/A",
            coverage_name: config.carport_coverage_types?.name || "N/A",
            surface_name: config.carport_surfaces?.name || "N/A",
          })) || []

        // Fetch models count
        console.log("[v0] Fetching models count")
        const { count: modelsCount, error: modelsError } = await supabase
          .from("carport_models")
          .select("*", { count: "exact", head: true })

        console.log("[v0] Models count result:", { modelsCount, modelsError })

        if (modelsError) {
          console.error("Error fetching models count:", modelsError)
        }

        // Fetch colors count
        console.log("[v0] Fetching colors count")
        const { count: colorsCount, error: colorsError } = await supabase
          .from("carport_colors")
          .select("*", { count: "exact", head: true })

        console.log("[v0] Colors count result:", { colorsCount, colorsError })

        if (colorsError) {
          console.error("Error fetching colors count:", colorsError)
        }

        // Calculate stats
        const totalConfigurations = configurations?.length || 0
        const newConfigurations = configurations?.filter((config) => config.status === "nuovo").length || 0

        console.log("[v0] Calculated stats:", {
          totalConfigurations,
          newConfigurations,
          totalModels: modelsCount || 0,
          totalColors: colorsCount || 0,
        })

        setStats({
          totalConfigurations,
          newConfigurations,
          totalModels: modelsCount || 0,
          totalColors: colorsCount || 0,
        })

        // Set recent configurations (last 5)
        const recentConfigs = transformedConfigurations?.slice(0, 5) || []
        console.log("[v0] Setting recent configurations:", recentConfigs)
        setRecentConfigurations(recentConfigs)
      } catch (error) {
        console.error("[v0] Error fetching dashboard data:", error)
        setStats({
          totalConfigurations: 0,
          newConfigurations: 0,
          totalModels: 0,
          totalColors: 0,
        })
        setRecentConfigurations([])
      } finally {
        console.log("[v0] Dashboard data fetch completed")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-gray-600">Caricamento dashboard...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Configurazioni Totali</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalConfigurations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Nuove Richieste</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.newConfigurations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Modelli Disponibili</CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalModels}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Colori Disponibili</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalColors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800">Configurazioni Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConfigurations.length > 0 ? (
                recentConfigurations.map((config) => (
                  <div key={config.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-gray-800">{config.customer_name}</p>
                        <Badge
                          className={
                            config.status === "nuovo"
                              ? "bg-orange-500 text-white"
                              : config.status === "in_lavorazione"
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                          }
                        >
                          {config.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <p>
                          <span className="font-medium">Email:</span> {config.customer_email}
                        </p>
                        <p>
                          <span className="font-medium">Telefono:</span> {config.customer_phone}
                        </p>
                        <p>
                          <span className="font-medium">Indirizzo:</span> {config.customer_address},{" "}
                          {config.customer_city}
                        </p>
                        <p>
                          <span className="font-medium">CAP/Provincia:</span> {config.customer_cap} (
                          {config.customer_province})
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700 bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Modello:</span> {config.model_name}
                        </p>
                        <p>
                          <span className="font-medium">Struttura:</span> {config.structure_type_name}
                        </p>
                        <p>
                          <span className="font-medium">Colore Struttura:</span> {config.structure_color_name}
                        </p>
                        <p>
                          <span className="font-medium">Colore Copertura:</span> {config.coverage_color_name}
                        </p>
                        <p>
                          <span className="font-medium">Copertura:</span> {config.coverage_name}
                        </p>
                        <p>
                          <span className="font-medium">Superficie:</span> {config.surface_name}
                        </p>
                        <p>
                          <span className="font-medium">Pacchetto:</span> {config.package_type}
                        </p>
                        <p>
                          <span className="font-medium">Dimensioni:</span> {config.width}×{config.depth}×{config.height}
                          cm
                        </p>
                        <p>
                          <span className="font-medium">Prezzo:</span> €{config.total_price?.toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Data:</span>{" "}
                          {new Date(config.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">Nessuna configurazione trovata</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
