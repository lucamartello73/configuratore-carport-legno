"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/admin-layout"
import { FileText, Users, Package, TrendingUp } from "lucide-react"

const mockStats = {
  totalConfigurations: 24,
  newConfigurations: 8,
  totalModels: 6,
  totalColors: 12,
}

const mockRecentConfigurations = [
  {
    id: "1",
    customer_name: "Mario Rossi",
    customer_email: "mario.rossi@email.com",
    total_price: 15000,
    status: "nuovo",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    customer_name: "Giulia Bianchi",
    customer_email: "giulia.bianchi@email.com",
    total_price: 18500,
    status: "in_lavorazione",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    customer_name: "Luca Verdi",
    customer_email: "luca.verdi@email.com",
    total_price: 22000,
    status: "completato",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Configurazioni Totali</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{mockStats.totalConfigurations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Nuove Richieste</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{mockStats.newConfigurations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Modelli Disponibili</CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{mockStats.totalModels}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Colori Disponibili</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{mockStats.totalColors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800">Configurazioni Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentConfigurations.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{config.customer_name}</p>
                    <p className="text-sm text-gray-600">{config.customer_email}</p>
                    <p className="text-xs text-gray-500">{new Date(config.created_at).toLocaleDateString("it-IT")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">€{config.total_price?.toLocaleString()}</p>
                    <Badge
                      className={
                        config.status === "nuovo"
                          ? "bg-orange-500 text-white"
                          : config.status === "in_lavorazione"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                      }
                    >
                      {config.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
