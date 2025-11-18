"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, MousePointerClick, Clock, BarChart3 } from "lucide-react"

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
        <div className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Configuratore</h1>
          <p className="text-gray-600 mt-2">Statistiche visitatori e comportamento utenti</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitatori Totali</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% dal mese scorso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizzazioni Pagina</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +8% dal mese scorso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Totali</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +15% dal mese scorso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durata Media Sessione</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +5% dal mese scorso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Pagine Più Visitate
              </CardTitle>
              <CardDescription>Top 4 pagine per numero di visualizzazioni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{page.path}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">{page.views.toLocaleString()} views</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Visitatori Recenti
              </CardTitle>
              <CardDescription>Ultimi 5 visitatori in tempo reale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentVisitors.map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{visitor.page}</p>
                      <p className="text-xs text-gray-500">{visitor.timestamp}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">📊 Vercel Analytics Integrato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 text-sm">
              Il tracciamento dei visitatori è attivo tramite Vercel Analytics. I dati vengono raccolti automaticamente
              e aggiornati in tempo reale. Per visualizzare statistiche dettagliate, accedi al{" "}
              <a
                href="https://vercel.com/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-blue-600"
              >
                dashboard Vercel Analytics
              </a>
              .
            </p>
            <p className="text-blue-800 text-sm mt-3">
              <strong>Nota:</strong> I dati mostrati sopra sono simulati per scopo dimostrativo. L'integrazione con
              l'API Vercel Analytics per dati reali sarà implementata in una versione futura.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
