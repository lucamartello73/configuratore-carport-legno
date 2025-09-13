"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleIcons } from "@/components/ui/simple-icons"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="text-6xl font-bold mb-2">404</div>
          <CardTitle className="text-xl">Pagina Non Trovata</CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <p className="text-green-600 mb-6 leading-relaxed">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <SimpleIcons.Home className="w-4 h-4 mr-2" />
                Torna alla Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full bg-transparent border-green-300 text-green-700 hover:bg-green-50"
            >
              <SimpleIcons.ArrowLeft className="w-4 h-4 mr-2" />
              Torna Indietro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
