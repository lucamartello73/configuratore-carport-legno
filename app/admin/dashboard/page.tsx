"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { FileText, Package, TrendingUp, Palette, Settings, Users, Mail, DollarSign, Shield, LayoutDashboard, LogOut, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearAdminSession, getAdminSession } from "@/lib/auth/admin-auth"
import { ConfiguratorSwitch } from "@/components/admin/ConfiguratorSwitch"
import { useAdminConfigurator } from "@/contexts/AdminConfiguratorContext"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_cap: string
  customer_province: string
  structure_type: string
  width: number
  depth: number
  height: number
  package_type: string
  total_price: number
  status: string
  created_at: string
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

// Menu navigation - ordinato per corrispondere agli step del configuratore
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
  const { theme } = useAdminConfigurator()
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
            carport_models!model_id(name, carport_structure_types!structure_type_id(name)),
            structure_color:carport_colors!structure_color_id(name),
            coverage_color:carport_colors!coverage_color_id(name),
            carport_coverage_types!coverage_id(name),
            carport_surfaces!surface_id(name)
          `)
          .order("created_at", { ascending: false })

        if (configError) throw configError

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

        setRecentConfigurations(transformedConfigurations?.slice(0, 5) || [])
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
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6B7280' }}>Caricamento dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bgGradient }}>
      {/* Header con pulsanti */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #E5E7EB', 
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1536px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: theme.primary }}>
              Admin Panel - Carport Configurator
            </h1>
          </div>
          
          {/* Switch Configuratore al centro */}
          <div style={{ 
            flex: '0 0 auto',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ConfiguratorSwitch />
          </div>

          <div style={{ 
            flex: '1 1 auto', 
            minWidth: '200px',
            display: 'flex', 
            gap: '12px',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <Link href="/configura">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Vai al Configuratore
              </button>
            </Link>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '14px', 
              color: '#6B7280',
              padding: '0 12px'
            }}>
              Benvenuto, {session?.name}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Contenuto principale */}
      <div style={{ maxWidth: '1536px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Titolo */}
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          color: '#111827', 
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Dashboard Admin
        </h1>

        {/* Barra navigazione orizzontale */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link 
                key={item.name} 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#5A3A1A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Grid card statistiche */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '24px',
          marginTop: '32px'
        }}
        className="md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Card 1: Configurazioni Totali */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <FileText style={{ 
              width: '32px', 
              height: '32px', 
              color: '#6B7280',
              margin: '0 auto'
            }} />
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151',
              marginTop: '12px'
            }}>
              Configurazioni Totali
            </p>
            <p style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginTop: '8px'
            }}>
              {stats.totalConfigurations}
            </p>
          </div>

          {/* Card 2: Nuove Richieste */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <TrendingUp style={{ 
              width: '32px', 
              height: '32px', 
              color: '#EA580C',
              margin: '0 auto'
            }} />
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151',
              marginTop: '12px'
            }}>
              Nuove Richieste
            </p>
            <p style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#EA580C',
              marginTop: '8px'
            }}>
              {stats.newConfigurations}
            </p>
          </div>

          {/* Card 3: Modelli Disponibili */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <Package style={{ 
              width: '32px', 
              height: '32px', 
              color: '#6B7280',
              margin: '0 auto'
            }} />
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151',
              marginTop: '12px'
            }}>
              Modelli Disponibili
            </p>
            <p style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginTop: '8px'
            }}>
              {stats.totalModels}
            </p>
          </div>

          {/* Card 4: Colori Disponibili */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <Palette style={{ 
              width: '32px', 
              height: '32px', 
              color: '#6B7280',
              margin: '0 auto'
            }} />
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151',
              marginTop: '12px'
            }}>
              Colori Disponibili
            </p>
            <p style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginTop: '8px'
            }}>
              {stats.totalColors}
            </p>
          </div>
        </div>

        {/* Configurazioni Recenti */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '32px',
          marginTop: '40px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Configurazioni Recenti
          </h2>
          
          {recentConfigurations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentConfigurations.map((config) => (
                <div 
                  key={config.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <p style={{ fontWeight: '500', color: '#111827' }}>{config.customer_name}</p>
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
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '8px'
                    }}
                    className="md:grid-cols-2"
                    >
                      <p><span style={{ fontWeight: '500' }}>Email:</span> {config.customer_email}</p>
                      <p><span style={{ fontWeight: '500' }}>Telefono:</span> {config.customer_phone}</p>
                      <p><span style={{ fontWeight: '500' }}>Indirizzo:</span> {config.customer_address}, {config.customer_city}</p>
                      <p><span style={{ fontWeight: '500' }}>CAP/Provincia:</span> {config.customer_cap} ({config.customer_province})</p>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#374151',
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB'
                    }}
                    className="md:grid-cols-3"
                    >
                      <p><span style={{ fontWeight: '500' }}>Modello:</span> {config.model_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Struttura:</span> {config.structure_type_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Colore Struttura:</span> {config.structure_color_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Colore Copertura:</span> {config.coverage_color_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Copertura:</span> {config.coverage_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Superficie:</span> {config.surface_name}</p>
                      <p><span style={{ fontWeight: '500' }}>Pacchetto:</span> {config.package_type}</p>
                      <p><span style={{ fontWeight: '500' }}>Dimensioni:</span> {config.width}×{config.depth}×{config.height} cm</p>
                      <p><span style={{ fontWeight: '500' }}>Prezzo:</span> €{config.total_price?.toLocaleString()}</p>
                      <p><span style={{ fontWeight: '500' }}>Data:</span> {new Date(config.created_at).toLocaleDateString("it-IT")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px', 
              color: '#9CA3AF'
            }}>
              Nessuna configurazione trovata
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
