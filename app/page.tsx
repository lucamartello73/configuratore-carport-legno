import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Hammer, Leaf, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen configurator-bg">
      <Header />

      <main>
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
              Configura la Tua Pergola Perfetta
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty">
              Crea la pergola in legno dei tuoi sogni con il nostro configuratore avanzato. Personalizza ogni dettaglio
              e ricevi un preventivo immediato.
            </p>

            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4">
              <Link href="/configurator/structure-type">
                Inizia Configurazione
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Artigianato Italiano</h3>
              <p className="text-gray-700">
                Oltre 90 anni di esperienza nella lavorazione del legno. Ogni pergola è realizzata con maestria
                artigianale.
              </p>
            </div>

            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Materiali Sostenibili</h3>
              <p className="text-gray-700">
                Utilizziamo solo legno certificato FSC e trattamenti ecologici per rispettare l'ambiente.
              </p>
            </div>

            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Garanzia 10 Anni</h3>
              <p className="text-gray-700">
                Siamo così sicuri della qualità che offriamo 10 anni di garanzia su struttura e trattamenti.
              </p>
            </div>
          </div>

          {/* Product Showcase */}
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">I Nostri Modelli</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/pergola-addossata-terrazzo-casa.jpg"
                    alt="Pergola Addossata"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pergola Addossata</h3>
                <p className="text-gray-700 text-sm">Perfetta per terrazzi e spazi adiacenti alla casa</p>
              </div>

              <div className="text-center">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/pergola-libera-giardino-indipendente.jpg"
                    alt="Pergola Libera"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pergola Libera</h3>
                <p className="text-gray-700 text-sm">Struttura indipendente ideale per giardini</p>
              </div>

              <div className="text-center">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/pergola-bioclimatica-lamelle-orientabili.jpg"
                    alt="Pergola Bioclimatica"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pergola Bioclimatica</h3>
                <p className="text-gray-700 text-sm">Tecnologia avanzata con lamelle orientabili</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
