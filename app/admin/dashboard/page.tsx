"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FileText, Package, TrendingUp, Palette, Settings, Users, Mail, DollarSign, Shield, LayoutDashboard, LogOut, ArrowLeft, BarChart3, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearAdminSession, getAdminSession } from "@/lib/auth/admin-auth"
import { ConfiguratorSwitch } from "@/components/admin/ConfiguratorSwitch"
import { useAdminConfigurator } from "@/contexts/AdminConfiguratorContext"
import { StatsCard } from "@/components/admin/ui/StatsCard"
import { Button } from "@/components/ui/button"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_price: number
  status: string
  created_at: string
  carport_models: { name: string } | null
}

interface Stats {
  totalConfigurations: number
  newConfigurations: number
  totalModels: number
  totalColors: number
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Configurazioni", href: "/admin/configurations", icon: FileText },
  { name: "Tipi Struttura", href: "/admin/structure-types", icon: Settings },
  { name: "Modelli", href: "/admin/models", icon: Package },
  { name: "Tipi Copertura", href: "/admin/coverage-types", icon: Shield },
  { name: "Colori", href: "/admin/colors", icon: Palette },
  { name: "Superfici", href: "/admin/surfaces", icon: Settings },
  { name: "Prezzi", href: "/admin/pricing", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Utenti Admin", href: "/admin/users", icon: Users },
  { name: "Email", href: "/admin/emails", icon: Mail },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState(getAdminSession())
  const [stats, setStats] = useState<Stats>({
    totalConfigurations: 0,
    newConfigurations: 0,
    totalModels: 0,
    totalColors: 0,
  })
  const [recentConfigurations, setRecentConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminSession = getAdminSession()
    if (!adminSession) {
      router.push("/admin/login")
      return
    }
    setSession(adminSession)
  }, [router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()

      try {
        const { data: configurations, error: configError } = await supabase
          .from("carport_configurations")
          .select(`
            *,
            carport_models!model_id(name)
          `)
          .order("created_at", { ascending: false })

        if (configError) throw configError

        const { count: modelsCount } = await supabase
          .from("carport_models")
          .select("*", { count: "exact", head: true })

        const { count: colorsCount } = await supabase
          .from("carport_colors")
          .select("*", { count: "exact", head: true })

        const totalConfigurations = configurations?.length || 0
        const newConfigurations = configurations?.filter((config) => config.status === "nuovo").length || 0

        setStats({
          totalConfigurations,
          newConfigurations,
          totalModels: modelsCount || 0,
          totalColors: colorsCount || 0,
        })

        setRecentConfigurations(configurations?.slice(0, 5) || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setStats({
          totalConfigurations: 0,
          newConfigurations: 0,
          totalModels: 0,
          totalColors: 0,
        })
        setRecentConfigurations([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
                Admin Panel
              </h1>
            </div>

            {/* Configurator Switch */}
            <div className="flex-shrink-0">
              <ConfiguratorSwitch />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/configura">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Configuratore
                </Button>
              </Link>
              <span className="text-sm text-gray-600 hidden md:block">
                {session?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Panoramica generale del sistema</p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Configurazioni Totali"
            value={stats.totalConfigurations}
            icon={FileText}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Nuove Richieste"
            value={stats.newConfigurations}
            icon={TrendingUp}
            iconColor="text-orange-600"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Modelli Disponibili"
            value={stats.totalModels}
            icon={Package}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Colori Disponibili"
            value={stats.totalColors}
            icon={Palette}
            iconColor="text-purple-600"
          />
        </div>

        {/* Recent Configurations */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Configurazioni Recenti</h3>
            <p className="text-sm text-gray-600 mt-1">Ultime 5 richieste ricevute</p>
          </div>
          
          {recentConfigurations.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nessuna configurazione trovata</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modello
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prezzo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentConfigurations.map((config) => (
                    <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{config.customer_name}</div>
                        <div className="text-sm text-gray-500">{config.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{config.carport_models?.name || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">€{config.total_price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          config.status === "nuovo" 
                            ? "bg-green-100 text-green-800" 
                            : config.status === "in_lavorazione"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {config.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(config.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={`/admin/configurations/${config.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Visualizza
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {recentConfigurations.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/configurations">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Visualizza Tutte le Configurazioni
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
