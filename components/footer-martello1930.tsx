import Link from "next/link"

export function FooterMartello1930() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sezione Logo e Descrizione */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#008f4c]">Martello1930</h3>
            <p className="text-gray-300 mb-4">
              Artigianato del legno dal 1930. Realizziamo coperture auto, pergole, carport e strutture su misura
              con materiali di prima qualità e lavorazione artigianale.
            </p>
          </div>

          {/* Sezione Contatti */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#008f4c]">Contatti</h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +39 XXX XXX XXXX
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@martello1930.net
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  Via Esempio, 123
                  <br />
                  12345 Città (Provincia)
                </span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Lun-Ven: 8:00-18:00
              </p>
            </div>
          </div>

          {/* Sezione Configuratori */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#008f4c]">Configuratori</h4>
            <div className="space-y-2">
              <Link
                href="/acciaio"
                className="block text-gray-300 hover:text-[#008f4c] transition-colors duration-300"
              >
                → Configuratore Acciaio/Alluminio
              </Link>
              <Link
                href="/legno"
                className="block text-gray-300 hover:text-[#008f4c] transition-colors duration-300"
              >
                → Configuratore Legno
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Martello1930. Tutti i diritti riservati.</p>
          <p className="text-sm mt-2">P.IVA: XXXXXXXXXXX</p>
        </div>
      </div>
    </footer>
  )
}
