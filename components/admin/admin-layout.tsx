"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAdminSession, clearAdminSession, type AdminSession } from "@/lib/auth/admin-auth"
import { useAdminConfigurator } from "@/contexts/AdminConfiguratorContext"
import { ConfiguratorSwitch } from "@/components/admin/ConfiguratorSwitch"
import {
  LayoutDashboard,
  Users,
  Settings,
  Palette,
  Package,
  Mail,
  LogOut,
  FileText,
  DollarSign,
  ArrowLeft,
  Shield,
  Menu,
  X,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
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

export function AdminLayout({ children }: AdminLayoutProps) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { configuratorType, theme } = useAdminConfigurator()

  useEffect(() => {
    const adminSession = getAdminSession()
    if (!adminSession && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else {
      setSession(adminSession)
    }
    setIsLoading(false)
  }, [router, pathname])

  const handleLogout = () => {
    clearAdminSession()
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bgGradient }}>
        <div style={{ color: theme.primary }}>Caricamento...</div>
      </div>
    )
  }

  if (!session && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="admin-layout" style={{ background: theme.bgGradient }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <h1 className="sidebar-title" style={{ color: theme.primary }}>
              Admin Panel
            </h1>
            <p className="sidebar-subtitle" style={{ color: theme.secondary }}>
              Configuratore {configuratorType === 'legno' ? 'Legno' : 'Ferro'}
            </p>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                style={isActive ? {
                  color: theme.primary,
                  borderLeftColor: theme.primary,
                  backgroundColor: `${theme.primary}10`,
                } : {}}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="menu-button"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="header-title" style={{ color: theme.primary }}>
                {navigation.find((item) => item.href === pathname)?.name || "Admin Panel"}
              </h2>
            </div>

            <div className="header-center">
              <ConfiguratorSwitch />
            </div>

            <div className="header-right">
              <Link href="/configura">
                <Button
                  variant="outline"
                  size="sm"
                  className="header-button"
                  style={{ 
                    color: theme.primary,
                    borderColor: theme.secondary,
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="button-text">Configuratore</span>
                </Button>
              </Link>
              <span className="user-name" style={{ color: theme.secondary }}>
                {session?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="header-button"
                style={{ 
                  color: theme.primary,
                  borderColor: theme.secondary,
                }}
              >
                <LogOut className="w-4 h-4" />
                <span className="button-text">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">{children}</main>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
          display: none;
        }

        .sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #F0F0F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .sidebar-subtitle {
          font-size: 13px;
          margin: 0;
        }

        .sidebar-close {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: #666;
        }

        .sidebar-close:hover {
          background: #F5F5F5;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #F9F9F9;
        }

        .nav-item-active {
          font-weight: 600;
        }

        .main-container {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .header {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid #F0F0F0;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          gap: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #666;
        }

        .menu-button:hover {
          background: #F5F5F5;
        }

        .header-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .header-center {
          flex: 0 0 auto;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: flex-end;
        }

        .header-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          transition: all 0.2s ease;
        }

        .header-button:hover {
          opacity: 0.8;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
        }

        .main-content {
          flex: 1;
          padding: 32px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar-open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
          }

          .sidebar-close {
            display: block;
          }

          .main-container {
            margin-left: 0;
          }

          .menu-button {
            display: block;
          }

          .header-center {
            order: -1;
            flex: 0 0 100%;
            display: flex;
            justify-content: center;
          }

          .header-content {
            flex-wrap: wrap;
            padding: 12px 16px;
          }

          .header-title {
            font-size: 16px;
          }

          .user-name {
            display: none;
          }

          .button-text {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .main-content {
            padding: 16px;
          }

          .header-left {
            flex: 0;
          }

          .header-right {
            flex: 0;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}
