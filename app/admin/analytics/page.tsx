"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, MousePointerClick, Clock, BarChart3 } from "lucide-react"
import { StatsCard } from "@/components/admin/ui/StatsCard"

interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  totalClicks: number
  avgSessionDuration: string
  topPages: { path: string; views: number }[]
  recentVisitors: { timestamp: string; page: string }[]
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisitors: 0,
    totalPageViews: 0,
    totalClicks: 0,
    avgSessionDuration: "0m 0s",
    topPages: [],
    recentVisitors: [],
  })

  useEffect(() => {
    // Simula caricamento dati (in futuro userà API Vercel Analytics)
    setTimeout(() => {
      setAnalytics({
        totalVisitors: 1247,
        totalPageViews: 3891,
        totalClicks: 2156,
        avgSessionDuration: "4m 32s",
        topPages: [
          { path: "/", views: 1523 },
          { path: "/configuratore", views: 1247 },
          { path: "/admin/dashboard", views: 234 },
          { path: "/admin/configurations", views: 187 },
        ],
        recentVisitors: [
          { timestamp: "2 minuti fa", page: "/configuratore" },
          { timestamp: "5 minuti fa", page: "/" },
          { timestamp: "8 minuti fa", page: "/configuratore" },
          { timestamp: "12 minuti fa", page: "/admin/dashboard" },
          { timestamp: "15 minuti fa", page: "/configuratore" },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Caricamento analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Analytics Configuratore</h1>
          </div>
          <p className="text-gray-600">Statistiche visitatori e comportamento utenti</p>
        </div>

        {/* Stats Cards - Compatte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Visitatori Totali"
            value={analytics.totalVisitors.toLocaleString()}
            icon={Users}
            iconColor="text-blue-600"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Visualizzazioni Pagina"
            value={analytics.totalPageViews.toLocaleString()}
            icon={Eye}
            iconColor="text-green-600"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Click Totali"
            value={analytics.totalClicks.toLocaleString()}
            icon={MousePointerClick}
            iconColor="text-purple-600"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Durata Media Sessione"
            value={analytics.avgSessionDuration}
            icon={Clock}
            iconColor="text-orange-600"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Top Pages & Recent Visitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Pagine Più Visitate
              </CardTitle>
              <CardDescription className="text-sm">Top 4 pagine per visualizzazioni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="font-medium text-sm text-gray-900">{page.path}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">{page.views.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visitors */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-green-600" />
                Visitatori Recenti
              </CardTitle>
              <CardDescription className="text-sm">Ultimi 5 visitatori in tempo reale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentVisitors.map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{visitor.page}</p>
                      <p className="text-xs text-gray-500">{visitor.timestamp}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Box - Compatto */}
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vercel Analytics Integrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 text-sm leading-relaxed">
              Il tracciamento dei visitatori è attivo tramite Vercel Analytics. I dati vengono raccolti automaticamente
              e aggiornati in tempo reale. Per visualizzare statistiche dettagliate, accedi al{" "}
              <a
                href="https://vercel.com/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-blue-600 transition-colors"
              >
                dashboard Vercel Analytics
              </a>.
            </p>
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-900 text-xs font-medium">
                ⚠️ <strong>Nota:</strong> I dati mostrati sono simulati per scopo dimostrativo. L'integrazione con
                l'API Vercel Analytics per dati reali sarà implementata in futuro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
