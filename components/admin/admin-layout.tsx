"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAdminSession, clearAdminSession, type AdminSession } from "@/lib/auth/admin-auth"
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
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Configurazioni", href: "/admin/configurations", icon: FileText },
  { name: "Modelli", href: "/admin/models", icon: Package },
  { name: "Colori", href: "/admin/colors", icon: Palette },
  { name: "Superfici", href: "/admin/surfaces", icon: Settings },
  { name: "Prezzi", href: "/admin/pricing", icon: DollarSign },
  { name: "Utenti Admin", href: "/admin/users", icon: Users },
  { name: "Email", href: "/admin/emails", icon: Mail },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-green-600">Caricamento...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold text-green-800">Admin Panel</h1>
            <p className="text-sm text-green-600">Carport Configurator</p>
          </div>

          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-green-800">
                {navigation.find((item) => item.href === pathname)?.name || "Admin Panel"}
              </h2>
              <div className="flex items-center space-x-4">
                <Link href="/configuratore">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Vai al Configuratore
                  </Button>
                </Link>
                <span className="text-sm text-green-600">Benvenuto, {session?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
