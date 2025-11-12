"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TreePine } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Configuratore Coperture Auto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scegli il tipo di struttura che desideri configurare
          </p>
        </div>

        {/* Configurator Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Steel/Aluminum Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer">
            <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-t-lg pb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <Building2 className="w-16 h-16" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">
                Strutture in Acciaio/Alluminio
              </CardTitle>
              <CardDescription className="text-blue-50 text-center text-lg mt-2">
                Carport moderni e resistenti
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Strutture metalliche di alta qualità</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Ampia gamma di colori RAL</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Resistenza massima agli agenti atmosferici</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Design moderno e personalizzabile</p>
                </div>
              </div>
              <Link href="/acciaio" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 group-hover:scale-105 transition-transform">
                  Configura Struttura in Acciaio
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Wood Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500 cursor-pointer">
            <CardHeader className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-t-lg pb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <TreePine className="w-16 h-16" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">
                Strutture in Legno
              </CardTitle>
              <CardDescription className="text-green-50 text-center text-lg mt-2">
                Pergole naturali ed eleganti
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Legno massello di prima qualità</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Tinte naturali per legno</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Estetica naturale e calda</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Perfette per giardini e terrazze</p>
                </div>
              </div>
              <Link href="/legno" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 group-hover:scale-105 transition-transform">
                  Configura Struttura in Legno
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-gray-600 text-lg">
            Hai bisogno di aiuto nella scelta? Contattaci per una consulenza personalizzata.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" size="lg" className="border-2">
              📞 Chiamaci
            </Button>
            <Button variant="outline" size="lg" className="border-2">
              ✉️ Scrivici
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
