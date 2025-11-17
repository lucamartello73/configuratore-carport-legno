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

interface ModernAdminWrapperProps {
  children: React.ReactNode
  title: string
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Configurazioni", href: "/admin/configurations", icon: FileText },
  { name: "Modelli", href: "/admin/models", icon: Package },
  { name: "Tipi Struttura", href: "/admin/structure-types", icon: Settings },
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
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6B7280' }}>Caricamento...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E8' }}>
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
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              Admin Panel - {title}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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
                onMouseEnter={(e) => e.currentTarget.style.color = '#5A3A1A'}
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
    </div>
  )
}
