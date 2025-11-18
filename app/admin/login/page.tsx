"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Shield, Lock, ArrowRight } from "lucide-react"
import { trackAdminLogin } from "@/lib/analytics/events"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (password === "admin123") {
        // Create mock session
        const sessionData = {
          adminId: "1",
          email: "admin@carport.com",
          name: "Admin User",
          role: "admin",
          loginTime: new Date().toISOString(),
        }

        // Store session in localStorage
        localStorage.setItem("adminSession", JSON.stringify(sessionData))
        
        // Track admin login
        trackAdminLogin(sessionData.email)

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        setError("Password non valida")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Errore durante il login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pannello Amministrazione</h1>
          <p className="text-gray-600">Configuratore Carport</p>
        </div>

        {/* Card Login */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Accesso Amministratore</CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              Inserisci le credenziali per accedere al pannello
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Inserisci la password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ErrorMessage message={error} />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Accesso in corso...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Accedi al Pannello</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Accesso Sicuro</p>
                  <p className="text-xs text-blue-700">
                    Questa area è riservata agli amministratori autorizzati. 
                    Tutti gli accessi vengono registrati per motivi di sicurezza.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2025 Configuratore Carport - Admin Panel
          </p>
        </div>
      </div>
    </div>
  )
}
