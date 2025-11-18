"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Settings, 
  Shield, 
  Palette, 
  DollarSign, 
  Users, 
  Mail, 
  LogOut, 
  ArrowLeft 
} from "lucide-react"
import { getAdminSession, clearAdminSession } from "@/lib/auth/admin-auth"
import { ConfiguratorSwitch } from "@/components/admin/ConfiguratorSwitch"
import { useAdminConfigurator } from "@/contexts/AdminConfiguratorContext"

interface ModernAdminWrapperProps {
  children: React.ReactNode
  title: string
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
  { name: "Utenti Admin", href: "/admin/users", icon: Users },
  { name: "Email", href: "/admin/emails", icon: Mail },
]

export function ModernAdminWrapper({ children, title }: ModernAdminWrapperProps) {
  const router = useRouter()
  const [session, setSession] = useState(getAdminSession())
  const { theme } = useAdminConfigurator()

  useEffect(() => {
    const adminSession = getAdminSession()
    if (!adminSession) {
      router.push("/admin/login")
      return
    }
    setSession(adminSession)
  }, [router])

  const handleLogout = () => {
    clearAdminSession()
    router.push("/admin/login")
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: theme.secondary }}>Caricamento...</div>
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
              Admin Panel - {title}
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
                border: `1px solid ${theme.secondary}`,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.primary,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primary}10`
                e.currentTarget.style.borderColor = theme.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = theme.secondary
              }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span style={{ display: 'inline' }} className="hidden-mobile">Configuratore</span>
              </button>
            </Link>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '14px', 
              color: theme.secondary,
              padding: '0 12px'
            }}
            className="hidden-mobile"
            >
              {session?.name}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: `1px solid ${theme.secondary}`,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.primary,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primary}10`
                e.currentTarget.style.borderColor = theme.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = theme.secondary
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              <span style={{ display: 'inline' }} className="hidden-mobile">Logout</span>
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
          color: theme.primary, 
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          {title}
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
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Contenuto pagina */}
        <div>
          {children}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
