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
import { Shield, Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (email === "admin@carport.com" && password === "admin123") {
        // Create mock session
        const sessionData = {
          adminId: "1",
          email: email,
          name: "Admin User",
          role: "admin",
          loginTime: new Date().toISOString(),
        }

        // Store session in localStorage
        localStorage.setItem("adminSession", JSON.stringify(sessionData))

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        setError("Credenziali non valide. Usa admin@carport.com / admin123")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Errore durante il login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Pannello Amministrazione</h1>
          <p className="text-gray-600 mt-2">Carport Configurator</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Accesso Admin</CardTitle>
            <CardDescription className="text-gray-100">Accedi al pannello di amministrazione</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-800">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="mt-1 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="admin@carport.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="flex items-center gap-2 text-gray-800">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="mt-1 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="admin123"
                />
              </div>
              {error && <ErrorMessage message={error} />}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Accesso in corso...
                  </div>
                ) : (
                  "Accedi"
                )}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Credenziali demo:</strong>
                <br />
                Email: admin@carport.com
                <br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
