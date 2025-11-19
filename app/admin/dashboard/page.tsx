import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { ConfiguratorSwitch } from '@/components/admin/layout/ConfiguratorSwitch'
import { StatCard } from '@/components/admin/ui/StatCard'
import { Badge, StatusBadge } from '@/components/admin/ui/Badge'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/lib/admin/colors'
import Link from 'next/link'

async function getDashboardStats() {
  const supabase = await createClient()
  
  // Get models count
  const { count: modelsCount } = await supabase
    .from('carport_ferro_models')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  
  // Get total requests
  const { count: totalRequests } = await supabase
    .from('carport_ferro_configurations')
    .select('*', { count: 'exact', head: true })
  
  // Get new requests (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { count: newRequests } = await supabase
    .from('carport_ferro_configurations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())
  
  // Get in progress requests
  const { count: inProgressRequests } = await supabase
    .from('carport_ferro_configurations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')
  
  return {
    modelsCount: modelsCount || 0,
    totalRequests: totalRequests || 0,
    newRequests: newRequests || 0,
    inProgressRequests: inProgressRequests || 0,
  }
}

async function getRecentRequests() {
  const supabase = await createClient()
  
  const { data: requests } = await supabase
    .from('carport_ferro_configurations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return requests || []
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentRequests = await getRecentRequests()
  
  return (
    <div>
      {/* Header */}
      <AdminHeader
        title="Dashboard"
        subtitle="Panoramica generale del sistema"
        configuratorType="ferro"
      />
      
      {/* Switch Configuratore */}
      <div style={{ padding: adminSpacing.lg, paddingTop: 0 }}>
        <ConfiguratorSwitch current="ferro" />
      </div>
      
      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{ padding: adminSpacing.lg, paddingTop: 0 }}
      >
        <StatCard
          title="Modelli Attivi"
          value={stats.modelsCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        
        <StatCard
          title="Richieste Totali"
          value={stats.totalRequests}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          trend={{
            value: '+12%',
            isPositive: true,
          }}
        />
        
        <StatCard
          title="Richieste Nuove"
          value={stats.newRequests}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="In Lavorazione"
          value={stats.inProgressRequests}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>
      
      {/* Recent Requests & Quick Actions */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ padding: adminSpacing.lg, paddingTop: 0 }}
      >
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <div
            className="p-6"
            style={{
              backgroundColor: adminColors.cardBackground,
              borderRadius: adminRadius.md,
              boxShadow: adminShadow.md,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-bold"
                style={{ color: adminColors.textPrimary }}
              >
                Richieste Recenti
              </h2>
              <Link href="/admin/quotes">
                <AdminButton variant="ghost" size="sm">
                  Vedi tutte
                </AdminButton>
              </Link>
            </div>
            
            {recentRequests.length === 0 ? (
              <p
                className="text-center py-8"
                style={{ color: adminColors.textMuted }}
              >
                Nessuna richiesta recente
              </p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ borderColor: adminColors.border }}
                  >
                    <div className="flex-1">
                      <p
                        className="font-medium mb-1"
                        style={{ color: adminColors.textPrimary }}
                      >
                        {request.customer_name || 'Cliente'}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: adminColors.textSecondary }}
                      >
                        {request.customer_email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        active={request.status === 'completed'}
                        activeText="Completata"
                        inactiveText="In attesa"
                      />
                      <Link href={`/admin/quotes/${request.id}`}>
                        <AdminButton variant="ghost" size="sm">
                          Dettagli
                        </AdminButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div>
          <div
            className="p-6"
            style={{
              backgroundColor: adminColors.cardBackground,
              borderRadius: adminRadius.md,
              boxShadow: adminShadow.md,
            }}
          >
            <h2
              className="text-lg font-bold mb-6"
              style={{ color: adminColors.textPrimary }}
            >
              Azioni Rapide
            </h2>
            
            <div className="space-y-3">
              <Link href="/admin/models">
                <div
                  className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderColor: adminColors.border,
                    backgroundColor: adminColors.cardBackground,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: adminColors.background }}
                    >
                      <svg className="w-5 h-5" style={{ color: adminColors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span
                      className="font-medium"
                      style={{ color: adminColors.textPrimary }}
                    >
                      Nuovo Modello
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: adminColors.textSecondary }}
                  >
                    Aggiungi un nuovo modello carport
                  </p>
                </div>
              </Link>
              
              <Link href="/admin/pricing">
                <div
                  className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderColor: adminColors.border,
                    backgroundColor: adminColors.cardBackground,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: adminColors.background }}
                    >
                      <svg className="w-5 h-5" style={{ color: adminColors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span
                      className="font-medium"
                      style={{ color: adminColors.textPrimary }}
                    >
                      Gestisci Prezzi
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: adminColors.textSecondary }}
                  >
                    Modifica prezzi e dimensioni
                  </p>
                </div>
              </Link>
              
              <Link href="/admin/quotes">
                <div
                  className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderColor: adminColors.border,
                    backgroundColor: adminColors.cardBackground,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: adminColors.background }}
                    >
                      <svg className="w-5 h-5" style={{ color: adminColors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span
                      className="font-medium"
                      style={{ color: adminColors.textPrimary }}
                    >
                      Vedi Richieste
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: adminColors.textSecondary }}
                  >
                    Gestisci preventivi ricevuti
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
