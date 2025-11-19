'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { adminColors, adminRadius, adminShadow } from '@/lib/admin/colors'
import { AdminButton } from '@/components/admin/ui/AdminButton'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Credenziali non valide')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError('Errore durante il login')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: adminColors.background }}
    >
      <div
        className="w-full max-w-md p-8"
        style={{
          backgroundColor: adminColors.cardBackground,
          borderRadius: adminRadius.lg,
          boxShadow: adminShadow.lg,
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: adminColors.primary }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: adminColors.primary }}
          >
            Pergola Legno
          </h1>
          <p
            className="text-sm"
            style={{ color: adminColors.textSecondary }}
          >
            Pannello Amministrazione
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div
              className="p-3 text-sm rounded-lg"
              style={{
                backgroundColor: '#FEE2E2',
                color: adminColors.danger,
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: adminColors.textPrimary }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border outline-none transition-colors"
              style={{
                borderColor: adminColors.border,
                borderRadius: adminRadius.md,
                color: adminColors.textPrimary,
                backgroundColor: adminColors.cardBackground,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = adminColors.primary
              }}
              onBlur={(e) => {
                e.target.style.borderColor = adminColors.border
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: adminColors.textPrimary }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border outline-none transition-colors"
              style={{
                borderColor: adminColors.border,
                borderRadius: adminRadius.md,
                color: adminColors.textPrimary,
                backgroundColor: adminColors.cardBackground,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = adminColors.primary
              }}
              onBlur={(e) => {
                e.target.style.borderColor = adminColors.border
              }}
            />
          </div>

          <AdminButton
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </AdminButton>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: adminColors.textMuted }}
        >
          © 2025 Martello1930. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  )
}
