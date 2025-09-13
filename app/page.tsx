import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimpleIcons } from "@/components/ui/simple-icons"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="bg-orange-500 text-white mb-4 px-4 py-2 text-sm font-medium">Configuratore Online</Badge>
          <h1 className="text-5xl font-bold text-green-800 mb-6 leading-tight">
            Configuratore Carport
            <span className="block text-orange-600">Personalizzato</span>
          </h1>
          <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Progetta il tuo carport personalizzato in 7 semplici passaggi. Scegli dimensioni, colori, copertura e ricevi
            un preventivo istantaneo.
          </p>
          <Link href="/configuratore">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Inizia Configurazione
              <SimpleIcons.ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SimpleIcons.Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Personalizzazione Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Scegli dimensioni, colori, copertura e finiture per creare il carport perfetto per le tue esigenze
                specifiche.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-orange-600">⏱️</div>
              </div>
              <CardTitle className="text-green-800">Preventivo Istantaneo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Ricevi immediatamente il prezzo del tuo carport personalizzato con tutti i dettagli e opzioni incluse.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-blue-600">👥</div>
              </div>
              <CardTitle className="text-green-800">Supporto Professionale</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Il nostro team esperto ti contatterà per finalizzare il progetto e organizzare l'installazione
                professionale.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-12">Come Funziona</h2>
          <div className="grid md:grid-cols-7 gap-4">
            {[
              { step: 1, title: "Tipo Struttura", desc: "Addossato o autoportante" },
              { step: 2, title: "Modello", desc: "Scegli il design" },
              { step: 3, title: "Dimensioni", desc: "Personalizza le misure" },
              { step: 4, title: "Copertura", desc: "Seleziona il materiale" },
              { step: 5, title: "Colori", desc: "Abbina i colori" },
              { step: 6, title: "Superficie", desc: "Scegli il pavimento" },
              { step: 7, title: "Finalizza", desc: "Ricevi il preventivo" },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg border-2 border-orange-600">
                  <span className="text-white">{item.step}</span>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{item.title}</h3>
                <p className="text-green-600 text-sm">{item.desc}</p>
                {index < 6 && (
                  <SimpleIcons.ArrowRight className="w-4 h-4 text-green-400 mx-auto mt-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-600 rounded-2xl p-12 shadow-xl">
          <div className="w-12 h-12 mx-auto mb-4 text-yellow-300 text-2xl">⭐</div>
          <h2 className="text-3xl font-bold mb-4 text-white">Pronto a Iniziare?</h2>
          <p className="text-xl mb-8 text-white opacity-90">Configura il tuo carport personalizzato in pochi minuti</p>
          <Link href="/configuratore">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Configura Ora
              <SimpleIcons.ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
